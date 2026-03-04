import {
	addEdge,
	Background,
	type Connection,
	ConnectionMode,
	Controls,
	type Edge,
	Handle,
	MarkerType,
	MiniMap,
	type Node,
	type NodeProps,
	type NodeTypes,
	type OnEdgesDelete,
	Position,
	ReactFlow,
	reconnectEdge,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import type React from "react";
import { memo, useCallback, useEffect } from "react";
import "@xyflow/react/dist/style.css";
import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { WorkflowCanvasNode, WorkflowNodeData } from "@/constants/nodes";
import { useDebounce } from "@/hooks/debouce";
import {
	useAddWorkflowConn,
	useDeleteWorkflowConn,
	useDeleteWorkflowNode,
	useUpdateWorkflowConn,
	useUpdateWorkflowNode,
	useWorkflowConnectionsQuery,
	useWorkflowNodesQuery,
} from "@/queries/userWorkflows";
import { Route } from "@/routes/_mainLayout/workflow/$workflowId";
import { useWorkflowSidbarTabsStore } from "@/store/workflow/useWorkflowEditor";
import { useWorkflowStore } from "@/store/workflow/useWorkflowStore";
import { withAlpha } from "@/utils/colors";
import {
	getNodeColorByTask,
	toCanvasEdges,
	toCanvasNodes,
} from "@/utils/nodes.utils";
import { useSidebar } from "../ui/sidebar";

const WorkflowNode = memo(
	({ data, selected }: NodeProps<Node<WorkflowNodeData>>) => {
		const { ui, name, inputPorts, outputPorts } = data;
		const Icon = ui.icon;
		const bg = withAlpha(ui.background ?? "#6366f1", 0.2);
		const border = ui.background ?? "#6366f1";

		return (
			<div
				style={{
					background: bg,
					borderColor: selected ? "#ffffff" : withAlpha(border, 0.4),
				}}
				className="group relative min-w-32 h-28 max-w-max rounded-xl flex flex-col items-center justify-center gap-2  transition-all duration-200 border-2 hover:scale-105 cursor-grab"
			>
				{inputPorts?.map((port, i) => (
					<Handle
						key={port.name}
						id={port.name}
						type="target"
						position={Position.Left}
						style={{
							top: `${((i + 1) / (inputPorts.length + 1)) * 100}%`,
							height: 7,
							width: 7,
							background: "var(--background)",
							border: `2px solid ${withAlpha(border, 0.8)}`,
							borderRadius: "50%",
							transition: "transform 0.15s",
						}}
						className="hover:scale-105"
					/>
				))}

				<div
					style={{
						background: withAlpha(border, 0.15),
						border: `1px solid ${withAlpha(border, 0.3)}`,
					}}
					className="w-10 h-10 rounded-lg flex items-center justify-center"
				>
					<Icon
						style={{ color: ui.color ?? "#ffffff" }}
						className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
					/>
				</div>

				<span
					style={{ color: "var(--foreground)" }}
					className="text-xs font-bold text-center leading-tight px-1"
				>
					{name}
				</span>

				{outputPorts?.map((port, i) => (
					<Handle
						key={port.name}
						id={port.name}
						type="source"
						position={Position.Right}
						style={{
							top: `${((i + 1) / (outputPorts.length + 1)) * 100}%`,
							height: 7,
							width: 7,
							borderColor: border,
							borderRadius: "50%",
							cursor: "crosshair",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							zIndex: 10,
							transition: "transform 0.15s, box-shadow 0.15s",
							boxShadow: `0 0 6px ${withAlpha(border, 0.5)}`,
						}}
						className="hidden group-hover:block"
					>
						<span className="text-accent text-xs pointer-events-none h-16 w-16 p-1 object-cover select-none font-bold">
							<HugeiconsIcon icon={Plus} className="h-full w-full" />
						</span>
					</Handle>
				))}

				{outputPorts?.length > 1 &&
					outputPorts.map((port, i) => (
						<div
							key={port.name}
							style={{
								top: `${((i + 1) / (outputPorts.length + 1)) * 100}%`,
								right: "-50%",
								transform: "translateY(-50%)",
								background: withAlpha(border, 0.15),
								border: `1px solid ${withAlpha(border, 0.3)}`,
								color: border,
							}}
							className="absolute text-[9px] font-semibold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
						>
							{port.label}
						</div>
					))}
			</div>
		);
	},
);

const nodeTypes: NodeTypes = {
	workflowNode: WorkflowNode,
};

const WorkflowCanvas = () => {
	const { workflowId } = Route.useParams();
	const { data: workflowNodes, isLoading: nodesLoading } =
		useWorkflowNodesQuery(workflowId);
	const { data: workflowConnections, isLoading: connectionsLoading } =
		useWorkflowConnectionsQuery(workflowId);
	const { mutate: updateNode } = useUpdateWorkflowNode();
	const { mutate: deleteNode } = useDeleteWorkflowNode();
	const { mutate: createNewConnection } = useAddWorkflowConn();
	const { mutate: updateConnection } = useUpdateWorkflowConn();
	const { mutate: deleteConnection } = useDeleteWorkflowConn();
	const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowCanvasNode>(
		[],
	);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const setTabOpen = useWorkflowSidbarTabsStore.getState().setTabOpen;
	const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode);
	const { setOpen } = useSidebar();
	useEffect(() => {
		if (!workflowNodes) return;
		setNodes(toCanvasNodes(workflowNodes));
	}, [workflowNodes, setNodes]);

	useEffect(() => {
		if (!workflowConnections) return;
		setEdges(toCanvasEdges(workflowConnections));
	}, [workflowConnections, setEdges]);

	const handleNodeClick = (node: WorkflowCanvasNode) => {
		setOpen(true);
		setSelectedNode(node.data);
		setTabOpen("editor");
	};

	const onConnect = useCallback(
		(connection: Connection) => {
			if (!connection.sourceHandle || !connection.targetHandle) return null;
			setEdges((eds) => addEdge(connection, eds));
			createNewConnection({
				id: crypto.randomUUID(),
				workflowId: workflowId,
				sourceId: connection.source,
				targetId: connection.target,
				sourcePort: connection.sourceHandle,
				targetPort: connection.targetHandle,
			});
		},
		[setEdges, createNewConnection, workflowId],
	);

	const isConnectionChanged = useCallback(
		(oldEdge: Edge, newConnection: Connection) => {
			return !(
				oldEdge.source === newConnection.source &&
				oldEdge.sourceHandle === newConnection.sourceHandle &&
				oldEdge.target === newConnection.target &&
				oldEdge.targetHandle === newConnection.targetHandle
			);
		},
		[],
	);

	const onReconnect = useCallback(
		(oldEdge: Edge, newConnection: Connection) => {
			if (
				!isConnectionChanged(oldEdge, newConnection) ||
				!newConnection.sourceHandle ||
				!newConnection.targetHandle
			)
				return null;

			setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
			updateConnection({
				id: oldEdge.id,
				workflowId: workflowId,
				sourceId: newConnection.source,
				targetId: newConnection.target,
				sourcePort: newConnection.sourceHandle,
				targetPort: newConnection.targetHandle,
			});
		},
		[setEdges, isConnectionChanged, workflowId, updateConnection],
	);

	const onEdgesDelete: OnEdgesDelete<Edge> = useCallback(
		(deletedEdges) => {
			for (const edge of deletedEdges) {
				deleteConnection({ id: edge.id });
			}
		},
		[deleteConnection],
	);

	const onNodesDelete = useCallback(
		(deletedNodes: WorkflowCanvasNode[]) => {
			for (const canvasNode of deletedNodes) {
				deleteNode({ id: canvasNode.data.id, workflowId });
			}
		},
		[deleteNode, workflowId],
	);

	const saveNodePosition = useCallback(
		(canvasNode: WorkflowCanvasNode) => {
			updateNode({
				id: canvasNode.id,
				task: canvasNode.data.task,
				positionX: Math.round(canvasNode.position.x),
				positionY: Math.round(canvasNode.position.y),
			});
		},
		[updateNode],
	);

	const debouncedSaveNode = useDebounce(
		saveNodePosition,
		(node: WorkflowCanvasNode) => node.id,
	);

	if (nodesLoading || connectionsLoading) {
		return <div>loading workflow</div>;
	}

	return (
		<div style={{ width: "100%", height: "100%" }}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				fitView={true}
				fitViewOptions={{
					duration: 250,
					padding: 0.75,
					minZoom: 1,
					maxZoom: 1,
				}}
				maxZoom={1.25}
				minZoom={0.5}
				onNodesChange={onNodesChange}
				onNodeClick={(_e, node) => handleNodeClick(node)}
				onNodesDelete={onNodesDelete}
				onNodeDragStop={(_e, node) => debouncedSaveNode(node)}
				onEdgesChange={onEdgesChange}
				onEdgesDelete={onEdgesDelete}
				onConnect={onConnect}
				onReconnect={onReconnect}
				connectionRadius={20}
				connectionMode={ConnectionMode.Strict}
				deleteKeyCode="Delete"
				panOnDrag={[1]}
				selectionOnDrag={true}
				defaultEdgeOptions={{
					markerEnd: { type: MarkerType.ArrowClosed },
					style: {
						strokeWidth: 2,
						stroke: "var(--muted-foreground)",
					},
				}}
			>
				<MiniMap
					style={{
						background: "hsl(var(--card))",
						border: "1px solid hsl(var(--border))",
						borderRadius: "12px",
						bottom: "3rem",
						right: "0.5rem",
					}}
					maskColor="hsl(var(--background) / 0.6)"
					nodeColor={(n) =>
						getNodeColorByTask((n.data as WorkflowNodeData).task)
					}
				/>
				<div className="absolute bottom-0 left-0">
					<Controls
						orientation="horizontal"
						style={
							{
								bottom: "4rem",
								background: "transparent",
							} as React.CSSProperties
						}
					/>
				</div>
				<Background />
			</ReactFlow>
		</div>
	);
};

export default WorkflowCanvas;
