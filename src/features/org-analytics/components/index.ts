import dynamic from 'next/dynamic';

export * from "./OrgDataSetupSheet";
export * from "./HealthScoreRing";
export * from "./BottleneckCharts";
export * from "./SimulationCharts";
export * from "./AgentWorkflowCanvas";

export const Bottleneck3D = dynamic(() => import('./Bottleneck3D'), { ssr: false });
export const Simulation3D = dynamic(() => import('./Simulation3D'), { ssr: false });
