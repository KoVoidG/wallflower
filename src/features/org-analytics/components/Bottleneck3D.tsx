"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import type { BottleneckResult, Department, WorkflowStep } from "@/lib/liquiflow-types";
import { analyzeBottlenecks, utilizationColor } from "@/lib/liquiflow-algorithms";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NodeData {
  id: string;
  name: string;
  position: THREE.Vector3;
  baseScale: number;
  utilizationRate: number;
  stressScore: number;
  isConstraint: boolean;
  isBottleneck: boolean;
  color: string;
}

interface EdgeData {
  from: THREE.Vector3;
  to: THREE.Vector3;
  volume: number; // weekly volume flowing through this connection
  maxVolume: number;
}

// ─── Force-Directed Layout ────────────────────────────────────────────────────
// Simplified Fruchterman-Reingold for stable, readable node positions.
function useForceLayout(
  departments: Department[],
  workflows: WorkflowStep[],
  iterations = 60
): Map<string, THREE.Vector3> {
  return useMemo(() => {
    const n = departments.length;
    if (n === 0) return new Map();

    const positions = new Map<string, THREE.Vector3>();
    const RADIUS = 3.8;

    // Seed on circle — deterministic so no layout thrash on re-render
    departments.forEach((d, i) => {
      const angle = (i / n) * Math.PI * 2;
      positions.set(d.id, new THREE.Vector3(
        Math.cos(angle) * RADIUS,
        (i % 2 === 0 ? 1 : -1) * 0.6, // slight vertical stagger
        Math.sin(angle) * RADIUS
      ));
    });

    // Build edge weight map for spring forces
    const edgeWeights = new Map<string, number>();
    const departmentIds = new Map(departments.map(d => [d.name, d.id]));
    for (const wf of workflows) {
      const srcId = departmentIds.get(wf.department);
      if (!srcId) continue;
      // Connect to all other departments that share workflow steps (cross-dept handoffs)
      for (const d of departments) {
        if (d.id !== srcId) {
          const key = [srcId, d.id].sort().join("--");
          edgeWeights.set(key, (edgeWeights.get(key) ?? 0) + wf.volume * 0.1);
        }
      }
    }

    // Force-directed iterations
    const REPULSION = 8;
    const SPRING_STRENGTH = 0.04;
    const SPRING_LEN = 4;
    const DAMPING = 0.85;
    const vels = new Map<string, THREE.Vector3>();
    departments.forEach(d => vels.set(d.id, new THREE.Vector3()));

    for (let iter = 0; iter < iterations; iter++) {
      // Repulsion — all pairs
      for (let i = 0; i < departments.length; i++) {
        for (let j = i + 1; j < departments.length; j++) {
          const a = departments[i], b = departments[j];
          const pa = positions.get(a.id)!, pb = positions.get(b.id)!;
          const diff = new THREE.Vector3().subVectors(pa, pb);
          const dist = Math.max(diff.length(), 0.5);
          const force = REPULSION / (dist * dist);
          const unit = diff.normalize().multiplyScalar(force);
          vels.get(a.id)!.add(unit);
          vels.get(b.id)!.sub(unit);
        }
      }
      // Spring attraction — only connected pairs
      for (const [key, weight] of edgeWeights) {
        const [aid, bid] = key.split("--");
        const pa = positions.get(aid), pb = positions.get(bid);
        if (!pa || !pb) continue;
        const diff = new THREE.Vector3().subVectors(pb, pa);
        const dist = Math.max(diff.length(), 0.01);
        const force = SPRING_STRENGTH * (dist - SPRING_LEN) * Math.min(weight, 3);
        const unit = diff.normalize().multiplyScalar(force);
        vels.get(aid)!.add(unit);
        vels.get(bid)!.sub(unit);
      }
      // Apply velocities with damping + constrain Y
      for (const d of departments) {
        const v = vels.get(d.id)!;
        const p = positions.get(d.id)!;
        v.multiplyScalar(DAMPING);
        p.add(v);
        p.y = Math.max(-1.5, Math.min(1.5, p.y)); // keep flat-ish
      }
    }

    return positions;
  }, [departments, workflows]);
}

