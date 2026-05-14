import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, AreaChart, Area } from 'recharts';

const ChevronDown = () => (
  <svg className="algo-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>
);

function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function FadeSection({ children, className = '' }) {
  const ref = useFadeIn();
  return <div ref={ref} className={`fade-section ${className}`}>{children}</div>;
}

function AnimatedValue({ value, suffix = '' }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const animated = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        const target = parseFloat(value);
        const dur = 1200, start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const v = target * ease;
          setDisplay(Number.isInteger(target) ? Math.round(v).toString() : v.toFixed(1));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

function CompareBar({ label, value, max, barClass }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setWidth((value / max) * 100), 100); obs.unobserve(el); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, max]);
  return (
    <div className="compare-bar__row" ref={ref}>
      <div className="compare-bar__label">
        <span className="compare-bar__name">{label}</span>
        <span className="compare-bar__value">{value}</span>
      </div>
      <div className="compare-bar__track">
        <div className={`compare-bar__fill ${barClass}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

// Per-algorithm grouped chart data: PURE / LLM / RAG for each algo
// Real data charts
const realWaitChart = [
  { name:'A2C', PURE:147.23, LLM:74.24, RAG:130.03 },
  { name:'DDPG', PURE:141.47, LLM:140.47, RAG:142.28 },
  { name:'DQN', PURE:134.43, LLM:133.43, RAG:134.75 },
  { name:'PPO', PURE:134.98, LLM:133.11, RAG:133.86 },
];
const realCo2Chart = [
  { name:'A2C', PURE:2005.82, LLM:1531.72, RAG:1773.36 },
  { name:'DDPG', PURE:1727.12, LLM:1758.88, RAG:1741.16 },
  { name:'DQN', PURE:1641.33, LLM:1630.88, RAG:1632.62 },
  { name:'PPO', PURE:1842.15, LLM:1753.85, RAG:1734.06 },
];
const realSpeedChart = [
  { name:'A2C', PURE:7.78, LLM:13.64, RAG:9.42 },
  { name:'DDPG', PURE:10.49, LLM:10.21, RAG:10.32 },
  { name:'DQN', PURE:10.68, LLM:10.79, RAG:10.75 },
  { name:'PPO', PURE:9.67, LLM:10.38, RAG:10.48 },
];
const realQueueChart = [
  { name:'A2C', PURE:10.37, LLM:6.71, RAG:8.76 },
  { name:'DDPG', PURE:7.99, LLM:8.17, RAG:8.06 },
  { name:'DQN', PURE:7.83, LLM:7.79, RAG:7.79 },
  { name:'PPO', PURE:8.78, LLM:8.14, RAG:8.05 },
];
// Synthetic data charts
const synthWaitChart = [
  { name:'A2C', PURE:59.91, LLM:53.66, RAG:50.99 },
  { name:'DDPG', PURE:58.82, LLM:58.07, RAG:59.16 },
  { name:'DQN', PURE:61.36, LLM:60.27, RAG:59.59 },
  { name:'PPO', PURE:51.27, LLM:76.09, RAG:47.14 },
];
const synthCo2Chart = [
  { name:'A2C', PURE:186.21, LLM:182.52, RAG:179.82 },
  { name:'DDPG', PURE:186.83, LLM:185.90, RAG:186.78 },
  { name:'DQN', PURE:189.96, LLM:187.12, RAG:186.42 },
  { name:'PPO', PURE:181.07, LLM:188.62, RAG:175.23 },
];
// Baselines
const realBaseline = { wait:109.27, queue:9.66, co2:1879.09, speed:9.40 };
const synthBaseline = { wait:132.08, queue:6.76, co2:192.16, speed:8.62 };
// Mode colors
const modeColors = { PURE:'#94a3b8', LLM:'#6366f1', RAG:'#10b981' };
// Traffic flow data (from saha_verisi.rou.xml)
const trafficFlowData = [
  { period:'09:00', coffee:320, hastane:260, uni:280, metro:270, total:1130 },
  { period:'09:15', coffee:340, hastane:210, uni:170, metro:150, total:870 },
  { period:'12:00', coffee:260, hastane:150, uni:160, metro:180, total:750 },
  { period:'12:15', coffee:340, hastane:160, uni:220, metro:190, total:910 },
  { period:'16:30', coffee:480, hastane:500, uni:210, metro:190, total:1380 },
  { period:'16:45', coffee:420, hastane:490, uni:200, metro:260, total:1370 },
];

const realData = [
  { algo:'BASELINE', mode:'BASELINE', wait:109.27, queue:9.66, co2:1879.09, speed:9.40, waitL5:109.53, queueL5:9.69 },
  { algo:'A2C', mode:'PURE', wait:147.23, queue:10.37, co2:2005.82, speed:7.78, waitL5:156.03, queueL5:10.84 },
  { algo:'A2C', mode:'LLM', wait:74.24, queue:6.71, co2:1531.72, speed:13.64, waitL5:53.24, queueL5:5.62 },
  { algo:'A2C', mode:'RAG', wait:130.03, queue:8.76, co2:1773.36, speed:9.42, waitL5:131.87, queueL5:9.07 },
  { algo:'DDPG', mode:'PURE', wait:141.47, queue:7.99, co2:1727.12, speed:10.49, waitL5:143.08, queueL5:7.97 },
  { algo:'DDPG', mode:'LLM', wait:140.47, queue:8.17, co2:1758.88, speed:10.21, waitL5:150.32, queueL5:8.21 },
  { algo:'DDPG', mode:'RAG', wait:142.28, queue:8.06, co2:1741.16, speed:10.32, waitL5:148.95, queueL5:8.00 },
  { algo:'DQN', mode:'PURE', wait:134.43, queue:7.83, co2:1641.33, speed:10.68, waitL5:135.73, queueL5:8.28 },
  { algo:'DQN', mode:'LLM', wait:133.43, queue:7.79, co2:1630.88, speed:10.79, waitL5:135.55, queueL5:7.75 },
  { algo:'DQN', mode:'RAG', wait:134.75, queue:7.79, co2:1632.62, speed:10.75, waitL5:131.17, queueL5:7.68 },
  { algo:'PPO', mode:'PURE', wait:134.98, queue:8.78, co2:1842.15, speed:9.67, waitL5:130.79, queueL5:7.83 },
  { algo:'PPO', mode:'LLM', wait:133.11, queue:8.14, co2:1753.85, speed:10.38, waitL5:133.94, queueL5:8.13 },
  { algo:'PPO', mode:'RAG', wait:133.86, queue:8.05, co2:1734.06, speed:10.48, waitL5:135.93, queueL5:8.03 },
];

const syntheticData = [
  { algo:'BASELINE', mode:'BASELINE', wait:132.08, queue:6.76, co2:192.16, speed:8.62, waitL5:132.43, queueL5:6.75 },
  { algo:'A2C', mode:'PURE', wait:59.91, queue:5.66, co2:186.21, speed:8.86, waitL5:59.69, queueL5:5.71 },
  { algo:'A2C', mode:'LLM', wait:53.66, queue:5.49, co2:182.52, speed:9.13, waitL5:47.31, queueL5:5.21 },
  { algo:'A2C', mode:'RAG', wait:50.99, queue:5.36, co2:179.82, speed:9.33, waitL5:49.34, queueL5:5.24 },
  { algo:'DDPG', mode:'PURE', wait:58.82, queue:5.64, co2:186.83, speed:8.87, waitL5:58.64, queueL5:5.67 },
  { algo:'DDPG', mode:'LLM', wait:58.07, queue:5.57, co2:185.90, speed:8.97, waitL5:59.66, queueL5:5.61 },
  { algo:'DDPG', mode:'RAG', wait:59.16, queue:5.62, co2:186.78, speed:8.87, waitL5:55.46, queueL5:5.49 },
  { algo:'DQN', mode:'PURE', wait:61.36, queue:5.94, co2:189.96, speed:8.86, waitL5:61.11, queueL5:5.93 },
  { algo:'DQN', mode:'LLM', wait:60.27, queue:5.67, co2:187.12, speed:8.80, waitL5:60.09, queueL5:5.67 },
  { algo:'DQN', mode:'RAG', wait:59.59, queue:5.63, co2:186.42, speed:8.82, waitL5:59.24, queueL5:5.63 },
  { algo:'PPO', mode:'PURE', wait:51.27, queue:5.43, co2:181.07, speed:9.27, waitL5:47.54, queueL5:5.26 },
  { algo:'PPO', mode:'LLM', wait:76.09, queue:5.87, co2:188.62, speed:8.85, waitL5:76.71, queueL5:5.94 },
  { algo:'PPO', mode:'RAG', wait:47.14, queue:5.19, co2:175.23, speed:9.63, waitL5:46.44, queueL5:5.15 },
];

const compareAlgos = ['A2C','DDPG','DQN','PPO'];

function getBestWorst(data, key, lower=true) {
  const nonBaseline = data.filter(r => r.mode !== 'BASELINE');
  const vals = nonBaseline.map(r => r[key]);
  const best = lower ? Math.min(...vals) : Math.max(...vals);
  const worst = lower ? Math.max(...vals) : Math.min(...vals);
  return { best, worst };
}

function DataTable({ data, t }) {
  const bw = {
    wait: getBestWorst(data, 'wait', true),
    queue: getBestWorst(data, 'queue', true),
    co2: getBestWorst(data, 'co2', true),
    speed: getBestWorst(data, 'speed', false),
    waitL5: getBestWorst(data, 'waitL5', true),
    queueL5: getBestWorst(data, 'queueL5', true),
  };
  const cls = (val, key) => {
    if (val === bw[key].best) return 'best-value';
    if (val === bw[key].worst) return 'worst-value';
    return '';
  };
  const modeCls = (m) => m === 'BASELINE' ? 'mode-baseline' : m === 'LLM' ? 'mode-llm' : m === 'RAG' ? 'mode-rag' : 'mode-pure';
  return (
    <>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>{t('exp_col_algo')}</th><th>{t('exp_col_mode')}</th>
            <th>{t('exp_col_wait')}</th><th>{t('exp_col_queue')}</th>
            <th>{t('exp_col_co2')}</th><th>{t('exp_col_speed')}</th>
            <th>{t('exp_col_wait_last5')}</th><th>{t('exp_col_queue_last5')}</th>
          </tr></thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className={r.mode === 'BASELINE' ? 'baseline-row' : ''}>
                <td className="algo-cell">{r.algo}</td>
                <td><span className={`mode-cell ${modeCls(r.mode)}`}>{r.mode}</span></td>
                <td className={r.mode !== 'BASELINE' ? cls(r.wait, 'wait') : ''}>{r.wait.toFixed(2)}</td>
                <td className={r.mode !== 'BASELINE' ? cls(r.queue, 'queue') : ''}>{r.queue.toFixed(2)}</td>
                <td className={r.mode !== 'BASELINE' ? cls(r.co2, 'co2') : ''}>{r.co2.toFixed(2)}</td>
                <td className={r.mode !== 'BASELINE' ? cls(r.speed, 'speed') : ''}>{r.speed.toFixed(2)}</td>
                <td className={r.mode !== 'BASELINE' ? cls(r.waitL5, 'waitL5') : ''}>{r.waitL5.toFixed(2)}</td>
                <td className={r.mode !== 'BASELINE' ? cls(r.queueL5, 'queueL5') : ''}>{r.queueL5.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="data-scroll-hint">← →</p>
    </>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [openAlgo, setOpenAlgo] = useState(null);
  const [chartTab, setChartTab] = useState('real');
  const [flippedCharts, setFlippedCharts] = useState({});

  const toggle = useCallback((id) => setOpenAlgo(prev => prev === id ? null : id), []);
  const toggleChart = useCallback((id) => setFlippedCharts(prev => ({...prev, [id]: !prev[id]})), []);

  const algos = [
    { id:'ppo', color:'ppo', name:t('ppo_name'), full:t('ppo_full'), verdict:t('ppo_verdict'), verdictType:t('ppo_verdict_type'), desc:t('ppo_desc'), analogy:t('ppo_analogy'), analysis:t('ppo_analysis'),
      modes:{ PURE:{wait:134.98,co2:1842,speed:9.67,queue:8.78}, LLM:{wait:133.11,co2:1754,speed:10.38,queue:8.14}, RAG:{wait:133.86,co2:1734,speed:10.48,queue:8.05} } },
    { id:'a2c', color:'a2c', name:t('a2c_name'), full:t('a2c_full'), verdict:t('a2c_verdict'), verdictType:t('a2c_verdict_type'), desc:t('a2c_desc'), analogy:t('a2c_analogy'), analysis:t('a2c_analysis'),
      modes:{ PURE:{wait:147.23,co2:2006,speed:7.78,queue:10.37}, LLM:{wait:74.24,co2:1532,speed:13.64,queue:6.71}, RAG:{wait:130.03,co2:1773,speed:9.42,queue:8.76} } },
    { id:'dqn', color:'dqn', name:t('dqn_name'), full:t('dqn_full'), verdict:t('dqn_verdict'), verdictType:t('dqn_verdict_type'), desc:t('dqn_desc'), analogy:t('dqn_analogy'), analysis:t('dqn_analysis'),
      modes:{ PURE:{wait:134.43,co2:1641,speed:10.68,queue:7.83}, LLM:{wait:133.43,co2:1631,speed:10.79,queue:7.79}, RAG:{wait:134.75,co2:1633,speed:10.75,queue:7.79} } },
    { id:'ddpg', color:'ddpg', name:t('ddpg_name'), full:t('ddpg_full'), verdict:t('ddpg_verdict'), verdictType:t('ddpg_verdict_type'), desc:t('ddpg_desc'), analogy:t('ddpg_analogy'), analysis:t('ddpg_analysis'),
      modes:{ PURE:{wait:141.47,co2:1727,speed:10.49,queue:7.99}, LLM:{wait:140.47,co2:1759,speed:10.21,queue:8.17}, RAG:{wait:142.28,co2:1741,speed:10.32,queue:8.06} } },
  ];

  const steps = [
    { title: t('step1_title'), text: t('step1_text') },
    { title: t('step2_title'), text: t('step2_text') },
    { title: t('step3_title'), text: t('step3_text') },
    { title: t('step4_title'), text: t('step4_text') },
  ];

  const team = [
    { name:'Arif ÖZALP', id:'21050111058', initials:'AÖ' },
    { name:'Meriç UYSALERLER', id:'21050111051', initials:'MU' },
    { name:'Mert BİLGİÇ', id:'21050111080', initials:'MB' },
    { name:'Onur ÇOKYİĞİT', id:'21050111012', initials:'OÇ' },
  ];

  return (
    <>
      <div className="app-bg"><div className="orb"/><div className="orb"/><div className="orb"/></div>
      <div className="app-container">

        {/* Header */}
        <header className="top-bar">
          <span className="top-bar__logo">🚦 SmartTraffic</span>
          <div className="top-bar__lang">
            <button className={i18n.language==='tr'?'active':''} onClick={()=>i18n.changeLanguage('tr')}>TR</button>
            <button className={i18n.language==='en'?'active':''} onClick={()=>i18n.changeLanguage('en')}>EN</button>
          </div>
        </header>

        {/* Hero */}
        <FadeSection>
          <section className="hero">
            <div className="hero__badge"><SparkleIcon /> {t('badge')}</div>
            <h1>{t('hero_title')}</h1>
            <p className="hero__subtitle">{t('hero_desc')}</p>
          </section>
        </FadeSection>

        {/* Key Stats - calculated from real data: A2C+LLM vs Baseline */}
        {/* CO2: (1879.09-1531.72)/1879.09 = 18.5% reduction */}
        {/* Speed: 13.64/9.40 = 1.45x increase */}
        {/* Queue: (9.66-6.71)/9.66 = 30.5% reduction */}
        {/* Wait (real A2C+LLM): 32.1% reduction */}
        <FadeSection>
          <div className="stats-row">
            <div className="stat-card"><div className="stat-card__value stat-card__value--green"><AnimatedValue value="32.1" suffix="%" /></div><div className="stat-card__label">{t('stat_wait')}</div></div>
            <div className="stat-card"><div className="stat-card__value stat-card__value--cyan"><AnimatedValue value="18.5" suffix="%" /></div><div className="stat-card__label">{t('stat_co2')}</div></div>
            <div className="stat-card"><div className="stat-card__value stat-card__value--blue"><AnimatedValue value="1.5" suffix="x" /></div><div className="stat-card__label">{t('stat_speed')}</div></div>
            <div className="stat-card"><div className="stat-card__value stat-card__value--amber"><AnimatedValue value="30.5" suffix="%" /></div><div className="stat-card__label">{t('stat_queue')}</div></div>
          </div>
        </FadeSection>

        {/* SUMO Map */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h2 className="section__title">{t('sumo_title')}</h2>
            </div>
            <div className="sumo-card glass-panel">
              <div className="sumo-card__img-wrapper">
                <img src="./sumo_map.png" alt="SUMO Intersection" className="sumo-card__img" />
                <div className="sumo-card__pulse sumo-card__pulse--1" />
                <div className="sumo-card__pulse sumo-card__pulse--2" />
                <div className="sumo-card__pulse sumo-card__pulse--3" />
              </div>
              <p className="sumo-card__desc">{t('sumo_desc')}</p>
              <div className="sumo-card__labels">
                <span className="sumo-label">📍 {t('sumo_label_1')}</span>
                <span className="sumo-label">🚗 {t('sumo_label_2')}</span>
                <span className="sumo-label">🎲 {t('sumo_label_3')}</span>
              </div>
            </div>
          </section>
        </FadeSection>

        {/* How It Works */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--cyan">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              <h2 className="section__title">{t('how_title')}</h2>
            </div>
            <div className="steps">
              {steps.map((s, i) => (
                <div className="step" key={i}>
                  <div className="step__dot"><span>{i+1}</span></div>
                  <div className="step__title">{s.title}</div>
                  <div className="step__text">{s.text}</div>
                </div>
              ))}
            </div>
          </section>
        </FadeSection>

        {/* Tech Stack */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--indigo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>
              </div>
              <h2 className="section__title">{t('tech_title')}</h2>
            </div>
            <div className="tech-pills">
              <span className="tech-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="" className="tech-pill__logo"/>Python</span>
              <span className="tech-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" alt="" className="tech-pill__logo"/>PyTorch</span>
              <span className="tech-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" alt="" className="tech-pill__logo"/>NumPy</span>
              <span className="tech-pill"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" alt="" className="tech-pill__logo"/>Pandas</span>
              <span className="tech-pill"><span className="tech-pill__icon">🚗</span>SUMO/TraCI</span>
              <span className="tech-pill"><span className="tech-pill__icon">🦙</span>Llama 3.1</span>
              <span className="tech-pill"><span className="tech-pill__icon">🤖</span>Ollama</span>
            </div>
          </section>
        </FadeSection>

        {/* Algorithms */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--indigo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
              </div>
              <h2 className="section__title">{t('algo_title')}</h2>
            </div>
            <div className="algo-list">
              {algos.map(a => (
                <div key={a.id} className={`algo-item ${openAlgo===a.id?'open':''}`}>
                  <div className="algo-item__header" onClick={()=>toggle(a.id)}>
                    <div className={`algo-item__dot algo-item__dot--${a.color}`}/>
                    <span className="algo-item__name">{a.name}</span>
                    <ChevronDown />
                  </div>
                  <div className="algo-item__body">
                    <div className="algo-item__content">
                      <div className="algo-item__top-row">
                        <span className={`algo-item__tag algo-item__tag--${a.color}`}>{a.full}</span>
                        <span className={`algo-item__verdict algo-item__verdict--${a.verdictType}`}>{a.verdict}</span>
                      </div>
                      <p className="algo-item__desc">{a.desc}</p>
                      <div className="algo-item__analogy-box">
                        <span className="algo-item__analogy-icon">💡</span>
                        <p className="algo-item__analogy">{a.analogy}</p>
                      </div>
                      <div className="algo-item__analysis-box">
                        <p className="algo-item__analysis">{a.analysis}</p>
                      </div>
                      <div className="algo-item__modes">
                        <div className="algo-mode-header">
                          <span></span><span>PURE</span><span>LLM</span><span>RAG</span>
                        </div>
                        <div className="algo-mode-row">
                          <span className="algo-mode-label">⏱️ {t('chart_wait_title')}</span>
                          {['PURE','LLM','RAG'].map(m => <span key={m} className={`algo-mode-val ${a.modes[m].wait <= realBaseline.wait ? 'algo-mode-val--good' : ''}`}>{a.modes[m].wait.toFixed(1)}s</span>)}
                        </div>
                        <div className="algo-mode-row">
                          <span className="algo-mode-label">🌿 CO₂</span>
                          {['PURE','LLM','RAG'].map(m => <span key={m} className={`algo-mode-val ${a.modes[m].co2 <= realBaseline.co2 ? 'algo-mode-val--good' : ''}`}>{a.modes[m].co2}g</span>)}
                        </div>
                        <div className="algo-mode-row">
                          <span className="algo-mode-label">🏎️ {t('chart_speed_title')}</span>
                          {['PURE','LLM','RAG'].map(m => <span key={m} className={`algo-mode-val ${a.modes[m].speed >= realBaseline.speed ? 'algo-mode-val--good' : ''}`}>{a.modes[m].speed.toFixed(1)}</span>)}
                        </div>
                        <div className="algo-mode-row">
                          <span className="algo-mode-label">🚗 {t('chart_queue_title')}</span>
                          {['PURE','LLM','RAG'].map(m => <span key={m} className={`algo-mode-val ${a.modes[m].queue <= realBaseline.queue ? 'algo-mode-val--good' : ''}`}>{a.modes[m].queue.toFixed(1)}</span>)}
                        </div>
                        <div className="algo-mode-baseline">Baseline: {realBaseline.wait}s | {realBaseline.co2}g | {realBaseline.speed} | {realBaseline.queue}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeSection>

        {/* Traffic Data Context */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--amber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <h2 className="section__title">{t('traffic_title')}</h2>
            </div>
            <p className="discussion-intro">{t('traffic_desc')}</p>
            <div className="chart-card">
              <div className="chart-card__title">{t('traffic_chart_title')}</div>
              <div style={{width:'100%',height:220}}>
                <ResponsiveContainer>
                  <AreaChart data={trafficFlowData} margin={{top:5,right:10,left:-15,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                    <XAxis dataKey="period" tick={{fontSize:10,fill:'#64748b'}}/>
                    <YAxis tick={{fontSize:10,fill:'#64748b'}}/>
                    <Tooltip/>
                    <Legend wrapperStyle={{fontSize:10}}/>
                    <Area type="monotone" dataKey="coffee" name={t('traffic_east')} stackId="1" fill="#6366f1" stroke="#6366f1" fillOpacity={0.6}/>
                    <Area type="monotone" dataKey="hastane" name={t('traffic_west')} stackId="1" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.6}/>
                    <Area type="monotone" dataKey="uni" name={t('traffic_north')} stackId="1" fill="#06b6d4" stroke="#06b6d4" fillOpacity={0.6}/>
                    <Area type="monotone" dataKey="metro" name={t('traffic_south')} stackId="1" fill="#10b981" stroke="#10b981" fillOpacity={0.6}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="traffic-info-grid">
              <div className="traffic-info"><span className="traffic-info__dot" style={{background:'#6366f1'}}/><strong>E · 33.1%</strong> CoffeeLab</div>
              <div className="traffic-info"><span className="traffic-info__dot" style={{background:'#f59e0b'}}/><strong>W · 22.9%</strong> {t('traffic_hospital')}</div>
              <div className="traffic-info"><span className="traffic-info__dot" style={{background:'#06b6d4'}}/><strong>N · 19.1%</strong> {t('traffic_uni')}</div>
              <div className="traffic-info"><span className="traffic-info__dot" style={{background:'#10b981'}}/><strong>S · 24.9%</strong> Metro</div>
            </div>
            <div className="traffic-compare">
              <div className="traffic-compare__item">
                <div className="traffic-compare__icon">🏙️</div>
                <div><strong>{t('traffic_real_label')}</strong><br/><span className="traffic-compare__text">{t('traffic_real_text')}</span></div>
              </div>
              <div className="traffic-compare__item">
                <div className="traffic-compare__icon">🧪</div>
                <div><strong>{t('traffic_synth_label')}</strong><br/><span className="traffic-compare__text">{t('traffic_synth_text')}</span></div>
              </div>
            </div>
          </section>
        </FadeSection>

        {/* Results - Per-Algorithm PURE/LLM/RAG */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--cyan">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              </div>
              <h2 className="section__title">{t('results_title')}</h2>
            </div>
            <p className="results-note">📊 {t('results_note')}</p>

            <div className="exp-tabs" style={{marginBottom:12}}>
              <button className={`exp-tab ${chartTab==='real'?'active':''}`} onClick={()=>setChartTab('real')}>{t('exp_tab_real')}</button>
              <button className={`exp-tab ${chartTab==='synthetic'?'active':''}`} onClick={()=>setChartTab('synthetic')}>{t('exp_tab_synthetic')}</button>
            </div>

            {/* Wait Time */}
            <div className={`chart-flip-container ${flippedCharts.wait ? 'flipped' : ''}`} onClick={() => toggleChart('wait')}>
              <div className="chart-flip-inner">
                <div className="chart-flip-front" style={{padding: '16px', display: 'flex', flexDirection: 'column'}}>
                  <div className="chart-card__title" style={{fontWeight: 700, marginBottom: '12px'}}>{t('chart_wait_title')} <span className="chart-card__subtitle" style={{fontWeight: 400, color: 'var(--clr-text-secondary)', fontSize: '0.8rem'}}>({t('chart_wait_unit')})</span></div>
                  <div style={{width:'100%',flex:1}}>
                    <ResponsiveContainer>
                      <BarChart data={chartTab==='real'?realWaitChart:synthWaitChart} margin={{top:5,right:10,left:-15,bottom:5}}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                        <XAxis dataKey="name" tick={{fontSize:10,fill:'#64748b'}}/>
                        <YAxis tick={{fontSize:10,fill:'#64748b'}}/>
                        <Tooltip/>
                        <Legend wrapperStyle={{fontSize:11}}/>
                        <ReferenceLine y={chartTab==='real'?realBaseline.wait:synthBaseline.wait} stroke="#ef4444" strokeDasharray="5 5" label={{value:'Baseline',position:'right',fontSize:9,fill:'#ef4444'}}/>
                        <Bar dataKey="PURE" fill={modeColors.PURE} radius={[4,4,0,0]}/>
                        <Bar dataKey="LLM" fill={modeColors.LLM} radius={[4,4,0,0]}/>
                        <Bar dataKey="RAG" fill={modeColors.RAG} radius={[4,4,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="chart-flip-back">
                  <div className="chart-flip-back__title">⏱️ {t('chart_wait_title')}</div>
                  <p className="chart-flip-back__text">{t('chart_wait_back')}</p>
                </div>
              </div>
            </div>

            {/* CO2 */}
            <div className={`chart-flip-container ${flippedCharts.co2 ? 'flipped' : ''}`} onClick={() => toggleChart('co2')}>
              <div className="chart-flip-inner">
                <div className="chart-flip-front" style={{padding: '16px', display: 'flex', flexDirection: 'column'}}>
                  <div className="chart-card__title" style={{fontWeight: 700, marginBottom: '12px'}}>{t('chart_co2_title')} <span className="chart-card__subtitle" style={{fontWeight: 400, color: 'var(--clr-text-secondary)', fontSize: '0.8rem'}}>({t('chart_co2_unit')})</span></div>
                  <div style={{width:'100%',flex:1}}>
                    <ResponsiveContainer>
                      <BarChart data={chartTab==='real'?realCo2Chart:synthCo2Chart} margin={{top:5,right:10,left:-5,bottom:5}}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                        <XAxis dataKey="name" tick={{fontSize:10,fill:'#64748b'}}/>
                        <YAxis tick={{fontSize:10,fill:'#64748b'}}/>
                        <Tooltip/>
                        <Legend wrapperStyle={{fontSize:11}}/>
                        <ReferenceLine y={chartTab==='real'?realBaseline.co2:synthBaseline.co2} stroke="#ef4444" strokeDasharray="5 5" label={{value:'Baseline',position:'right',fontSize:9,fill:'#ef4444'}}/>
                        <Bar dataKey="PURE" fill={modeColors.PURE} radius={[4,4,0,0]}/>
                        <Bar dataKey="LLM" fill={modeColors.LLM} radius={[4,4,0,0]}/>
                        <Bar dataKey="RAG" fill={modeColors.RAG} radius={[4,4,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="chart-flip-back">
                  <div className="chart-flip-back__title">🌿 {t('chart_co2_title')}</div>
                  <p className="chart-flip-back__text">{t('chart_co2_back')}</p>
                </div>
              </div>
            </div>

            {/* Speed */}
            <div className={`chart-flip-container ${flippedCharts.speed ? 'flipped' : ''}`} onClick={() => toggleChart('speed')}>
              <div className="chart-flip-inner">
                <div className="chart-flip-front" style={{padding: '16px', display: 'flex', flexDirection: 'column'}}>
                  <div className="chart-card__title" style={{fontWeight: 700, marginBottom: '12px'}}>{t('chart_speed_title')} <span className="chart-card__subtitle" style={{fontWeight: 400, color: 'var(--clr-text-secondary)', fontSize: '0.8rem'}}>({t('chart_speed_unit')})</span></div>
                  <div style={{width:'100%',flex:1}}>
                    <ResponsiveContainer>
                      <BarChart data={chartTab==='real'?realSpeedChart:[{name:'A2C',PURE:8.86,LLM:9.13,RAG:9.33},{name:'DDPG',PURE:8.87,LLM:8.97,RAG:8.87},{name:'DQN',PURE:8.86,LLM:8.80,RAG:8.82},{name:'PPO',PURE:9.27,LLM:8.85,RAG:9.63}]} margin={{top:5,right:10,left:-15,bottom:5}}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                        <XAxis dataKey="name" tick={{fontSize:10,fill:'#64748b'}}/>
                        <YAxis tick={{fontSize:10,fill:'#64748b'}}/>
                        <Tooltip/>
                        <Legend wrapperStyle={{fontSize:11}}/>
                        <ReferenceLine y={chartTab==='real'?realBaseline.speed:synthBaseline.speed} stroke="#ef4444" strokeDasharray="5 5" label={{value:'Baseline',position:'right',fontSize:9,fill:'#ef4444'}}/>
                        <Bar dataKey="PURE" fill={modeColors.PURE} radius={[4,4,0,0]}/>
                        <Bar dataKey="LLM" fill={modeColors.LLM} radius={[4,4,0,0]}/>
                        <Bar dataKey="RAG" fill={modeColors.RAG} radius={[4,4,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="chart-flip-back">
                  <div className="chart-flip-back__title">🏎️ {t('chart_speed_title')}</div>
                  <p className="chart-flip-back__text">{t('chart_speed_back')}</p>
                </div>
              </div>
            </div>

            {/* Queue */}
            <div className={`chart-flip-container ${flippedCharts.queue ? 'flipped' : ''}`} onClick={() => toggleChart('queue')}>
              <div className="chart-flip-inner">
                <div className="chart-flip-front" style={{padding: '16px', display: 'flex', flexDirection: 'column'}}>
                  <div className="chart-card__title" style={{fontWeight: 700, marginBottom: '12px'}}>{t('chart_queue_title')} <span className="chart-card__subtitle" style={{fontWeight: 400, color: 'var(--clr-text-secondary)', fontSize: '0.8rem'}}>({t('chart_queue_unit')})</span></div>
                  <div style={{width:'100%',flex:1}}>
                    <ResponsiveContainer>
                      <BarChart data={chartTab==='real'?realQueueChart:[{name:'A2C',PURE:5.66,LLM:5.49,RAG:5.36},{name:'DDPG',PURE:5.64,LLM:5.57,RAG:5.62},{name:'DQN',PURE:5.94,LLM:5.67,RAG:5.63},{name:'PPO',PURE:5.43,LLM:5.87,RAG:5.19}]} margin={{top:5,right:10,left:-15,bottom:5}}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                        <XAxis dataKey="name" tick={{fontSize:10,fill:'#64748b'}}/>
                        <YAxis tick={{fontSize:10,fill:'#64748b'}}/>
                        <Tooltip/>
                        <Legend wrapperStyle={{fontSize:11}}/>
                        <ReferenceLine y={chartTab==='real'?realBaseline.queue:synthBaseline.queue} stroke="#ef4444" strokeDasharray="5 5" label={{value:'Baseline',position:'right',fontSize:9,fill:'#ef4444'}}/>
                        <Bar dataKey="PURE" fill={modeColors.PURE} radius={[4,4,0,0]}/>
                        <Bar dataKey="LLM" fill={modeColors.LLM} radius={[4,4,0,0]}/>
                        <Bar dataKey="RAG" fill={modeColors.RAG} radius={[4,4,0,0]}/>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="chart-flip-back">
                  <div className="chart-flip-back__title">🚗 {t('chart_queue_title')}</div>
                  <p className="chart-flip-back__text">{t('chart_queue_back')}</p>
                </div>
              </div>
            </div>
          </section>
        </FadeSection>


        {/* Deep Analysis Section */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--indigo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <h2 className="section__title">{t('deep_title')}</h2>
            </div>
            <p className="deep-analysis-desc">{t('deep_desc')}</p>
            <div className="deep-cards">
              <div className="deep-card"><div className="deep-card__icon">🌊</div><h4 className="deep-card__title">{t('deep_traffic_title')}</h4><p className="deep-card__text">{t('deep_traffic_text')}</p></div>
              <div className="deep-card"><div className="deep-card__icon">📊</div><h4 className="deep-card__title">{t('deep_variance_title')}</h4><p className="deep-card__text">{t('deep_variance_text')}</p></div>
              <div className="deep-card"><div className="deep-card__icon">🤖</div><h4 className="deep-card__title">{t('deep_llm_title')}</h4><p className="deep-card__text">{t('deep_llm_text')}</p></div>
              <div className="deep-card"><div className="deep-card__icon">🌿</div><h4 className="deep-card__title">{t('deep_co2_title')}</h4><p className="deep-card__text">{t('deep_co2_text')}</p></div>
              <div className="deep-card"><div className="deep-card__icon">🏆</div><h4 className="deep-card__title">{t('deep_best_title')}</h4><p className="deep-card__text">{t('deep_best_text')}</p></div>
            </div>
            <div className="deep-conclusion">
              <div className="deep-conclusion__title">📋 {t('deep_conclusion_title')}</div>
              <p className="deep-conclusion__text">{t('deep_conclusion_text')}</p>
            </div>
          </section>
        </FadeSection>

        {/* Team */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--cyan">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h2 className="section__title">{t('team_title')}</h2>
            </div>
            <div className="team-advisor">{t('footer_advisor')}</div>
            <div className="team-grid">
              {team.map(m => (
                <div className="team-member" key={m.id}>
                  <div className="team-member__avatar">{m.initials}</div>
                  <div className="team-member__name">{m.name}</div>
                  <div className="team-member__id">{m.id}</div>
                </div>
              ))}
            </div>
          </section>
        </FadeSection>

        <footer className="footer">
          <p className="footer__text">
            <span className="footer__uni">{t('footer_uni')}</span><br/>
            {t('footer_text')}
          </p>
        </footer>
      </div>
    </>
  );
}
