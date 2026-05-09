import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';

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

// PPO training data (from ppo_llm.csv)
const ppoTrainingData = [
  {ep:1,wait:218},{ep:2,wait:288},{ep:3,wait:213},{ep:4,wait:84},{ep:5,wait:75},
  {ep:6,wait:95},{ep:7,wait:226},{ep:8,wait:106},{ep:9,wait:74},{ep:10,wait:72},
  {ep:11,wait:73},{ep:12,wait:79},{ep:13,wait:71},{ep:14,wait:69},{ep:15,wait:72},
  {ep:16,wait:74},{ep:17,wait:77},{ep:18,wait:81},{ep:19,wait:79},{ep:20,wait:81},
  {ep:21,wait:89},{ep:22,wait:76},{ep:23,wait:72},{ep:24,wait:52},{ep:25,wait:72}
];
const a2cTrainingData = [
  {ep:1,wait:293},{ep:2,wait:220},{ep:3,wait:147},{ep:4,wait:87},{ep:5,wait:64},
  {ep:6,wait:65},{ep:7,wait:56},{ep:8,wait:67},{ep:9,wait:59},{ep:10,wait:61},
  {ep:11,wait:58},{ep:12,wait:54},{ep:13,wait:73},{ep:14,wait:57},{ep:15,wait:61},
  {ep:16,wait:65},{ep:17,wait:61},{ep:18,wait:59},{ep:19,wait:56},{ep:20,wait:63},
  {ep:21,wait:53},{ep:22,wait:56},{ep:23,wait:71},{ep:24,wait:64},{ep:25,wait:59}
];

const barChartData = [
  { name: 'Baseline', wait: 153.2, co2: 2453 },
  { name: 'PPO+LLM', wait: 52.3, co2: 1393 },
  { name: 'A2C+LLM', wait: 53.1, co2: 1422 },
  { name: 'DQN+LLM', wait: 206.9, co2: 2069 },
  { name: 'DDPG+LLM', wait: 221.6, co2: 1988 },
];
const barColors = ['#94a3b8','#6366f1','#10b981','#06b6d4','#f59e0b'];