// ─── Scene Graph ──────────────────────────────────────────────────────────────
function OrgGraph({
  departments, workflows, result, isScanning,
}: {
  departments: Department[]; workflows: WorkflowStep[];
  result: BottleneckResult | null; isScanning: boolean;
}) {
  const positions = useForceLayout(departments, workflows);
  const groupRef = useRef<THREE.Group>(null);

  const analysis = useMemo(
    () => analyzeBottlenecks(departments, workflows, 35),
    [departments, workflows]
  );

  const utilizationByDept = useMemo(() => {
    const map = new Map<string, number>();
    for (const dm of analysis.departmentMetrics) {
      map.set(dm.departmentId, dm.overallUtilizationRate);
    }
    return map;
  }, [analysis.departmentMetrics]);

  const stressById = useMemo(() => {
    const map = new Map<string, number>();
    for (const dm of analysis.departmentMetrics) {
      map.set(dm.departmentId, dm.stressScore);
    }
    return map;
  }, [analysis.departmentMetrics]);

  const maxVolume = useMemo(
    () => Math.max(...workflows.map(w => w.volume), 1),
    [workflows]
  );

  // Build workflow-based edges: only departments that share workflow steps
  const edges: EdgeData[] = useMemo(() => {
    const edgeVolumeMap = new Map<string, number>();
    const departmentIdxMap = new Map(departments.map(d => [d.name, d.id]));

    for (let i = 0; i < workflows.length; i++) {
      const wfA = workflows[i];
      const aId = departmentIdxMap.get(wfA.department);
      if (!aId) continue;
      // Workflows from same dept to output dept — connect to adjacent workflow depts
      for (let j = i + 1; j < workflows.length; j++) {
        const wfB = workflows[j];
        const bId = departmentIdxMap.get(wfB.department);
        if (!bId || bId === aId) continue;
        const key = [aId, bId].sort().join("--");
        edgeVolumeMap.set(key, (edgeVolumeMap.get(key) ?? 0) + Math.min(wfA.volume, wfB.volume) * 0.4);
      }
    }

    const result: EdgeData[] = [];
    for (const [key, vol] of edgeVolumeMap) {
      const [aid, bid] = key.split("--");
      const pa = positions.get(aid), pb = positions.get(bid);
      if (!pa || !pb) continue;
      result.push({ from: pa, to: pb, volume: vol, maxVolume });
    }
    return result;
  }, [departments, workflows, positions, maxVolume]);

  // Build node data
  const nodes: NodeData[] = useMemo(() => {
    return departments.map(d => {
      const utilRate = utilizationByDept.get(d.id) ?? 0;
      const stress = stressById.get(d.id) ?? 0;
      const isConstraint = analysis.primaryConstraint?.department === d.name;
      const bnk = result?.bottlenecks.find(b =>
        b.location.toLowerCase().includes(d.name.toLowerCase()) ||
        d.name.toLowerCase().includes(b.location.split(" ")[0].toLowerCase())
      );
      const isBottleneck = !!bnk;
      const pos = positions.get(d.id) ?? new THREE.Vector3();
      const baseScale = Math.max(0.35, Math.min(1.1, d.headcount / 25));
      const rawColor = utilizationColor(utilRate);

      return {
        id: d.id, name: d.name, position: pos, baseScale,
        utilizationRate: utilRate, stressScore: stress,
        isConstraint, isBottleneck, color: rawColor,
      };
    });
  }, [departments, positions, utilizationByDept, stressById, result, analysis.primaryConstraint?.department]);

  const timeRef = useRef(0);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    // Very gentle drift — stops during scanning to show analysis
    if (!isScanning) {
      groupRef.current.rotation.y = timeRef.current * 0.05;
    } else {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Edges — workflow-based connections only */}
      {edges.map((e, i) => {
        const alpha = 0.06 + (e.volume / e.maxVolume) * 0.25;
        const col = isScanning ? "#fbbf24" : "#0F766E";
        return (
          <Line
            key={i}
            points={[e.from, e.to]}
            color={col}
            lineWidth={0.5 + (e.volume / e.maxVolume) * 2}
            transparent
            opacity={isScanning ? alpha * 1.6 : alpha}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map(node => (
        <DeptNode key={node.id} node={node} isScanning={isScanning} />
      ))}

      {/* Primary constraint spotlight beam */}
      {!isScanning && nodes.find(n => n.isConstraint) && (() => {
        const cn = nodes.find(n => n.isConstraint)!;
        return (
          <spotLight
            position={[cn.position.x, cn.position.y + 5, cn.position.z]}
            target-position={[cn.position.x, cn.position.y, cn.position.z]}
            intensity={4}
            color="#f87171"
            angle={0.3}
            penumbra={0.6}
            distance={8}
          />
        );
      })()}
    </group>
  );
}

// ─── Department Node Sphere ───────────────────────────────────────────────────
function DeptNode({ node, isScanning }: { node: NodeData; isScanning: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (!meshRef.current) return;

    // Pulse speed = utilization rate (overloaded nodes pulse faster)
    const pulseFreq = isScanning ? 8 : Math.max(1, node.utilizationRate * 6);
    const pulseAmp = isScanning ? 0.18 : node.isBottleneck
      ? 0.12 + node.utilizationRate * 0.2
      : 0.04;

    const targetScale = node.baseScale + Math.sin(timeRef.current * pulseFreq) * pulseAmp;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.15)
    );

    // Emissive intensity — higher for overloaded nodes
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const targetEmissive = isScanning ? 1.2
      : node.isConstraint ? 2.0
      : node.isBottleneck ? 1.4
      : 0.15 + node.utilizationRate * 0.6;
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.08);

    // Ring rotation
    if (ringRef.current) {
      ringRef.current.rotation.z = timeRef.current * (0.5 + node.utilizationRate * 1.5);
    }
  });

  const col = isScanning ? "#fbbf24" : node.color;

  return (
    <group position={node.position}>
      {/* Main sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color={col}
          emissive={col}
          emissiveIntensity={0.3}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Utilization-driven outer glow ring */}
      {(node.isBottleneck || node.utilizationRate > 0.8) && (
        <mesh ref={ringRef} rotation={[Math.PI / 2 + 0.2, 0, 0]}>
          <torusGeometry args={[
            node.baseScale * 0.55 + node.utilizationRate * 0.25,
            0.025 + node.utilizationRate * 0.02,
            8, 64
          ]} />
          <meshBasicMaterial
            color={node.isConstraint ? "#f87171" : col}
            transparent
            opacity={0.4 + node.utilizationRate * 0.4}
          />
        </mesh>
      )}

      {/* Second halo ring for constraint node */}
      {node.isConstraint && !isScanning && (
        <mesh rotation={[Math.PI / 2, 0.5, 0]}>
          <torusGeometry args={[node.baseScale * 0.85, 0.015, 8, 64]} />
          <meshBasicMaterial color="#f87171" transparent opacity={0.25} />
        </mesh>
      )}

      {/* Label */}
      <Html position={[0, node.baseScale * 1.8, 0]} center sprite>
        <div className={`px-2 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap text-[11px] font-medium border transition-colors ${
          node.isConstraint
            ? "bg-danger-soft/70 border-danger/60 text-danger shadow-sm shadow-danger/20"
            : node.isBottleneck
            ? "bg-warning-soft/70 border-warning/50 text-warning shadow-sm shadow-warning/20"
            : "bg-surface/80 border-border/50 text-text-primary shadow-sm"
        }`}>
          {node.name}
          {node.isConstraint && <span className="ml-1 text-danger text-[9px]">● CONSTRAINT</span>}
        </div>
      </Html>
    </group>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Bottleneck3D({
  departments, workflows, result, isScanning,
}: {
  departments: Department[]; workflows: WorkflowStep[];
  result: BottleneckResult | null; isScanning: boolean;
}) {
  return (
    <div className="w-full h-[420px] border border-border/50 rounded-2xl overflow-hidden bg-surface-subtle/50 relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 text-xs uppercase tracking-widest text-text-muted font-semibold bg-surface/80 border border-border/50 px-3 py-1 rounded-full backdrop-blur-md shadow-sm">
        {isScanning
          ? "TOC Constraint Scan in progress…"
          : result
          ? "Analysis Complete — TOC Constraint Highlighted"
          : "Organizational Flow Graph (Force-Directed Layout)"}
      </div>
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        {[
          { color: "#34d399", label: "< 70% Util" },
          { color: "#fbbf24", label: "70–100%" },
          { color: "#f87171", label: "> 100% (Overloaded)" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <div className="w-2 h-2 rounded-full shadow-sm" style={{ background: color }} />
            {label}
          </div>
        ))}
        <div className="text-[9px] text-text-muted/70 mt-1 uppercase tracking-wider font-semibold">Utilization rate</div>
      </div>

      <Canvas camera={{ position: [0, 5, 11], fov: 44 }} dpr={[1, 2]}>
        <ambientLight intensity={0.35} />
        <spotLight position={[0, 12, 0]} intensity={1.5} color="#0F766E" />
        <spotLight position={[-8, 4, -8]} intensity={1.2} color="#34d399" />

        {departments.length > 0 && (
          <OrgGraph
            departments={departments}
            workflows={workflows}
            result={result}
            isScanning={isScanning}
          />
        )}

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={!isScanning && !result}
          autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 5}
          minDistance={4}
          maxDistance={18}
        />
      </Canvas>
    </div>
  );
}
