import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target, 
  Layers, 
  Database, 
  Lock, 
  Globe, 
  HelpCircle,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const TOC = [
  { id: 'problem', title: '1. The Macro Problem', icon: <Target size={18} /> },
  { id: 'why-not-built', title: '2. Why Has This Not Been Built?', icon: <HelpCircle size={18} /> },
  { id: 'insight', title: '3. The Insight', icon: <Zap size={18} /> },
  { id: 'product', title: '4. The Product', icon: <Layers size={18} /> },
  { id: 'tech-diff', title: '5. Technical Differentiation', icon: <Database size={18} /> },
  { id: 'market-entry', title: '6. Initial Market Entry', icon: <Globe size={18} /> },
  { id: 'market-size', title: '7. Market Size', icon: <TrendingUp size={18} /> },
  { id: 'business-model', title: '8. Business Model', icon: <BookOpen size={18} /> },
  { id: 'consulting', title: '9. Why Consulting Firms Won\'t Win', icon: <Shield size={18} /> },
  { id: 'big-tech', title: '10. Why Big Tech Won\'t Easily Copy', icon: <Lock size={18} /> },
  { id: 'why-now', title: '11. Why Now', icon: <Zap size={18} /> },
  { id: 'defensibility', title: '12. Defensibility', icon: <Shield size={18} /> },
  { id: 'risks', title: '13. Risks & Mitigation', icon: <Target size={18} /> },
  { id: 'vision', title: '14. Long-Term Vision', icon: <TrendingUp size={18} /> },
  { id: 'faq', title: '15. Top 15 Investor Questions', icon: <HelpCircle size={18} /> },
  { id: 'appendices', title: 'Appendices', icon: <Layers size={18} /> }
];