export default function App() {
  const { t, i18n } = useTranslation();
  const [openAlgo, setOpenAlgo] = useState(null);
  const toggle = useCallback((id) => setOpenAlgo(prev => prev === id ? null : id), []);

  const algos = [
    { id:'ppo', color:'ppo', name:t('ppo_name'), full:t('ppo_full'), verdict:t('ppo_verdict'), verdictType:t('ppo_verdict_type'), desc:t('ppo_desc'), analogy:t('ppo_analogy'), analysis:t('ppo_analysis'), wait:t('ppo_wait'), co2:t('ppo_co2') },
    { id:'a2c', color:'a2c', name:t('a2c_name'), full:t('a2c_full'), verdict:t('a2c_verdict'), verdictType:t('a2c_verdict_type'), desc:t('a2c_desc'), analogy:t('a2c_analogy'), analysis:t('a2c_analysis'), wait:t('a2c_wait'), co2:t('a2c_co2') },
    { id:'dqn', color:'dqn', name:t('dqn_name'), full:t('dqn_full'), verdict:t('dqn_verdict'), verdictType:t('dqn_verdict_type'), desc:t('dqn_desc'), analogy:t('dqn_analogy'), analysis:t('dqn_analysis'), wait:t('dqn_wait'), co2:t('dqn_co2') },
    { id:'ddpg', color:'ddpg', name:t('ddpg_name'), full:t('ddpg_full'), verdict:t('ddpg_verdict'), verdictType:t('ddpg_verdict_type'), desc:t('ddpg_desc'), analogy:t('ddpg_analogy'), analysis:t('ddpg_analysis'), wait:t('ddpg_wait'), co2:t('ddpg_co2') },
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

        {/* Key Stats */}
        <FadeSection>
          <div className="stats-row">
            <div className="stat-card"><div className="stat-card__value stat-card__value--green"><AnimatedValue value="50.6" suffix="%" /></div><div className="stat-card__label">{t('stat_wait')}</div></div>
            <div className="stat-card"><div className="stat-card__value stat-card__value--cyan"><AnimatedValue value="40" suffix="%" /></div><div className="stat-card__label">{t('stat_co2')}</div></div>
            <div className="stat-card"><div className="stat-card__value stat-card__value--blue"><AnimatedValue value="2.3" suffix="x" /></div><div className="stat-card__label">{t('stat_speed')}</div></div>
            <div className="stat-card"><div className="stat-card__value stat-card__value--amber"><AnimatedValue value="58" suffix="%" /></div><div className="stat-card__label">{t('stat_queue')}</div></div>
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
                <img src="/sumo_map.png" alt="SUMO Intersection" className="sumo-card__img" />
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
                      <div className="algo-item__mini-stats">
                        <div className="algo-mini"><div className="algo-mini__value">{a.wait}</div><div className="algo-mini__label">{t('chart_wait_title')}</div></div>
                        <div className="algo-mini"><div className="algo-mini__value">{a.co2}</div><div className="algo-mini__label">CO₂</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </FadeSection>

        {/* Results */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--cyan">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
              </div>
              <h2 className="section__title">{t('results_title')}</h2>
            </div>
            <p className="results-note">📊 {t('results_note')}</p>

            {/* Bar Charts */}
            <div className="chart-card">
              <div className="chart-card__title">{t('chart_wait_title')} <span className="chart-card__subtitle">({t('chart_wait_unit')})</span></div>
              <div style={{width:'100%',height:220}}>
                <ResponsiveContainer>
                  <BarChart data={barChartData} margin={{top:5,right:10,left:-15,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:'#64748b'}}/>
                    <YAxis tick={{fontSize:10,fill:'#64748b'}}/>
                    <Tooltip/>
                    <Bar dataKey="wait" radius={[4,4,0,0]}>
                      {barChartData.map((_, i) => <Cell key={i} fill={barColors[i]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-card__title">{t('chart_co2_title')} <span className="chart-card__subtitle">({t('chart_co2_unit')})</span></div>
              <div style={{width:'100%',height:220}}>
                <ResponsiveContainer>
                  <BarChart data={barChartData} margin={{top:5,right:10,left:-15,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:'#64748b'}}/>
                    <YAxis tick={{fontSize:10,fill:'#64748b'}}/>
                    <Tooltip/>
                    <Bar dataKey="co2" radius={[4,4,0,0]}>
                      {barChartData.map((_, i) => <Cell key={i} fill={barColors[i]}/>)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Training Progress Line Chart */}
            <div className="chart-card">
              <div className="chart-card__title">{i18n.language==='tr'?'Eğitim İlerlemesi (Bekleme Süresi)':'Training Progress (Wait Time)'} <span className="chart-card__subtitle">({t('chart_wait_unit')})</span></div>
              <div style={{width:'100%',height:220}}>
                <ResponsiveContainer>
                  <LineChart margin={{top:5,right:10,left:-15,bottom:5}}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                    <XAxis dataKey="ep" type="number" domain={[1,25]} tick={{fontSize:10,fill:'#64748b'}} label={{value:i18n.language==='tr'?'Bölüm':'Episode',position:'insideBottom',offset:-2,fontSize:10,fill:'#94a3b8'}}/>
                    <YAxis tick={{fontSize:10,fill:'#64748b'}}/>
                    <Tooltip/>
                    <Line data={ppoTrainingData} dataKey="wait" name="PPO+LLM" stroke="#6366f1" strokeWidth={2} dot={false} type="monotone"/>
                    <Line data={a2cTrainingData} dataKey="wait" name="A2C+LLM" stroke="#10b981" strokeWidth={2} dot={false} type="monotone"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend">
                <span className="chart-legend__item"><span className="chart-legend__dot" style={{background:'#6366f1'}}/>PPO+LLM</span>
                <span className="chart-legend__item"><span className="chart-legend__dot" style={{background:'#10b981'}}/>A2C+LLM</span>
              </div>
            </div>

            {/* Comparison Bars */}
            <div className="chart-card">
              <div className="chart-card__title">{t('chart_wait_title')} <span className="chart-card__subtitle">({i18n.language==='tr'?'karşılaştırma':'comparison'})</span></div>
              <div className="compare-bars">
                <CompareBar label={t('baseline_label')} value={153.2} max={230} barClass="compare-bar__fill--baseline"/>
                <CompareBar label={t('ppo_llm_label')} value={52.3} max={230} barClass="compare-bar__fill--ppo"/>
                <CompareBar label={t('a2c_llm_label')} value={53.1} max={230} barClass="compare-bar__fill--a2c"/>
                <CompareBar label={t('dqn_llm_label')} value={206.9} max={230} barClass="compare-bar__fill--dqn"/>
                <CompareBar label={t('ddpg_llm_label')} value={221.6} max={230} barClass="compare-bar__fill--ddpg"/>
              </div>
            </div>
          </section>
        </FadeSection>

        {/* Discussion */}
        <FadeSection>
          <section className="section">
            <div className="section__header">
              <div className="section__icon section__icon--amber">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              </div>
              <h2 className="section__title">{t('discussion_title')}</h2>
            </div>
            <p className="discussion-intro">{t('discussion_text')}</p>
            <div className="discussion-cards">
              <div className="discussion-card"><div className="discussion-card__icon">🔄</div><h4 className="discussion-card__title">{t('discussion_onpolicy')}</h4><p className="discussion-card__text">{t('discussion_onpolicy_text')}</p></div>
              <div className="discussion-card"><div className="discussion-card__icon">🎯</div><h4 className="discussion-card__title">{t('discussion_action')}</h4><p className="discussion-card__text">{t('discussion_action_text')}</p></div>
              <div className="discussion-card"><div className="discussion-card__icon">⚖️</div><h4 className="discussion-card__title">{t('discussion_stability')}</h4><p className="discussion-card__text">{t('discussion_stability_text')}</p></div>
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
