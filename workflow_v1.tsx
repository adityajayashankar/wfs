import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  MessageSquare, ShieldCheck, Network, GitMerge, Cpu, 
  Brain, Zap, Search, Database, Share2, Terminal, 
  FileJson, Activity, Server, ArrowRight, Layers
} from 'lucide-react';

// --- Types & Data Configuration ---

type Category = 'entry' | 'core' | 'llm' | 'tools' | 'storage';

interface NodeData {
  id: string;
  label: string;
  subLabel: string;
  icon: React.ElementType;
  category: Category;
  details?: string[];
}

interface EdgeData {
  source: string;
  target: string;
  animated?: boolean;
  dashed?: boolean;
}

const NODES: NodeData[] = [
  { id: 'user', label: 'User Query', subLabel: 'Input origin', icon: MessageSquare, category: 'entry' },
  { id: 'chat_layer', label: 'Chat Layer', subLabel: 'Query & Intent Validation', icon: ShieldCheck, category: 'entry', details: ['Context preparation', 'Permission check'] },
  
  { id: 'gateway', label: 'Agent Core Gateway', subLabel: 'Routing & Auth', icon: Network, category: 'core', details: ['Auth verification', 'Task assignment'] },
  { id: 'orchestrator', label: 'Task Orchestrator', subLabel: 'DAG Planning', icon: GitMerge, category: 'core', details: ['Sub-task generation', 'Dependency mapping'] },
  { id: 'executor', label: 'Task Executor', subLabel: 'Tool & Action Execution', icon: Cpu, category: 'core', details: ['Tool selection', 'Parallel execution'] },
  { id: 'synthesizer', label: 'Synthesizer LLM', subLabel: 'Response Assembly', icon: Brain, category: 'core', details: ['Context merging', 'Final formatting'] },
  
  { id: 'llm_gateway', label: 'LLM Gateway', subLabel: 'Model Management', icon: Zap, category: 'llm', details: ['Temperature & Params', 'OpenAI/Anthropic router', 'Fallback handling'] },
  
  { id: 'rag_pipeline', label: 'RAG / Search Pipeline', subLabel: 'Information Retrieval', icon: Search, category: 'tools', details: ['Internet Search', 'Query expansion'] },
  { id: 'action_exec', label: 'Action Exec & Monitor', subLabel: 'External Mutations', icon: Terminal, category: 'tools', details: ['API integrations', 'State mutations'] },
  
  { id: 'graph_db', label: 'Graph DB Pipeline', subLabel: 'Neo4j / Knowledge', icon: Share2, category: 'storage', details: ['Graph traversal', 'Entity relationship'] },
  { id: 'vector_db', label: 'Vector & Relational DB', subLabel: 'Qdrant / Postgres', icon: Database, category: 'storage', details: ['Semantic search', 'Document retrieval'] },
  
  { id: 'report', label: 'Final Output', subLabel: 'JSON / Report', icon: FileJson, category: 'entry' }
];

const EDGES: EdgeData[] = [
  { source: 'user', target: 'chat_layer' },
  { source: 'chat_layer', target: 'gateway' },
  { source: 'gateway', target: 'orchestrator' },
  { source: 'orchestrator', target: 'executor' },
  
  { source: 'executor', target: 'rag_pipeline' },
  { source: 'executor', target: 'action_exec' },
  
  { source: 'rag_pipeline', target: 'graph_db' },
  { source: 'rag_pipeline', target: 'vector_db' },
  
  { source: 'graph_db', target: 'synthesizer' },
  { source: 'vector_db', target: 'synthesizer' },
  { source: 'action_exec', target: 'synthesizer' },
  { source: 'executor', target: 'synthesizer', dashed: true },
  
  { source: 'synthesizer', target: 'report' },
  
  // LLM Gateway connections
  { source: 'gateway', target: 'llm_gateway', dashed: true, animated: true },
  { source: 'orchestrator', target: 'llm_gateway', dashed: true, animated: true },
  { source: 'executor', target: 'llm_gateway', dashed: true, animated: true },
  { source: 'synthesizer', target: 'llm_gateway', dashed: true, animated: true },
];