export default function App() {
  const [activeSection, setActiveSection] = useState('problem');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Smooth scroll handler
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
      setIsSidebarOpen(false);
    }
  };

  // Setup intersection observer for scroll spy
  useEffect(() => {
    const observers = TOC.map(item => {
      const el = document.getElementById(item.id);
      if (!el) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setActiveSection(item.id);
          }
        },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      observer.observe(el);
      return observer;
    });

    return () => {
      observers.forEach(obs => obs?.disconnect());
    };
  }, []);

  const Td = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <td className={`p-4 border-b border-slate-200 text-slate-700 align-top ${className}`}>{children}</td>
  );

  const Th = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <th className={`p-4 bg-slate-50 border-b-2 border-slate-300 text-left font-semibold text-slate-900 align-bottom ${className}`}>{children}</th>
  );

  const MathBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 p-6 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto text-center font-mono text-lg text-slate-800 shadow-sm">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-slate-200 shadow-lg lg:shadow-none z-50
        transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
          <div>
            <h1 className="text-xl font-bold tracking-tight">RankStack</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wider uppercase mt-1">Investor Memo</p>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {TOC.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                ${activeSection === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <span className={`${activeSection === item.id ? 'text-blue-500' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              <span className="truncate">{item.title}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 bg-white">
        
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold">R</div>
            <span className="font-semibold text-slate-900">RankStack Memo</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12 lg:py-20 space-y-24">
          
          {/* Header Section */}
          <header className="space-y-6 text-center lg:text-left border-b border-slate-200 pb-12">
            <div className="inline-flex items-center justify-center lg:justify-start gap-3 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
              <Lock size={16} /> Confidential | Series Seed / Pre-A
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              RankStack
            </h1>
            <h2 className="text-2xl lg:text-3xl font-medium text-slate-500">
              Domain-Aware Credibility Intelligence Engine
            </h2>
            <div className="mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
              <blockquote className="text-xl lg:text-2xl font-serif text-slate-800 italic relative z-10 leading-relaxed">
                "Credibility is one of the largest invisible markets in the world — and it runs on weak infrastructure."
              </blockquote>
            </div>
          </header>

          {/* Section 1 */}
          <section id="problem" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Target className="text-blue-500" /> 1. The Macro Problem
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Institutional credibility is the invisible variable that determines:
            </p>
            <ul className="space-y-4">
              {[
                { label: 'Capital allocation', desc: 'LPs, sovereign funds, and impact investors route billions based on perceived institutional quality.' },
                { label: 'Talent flow', desc: 'Engineers, researchers, and founders choose affiliations based on reputation signals.' },
                { label: 'Partnerships', desc: 'Corporates, governments, and multilaterals select partners based on trust proxies.' },
                { label: 'Government funding', desc: 'Public grants, subsidies, and policy incentives follow perceived legitimacy.' },
                { label: 'Reputation economics', desc: 'Brand premium, pricing power, and network access are direct functions of credibility.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <ChevronRight className="text-blue-500 shrink-0 mt-1" size={20} />
                  <div>
                    <strong className="text-slate-900">{item.label}</strong> — {item.desc}
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-lg font-medium text-slate-800 mt-6">
              These are not marginal decisions. They are <strong>load-bearing decisions</strong> in the global economy.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Yet the infrastructure supporting these decisions is:
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th className="w-1/3">Current State</Th>
                    <Th>Reality</Th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr><Td><strong>Spreadsheet-based</strong></Td><Td>Most institutional evaluations live in Excel files maintained by analysts with inconsistent methodologies.</Td></tr>
                  <tr><Td><strong>Consulting-led</strong></Td><Td>McKinsey, Deloitte, and niche advisory firms produce bespoke reports — expensive, slow, non-reproducible.</Td></tr>
                  <tr><Td><strong>Static</strong></Td><Td>Rankings are published annually. The world moves quarterly.</Td></tr>
                  <tr><Td><strong>Backward-looking</strong></Td><Td>Historical data dominates. Leading indicators are ignored.</Td></tr>
                  <tr><Td><strong>Politically biased</strong></Td><Td>Ranking bodies have funding dependencies, editorial conflicts, and methodological opacity.</Td></tr>
                  <tr><Td><strong>Easily manipulated</strong></Td><Td>Institutions optimize for ranking inputs rather than genuine performance — metric gaming is systemic.</Td></tr>
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-900 text-white rounded-xl space-y-4 shadow-lg mt-8">
              <p className="font-semibold text-red-400">The core failure:</p>
              <p className="text-lg">Trust measurement today is artisan, not engineered. It is editorial, not computational. It is periodic, not continuous. It is brittle, not adaptive.</p>
              <ul className="space-y-2 text-slate-300 font-medium">
                <li>• There is no Bloomberg Terminal for institutional credibility.</li>
                <li>• There is no Moody's for non-financial trust.</li>
                <li>• There is no programmable infrastructure layer for structured, domain-aware, confidence-weighted credibility intelligence.</li>
              </ul>
              <p className="text-xl font-bold text-white pt-4">That gap is RankStack.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="why-not-built" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <HelpCircle className="text-blue-500" /> 2. Why Has This Not Been Built in 50 Years?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Rankings have existed since the 1970s — U.S. News, QS, Times Higher Education, various incubator lists, fund performance tables. Yet none of them are dynamic, adaptive, confidence-weighted, anti-gaming, or governance-aware.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              This is not because nobody tried. It is because <strong>the technical prerequisites did not exist.</strong>
            </p>
            
            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">What was missing:</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th className="w-1/3">Prerequisite</Th>
                    <Th>Why It Was Unavailable</Th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr><Td><strong>LLM-based reasoning</strong></Td><Td>Decomposing qualitative credibility into structured evaluation dimensions requires natural language understanding at scale. Pre-2022, this was not production-viable.</Td></tr>
                  <tr><Td><strong>Weight mutation modeling</strong></Td><Td>Treating ranking weights as conditional variables — not fixed constants — requires optimization frameworks that can respond to contextual signals in real time. This required modern ML infrastructure.</Td></tr>
                  <tr><Td><strong>Large-scale contextual scoring</strong></Td><Td>Scoring across heterogeneous domains requires a context engine that dynamically adapts its evaluation frame. Static models cannot do this.</Td></tr>
                  <tr><Td><strong>Anti-gaming detection</strong></Td><Td>Identifying metric manipulation requires anomaly detection, non-linear curves, and hidden parameters. This requires adversarial ML capabilities.</Td></tr>
                  <tr><Td><strong>Intelligence-first governance</strong></Td><Td>Governance systems were document-first. Intelligence-first governance (continuous scoring, adaptive thresholds) is a post-AI concept.</Td></tr>
                  <tr><Td><strong>Compute economics</strong></Td><Td>Running multi-agent evaluation pipelines across thousands of institutions was cost-prohibitive before the 2023–2025 AI cost collapse.</Td></tr>
                  <tr><Td><strong>Data reconciliation</strong></Td><Td>Cross-referencing claims against independent sources at scale required pipelines only economically viable with modern ETL + LLM extraction.</Td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">What changed:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "LLM agents that can reason about domain-specific evaluation criteria.",
                "Multi-criteria optimization frameworks that handle weight conditionality.",
                "Context engines that adapt scoring frames to domain descriptors.",
                "Real-time data ingestion pipelines at marginal cost.",
                "AI cost collapse — GPT-4 class inference dropped 100x in 18 months."
              ].map((text, i) => (
                <li key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-3">
                  <Zap className="text-yellow-500 shrink-0" size={20} />
                  <span className="text-slate-700">{text}</span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold text-blue-600 mt-6 bg-blue-50 p-4 rounded-lg inline-block">
              The structural preconditions converged in 2024–2025. RankStack is built on that convergence.
            </p>
          </section>

          {/* Section 3 */}
          <section id="insight" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Zap className="text-blue-500" /> 3. The Insight
            </h2>
            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <h3 className="text-2xl font-bold text-indigo-900 mb-2">Credibility is decomposable.</h3>
              <p className="text-indigo-800 text-lg">Trust is not a feeling. It is not a brand. It is not a reputation. It is a <strong>structured, domain-sensitive, weighted function of measurable signals.</strong></p>
            </div>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              For any institution — an incubator, a university, a venture fund, a hospital, a CSR partner, a research lab — credibility can be expressed as:
            </p>

            <MathBlock>
              {String.raw`$$C(i) = \sum_{d=1}^{D} w_d(ctx) \cdot S_d(i) \cdot \alpha_d(freshness) \cdot \beta_d(confidence)$$`}
            </MathBlock>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <ul className="space-y-2 font-mono text-sm text-slate-700">
                <li><strong>C(i)</strong> = Composite credibility score for institution i</li>
                <li><strong>w_d(ctx)</strong> = Context-dependent weight for dimension d</li>
                <li><strong>S_d(i)</strong> = Raw signal score for dimension d</li>
                <li><strong>α_d</strong> = Freshness decay factor</li>
                <li><strong>β_d</strong> = Confidence multiplier from multi-source reconciliation</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mt-8 mb-4">The critical insight: weights must change.</h3>
            <p className="text-lg text-slate-600 mb-4">Depending on:</p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th className="w-1/4">Factor</Th>
                    <Th>Example</Th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr><Td><strong>Domain</strong></Td><Td>"Mentor quality" matters differently for a biotech incubator vs. a consumer tech accelerator.</Td></tr>
                  <tr><Td><strong>Geography</strong></Td><Td>Regulatory compliance weight increases in EU vs. US contexts.</Td></tr>
                  <tr><Td><strong>Stage</strong></Td><Td>Early-stage incubators are evaluated on founder access; late-stage on exit track record.</Td></tr>
                  <tr><Td><strong>Maturity</strong></Td><Td>A 2-year-old program is scored differently than a 15-year institution.</Td></tr>
                  <tr><Td><strong>Policy intent</strong></Td><Td>A government scoring incubators for subsidy allocation weights job creation; a VC scoring weights portfolio IRR.</Td></tr>
                  <tr><Td><strong>Economic cycle</strong></Td><Td>In downturns, survival metrics dominate. In growth cycles, scale metrics dominate.</Td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-xl text-red-900">
              <p className="text-lg font-bold mb-2">Static ranking models are mathematically flawed.</p>
              <p>They assign fixed weights to dimensions whose importance is contextually variable. This is not a UX problem. It is a structural modeling error. RankStack treats this as an engineering problem, not an editorial one.</p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="product" className="scroll-mt-24 space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-6">
              <Layers className="text-blue-500" /> 4. The Product
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              RankStack is a <strong>4-layer credibility intelligence architecture</strong> built on LLM-based reasoning agents, structured evaluation frameworks, and lightweight data connectors.
            </p>

            {/* Layer 1 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="bg-slate-50 p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">Layer 1 — Domain Modeling Agent</h3>
                <p className="text-slate-600 mt-2">The system begins with a domain descriptor — a structured or natural-language input that defines the ecosystem being evaluated.</p>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <Td className="w-1/4 font-semibold">Reads ecosystem descriptors</Td>
                    <Td>Accepts inputs like "biotech incubators in India," "Tier-2 university research labs in Southeast Asia," "ESG-focused impact funds in Europe."</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Generates evaluation dimensions</Td>
                    <Td>The LLM agent decomposes the domain into the relevant evaluation axes. For incubators: mentor quality, capital access, alumni outcomes, infrastructure, network density, sector specialization. For university research labs: publication impact, grant capture rate, industry collaboration, talent output, IP commercialization.</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Defines sub-metrics dynamically</Td>
                    <Td>Each dimension is broken into measurable sub-metrics. "Mentor quality" → mentor-to-cohort ratio, mentor domain relevance, mentor NPS, mentor professional seniority, mentor active engagement frequency.</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Understands context</Td>
                    <Td>The agent differentiates between biotech and fintech incubators, between a Tier-1 research university and a teaching-focused college, between a seed-stage VC and a growth-equity fund. Dimensions and weights shift accordingly.</Td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 bg-slate-100 text-sm font-medium text-slate-800 border-t border-slate-200">
                <strong>Output:</strong> A structured evaluation schema — dimensions, sub-metrics, initial weight vectors, and context annotations — generated in seconds, not weeks.
              </div>
            </div>

            {/* Layer 2 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="bg-slate-50 p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">Layer 2 — Dynamic Scoring Engine</h3>
                <p className="text-slate-600 mt-2">Once the evaluation schema exists, the scoring engine processes institutional data.</p>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <Td className="w-1/4 font-semibold">Multi-criteria weighted scoring</Td>
                    <Td>Each institution is scored across all dimensions and sub-metrics. Scores are computed from ingested data, disclosed records, and LLM-extracted signals.</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Weight mutation logic</Td>
                    <Td>Weights are not constants. They are conditional variables governed by mutation rules. A context trigger (e.g., "post-pandemic economic cycle" or "government subsidy evaluation") shifts the weight vector. This is modeled as: <code className="bg-slate-100 px-1 rounded text-pink-600">{String.raw`$$w_d^{t+1} = f(w_d^t, \Delta ctx)$$`}</code> where <code className="bg-slate-100 px-1 rounded text-pink-600">{String.raw`$$\Delta ctx$$`}</code> represents the contextual delta.</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Relative percentile scoring</Td>
                    <Td>Institutions are scored relative to the evaluated cohort, not against absolute thresholds. This prevents artificial tiering and improves interpretability.</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Non-linear curves</Td>
                    <Td>Scoring follows non-linear response functions. A 10% improvement in a metric at the low end produces a larger score change than the same improvement at the high end. This penalizes gaming at ceiling levels.</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Context-triggered rebalancing</Td>
                    <Td>When the engine detects a domain shift (e.g., regulatory change, market cycle turn), it rebalances weights without manual intervention.</Td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 bg-slate-100 text-sm font-medium text-slate-800 border-t border-slate-200">
                <strong>Output:</strong> Percentile-ranked scores, tier classifications, and dimensional breakdowns — with full weight transparency.
              </div>
            </div>

            {/* Layer 3 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="bg-slate-50 p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">Layer 3 — Validation & Confidence Engine</h3>
                <p className="text-slate-600 mt-2">Raw scores are only as reliable as the data they consume. Layer 3 enforces trust in the output.</p>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <Td className="w-1/4 font-semibold">Multi-source reconciliation</Td>
                    <Td>Every data point is cross-referenced against multiple independent sources. Self-reported incubator claims are validated against government registries, portfolio company filings, media coverage, alumni records, and third-party databases.</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Confidence scoring</Td>
                    <Td>Each score carries a confidence interval. An institution with 5 corroborating sources scores higher confidence than one with 1 self-reported source. Confidence is expressed as: <code className="bg-slate-100 px-1 rounded text-pink-600">{String.raw`$$\beta_d = \frac{n_{corroborated}}{n_{total}} \cdot q_{source\_reliability}$$`}</code></Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Freshness decay modeling</Td>
                    <Td>Data depreciates. A 2024 funding round is worth more than a 2019 funding round. Freshness decay follows: <code className="bg-slate-100 px-1 rounded text-pink-600">{String.raw`$$\alpha(t) = e^{-\lambda(t_{now} - t_{data})}$$`}</code> where λ is a domain-specific decay constant.</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Anomaly detection</Td>
                    <Td>Statistical outliers are flagged. An incubator that claims 50 portfolio exits in 2 years triggers a variance alert. An institution whose metrics improve 3 standard deviations in one cycle triggers a gaming flag.</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold">Anti-gaming flags</Td>
                    <Td>Institutions that exhibit suspicious metric patterns (sudden spikes, correlated metric padding, data source concentration) are flagged for manual review or confidence downgrade.</Td>
                  </tr>
                </tbody>
              </table>
              <div className="p-4 bg-slate-100 text-sm font-medium text-slate-800 border-t border-slate-200">
                <strong>Output:</strong> Confidence-adjusted scores, freshness-weighted rankings, and anomaly/gaming risk flags.
              </div>
            </div>

            {/* Layer 4 */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="bg-slate-50 p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-900">Layer 4 — Intelligence Interface</h3>
                <p className="text-slate-600 mt-2">The final layer delivers actionable intelligence to decision-makers.</p>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <Td className="w-1/4 font-semibold text-blue-800 bg-blue-50/50">Capital allocators</Td>
                    <Td>LP/GP intelligence — which incubators, funds, or labs are genuine performers vs. brand-inflated?</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold text-blue-800 bg-blue-50/50">Governments</Td>
                    <Td>Subsidy allocation — which institutions merit public funding based on adaptive, confidence-weighted scores?</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold text-blue-800 bg-blue-50/50">CSR funds</Td>
                    <Td>Deployment partner intelligence — which NGOs, social enterprises, or implementation partners are credible?</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold text-blue-800 bg-blue-50/50">Corporate innovation teams</Td>
                    <Td>Partnership selection — which universities, labs, or accelerators are domain-relevant and high-performing?</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold text-blue-800 bg-blue-50/50">Talent pipelines</Td>
                    <Td>Institutional quality signals — where should researchers, engineers, and founders invest their careers?</Td>
                  </tr>
                  <tr>
                    <Td className="font-semibold text-blue-800 bg-blue-50/50">Researchers</Td>
                    <Td>Meta-analysis infrastructure — structured, queryable institutional performance data across domains.</Td>
                  </tr>
                </tbody>
              </table>
              <div className="p-6 bg-slate-900 text-white border-t border-slate-200 text-center">
                <p className="text-slate-300 text-sm uppercase tracking-wide font-semibold mb-4">Every output is a composite signal:</p>
                <div className="font-mono text-lg bg-black/30 p-4 rounded-lg inline-block border border-slate-700 shadow-inner overflow-x-auto w-full">
                  {String.raw`$$\text{Output}(i) = \text{Rank}_{\%ile} + \text{Confidence}_\beta + \text{Freshness}_\alpha + \text{Risk}_{flag}$$`}
                </div>
                <p className="mt-4 font-semibold text-blue-400">Not a number. Not a tier. A multi-dimensional credibility intelligence object.</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="tech-diff" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Database className="text-blue-500" /> 5. Technical Differentiation
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">5.1 Dynamic Weight Mutation</h3>
                <p className="text-slate-600 mb-4">
                  <strong>The problem with every existing ranking:</strong> Weights are fixed. QS World University Rankings assigns 40% to academic reputation, 20% to faculty-student ratio, etc. These weights were set editorially. They don't change when the domain shifts, when the evaluation purpose changes, or when the economic cycle turns.
                </p>
                <p className="text-slate-600 mb-4">
                  <strong>RankStack's approach:</strong> Weights are modeled as conditional variables. The weight mutation engine operates on:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 bg-white p-6 rounded-xl border border-slate-200">
                  <li><strong>Domain triggers</strong> — A biotech incubator evaluation up-weights IP output; a social enterprise incubator evaluation up-weights community impact.</li>
                  <li><strong>Temporal triggers</strong> — In recession, capital efficiency and survival metrics gain weight. In expansion, growth and scale metrics dominate.</li>
                  <li><strong>Policy triggers</strong> — A government evaluating incubators for rural subsidy allocation shifts weights toward geographic diversity and job creation.</li>
                  <li><strong>Maturity triggers</strong> — A 1-year-old program is scored on founding team credibility; a 10-year program is scored on portfolio outcomes.</li>
                </ul>
                <p className="text-slate-600 mt-4 italic">
                  This is not manual tuning. The mutation rules are defined as policy functions that respond to contextual signals automatically.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">5.2 Confidence-Weighted Outputs</h3>
                <p className="text-slate-600 mb-4">Every score in RankStack includes:</p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 bg-white p-6 rounded-xl border border-slate-200 mb-4">
                  <li><strong>Primary Score</strong> — The percentile rank within the evaluated cohort.</li>
                  <li><strong>Confidence Score</strong> — A probability-adjusted reliability metric based on source count, source quality, corroboration rate, and recency.</li>
                  <li><strong>Freshness Factor</strong> — A decay-adjusted value reflecting how current the underlying data is.</li>
                </ul>
                <p className="text-slate-600 mb-4">This means a consumer can distinguish between:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-900">
                    <strong>Institution A:</strong> Rank 85th percentile, Confidence 0.92, Freshness 0.88<br/>
                    <span className="font-bold text-green-700 mt-2 block">→ High-conviction signal</span>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-900">
                    <strong>Institution B:</strong> Rank 87th percentile, Confidence 0.41, Freshness 0.55<br/>
                    <span className="font-bold text-orange-700 mt-2 block">→ Weak signal, likely stale or poorly corroborated</span>
                  </div>
                </div>
                <p className="text-slate-600 font-bold mt-4">No existing ranking system provides this layering.</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">5.3 Anti-Gaming Architecture</h3>
                <p className="text-slate-600 mb-4">Gaming is the central vulnerability of every ranking system. Institutions optimize for inputs rather than outcomes. RankStack's anti-gaming layer includes:</p>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead><tr><Th className="w-1/4">Mechanism</Th><Th>Function</Th></tr></thead>
                    <tbody className="bg-white">
                      <tr>
                        <Td><strong>Non-linear scoring curves</strong></Td>
                        <Td>Diminishing returns at high metric values. Padding a metric from 90 to 95 yields far less rank improvement than moving from 40 to 60. This eliminates the incentive to inflate already-strong metrics.</Td>
                      </tr>
                      <tr>
                        <Td><strong>Hidden blended parameters</strong></Td>
                        <Td>Not all scoring dimensions are publicly disclosed. A subset of blended parameters — composite signals derived from multiple inputs — are opaque to the evaluated institution. You cannot game what you cannot see.</Td>
                      </tr>
                      <tr>
                        <Td><strong>Anomaly detection</strong></Td>
                        <Td>Statistical models flag institutions whose metrics deviate significantly from expected distributions. Sudden 3σ+ improvements, metric clustering patterns, and source concentration trigger automated alerts.</Td>
                      </tr>
                      <tr>
                        <Td><strong>Comparative variance alerts</strong></Td>
                        <Td>If an institution's self-reported data diverges significantly from third-party corroboration, the system generates a variance flag and downgrades confidence.</Td>
                      </tr>
                      <tr>
                        <Td><strong>Temporal consistency checks</strong></Td>
                        <Td>Metric trajectories are tracked longitudinally. Institutions that show unrealistic improvement curves are flagged for review.</Td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">5.4 Relative Ranking Logic</h3>
                <p className="text-slate-600 mb-4">RankStack produces <strong>relative percentile scores</strong>, not absolute ratings. This design choice is deliberate:</p>
                <ul className="list-disc list-inside space-y-3 text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <li><strong>Reduces legal exposure</strong> — Absolute scores invite litigation ("You rated us 3/10"). Percentile ranks within a cohort are comparative, not declaratory.</li>
                  <li><strong>Improves interpretability</strong> — "Institute X is in the 78th percentile among biotech incubators in India" is more actionable than "Institute X scored 67.4 out of 100."</li>
                  <li><strong>Prevents rigid tiering</strong> — Absolute thresholds create cliff effects. Percentile distributions are continuous and granular.</li>
                  <li><strong>Adapts to cohort quality</strong> — As the overall quality of a cohort improves, the scoring adjusts. This prevents grade inflation.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">5.5 Governance-Aware Modeling</h3>
                <p className="text-slate-600 mb-4">RankStack is designed to integrate with policy structures from inception:</p>
                <ul className="list-disc list-inside space-y-3 text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <li><strong>Policy intent mapping</strong> — Different scoring contexts (subsidy allocation vs. accreditation vs. investor due diligence) trigger different weight configurations.</li>
                  <li><strong>Regulatory compliance hooks</strong> — Outputs can be structured to align with government reporting frameworks.</li>
                  <li><strong>Audit trail</strong> — Every score is fully traceable: which data sources contributed, which weights were applied, which confidence adjustments were made.</li>
                  <li><strong>Programmable governance</strong> — Policy bodies can define scoring rules as code, not as guidelines. This enables reproducible, auditable, and version-controlled evaluation frameworks.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="market-entry" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Globe className="text-blue-500" /> 6. Initial Market Entry
            </h2>
            
            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-2">Wedge Strategy</h3>
            <p className="text-slate-600 mb-4">Enter where evaluation is politically sensitive, capital flows immediately follow scores, static models fail, and unstructured data exists.</p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th className="w-1/3">Vertical</Th>
                    <Th className="w-1/3">Pain Point</Th>
                    <Th className="w-1/3">RankStack Value</Th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr><Td><strong>Incubator / Accelerator Rating</strong></Td><Td>India alone has 700+ incubators with no structured scoring. Funding relies on anecdote.</Td><Td>Dynamic, confidence-weighted intelligence for capital allocators.</Td></tr>
                  <tr><Td><strong>CSR Partner Intelligence</strong></Td><Td>Corporates deploy mandatory CSR based on relationships. Misallocation is systemic.</Td><Td>Structured scoring of NGOs and deployment partners.</Td></tr>
                  <tr><Td><strong>Venture Fund Track Record</strong></Td><Td>Performance is self-reported, vintage-dependent, and rarely comparable.</Td><Td>Normalized evaluation with temporal decay and domain adjustment.</Td></tr>
                  <tr><Td><strong>University Innovation</strong></Td><Td>Existing rankings are reputation-heavy. Innovation output is poorly measured.</Td><Td>R&D-focused institutional scoring dynamically weighted.</Td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mt-6 mb-4">Expansion Path (Wedge → Platform)</h3>
            <div className="bg-slate-900 text-green-400 font-mono text-sm p-6 rounded-xl overflow-x-auto shadow-inner">
              <pre className="whitespace-pre-wrap leading-loose">
                Incubator Rating (Year 1){'\n'}
                &nbsp;&nbsp;→ University Innovation Scoring (Year 2){'\n'}
                &nbsp;&nbsp;→ VC Fund Intelligence (Year 2–3){'\n'}
                &nbsp;&nbsp;→ CSR/ESG Partner Scoring (Year 2–3){'\n'}
                &nbsp;&nbsp;→ Healthcare Institutional Credibility (Year 3–4){'\n'}
                &nbsp;&nbsp;→ Cross-domain Credibility Infrastructure (Year 4+)
              </pre>
            </div>
          </section>

          {/* Section 7 */}
          <section id="market-size" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-blue-500" /> 7. Market Size
            </h2>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th className="w-1/3">Market</Th>
                    <Th className="w-1/4">Annual Value</Th>
                    <Th>RankStack Role</Th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr><Td><strong>Institutional ranking & benchmarking</strong></Td><Td>$4–6B</Td><Td>Replace static ranking with adaptive intelligence.</Td></tr>
                  <tr><Td><strong>Management consulting (DD)</strong></Td><Td>$50B+</Td><Td>Augment or replace manual evaluation workflows.</Td></tr>
                  <tr><Td><strong>ESG compliance & reporting</strong></Td><Td>$15–20B</Td><Td>Provide credibility scoring for partner networks.</Td></tr>
                  <tr><Td><strong>Government grant allocation</strong></Td><Td>$500B+</Td><Td>Inform allocation through structured scoring.</Td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-500 text-blue-900">
              <h3 className="text-xl font-bold mb-2">The Real Market</h3>
              <p className="mb-2">RankStack does not compete in the "ranking products" market. It competes in the <strong>institutional decision infrastructure</strong> market.</p>
              <p>The total value influenced by institutional credibility measurement is measured in <strong>trillions</strong>, not billions. RankStack captures value by becoming the scoring layer embedded in these decision flows.</p>
            </div>
          </section>

          {/* Section 8 */}
          <section id="business-model" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <BookOpen className="text-blue-500" /> 8. Business Model
            </h2>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th className="w-1/4">Revenue Layer</Th>
                    <Th className="w-1/2">Description</Th>
                    <Th className="w-1/4">Pricing Model</Th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr><Td><strong>Enterprise SaaS</strong></Td><Td>Full platform access for allocators and evaluation teams.</Td><Td>$50K–$500K / yr</Td></tr>
                  <tr><Td><strong>Govt Contracts</strong></Td><Td>Bespoke scoring for governments evaluating institutions.</Td><Td>$200K–$2M / project</Td></tr>
                  <tr><Td><strong>Data Subscriptions</strong></Td><Td>API access for research, media, and analytics platforms.</Td><Td>$10K–$100K / yr</Td></tr>
                  <tr><Td><strong>Embedded APIs</strong></Td><Td>White-label engine embedded in third-party investor portals.</Td><Td>Per-query + minimum</Td></tr>
                  <tr><Td><strong>Consulting Aug.</strong></Td><Td>Intelligence packages for consulting firms.</Td><Td>$5K–$50K / report</Td></tr>
                  <tr><Td><strong>AUM-Linked</strong></Td><Td>Credibility-adjusted allocation models for LPs.</Td><Td>1–5 bps on capital</Td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-lg font-bold text-slate-800 mt-6 text-center">
              End state: RankStack becomes embedded governance infrastructure — the trust layer underlying institutional decision-making.
            </p>
          </section>

          {/* Section 9 */}
          <section id="consulting" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Shield className="text-blue-500" /> 9. Why Consulting Firms Won't Win
            </h2>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th className="w-1/6">Factor</Th>
                    <Th className="w-5/12 text-slate-500">Consulting Firm Reality</Th>
                    <Th className="w-5/12 text-blue-700 bg-blue-50/50">RankStack Reality</Th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr>
                    <Td><strong>Model</strong></Td>
                    <Td>Monetize opacity. Revenue scales with information asymmetry.</Td>
                    <Td className="bg-blue-50/20">Monetize infrastructure. Revenue scales with adoption.</Td>
                  </tr>
                  <tr>
                    <Td><strong>Output</strong></Td>
                    <Td>PDF reports. Project-based. Delivered quarterly at best.</Td>
                    <Td className="bg-blue-50/20">Living system. API-first. Continuously updated.</Td>
                  </tr>
                  <tr>
                    <Td><strong>Scale</strong></Td>
                    <Td>Revenue grows linearly with headcount.</Td>
                    <Td className="bg-blue-50/20">Revenue grows with compute. 10k institutions = 100.</Td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-center italic text-slate-600">Consulting firms will be customers, not competitors. They will embed RankStack to arm themselves.</p>
          </section>

          {/* Section 10 */}
          <section id="big-tech" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Lock className="text-blue-500" /> 10. Why Big Tech Won't Easily Copy
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { title: 'Domain Modeling', desc: 'General-purpose AI fails at deep, localized credibility criteria without specialized architecture.' },
                { title: 'Governance Sensitivity', desc: 'Scoring universities or governments invites regulatory scrutiny and backlash Big Tech avoids.' },
                { title: 'Reputational Risk', desc: 'High downside, low strategic relevance. A bad rank by Google is a PR crisis.' },
                { title: 'Incentive Misalignment', desc: 'Big Tech monetizes ads and cloud compute. Credibility is a governance product.' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-lg font-medium text-slate-800 bg-slate-100 p-4 rounded-lg text-center">
              Trust compounds. A 3-year head start creates a moat capital alone cannot replicate.
            </p>
          </section>

          {/* Section 11 */}
          <section id="why-now" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Zap className="text-blue-500" /> 11. Why Now
            </h2>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <tbody className="bg-white divide-y divide-slate-100">
                  <tr><Td className="w-1/3 font-semibold">Agentic AI maturity</Td><Td>LLM agents capable of domain reasoning and multi-criteria evaluation are production-ready.</Td></tr>
                  <tr><Td className="font-semibold">Institutional digitization</Td><Td>Registries, filings, and disclosures are increasingly machine-readable.</Td></tr>
                  <tr><Td className="font-semibold">Transparency pressure</Td><Td>Stakeholders demand structured accountability. Opacity is a liability.</Td></tr>
                  <tr><Td className="font-semibold">ESG mandates</Td><Td>Regulatory frameworks (EU CSRD, India CSR) require structured evaluation.</Td></tr>
                  <tr><Td className="font-semibold">AI cost collapse</Td><Td>Multi-agent pipelines that cost $1M/yr in 2022 now cost $10K–$50K/yr.</Td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 12 */}
          <section id="defensibility" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Shield className="text-blue-500" /> 12. Defensibility
            </h2>
            <p className="text-lg text-slate-600">RankStack's defensibility is a <strong>layered moat</strong> that compounds over time.</p>

            <div className="bg-slate-900 text-blue-300 font-mono text-sm p-6 rounded-xl overflow-x-auto shadow-inner mb-6">
              <pre className="whitespace-pre-wrap leading-relaxed">
                Year 0–1:  Technical differentiation (weight mutation, confidence layering){'\n'}
                Year 1–2:  Dataset accumulation (longitudinal institutional data){'\n'}
                Year 2–3:  Trust network lock-in (institutions participate willingly){'\n'}
                Year 3–5:  Embedded infrastructure (integrated into policy workflows){'\n'}
                Year 5+:   Switching cost dominance (data history is irreplaceable)
              </pre>
            </div>

            <p className="font-bold text-slate-800 text-lg">Switching Cost Dynamics</p>
            <p className="text-slate-600">After 3-5 years, switching means abandoning years of verified institutional history built into government frameworks and LP due diligence. The cost is informational, not financial.</p>
          </section>

          {/* Section 13 */}
          <section id="risks" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Target className="text-blue-500" /> 13. Risks & Mitigation
            </h2>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <Th className="w-1/5">Risk</Th>
                    <Th className="w-1/12 text-center">Severity</Th>
                    <Th>Mitigation</Th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr><Td className="font-bold">Political capture</Td><Td className="text-center text-red-600 font-bold">High</Td><Td>Methodological transparency. Independent advisory boards. Refuse exclusive contracts compromising independence.</Td></tr>
                  <tr><Td className="font-bold">Legal disputes</Td><Td className="text-center text-red-600 font-bold">High</Td><Td>Relative scoring reduces declaratory risk. Auditable data trails. Institutional response mechanism.</Td></tr>
                  <tr><Td className="font-bold">Data manipulation</Td><Td className="text-center text-orange-500 font-bold">Med</Td><Td>Multi-source recon, anomaly detection, confidence downgrade.</Td></tr>
                  <tr><Td className="font-bold">Bias accusations</Td><Td className="text-center text-red-600 font-bold">High</Td><Td>Full weight transparency. Built-in bias auditing. Third-party audits.</Td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 14 */}
          <section id="vision" className="scroll-mt-24 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-blue-500" /> 14. Long-Term Vision
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-24 shrink-0 font-bold text-slate-400">2026–2028</div>
                <div><strong className="text-slate-800 block mb-1">Foundation</strong> Launch incubator intel, expand to CSR, establish government contracts, build dataset.</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-24 shrink-0 font-bold text-blue-400">2028–2030</div>
                <div><strong className="text-slate-800 block mb-1">Expansion</strong> Cross-domain platform (healthcare, VC), embedded APIs, international scale.</div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-24 shrink-0 font-bold text-blue-600">2030–2035</div>
                <div><strong className="text-slate-800 block mb-1">Infrastructure</strong> Default credibility layer globally. Programmable governance. Trust as infrastructure.</div>
              </div>
            </div>

            <div className="p-8 bg-blue-900 text-white rounded-2xl text-center mt-8 shadow-xl">
              <p className="text-xl font-serif italic mb-4">
                "In 10 years, capital decisions will run through adaptive trust engines. Institutional performance will be continuously scored. Governance will become programmable. Trust will be infrastructure."
              </p>
              <p className="font-bold text-blue-300 uppercase tracking-widest text-sm">
                RankStack is building the trust layer of the institutional economy.
              </p>
            </div>
          </section>

          {/* Section 15 */}
          <section id="faq" className="scroll-mt-24 space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 mb-8">
              <HelpCircle className="text-blue-500" /> 15. Top 15 Investor Questions
            </h2>
            
            <div className="space-y-6">
              {[
                { 
                  q: "Q1: Is this a ranking company?", 
                  a: "No. RankStack is a credibility intelligence infrastructure company. Rankings are a surface-level output like search results are to Google. The core product is the scoring engine." 
                },
                { 
                  q: "Q2: What if government builds internal?", 
                  a: "Governments build procurement systems, not intelligence engines. They lack the AI architecture and independence. Governments are buyers, not builders." 
                },
                { 
                  q: "Q3: How do you avoid lawsuits?", 
                  a: "1. Relative percentile scoring. 2. Full auditability. 3. Institutional response mechanism. 4. Defamation insurance." 
                },
                {
                  q: "Q4: What data is proprietary?",
                  a: "Longitudinal institutional performance datasets, weight mutation patterns, and anti-gaming adversarial models."
                },
                {
                  q: "Q5: Can this scale internationally?",
                  a: "Yes— by design. The Domain Modeling Agent adjusts frames based on inputs ('Biotech in Germany' vs 'Fintech in Nigeria'). Geographic context is an input variable, not a hardcode."
                },
                {
                  q: "Q6: What is the first $1M revenue path?",
                  a: "3-5 government contracts ($200K-$400K) + 10-20 enterprise SaaS licenses ($50K-$100K) within 12-18 months."
                },
                {
                  q: "Q7: How long until moat forms?",
                  a: "Hard moat: 24–36 months (data/network). Deep moat: 48–60 months (embedded policy)."
                },
                {
                  q: "Q8: What assumption kills you?",
                  a: "If institutions universally refuse transparency and markets remain satisfied with opaque, anecdotal reputation evaluation."
                },
                {
                  q: "Q9: Why will incumbents lose?",
                  a: "QS/US News rely on ads/brands. Consultants rely on manual opacity. An automated, transparent engine destroys their current revenue models."
                },
                {
                  q: "Q10: Why you?",
                  a: "This team has: Deep understanding of institutional evaluation workflows from direct research exposure. Technical architecture for domain-aware scoring built as a working prototype. Structural insight: credibility is decomposable, weights must mutate, and confidence must be layered. First-mover advantage in building the specific 4-layer architecture required. No legacy business model to protect. Pure incentive alignment with the mission."
                },
                {
                  q: "Q11: Exit outcomes?",
                  a: (
                    <div className="space-y-3 mt-2">
                      <p><strong>Acquisition by data/analytics incumbent:</strong> Bloomberg, Moody's, S&P Global, Refinitiv — institutional intelligence is adjacent to their core business. (Year 5–7, $500M–$2B)</p>
                      <p><strong>Acquisition by consulting firm:</strong> McKinsey, BCG, Deloitte — credibility intelligence augments their advisory offerings. (Year 4–6, $200M–$1B)</p>
                      <p><strong>Acquisition by Big Tech:</strong> Google, Microsoft — governance infrastructure for enterprise and government cloud. (Year 6–8, $1B–$5B)</p>
                      <p><strong>IPO:</strong> If RankStack becomes embedded governance infrastructure across multiple domains and geographies. (Year 7–10, $2B–$10B+)</p>
                    </div>
                  )
                },
                {
                  q: "Q12: Is this venture-backable?",
                  a: "Yes. Large TAM, compounding moat, high-margin software economics, and platform expansion dynamics. It's an infrastructure business, not a services firm."
                },
                {
                  q: "Q13: What makes this 100x not 5x?",
                  a: "5x is an incubator ranking SaaS. 100x is the embedded API powering every LP allocation and government subsidy globally. The Moody's of non-financial trust."
                },
                {
                  q: "Q14: Why isn't this just analytics?",
                  a: "Analytics is descriptive and flat. RankStack is prescriptive, forward-weighted (decay), multi-source reconciled, and confidence-layered."
                },
                {
                  q: "Q15: What becomes impossible without your system?",
                  a: "Without RankStack, institutional decision-makers cannot: Compare institutions across domains with context-aware weighting. Distinguish high-confidence signals from noise. Detect institutional gaming. Adapt evaluations to policy context. Track institutional credibility longitudinally. Without RankStack, institutional credibility remains a $0 infrastructure market — decisions worth trillions are made on gut instinct, brand, and stale PDFs."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h4>
                  <div className="text-slate-600">{faq.a}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Appendices */}
          <section id="appendices" className="scroll-mt-24 space-y-12 border-t-2 border-slate-200 pt-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Appendix A: Technical Architecture Summary</h2>
              <div className="bg-slate-900 text-blue-300 p-6 rounded-2xl overflow-x-auto font-mono text-sm leading-tight shadow-xl border border-slate-800">
                <pre>
{`┌─────────────────────────────────────────────────────────────────┐
│                    INTELLIGENCE INTERFACE                       │
│  Capital Allocators │ Governments │ CSR │ Corporates │ Talent   │
├─────────────────────────────────────────────────────────────────┤
│                VALIDATION & CONFIDENCE ENGINE                   │
│  Multi-Source Reconciliation │ Confidence Scoring │ Freshness   │
│  Decay │ Anomaly Detection │ Anti-Gaming Flags                  │
├─────────────────────────────────────────────────────────────────┤
│                    DYNAMIC SCORING ENGINE                       │
│  Multi-Criteria Weighted Scoring │ Weight Mutation Logic │      │
│  Relative Percentile │ Non-Linear Curves │ Context Rebalancing  │
├─────────────────────────────────────────────────────────────────┤
│                    DOMAIN MODELING AGENT                        │
│  Ecosystem Descriptor │ Dimension Generation │ Sub-Metric       │
│  Mapping │ Context Understanding │ Schema Output                │
├─────────────────────────────────────────────────────────────────┤
│                      DATA SUBSTRATE                             │
│  Government Registries │ Corporate Filings │ Research DBs │     │
│  Media │ Self-Reported │ Third-Party APIs │ Alumni Records      │
└─────────────────────────────────────────────────────────────────┘`}
                </pre>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Appendix B: Scoring Formula</h2>
              
              <MathBlock>
                {String.raw`$$C(i) = \sum_{d=1}^{D} w_d(ctx) \cdot S_d(i) \cdot \alpha_d(t) \cdot \beta_d(sources)$$`}
              </MathBlock>

              <div className="overflow-x-auto rounded-xl border border-slate-200 mb-6">
                <table className="w-full text-sm">
                  <tbody className="bg-white divide-y divide-slate-100">
                    <tr><Td className="font-mono font-bold w-1/6 bg-slate-50">C(i)</Td><Td>Composite credibility score for institution i</Td></tr>
                    <tr><Td className="font-mono font-bold bg-slate-50">D</Td><Td>Number of evaluation dimensions</Td></tr>
                    <tr><Td className="font-mono font-bold bg-slate-50">w_d(ctx)</Td><Td>Context-dependent weight for dimension d (function of domain, stage, etc.)</Td></tr>
                    <tr><Td className="font-mono font-bold bg-slate-50">S_d(i)</Td><Td>Normalized signal score for dimension d</Td></tr>
                    <tr><Td className="font-mono font-bold bg-slate-50">α_d(t)</Td><Td>Freshness decay: <code className="text-pink-600 bg-pink-50 px-1 rounded">{String.raw`$$e^{-\lambda_d(t_{now} - t_{data})}$$`}</code></Td></tr>
                    <tr><Td className="font-mono font-bold bg-slate-50">β_d</Td><Td>Confidence multiplier: (corroborated / total) × source reliability</Td></tr>
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-slate-100 rounded-xl text-center">
                <p className="font-bold text-slate-600 mb-2 uppercase text-sm tracking-widest">Output per institution</p>
                <code className="text-lg font-mono font-bold text-slate-900 bg-white px-4 py-2 border border-slate-300 rounded shadow-sm">
                  {String.raw`$$\text{Output}(i) = \left[ \text{Rank}_{\%ile},\ \beta_{composite},\ \alpha_{composite},\ \text{Flags}_{risk} \right]$$`}
                </code>
              </div>
            </div>
          </section>

          <footer className="pt-12 pb-24 text-center text-slate-500 border-t border-slate-200 mt-24">
            <p className="font-medium text-slate-800 mb-2">RankStack — Structuring trust for the institutional economy.</p>
            <p className="text-sm">Confidential. For investor discussion only.</p>
          </footer>

        </div>
      </main>
    </div>
  );
}