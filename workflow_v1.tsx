import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  MessageSquare, ShieldCheck, Network, GitMerge, Cpu, 
  Brain, Zap, Search, Database, Share2, Terminal, 
  FileJson, Activity, Server, ArrowRight, Layers,
  LayoutTemplate, ArrowLeftRight, GitPullRequest,
  CheckCircle2, User, Wrench, AlertCircle, PlayCircle, DatabaseZap,
  Filter, ShieldAlert, Bot, FileText, Blocks, Workflow
} from 'lucide-react';

// --- Types & Global Configuration ---

type ViewMode = 'architecture' | 'sequence' | 'pipeline';
type Category = 'entry' | 'core' | 'llm' | 'tools' | 'storage' | 'policy' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'phase5';

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
  label?: string;
}

const CATEGORY_STYLES: Record<Category, { border: string, bg: string, header: string, icon: string, glow: string }> = {
  entry: { border: 'border-slate-600', bg: 'bg-slate-800', header: 'bg-slate-700/50', icon: 'text-slate-300', glow: 'shadow-slate-500/20' },
  core: { border: 'border-blue-500/50', bg: 'bg-[#0f172a]', header: 'bg-blue-900/30', icon: 'text-blue-400', glow: 'shadow-blue-500/20' },
  llm: { border: 'border-amber-500/50', bg: 'bg-[#1a1308]', header: 'bg-amber-900/30', icon: 'text-amber-400', glow: 'shadow-amber-500/20' },
  tools: { border: 'border-rose-500/50', bg: 'bg-[#1a0f14]', header: 'bg-rose-900/30', icon: 'text-rose-400', glow: 'shadow-rose-500/20' },
  storage: { border: 'border-indigo-500/50', bg: 'bg-[#0f111a]', header: 'bg-indigo-900/30', icon: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
  policy: { border: 'border-amber-600/50', bg: 'bg-[#1a1508]', header: 'bg-amber-900/40', icon: 'text-amber-500', glow: 'shadow-amber-600/20' },
  // Pipeline specific categories
  phase1: { border: 'border-slate-500/50', bg: 'bg-[#12161c]', header: 'bg-slate-800/50', icon: 'text-slate-400', glow: 'shadow-slate-500/20' },
  phase2: { border: 'border-purple-500/50', bg: 'bg-[#140f1a]', header: 'bg-purple-900/30', icon: 'text-purple-400', glow: 'shadow-purple-500/20' },
  phase3: { border: 'border-cyan-500/50', bg: 'bg-[#0a1417]', header: 'bg-cyan-900/30', icon: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  phase4: { border: 'border-blue-500/50', bg: 'bg-[#0a111f]', header: 'bg-blue-900/30', icon: 'text-blue-400', glow: 'shadow-blue-500/20' },
  phase5: { border: 'border-emerald-500/50', bg: 'bg-[#0a1711]', header: 'bg-emerald-900/30', icon: 'text-emerald-400', glow: 'shadow-emerald-500/20' }
};

// ==========================================
// DATA: GraphRAG Agent Architecture
// ==========================================
const ARCH_NODES: NodeData[] = [
  // Input
  { id: 'user', label: 'User Query', subLabel: 'Input origin', icon: MessageSquare, category: 'entry' },
  { id: 'guard', label: 'Guardrail Parser', subLabel: 'Validation Layer', icon: ShieldCheck, category: 'entry', details: ['CVE / CWE regex', 'Format validation'] },
  
  // Core Agent
  { id: 'planner', label: 'Planner Node', subLabel: 'Routing & Logic', icon: Brain, category: 'core', details: ['Force graphrag_query on CVE + corr', 'Force lookup_by_cwe on CWE', 'LLM tool selection'] },
  { id: 'executor', label: 'Tool Executor Node', subLabel: 'Dispatch', icon: Cpu, category: 'core', details: ['Dispatch to tool fn', 'Append result'] },
  { id: 'synth', label: 'Synthesis Node', subLabel: 'Final Assembly', icon: GitMerge, category: 'core', details: ['Synthesize FINAL JSON', 'Raw tool fallback'] },
  { id: 'state', label: 'AgentState', subLabel: 'Shared Memory', icon: DatabaseZap, category: 'core', details: ['query · memory · tool_results', 'step_num · pending_tool'] },
  
  // Tools
  { id: 't_gr', label: 'graphrag_query', subLabel: 'Hybrid Retrieval', icon: Network, category: 'tools', details: ['KG + Vector retrieval'] },
  { id: 't_likely', label: 'likely_on_system', subLabel: 'Graph Traversal', icon: Share2, category: 'tools', details: ['3-tier KG lookup'] },
  { id: 't_cwe', label: 'lookup_by_cwe', subLabel: 'CWE Pathway', icon: Search, category: 'tools', details: ['CWE → cluster → CVEs'] },
  { id: 't_cve', label: 'lookup_cve / fetch_epss', subLabel: 'Live APIs', icon: Activity, category: 'tools', details: ['NVD + FIRST.org live APIs'] },
  { id: 't_other', label: 'Other Tools', subLabel: 'Risk & Pentest', icon: Wrench, category: 'tools', details: ['map_owasp · score_risk', 'get_pentest_method'] },
  
  // Retrieval & Storage
  { id: 'neo4j', label: 'Neo4j Graph', subLabel: 'Knowledge DB', icon: Share2, category: 'storage', details: ['407k nodes · 6.9M edges', 'CORRELATED_WITH · HAS_CWE'] },
  { id: 'embedder', label: 'Embedder', subLabel: 'BAAI/bge-small-en-v1.5', icon: Zap, category: 'storage', details: ['dim=384 · CPU'] },
  { id: 'qdrant', label: 'Qdrant Cloud', subLabel: 'Vector DB', icon: Database, category: 'storage', details: ['vuln_kg_evidence_v1', '225k target vectors'] },
  { id: 'merge', label: 'Evidence Merge', subLabel: 'Aggregation', icon: Filter, category: 'storage', details: ['dedup · score-sort', 'direct vs inferred'] },
  
  // LLM Backend
  { id: 'groq', label: 'Groq API', subLabel: 'Primary LLM', icon: Zap, category: 'llm', details: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'] },
  { id: 'openrouter', label: 'OpenRouter', subLabel: 'Fallback 1', icon: Network, category: 'llm', details: ['llama-3.3-70b · gemma-3', 'Free tier models'] },
  { id: 'ollama', label: 'Ollama (Local)', subLabel: 'Fallback 2', icon: Server, category: 'llm', details: ['llama3.2 · mistral · phi3'] },

  // Policy
  { id: 'hitl', label: 'HITL Policy', subLabel: 'Safety Layer', icon: AlertCircle, category: 'policy', details: ['5 trigger conditions', 'low confidence · sparse evidence'] },
  { id: 'schema', label: 'GraphRAGResponse', subLabel: 'Structured Output', icon: FileJson, category: 'policy', details: ['status · entity · citations', 'direct_evidence'] },
  
  { id: 'final', label: 'FINAL Report', subLabel: 'JSON Output', icon: FileText, category: 'entry' }
];

const ARCH_EDGES: EdgeData[] = [
  { source: 'user', target: 'guard' }, { source: 'guard', target: 'planner' },
  { source: 'planner', target: 'executor' }, { source: 'executor', target: 'synth' },
  { source: 'synth', target: 'planner', dashed: true, label: 'needs tools' },
  
  { source: 'executor', target: 't_gr' }, { source: 'executor', target: 't_likely' },
  { source: 'executor', target: 't_cwe' }, { source: 'executor', target: 't_cve' },
  { source: 'executor', target: 't_other' },
  
  { source: 't_gr', target: 'neo4j' }, { source: 't_gr', target: 'embedder' },
  { source: 't_likely', target: 'neo4j' }, { source: 't_cwe', target: 'neo4j' },
  { source: 'embedder', target: 'qdrant' },
  
  { source: 'neo4j', target: 'merge' }, { source: 'qdrant', target: 'merge' },
  { source: 'merge', target: 'hitl' }, { source: 'hitl', target: 'schema' },
  { source: 'schema', target: 'executor', dashed: true },
  
  { source: 't_other', target: 'groq', dashed: true }, { source: 'synth', target: 'groq', animated: true },
  { source: 'groq', target: 'openrouter', dashed: true }, { source: 'openrouter', target: 'ollama', dashed: true },
  
  { source: 'synth', target: 'final' }
];

// ==========================================
// DATA: Data Pipeline DAG
// ==========================================
const PIPE_NODES: NodeData[] = [
  // Phase 1: Collect (Crawlers grouped for visual sanity, detailing the 10+ sources)
  { id: 'crawl_nvd', label: 'crawl_nvd.py', subLabel: 'raw_nvd.json', icon: Search, category: 'phase1', details: ['328k CVEs'] },
  { id: 'crawl_epss', label: 'crawl_epss.py', subLabel: 'raw_epss.json', icon: Activity, category: 'phase1', details: ['305k scores'] },
  { id: 'crawl_intel', label: 'Threat Intel Crawlers', subLabel: 'KEV, MITRE, ExDB', icon: ShieldAlert, category: 'phase1', details: ['raw_cisa_kev.json (1.5k)', 'raw_mitre_attack.json'] },
  { id: 'crawl_web', label: 'Web Crawlers', subLabel: 'GitHub, Blogs, Vendors', icon: Network, category: 'phase1', details: ['raw_github.json (3k)', 'raw_blogs.json (228)'] },

  // Phase 2: Correlate
  { id: 'b_corr', label: 'build_correlations.py', subLabel: '5.8M links', icon: GitMerge, category: 'phase2' },
  { id: 'b_cooc', label: 'build_cooccurrence_v2', subLabel: '891k pairs', icon: Share2, category: 'phase2' },
  { id: 'col_cwe', label: 'collect_cwe_chains.py', subLabel: 'raw_cwe_chains.json', icon: Blocks, category: 'phase2' },
  { id: 'clus_kev', label: 'cluster_kev_campaigns', subLabel: '160k clusters', icon: Layers, category: 'phase2' },
  
  // Phase 3: Build Dataset
  { id: 'b_ds', label: 'build_dataset.py', subLabel: 'vuln_dataset.jsonl', icon: DatabaseZap, category: 'phase3', details: ['325k rows'] },
  { id: 'stack_prof', label: 'stack_profiles.py', subLabel: 'To raw_cooccurrence', icon: Workflow, category: 'phase3' },
  { id: 'exp_tp', label: 'expand_training_pairs.py', subLabel: 'training_pairs.jsonl', icon: Network, category: 'phase3', details: ['2.6M pairs'] },
  
  // Phase 4: Master Build & KG Load
  { id: 'b_master', label: 'build_master_dataset.py', subLabel: 'master_vuln_context', icon: FileJson, category: 'phase4' },
  { id: 'load_kg', label: 'load_kg_master.py', subLabel: 'Graph Ingestion', icon: Terminal, category: 'phase4' },
  { id: 'neo_db', label: 'Neo4j KG', subLabel: 'Production Graph', icon: Share2, category: 'phase4' },

  // Phase 5: Vector Ingest
  { id: 'gr_embed', label: 'graphrag_embed_index', subLabel: 'Qdrant CPU', icon: Brain, category: 'phase5' },
  { id: 'qd_db', label: 'Qdrant Cloud', subLabel: 'Production Vectors', icon: Database, category: 'phase5' }
];

const PIPE_EDGES: EdgeData[] = [
  // P1 -> P2
  { source: 'crawl_nvd', target: 'b_corr' }, { source: 'crawl_epss', target: 'b_corr' }, { source: 'crawl_intel', target: 'b_corr' }, { source: 'crawl_web', target: 'b_corr' },
  { source: 'crawl_nvd', target: 'b_cooc' }, { source: 'crawl_intel', target: 'b_cooc' },
  
  // P2 -> P3
  { source: 'b_corr', target: 'b_ds' }, { source: 'b_cooc', target: 'b_ds' }, { source: 'col_cwe', target: 'b_ds' },
  { source: 'b_ds', target: 'stack_prof' },
  { source: 'b_ds', target: 'exp_tp' },
  
  // P2/P3 -> P4
  { source: 'b_corr', target: 'b_master' }, { source: 'b_cooc', target: 'b_master' }, { source: 'b_ds', target: 'b_master' },
  { source: 'b_master', target: 'load_kg' }, { source: 'load_kg', target: 'neo_db' },
  
  // P4 -> P5
  { source: 'b_master', target: 'gr_embed' }, { source: 'gr_embed', target: 'qd_db' }
];

// ==========================================
// DATA: Sequence Diagram
// ==========================================
const SEQ_ACTORS = [
  { id: 'user', label: 'User', icon: User },
  { id: 'planner', label: 'Planner', icon: Brain },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'neo4j', label: 'Neo4j', icon: Share2 },
  { id: 'qdrant', label: 'Qdrant', icon: Database },
  { id: 'hitl', label: 'HITL', icon: AlertCircle },
  { id: 'llm', label: 'LLM', icon: Zap }
];

const SEQ_MESSAGES = [
  { from: 'user', to: 'planner', label: '"CVE-2021-28310 — what co-exists?"', solid: true, note: 'CVE regex match → force graphrag_query' },
  { from: 'planner', to: 'tools', label: 'graphrag_query({entity: "CVE...", top_k: 20, max_hops: 2})', solid: true },
  { from: 'tools', to: 'neo4j', label: 'MATCH CVE -[CORRELATED_WITH|CO_OCCURS_WITH]->', solid: true },
  { from: 'neo4j', to: 'tools', label: '18 CORRELATED + 2 CO_OCCURS rows', solid: false },
  { from: 'tools', to: 'qdrant', label: 'vector search (when GRAPHRAG_USE_VECTOR=1)', solid: true },
  { from: 'qdrant', to: 'tools', label: 'top-k semantic matches', solid: false },
  { from: 'tools', to: 'planner', label: 'EvidenceItems + Citations (JSON)', solid: false },
  { from: 'planner', to: 'hitl', label: 'evaluate_hitl_policy(payload)', solid: true },
  { from: 'hitl', to: 'planner', label: '{required: false} (confidence 0.652 is OK)', solid: false },
  { from: 'planner', to: 'llm', label: 'synthesize FINAL JSON report', solid: true },
  { from: 'llm', to: 'planner', label: 'structured finding', solid: false },
  { from: 'planner', to: 'user', label: 'FINAL REPORT (JSON)', solid: false }
];

// --- Main Application Component ---

export default function App() {
  const [activeView, setActiveView] = useState<ViewMode>('architecture');

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden flex flex-col">
      {/* Global styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash { to { stroke-dashoffset: -24; } }
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
      `}} />

      {/* Header */}
      <header className="flex flex-col border-b border-slate-800/80 sticky top-0 z-50 bg-[#0a0f1a]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-100 leading-tight">Vulnerability GraphRAG Architecture</h1>
              <p className="text-xs text-slate-400">Detailed Systems & Flow Specifications</p>
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
            <div className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-md flex items-center space-x-2 shadow-inner">
              <Activity className="w-4 h-4 text-slate-400" />
              <span className="font-mono text-xs text-slate-300">Latency: 42ms</span>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="flex items-center px-6 space-x-1 border-t border-slate-800/50 bg-[#080c14]">
          <NavButton 
            active={activeView === 'architecture'} 
            onClick={() => setActiveView('architecture')} 
            icon={LayoutTemplate} 
            label="Agent Architecture" 
          />
          <NavButton 
            active={activeView === 'sequence'} 
            onClick={() => setActiveView('sequence')} 
            icon={ArrowLeftRight} 
            label="Execution Flow" 
          />
          <NavButton 
            active={activeView === 'pipeline'} 
            onClick={() => setActiveView('pipeline')} 
            icon={GitPullRequest} 
            label="Data Pipeline" 
          />
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-grid-pattern overflow-auto">
        {activeView === 'architecture' && <DiagramView nodes={ARCH_NODES} edges={ARCH_EDGES} viewType="arch" />}
        {activeView === 'pipeline' && <DiagramView nodes={PIPE_NODES} edges={PIPE_EDGES} viewType="pipeline" />}
        {activeView === 'sequence' && <SequenceDiagramView />}
      </main>
    </div>
  );
}

// --- Navigation Button Component ---
function NavButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200
        ${active 
          ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
          : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

// --- Dynamic Node/Edge Diagram Renderer ---
function DiagramView({ nodes, edges, viewType }: { nodes: NodeData[], edges: EdgeData[], viewType: 'arch' | 'pipeline' }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [lines, setLines] = useState<React.ReactNode[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const drawLines = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines: React.ReactNode[] = [];

    edges.forEach((edge, index) => {
      const sourceNode = nodeRefs.current[edge.source];
      const targetNode = nodeRefs.current[edge.target];

      if (sourceNode && targetNode) {
        const sourceRect = sourceNode.getBoundingClientRect();
        const targetRect = targetNode.getBoundingClientRect();

        const x1 = sourceRect.left - containerRect.left + sourceRect.width / 2;
        const y1 = sourceRect.top - containerRect.top + sourceRect.height / 2;
        const x2 = targetRect.left - containerRect.left + targetRect.width / 2;
        const y2 = targetRect.top - containerRect.top + targetRect.height / 2;

        const isHorizontal = Math.abs(x1 - x2) > Math.abs(y1 - y2);
        const offset = isHorizontal ? Math.abs(x1 - x2) / 2 : 0;
        const vOffset = !isHorizontal ? Math.abs(y1 - y2) / 2 : 0;
        
        const pathData = `M ${x1} ${y1} C ${x1 + offset} ${y1 + vOffset}, ${x2 - offset} ${y2 - vOffset}, ${x2} ${y2}`;
        
        const isActive = activeNode === edge.source || activeNode === edge.target;
        const isFaded = activeNode && !isActive;

        newLines.push(
          <g key={`${edge.source}-${edge.target}-${index}`} className="transition-opacity duration-300">
            <path d={pathData} fill="none" stroke="transparent" strokeWidth="15" />
            <path
              d={pathData}
              fill="none"
              stroke={isActive ? '#3b82f6' : '#334155'}
              strokeWidth={isActive ? '2.5' : '1.5'}
              strokeDasharray={edge.dashed ? '6,6' : 'none'}
              className={`${edge.animated ? 'animate-[dash_3s_linear_infinite]' : ''} ${isFaded ? 'opacity-20' : 'opacity-100'} transition-all duration-300`}
              style={edge.animated && isActive ? { strokeDasharray: '8,8' } : {}}
            />
            <circle cx={x2} cy={y2} r="3" fill={isActive ? '#3b82f6' : '#334155'} className={`transform transition-all ${isFaded ? 'opacity-20' : 'opacity-100'}`} />
            
            {/* Optional Edge Label */}
            {edge.label && (
              <text 
                x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} 
                fill={isActive ? '#94a3b8' : '#64748b'} 
                fontSize="10" textAnchor="middle" 
                className={`transition-opacity duration-300 ${isFaded ? 'opacity-0' : 'opacity-100'}`}
              >
                {edge.label}
              </text>
            )}
          </g>
        );
      }
    });

    setLines(newLines);
  }, [edges, activeNode]);

  useEffect(() => {
    drawLines();
    window.addEventListener('resize', drawLines);
    const timeoutId = setTimeout(drawLines, 200);
    const intervalId = setInterval(drawLines, 2000);
    return () => {
      window.removeEventListener('resize', drawLines);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [drawLines]);

  return (
    <div className="w-full h-full p-8" ref={containerRef}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {lines}
      </svg>
      {viewType === 'arch' ? (
        <ArchitectureLayout nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
      ) : (
        <PipelineLayout nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
      )}
    </div>
  );
}

// --- Layout: GraphRAG Agent Architecture ---
function ArchitectureLayout({ nodes, nodeRefs, activeNode, setActiveNode }: any) {
  return (
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 min-w-[1200px] h-full items-start max-w-[1400px] mx-auto mt-4">
      
      {/* Col 1: Input / Output */}
      <div className="flex flex-col space-y-8 h-full">
        <div className="space-y-6 bg-[#080d14] p-5 rounded-xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 pl-1">Input Layer</div>
          <NodeCard id="user" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="guard" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
        </div>
        
        <div className="mt-auto pt-24 bg-[#0a1411] p-5 rounded-xl border border-emerald-900/40">
           <div className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-2 pl-1">Egress</div>
           <NodeCard id="final" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
        </div>
      </div>

      {/* Col 2: LangGraph Core */}
      <div className="flex flex-col space-y-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1 pl-2 border-l-2 border-blue-500">Agent Core (pipeline/langgraph)</div>
        <div className="bg-[#0c121e] border border-blue-900/40 rounded-xl p-5 shadow-xl space-y-8 relative">
           <NodeCard id="planner" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
           <div className="h-4 w-px bg-blue-900/50 mx-auto my-1"></div>
           <NodeCard id="executor" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
           <div className="h-4 w-px bg-blue-900/50 mx-auto my-1"></div>
           <NodeCard id="synth" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
           
           <div className="pt-6 mt-6 border-t border-blue-900/30">
             <NodeCard id="state" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
           </div>
        </div>
      </div>

      {/* Col 3: Tools & Policy */}
      <div className="flex flex-col space-y-10 pt-10">
         <div className="bg-[#120a0f] border border-rose-900/30 rounded-xl p-5 shadow-lg space-y-4 relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2 pl-1">Tool Layer (pipeline/tools)</div>
            <NodeCard id="t_gr" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            <NodeCard id="t_likely" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            <NodeCard id="t_cwe" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            <NodeCard id="t_cve" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            <NodeCard id="t_other" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
         </div>
         
         <div className="bg-[#141008] border border-amber-900/30 rounded-xl p-5 shadow-lg space-y-4 relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 pl-1">Policy & Schema</div>
            <NodeCard id="hitl" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            <NodeCard id="schema" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
         </div>
      </div>

      {/* Col 4: Retrieval */}
      <div className="flex flex-col space-y-8 pt-16">
         <div className="bg-[#0b0c14] border border-indigo-900/30 rounded-xl p-5 shadow-lg space-y-6 relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2 pl-1">Retrieval (pipeline/graphrag)</div>
            
            <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-4">
               <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center">Graph Path</div>
               <NodeCard id="neo4j" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            </div>

            <div className="bg-black/30 p-3 rounded-lg border border-white/5 space-y-4">
               <div className="text-[10px] text-slate-500 uppercase tracking-widest text-center">Vector Path</div>
               <NodeCard id="embedder" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
               <NodeCard id="qdrant" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            </div>

            <div className="pt-4 border-t border-indigo-900/30">
               <NodeCard id="merge" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            </div>
         </div>
      </div>
      
      {/* Col 5: LLM Backend */}
      <div className="flex flex-col space-y-6 pt-32">
         <div className="bg-[#141008] border border-amber-900/30 rounded-xl p-5 shadow-lg space-y-6 relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 pl-1">LLM Backend</div>
            <NodeCard id="groq" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            <NodeCard id="openrouter" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
            <NodeCard id="ollama" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
         </div>
      </div>

    </div>
  );
}

// --- Layout: Data Pipeline DAG ---
function PipelineLayout({ nodes, nodeRefs, activeNode, setActiveNode }: any) {
  return (
    <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-12 min-w-[1000px] h-full items-start max-w-7xl mx-auto mt-4">
      {/* Column 1: Phase 1 (Collect) */}
      <div className="flex flex-col space-y-6">
        <div className="bg-[#0d1014] border border-slate-700/50 rounded-xl p-5 shadow-lg space-y-5 relative">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 pl-1">Phase 1: Collect</div>
          <NodeCard id="crawl_nvd" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="crawl_epss" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="crawl_intel" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="crawl_web" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
        </div>
      </div>

      {/* Column 2: Phase 2 (Correlate) */}
      <div className="flex flex-col space-y-6 pt-12">
        <div className="bg-[#100b14] border border-purple-900/40 rounded-xl p-5 shadow-lg space-y-5 relative">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 pl-1">Phase 2: Correlate</div>
          <NodeCard id="b_corr" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="b_cooc" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="col_cwe" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="clus_kev" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
        </div>
      </div>

      {/* Column 3: Phase 3 (Build Dataset) */}
      <div className="flex flex-col space-y-6 pt-24">
        <div className="bg-[#081214] border border-cyan-900/40 rounded-xl p-5 shadow-lg space-y-6 relative">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 pl-1">Phase 3: Build Dataset</div>
          <NodeCard id="b_ds" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="stack_prof" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="exp_tp" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
        </div>
      </div>

      {/* Column 4: Phase 4 & 5 (Master & Ingest) */}
      <div className="flex flex-col space-y-10 pt-32">
        <div className="bg-[#0a0f1a] border border-blue-900/40 rounded-xl p-5 shadow-lg space-y-6 relative">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2 pl-1">Phase 4: Master & KG</div>
          <NodeCard id="b_master" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="load_kg" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="neo_db" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
        </div>
        
        <div className="bg-[#08140f] border border-emerald-900/40 rounded-xl p-5 shadow-lg space-y-6 relative">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 pl-1">Phase 5: Vector Ingest</div>
          <NodeCard id="gr_embed" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
          <NodeCard id="qd_db" nodes={nodes} nodeRefs={nodeRefs} activeNode={activeNode} setActiveNode={setActiveNode} />
        </div>
      </div>
    </div>
  );
}

// --- Reusable Node Component ---
function NodeCard({ id, nodes, nodeRefs, activeNode, setActiveNode }: any) {
  const node = nodes.find((n: NodeData) => n.id === id);
  if (!node) return null;

  const style = CATEGORY_STYLES[node.category as Category];
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
        ${isHovered ? `shadow-lg scale-[1.02] ring-1 ring-white/10 z-20 ${style.glow}` : 'shadow-md scale-100 z-10'}
        ${isFaded ? 'opacity-30 grayscale-[50%]' : 'opacity-100'}
      `}
    >
      <div className={`px-4 py-3 border-b flex items-center space-x-3 rounded-t-xl transition-colors duration-300 ${style.header} ${isHovered ? 'bg-opacity-70' : ''}`}>
        <div className={`p-1.5 rounded-md bg-black/30 ${style.icon}`}>
          <node.icon size={16} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-slate-200 tracking-wide">{node.label}</h3>
        </div>
      </div>
      <div className="p-3 flex flex-col justify-between min-h-[50px]">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">{node.subLabel}</p>
        {node.details && (
          <div className="mt-1 space-y-1">
            {node.details.map((detail: string, idx: number) => (
              <div key={idx} className="flex items-start space-x-1.5 text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors">
                <ArrowRight size={10} className="mt-[2px] opacity-40 flex-shrink-0" />
                <span className="leading-tight">{detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sequence Diagram Component ---
function SequenceDiagramView() {
  return (
    <div className="p-10 max-w-6xl mx-auto overflow-x-auto min-w-[900px]">
      {/* Header Row (Actors) */}
      <div className="flex justify-between relative z-10">
        {SEQ_ACTORS.map((actor) => (
          <div key={actor.id} className="flex flex-col items-center w-32">
            <div className="w-12 h-12 bg-slate-800 border border-slate-600 rounded-xl flex items-center justify-center shadow-lg mb-4 text-slate-300">
              <actor.icon size={24} />
            </div>
            <span className="text-sm font-semibold text-slate-300 bg-[#06090f] px-2">{actor.label}</span>
          </div>
        ))}
      </div>

      {/* Lifelines and Messages Area */}
      <div className="relative mt-2 pb-20">
        {/* Draw vertical lifelines */}
        <div className="absolute inset-0 flex justify-between pointer-events-none z-0">
          {SEQ_ACTORS.map((actor) => (
            <div key={actor.id} className="w-32 flex justify-center">
              <div className="w-px h-full bg-slate-800 border-l border-dashed border-slate-700"></div>
            </div>
          ))}
        </div>

        {/* Draw Messages */}
        <div className="relative z-10 pt-8 flex flex-col space-y-12">
          {SEQ_MESSAGES.map((msg, idx) => {
            const fromIdx = SEQ_ACTORS.findIndex(a => a.id === msg.from);
            const toIdx = SEQ_ACTORS.findIndex(a => a.id === msg.to);
            const isForward = toIdx > fromIdx;
            
            // Calculate width and position dynamically based on grid
            const leftPerc = Math.min(fromIdx, toIdx) * (100 / (SEQ_ACTORS.length - 1));
            const widthPerc = Math.abs(toIdx - fromIdx) * (100 / (SEQ_ACTORS.length - 1));

            return (
              <div key={idx} className="relative w-full h-8 group hover:z-20">
                <div 
                  className="absolute flex flex-col items-center transition-transform hover:-translate-y-1"
                  style={{ left: `calc(${leftPerc}% + 2rem)`, width: `calc(${widthPerc}% - 4rem)` }}
                >
                  {msg.note && (
                    <div className="absolute -top-10 bg-amber-900/60 border border-amber-500/50 text-amber-100 text-[10px] px-2 py-1 rounded w-max max-w-xs text-center z-20 shadow-md backdrop-blur-sm">
                      {msg.note}
                    </div>
                  )}
                  
                  <div className={`text-[11px] font-semibold mb-1 px-2 py-0.5 rounded bg-[#0a0f1a] border border-slate-800 z-10 shadow-sm ${isForward ? 'text-blue-300' : 'text-slate-400'}`}>
                    {msg.label}
                  </div>
                  
                  {/* The Arrow Line */}
                  <div className="w-full flex items-center absolute bottom-0">
                    {!isForward && <ArrowLeftRight className="w-3 h-3 absolute left-0 -ml-1.5 text-slate-500" strokeWidth={3} />}
                    
                    <div className={`w-full h-px ${msg.solid ? 'bg-blue-500/70' : 'bg-slate-600'} relative`}>
                       {/* CSS workaround for dashed border */}
                       {!msg.solid && <div className="absolute inset-0 border-t border-dashed border-[#06090f]"></div>}
                    </div>

                    {isForward && <ArrowRight className="w-3 h-3 absolute right-0 -mr-1.5 text-blue-500" strokeWidth={3} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer Actor repeated for visual closure */}
      <div className="flex justify-between relative z-10 mt-8">
        {SEQ_ACTORS.map((actor) => (
          <div key={`foot-${actor.id}`} className="flex flex-col items-center w-32">
             <div className="w-10 h-10 bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center opacity-70">
              <actor.icon size={18} className="text-slate-500"/>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