const CATEGORY_STYLES = {
  entry: { border: 'border-slate-600', bg: 'bg-slate-800', header: 'bg-slate-700/50', icon: 'text-slate-300', glow: 'shadow-slate-500/20' },
  core: { border: 'border-blue-500/50', bg: 'bg-[#0f172a]', header: 'bg-blue-900/30', icon: 'text-blue-400', glow: 'shadow-blue-500/20' },
  llm: { border: 'border-amber-500/50', bg: 'bg-[#1a1308]', header: 'bg-amber-900/30', icon: 'text-amber-400', glow: 'shadow-amber-500/20' },
  tools: { border: 'border-rose-500/50', bg: 'bg-[#1a0f14]', header: 'bg-rose-900/30', icon: 'text-rose-400', glow: 'shadow-rose-500/20' },
  storage: { border: 'border-emerald-500/50', bg: 'bg-[#0a1711]', header: 'bg-emerald-900/30', icon: 'text-emerald-400', glow: 'shadow-emerald-500/20' }
};

// --- Main Application Component ---

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [lines, setLines] = useState<React.ReactNode[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Function to draw SVG curves between nodes
  const drawLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: React.ReactNode[] = [];

    EDGES.forEach((edge, index) => {
      const sourceNode = nodeRefs.current[edge.source];
      const targetNode = nodeRefs.current[edge.target];

      if (sourceNode && targetNode) {
        const sourceRect = sourceNode.getBoundingClientRect();
        const targetRect = targetNode.getBoundingClientRect();

        // Calculate centers relative to container
        const x1 = sourceRect.left - containerRect.left + sourceRect.width / 2;
        const y1 = sourceRect.top - containerRect.top + sourceRect.height / 2;
        const x2 = targetRect.left - containerRect.left + targetRect.width / 2;
        const y2 = targetRect.top - containerRect.top + targetRect.height / 2;

        // Path logic (bezier curve)
        const isHorizontal = Math.abs(x1 - x2) > Math.abs(y1 - y2);
        const offset = isHorizontal ? Math.abs(x1 - x2) / 2 : 0;
        const vOffset = !isHorizontal ? Math.abs(y1 - y2) / 2 : 0;
        
        const pathData = `M ${x1} ${y1} C ${x1 + offset} ${y1 + vOffset}, ${x2 - offset} ${y2 - vOffset}, ${x2} ${y2}`;
        
        const isActive = activeNode === edge.source || activeNode === edge.target;
        const isFaded = activeNode && !isActive;

        newLines.push(
          <g key={`${edge.source}-${edge.target}-${index}`} className="transition-opacity duration-300">
            {/* Invisible thicker path for easier hovering if needed */}
            <path d={pathData} fill="none" stroke="transparent" strokeWidth="15" />
            
            {/* Actual visual path */}
            <path
              d={pathData}
              fill="none"
              stroke={isActive ? '#3b82f6' : '#334155'}
              strokeWidth={isActive ? '2.5' : '1.5'}
              strokeDasharray={edge.dashed ? '6,6' : 'none'}
              className={`
                ${edge.animated ? 'animate-[dash_3s_linear_infinite]' : ''} 
                ${isFaded ? 'opacity-20' : 'opacity-100'}
                transition-all duration-300
              `}
              style={edge.animated && isActive ? { strokeDasharray: '8,8' } : {}}
            />
            {/* Directional Arrow */}
            <circle 
              cx={x2} cy={y2} r="3" 
              fill={isActive ? '#3b82f6' : '#334155'} 
              className={`transform transition-all ${isFaded ? 'opacity-20' : 'opacity-100'}`} 
            />
          </g>
        );
      }
    });

    setLines(newLines);
  }, [activeNode]);

  // Recalculate lines on mount, window resize, and periodically for safety
  useEffect(() => {
    drawLines();
    window.addEventListener('resize', drawLines);
    
    // Slight delay to ensure DOM is fully painted (fonts loaded, etc)
    const timeoutId = setTimeout(drawLines, 200);
    const intervalId = setInterval(drawLines, 2000); // Polling for robust dynamic resizing
    
    return () => {
      window.removeEventListener('resize', drawLines);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [drawLines]);

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -24;
          }
        }
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
      `}} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#0a0f1a]/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <Layers className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-100 leading-tight">Enterprise Agent Architecture</h1>
            <p className="text-xs text-slate-400">Interactive Flow Diagram</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">System Live</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-md flex items-center space-x-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="font-mono text-xs text-slate-300">Latency: 42ms</span>
          </div>
        </div>
      </header>

      {/* Main Diagram Canvas */}
      <main className="flex-1 relative bg-grid-pattern overflow-auto p-8" ref={containerRef}>
        
        {/* SVG Overlay for Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {lines}
        </svg>

        {/* CSS Grid Layout representing the architecture columns */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-10 min-w-[1000px] h-full items-start max-w-7xl mx-auto mt-4">
          
          {/* Column 1: Entry & Global Services (LLM) */}
          <div className="flex flex-col space-y-12 h-full">
            <div className="space-y-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 pl-2">Ingress</div>
              <NodeCard id="user" />
              <NodeCard id="chat_layer" />
            </div>
            
            <div className="mt-auto pt-24">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 pl-2">Global Services</div>
              <NodeCard id="llm_gateway" />
            </div>
          </div>

          {/* Column 2: Agent Core (Takes up 2 cols for emphasis) */}
          <div className="flex flex-col space-y-8 lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-500/70 mb-2 pl-2 border-l-2 border-blue-500/30">LangChain Agent Core</div>
            
            <div className="bg-[#0c121e] border border-slate-800/80 rounded-2xl p-6 shadow-2xl relative">
              {/* Decorative background element for the Core */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-transparent rounded-2xl pointer-events-none"></div>
              
              <div className="flex flex-col space-y-10 relative z-10">
                <NodeCard id="gateway" />
                
                <div className="flex flex-col items-center">
                   <div className="h-4 w-px bg-slate-700/50 my-1"></div>
                   <NodeCard id="orchestrator" />
                   <div className="h-4 w-px bg-slate-700/50 my-1"></div>
                   <NodeCard id="executor" />
                </div>
                
                <div className="pt-6 border-t border-slate-800/80">
                  <NodeCard id="synthesizer" />
                </div>
              </div>
            </div>
            
            <div className="pt-8">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 pl-2">Egress</div>
              <NodeCard id="report" />
            </div>
          </div>

          {/* Column 3: Pipelines & Tools */}
          <div className="flex flex-col space-y-16 pt-24">
             <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-500/70 mb-2 pl-2">Execution Layer</div>
                <div className="space-y-8">
                  <NodeCard id="rag_pipeline" />
                  <NodeCard id="action_exec" />
                </div>
             </div>
          </div>

          {/* Column 4: Storage & External Retrieval */}
          <div className="flex flex-col space-y-12 pt-32">
             <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-500/70 mb-2 pl-2 flex items-center">
                  <Server className="w-3 h-3 mr-1.5" /> Data & Retrieval
                </div>
                <div className="bg-[#081015] border border-emerald-900/30 rounded-xl p-5 shadow-lg space-y-8 relative">
                   <NodeCard id="graph_db" />
                   <NodeCard id="vector_db" />
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );

  // --- Sub-component for rendering individual nodes ---
  function NodeCard({ id }: { id: string }) {
    const node = NODES.find((n) => n.id === id);
    if (!node) return null;

    const style = CATEGORY_STYLES[node.category];
    const isHovered = activeNode === id;
    const isFaded = activeNode !== null && activeNode !== id;

    return (
      <div
        ref={(el) => {
          nodeRefs.current[id] = el;
        }}
        onMouseEnter={() => setActiveNode(id)}
        onMouseLeave={() => setActiveNode(null)}
        className={`
          relative group cursor-pointer w-full rounded-xl border transition-all duration-300
          ${style.bg} ${style.border} 
          ${isHovered ? `shadow-lg scale-[1.02] ring-1 ring-white/10 ${style.glow}` : 'shadow-md scale-100'}
          ${isFaded ? 'opacity-40 grayscale-[30%]' : 'opacity-100'}
        `}
      >
        <div className={`px-4 py-3 border-b flex items-center space-x-3 rounded-t-xl transition-colors duration-300 ${style.header} ${isHovered ? 'bg-opacity-50' : ''}`}>
          <div className={`p-1.5 rounded-md bg-black/20 ${style.icon}`}>
            <node.icon size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wide">{node.label}</h3>
          </div>
        </div>
        
        <div className="p-4 flex flex-col justify-between min-h-[70px]">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
            {node.subLabel}
          </p>
          
          {node.details && (
            <div className="mt-2 space-y-1.5">
              {node.details.map((detail, idx) => (
                <div key={idx} className="flex items-start space-x-1.5 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                  <ArrowRight size={10} className="mt-0.5 opacity-50" />
                  <span className="leading-tight">{detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}
