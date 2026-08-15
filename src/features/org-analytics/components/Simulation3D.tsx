'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { SimulationResult, WorkflowStep } from '@/lib/liquiflow-types';
import { utilizationColor } from '@/lib/liquiflow-algorithms';

// ─── Constants ────────────────────────────────────────────────────────────────
const STAGE_SPACING = 2.4; // horizontal spacing between pipeline stages
const PIPE_RADIUS = 0.18; // tube/pipe cross-section radius
const PARTICLE_COUNT = 180; // total particles split across stages

// Particle represents a work item flowing through the pipeline
interface ParticleState {
  stageIndex: number;
  // Progress 0→1 along this stage's pipe
  progress: number;
  // Visual offsets within the pipe cross-section
  offsetX: number;
  offsetZ: number;
  speed: number; // relative to stage base speed
  color: THREE.Color;
  size: number;
}

// ─── Pipeline Stage ───────────────────────────────────────────────────────────
function PipelineStage({
  stageX,
  label,
  cycleTime,
  volume,
  maxVolume,
  utilizationRate,
  isConstraint,
  isSimulating,
  result,
}: {
  stageX: number;
  label: string;
  cycleTime: number;
  volume: number;
  maxVolume: number;
  utilizationRate: number;
  isConstraint: boolean;
  isSimulating: boolean;
  result: SimulationResult | null;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const pipeLen = 1.6 + (volume / maxVolume) * 1.2; // wider stages handle more volume

  // Color encodes utilization rate
  const color = utilizationColor(utilizationRate);
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (!meshRef.current) return;
    // Pulse the constraint stage
    if (isConstraint && !isSimulating) {
      const pulse = 1 + Math.sin(timeRef.current * 3.5) * 0.06;
      meshRef.current.scale.setScalar(pulse);
    } else {
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1),
      );
    }
  });

  // Projected improvement label
  const showProjection = result && !isSimulating;
  const deltaCycle = result
    ? ((result.currentState.avgCycleTimeHours -
        result.projectedState.avgCycleTimeHours) /
        result.currentState.avgCycleTimeHours) *
      100
    : 0;

  return (
    <group position={[stageX, 0, 0]}>
      {/* Cylinder representing pipeline stage */}
      <mesh ref={meshRef} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry
          args={[PIPE_RADIUS, PIPE_RADIUS, pipeLen, 20, 1, true]}
        />
        <meshStandardMaterial
          color={colorObj}
          emissive={colorObj}
          emissiveIntensity={isSimulating ? 0.3 : isConstraint ? 1.2 : 0.2}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          roughness={0.2}
        />
      </mesh>

      {/* End caps */}
      {[-pipeLen / 2, pipeLen / 2].map((xOff, i) => (
        <mesh key={i} position={[xOff, 0, 0]}>
          <circleGeometry args={[PIPE_RADIUS, 20]} />
          <meshStandardMaterial
            color={colorObj}
            emissive={colorObj}
            emissiveIntensity={isConstraint ? 1.5 : 0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Constraint alert ring */}
      {isConstraint && !isSimulating && (
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[PIPE_RADIUS * 1.8, 0.02, 8, 40]} />
          <meshBasicMaterial color="#f87171" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Stage Label */}
      <Html position={[0, 0.65, 0]} center>
        <div
          className={`px-2 py-0.5 rounded-full backdrop-blur-md text-[10px] whitespace-nowrap border font-medium ${
            isConstraint
              ? 'bg-danger-soft/70 border-danger/60 text-danger shadow-sm shadow-danger/20'
              : 'bg-surface/80 border-border/50 text-text-primary shadow-sm'
          }`}
        >
          {label}
        </div>
      </Html>

      {/* Metrics below stage */}
      <Html position={[0, -0.65, 0]} center>
        <div className="px-2 py-1 rounded-lg bg-surface/80 backdrop-blur text-[10px] space-y-0.5 text-center border border-border/50 shadow-sm min-w-20">
          <div className="text-text-muted">{cycleTime}h cycle</div>
          <div className="text-text-muted/70">{volume}/wk</div>
          {showProjection && deltaCycle > 0 && (
            <div className="text-brand">
              ↓ {deltaCycle.toFixed(0)}% projected
            </div>
          )}
          {isConstraint && (
            <div className="text-danger text-[9px] font-bold">
              TOC CONSTRAINT
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

const tempParticleMatrix = new THREE.Matrix4();

function createInitialParticles(stageCount: number): ParticleState[] {
  const count = Math.max(stageCount, 1);
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const stageIndex = i % count;
    const hue = 0.65 + (stageIndex / count) * 0.15; // violet → cyan
    const color = new THREE.Color().setHSL(hue, 0.8, 0.65);
    const pseudo1 = ((i * 137.5) % 100) / 100;
    const pseudo2 = ((i * 223.7) % 100) / 100;
    const pseudo3 = ((i * 311.9) % 100) / 100;
    const pseudo4 = ((i * 401.3) % 100) / 100;

    return {
      stageIndex,
      progress: pseudo1,
      offsetX: (pseudo2 - 0.5) * PIPE_RADIUS * 0.8,
      offsetZ: (pseudo3 - 0.5) * PIPE_RADIUS * 0.8,
      speed: 0.5 + pseudo4 * 0.5,
      color,
      size: 0.5 + pseudo2 * 0.5,
    };
  });
}

// ─── Flowing Particles (Instanced) ───────────────────────────────────────────
function FlowParticles({
  stages,
  result,
  isSimulating,
}: {
  stages: Array<{ x: number; baseSpeed: number; utilization: number }>;
  result: SimulationResult | null;
  isSimulating: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<ParticleState[]>(
    createInitialParticles(stages.length),
  );

  useEffect(() => {
    particlesRef.current = createInitialParticles(stages.length);
  }, [stages.length]);

  // Cycle time factor: if projected is faster, particles flow faster
  const cycleTimeFactor = useMemo(() => {
    if (!result || isSimulating) return 1;
    return Math.max(
      0.3,
      result.currentState.avgCycleTimeHours /
        Math.max(result.projectedState.avgCycleTimeHours, 1),
    );
  }, [result, isSimulating]);

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    if (!meshRef.current || stages.length === 0) return;
    const particles = particlesRef.current;
    if (particles.length === 0) return;

    timeRef.current += delta;
    const time = timeRef.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      if (!p) continue;
      const stage = stages[p.stageIndex];
      if (!stage) continue;

      // Speed: inversely proportional to utilization (congested stages = slower)
      // but projected state = overall faster by cycleTimeFactor
      const stageSlowdown = isSimulating
        ? 0.2
        : Math.max(0.1, 1 - stage.utilization * 0.6);
      const baseSpeed = stage.baseSpeed * stageSlowdown * cycleTimeFactor;

      if (isSimulating) {
        // Chaotic jitter — simulate processing turbulence
        p.progress += delta * 0.08 * p.speed;
        p.offsetX += Math.sin(time * 8 + i * 0.7) * 0.008;
        p.offsetZ += Math.cos(time * 11 + i * 1.3) * 0.008;
        // Dampen back towards center
        p.offsetX *= 0.97;
        p.offsetZ *= 0.97;
      } else {
        p.progress += delta * baseSpeed * p.speed;
      }

      // Wrap around the stage (or advance to next stage)
      if (p.progress >= 1) {
        p.progress -= 1;
        // Advance to next stage — flow through pipeline
        p.stageIndex = (p.stageIndex + 1) % stages.length;
        // Reset offsets at stage transition deterministically
        const pseudoOffset = ((i * 179 + Math.floor(time * 10)) % 100) / 100;
        p.offsetX = (pseudoOffset - 0.5) * PIPE_RADIUS * 0.8;
        p.offsetZ = (((pseudoOffset * 3) % 1) - 0.5) * PIPE_RADIUS * 0.8;
      }

      // Position: lerp from start to end of stage X-range
      const stX = stage.x;
      const pipeLen = 1.6 + stage.utilization * 0.8;
      const x = stX + (p.progress - 0.5) * pipeLen;
      const y = p.offsetX;
      const z = p.offsetZ;

      tempParticleMatrix.setPosition(x, y, z);
      const sc = 0.055 * p.size * (isSimulating ? 1.4 : 1);
      tempParticleMatrix.elements[0] = sc;
      tempParticleMatrix.elements[5] = sc;
      tempParticleMatrix.elements[10] = sc;
      meshRef.current.setMatrixAt(i, tempParticleMatrix);
      meshRef.current.setColorAt(i, p.color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor)
      meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        roughness={0.2}
        metalness={0.6}
        emissiveIntensity={isSimulating ? 0.9 : 0.4}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Connector Tubes between Stages ──────────────────────────────────────────
function StageConnectors({ stageXs }: { stageXs: number[] }) {
  return (
    <>
      {stageXs.slice(0, -1).map((x, i) => {
        const nextX = stageXs[i + 1];
        const mid = (x + nextX) / 2;
        const len = nextX - x - 0.5;
        return (
          <mesh key={i} position={[mid, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, len, 8]} />
            <meshBasicMaterial color="#115E59" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────────────
function SimulationScene({
  workflows,
  result,
  isSimulating,
}: {
  workflows: WorkflowStep[];
  result: SimulationResult | null;
  isSimulating: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Limit stages to 6 for readability
  const visibleWorkflows = useMemo(() => workflows.slice(0, 6), [workflows]);

  const maxCycleTime = useMemo(
    () => Math.max(...visibleWorkflows.map((w) => w.avgDurationHours), 1),
    [visibleWorkflows],
  );
  const maxVolume = useMemo(
    () => Math.max(...visibleWorkflows.map((w) => w.volume), 1),
    [visibleWorkflows],
  );

  const totalWidth = (visibleWorkflows.length - 1) * STAGE_SPACING;
  const startX = -totalWidth / 2;

  const stageXs = useMemo(
    () => visibleWorkflows.map((_, i) => startX + i * STAGE_SPACING),
    [visibleWorkflows, startX],
  );

  // Utilization per stage: volume × duration / (dept capacity estimate)
  const utilizations = useMemo(
    () =>
      visibleWorkflows.map((wf) => {
        const lambda = wf.volume / 40;
        const mu = 1 / wf.avgDurationHours;
        return Math.min(1.5, lambda / mu);
      }),
    [visibleWorkflows],
  );

  // Identify constraint (max constraint score = highest utilization × volume × duration)
  const constraintIdx = useMemo(
    () =>
      visibleWorkflows.reduce((maxIdx, wf, i) => {
        const score = utilizations[i] * wf.volume * wf.avgDurationHours;
        const maxScore =
          utilizations[maxIdx] *
          visibleWorkflows[maxIdx].volume *
          visibleWorkflows[maxIdx].avgDurationHours;
        return score > maxScore ? i : maxIdx;
      }, 0),
    [visibleWorkflows, utilizations],
  );

  // Stage data for particle system
  const particleStages = useMemo(
    () =>
      visibleWorkflows.map((wf, i) => ({
        x: stageXs[i],
        baseSpeed: 0.15 / Math.max(wf.avgDurationHours / maxCycleTime, 0.1),
        utilization: utilizations[i],
      })),
    [visibleWorkflows, stageXs, utilizations, maxCycleTime],
  );

  // Gentle tilt animation
  const tiltTimeRef = useRef(0);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    tiltTimeRef.current += delta;
    groupRef.current.rotation.x = Math.sin(tiltTimeRef.current * 0.12) * 0.06;
    if (!isSimulating) {
      groupRef.current.rotation.y = Math.sin(tiltTimeRef.current * 0.07) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Pipeline stages */}
      {visibleWorkflows.map((wf, i) => (
        <PipelineStage
          key={wf.id}
          stageX={stageXs[i]}
          label={wf.name.length > 18 ? wf.name.slice(0, 16) + '…' : wf.name}
          cycleTime={wf.avgDurationHours}
          volume={wf.volume}
          maxVolume={maxVolume}
          utilizationRate={utilizations[i]}
          isConstraint={i === constraintIdx}
          isSimulating={isSimulating}
          result={result}
        />
      ))}

      {/* Connector tubes */}
      <StageConnectors stageXs={stageXs} />

      {/* Flowing particles */}
      <FlowParticles
        stages={particleStages}
        result={result}
        isSimulating={isSimulating}
      />
    </group>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Simulation3D({
  result,
  isSimulating,
  workflows = [],
}: {
  result: SimulationResult | null;
  isSimulating: boolean;
  workflows?: WorkflowStep[];
}) {
  return (
    <div className="w-full h-full min-h-80 border border-border/50 rounded-2xl overflow-hidden bg-surface-subtle/50 relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 text-xs uppercase tracking-widest text-text-muted font-semibold bg-surface/80 px-3 py-1 rounded-full border border-border/50 backdrop-blur-md shadow-sm">
        {isSimulating
          ? 'Simulation Running — Workflow Pipeline'
          : result
            ? `Projected Pipeline — ${result.deltaPercent.cycleTime < 0 ? Math.abs(result.deltaPercent.cycleTime) + '% faster' : 'impact modeled'}`
            : 'Workflow Pipeline (Current State)'}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-surface/80 px-3 py-1.5 rounded-lg border border-border/50 backdrop-blur-md shadow-sm">
        <div className="text-[10px] text-text-muted/70 uppercase tracking-wider font-semibold">
          Stage utilization:
        </div>
        {[
          { color: '#34d399', label: 'Healthy' },
          { color: '#fbbf24', label: 'High' },
          { color: '#f87171', label: 'Overloaded' },
        ].map(({ color, label }) => (
          <div
            key={label}
            className="flex items-center gap-1 text-[10px] text-text-muted"
          >
            <div
              className="w-2 h-2 rounded-full shadow-sm"
              style={{ background: color }}
            />
            {label}
          </div>
        ))}
      </div>

      <Canvas camera={{ position: [0, 3.5, 9], fov: 48 }} dpr={[1, 2]}>
        <ambientLight intensity={0.3} />
        <spotLight position={[0, 10, 5]} intensity={2.5} color="#0F766E" />
        <spotLight position={[0, -6, 5]} intensity={1.2} color="#34d399" />

        {workflows.length > 0 ? (
          <SimulationScene
            workflows={workflows}
            result={result}
            isSimulating={isSimulating}
          />
        ) : (
          // Fallback: show placeholder when no workflows
          <mesh>
            <sphereGeometry args={[0.5]} />
            <meshBasicMaterial color="#0F766E" transparent opacity={0.3} />
          </mesh>
        )}

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 4}
          minDistance={4}
          maxDistance={16}
        />
      </Canvas>
    </div>
  );
}
