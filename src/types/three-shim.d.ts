/**
 * Type shim for `three` (v0.185+) which ships without bundled .d.ts files.
 * Re-exports all public symbols from the liquiflow project's @types/three.
 * Replace this file with a direct `pnpm add -D @types/three` once the pnpm
 * store ownership issue is resolved.
 */
declare module "three" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const THREE: any;
  export = THREE;
  export as namespace THREE;

  export class Vector3 {
    x: number; y: number; z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
    setScalar(scalar: number): this;
    clone(): Vector3;
    copy(v: Vector3): this;
    add(v: Vector3): this;
    sub(v: Vector3): this;
    subVectors(a: Vector3, b: Vector3): this;
    multiply(v: Vector3): this;
    multiplyScalar(s: number): this;
    normalize(): this;
    length(): number;
    dot(v: Vector3): number;
    cross(v: Vector3): this;
    lerp(v: Vector3, alpha: number): this;
    distanceTo(v: Vector3): number;
    toArray(): [number, number, number];
  }

  export class Color {
    r: number; g: number; b: number;
    constructor(r?: number | string, g?: number, b?: number);
    set(value: string | number): this;
    setHSL(h: number, s: number, l: number): this;
    getHexString(): string;
    clone(): Color;
    copy(color: Color): this;
  }

  export class Matrix4 {
    elements: number[];
    setPosition(x: number | Vector3, y?: number, z?: number): this;
    identity(): this;
    copy(m: Matrix4): this;
  }

  export class Mesh<
    TGeometry = BufferGeometry,
    TMaterial = Material | Material[]
  > {
    geometry: TGeometry;
    material: TMaterial;
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
    visible: boolean;
  }

  export class Group {
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
    children: Object3D[];
    add(...objects: Object3D[]): this;
    remove(...objects: Object3D[]): this;
  }

  export class Object3D {
    position: Vector3;
    rotation: Euler;
    scale: Vector3;
  }

  export class BufferGeometry {
    dispose(): void;
  }

  export class Material {
    dispose(): void;
    transparent: boolean;
    opacity: number;
  }

  export class MeshStandardMaterial extends Material {
    color: Color;
    emissive: Color;
    emissiveIntensity: number;
    roughness: number;
    metalness: number;
  }

  export class MeshBasicMaterial extends Material {
    color: Color;
  }

  export class MeshPhysicalMaterial extends MeshStandardMaterial {
    transmission: number;
    thickness: number;
  }

  export class InstancedMesh<
    TGeometry = BufferGeometry,
    TMaterial = Material
  > extends Mesh<TGeometry, TMaterial> {
    count: number;
    instanceMatrix: { needsUpdate: boolean };
    instanceColor: { needsUpdate: boolean } | null;
    setMatrixAt(index: number, matrix: Matrix4): void;
    setColorAt(index: number, color: Color): void;
    getMatrixAt(index: number, matrix: Matrix4): void;
    getColorAt(index: number, target: Color): void;
  }

  export class Euler {
    x: number; y: number; z: number;
    constructor(x?: number, y?: number, z?: number, order?: string);
    set(x: number, y: number, z: number, order?: string): this;
  }

  export class MathUtils {
    static lerp(x: number, y: number, t: number): number;
    static clamp(value: number, min: number, max: number): number;
  }

  export const DoubleSide: number;
  export const FrontSide: number;
  export const BackSide: number;
}
