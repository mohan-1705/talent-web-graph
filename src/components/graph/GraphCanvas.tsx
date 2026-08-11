import { memo } from "react";
import {
  Background, Controls, Handle, Position, ReactFlow, type Edge, type Node, type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Briefcase, Building2, Sparkles, User } from "lucide-react";
import type { NodeType, RelType } from "@/lib/graph-data";
import { cn } from "@/lib/utils";

export interface GraphNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  sub?: string;
  refId?: string;
  dimmed?: boolean;
}
export type GraphNode = Node<GraphNodeData>;

const styles: Record<NodeType, { ring: string; bg: string; text: string; Icon: typeof User }> = {
  User: { ring: "border-node-user/50", bg: "bg-node-user/10", text: "text-node-user", Icon: User },
  Skill: { ring: "border-node-skill/50", bg: "bg-node-skill/10", text: "text-node-skill", Icon: Sparkles },
  Job: { ring: "border-node-job/50", bg: "bg-node-job/10", text: "text-node-job", Icon: Briefcase },
  Company: { ring: "border-node-company/50", bg: "bg-node-company/10", text: "text-node-company", Icon: Building2 },
};

export const nodeTypeColor: Record<NodeType, string> = {
  User: "var(--node-user)",
  Skill: "var(--node-skill)",
  Job: "var(--node-job)",
  Company: "var(--node-company)",
};

const GraphNodeView = memo(({ data, selected }: NodeProps<GraphNode>) => {
  const s = styles[data.type];
  return (
    <div
      className={cn(
        "flex w-44 items-center gap-2.5 rounded-xl border-2 bg-card px-3 py-2.5 shadow-[var(--shadow-card)] transition-all",
        s.ring,
        selected && "scale-[1.04] shadow-[var(--shadow-lift)] ring-2 ring-primary ring-offset-2",
        data.dimmed && "opacity-30",
      )}
    >
      <Handle type="target" position={Position.Left} className="!size-1.5 !border-0 !bg-muted-foreground" />
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", s.bg, s.text)}>
        <s.Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold leading-tight">{data.label}</span>
        <span className={cn("block text-[10px] font-medium uppercase tracking-wide", s.text)}>
          {data.sub ?? data.type}
        </span>
      </span>
      <Handle type="source" position={Position.Right} className="!size-1.5 !border-0 !bg-muted-foreground" />
    </div>
  );
});
GraphNodeView.displayName = "GraphNodeView";

const nodeTypes = { graphNode: GraphNodeView };

export function edge(id: string, source: string, target: string, label: RelType, animated = false): Edge {
  return {
    id,
    source,
    target,
    label,
    animated,
    style: { stroke: "oklch(0.55 0.03 260 / 0.5)", strokeWidth: 1.5 },
    labelStyle: { fontSize: 9, fontWeight: 600, fill: "oklch(0.5 0.03 260)" },
    labelBgStyle: { fill: "white" },
    labelBgPadding: [4, 2] as [number, number],
    labelBgBorderRadius: 4,
  };
}

export function GraphCanvas({
  nodes,
  edges,
  onSelect,
  className,
  fitViewKey,
  interactive = true,
}: {
  nodes: GraphNode[];
  edges: Edge[];
  onSelect?: (node: GraphNode) => void;
  className?: string;
  fitViewKey?: string;
  interactive?: boolean;
}) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-xl bg-card", className)}>
      <ReactFlow
        key={fitViewKey}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={interactive}
        nodesConnectable={false}
        panOnDrag={interactive}
        zoomOnScroll={interactive}
        onNodeClick={(_, n) => onSelect?.(n as GraphNode)}
      >
        <Background gap={24} size={1.5} color="oklch(0.52 0.19 267 / 0.12)" />
        {interactive && <Controls showInteractive={false} className="!rounded-lg !border !border-border !shadow-none" />}
      </ReactFlow>
    </div>
  );
}

export function GraphLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4 text-xs text-muted-foreground", className)}>
      {(Object.keys(styles) as NodeType[]).map((t) => (
        <span key={t} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: nodeTypeColor[t] }} />
          {t}
        </span>
      ))}
    </div>
  );
}
