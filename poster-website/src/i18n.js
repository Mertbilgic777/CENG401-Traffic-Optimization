import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  tr: {
    translation: {
      badge: "CENG401 Bitirme Projesi",
      hero_title: "Yapay Zeka ile Akıllı Trafik Sinyalizasyonu",
      hero_desc: "Ankara Etlik kavşağının dijital ikizi üzerinde, LLM destekli pekiştirmeli öğrenme ile trafik akışını optimize ediyoruz.",
      stat_wait: "Bekleme ↓",
      stat_co2: "CO₂ ↓",
      stat_speed: "Hız ↑",
      stat_queue: "Kuyruk ↓",

      // ── SUMO Map ──
      sumo_title: "Simülasyon Ortamı",
      sumo_desc: "Ankara Etlik bölgesi — Halil Sezai Erkut ve Akşemsettin Caddeleri kesişimi. OpenStreetMap verileri kullanılarak SUMO'da oluşturulan yüksek doğruluklu dijital ikiz.",
      sumo_label_1: "Gerçek harita verisi",
      sumo_label_2: "Krauss araç takip modeli",
      sumo_label_3: "Stokastik trafik talebi",

      // ── How It Works ──
      how_title: "Nasıl Çalışıyor?",
      step1_title: "Dijital İkiz Oluşturma",
      step1_text: "OpenStreetMap verileri ile Ankara Etlik kavşağı SUMO simülatöründe modellendi.",
      step2_title: "RL Ajanlarının Eğitimi",
      step2_text: "Her kavşak bağımsız bir ajan olarak 4 farklı algoritma (PPO, DQN, DDPG, A2C) ile eğitildi.",
      step3_title: "LLM Meta-Kontrolör",
      step3_text: "Llama 3.1 modeli, her bölüm sonunda ödül fonksiyonu parametrelerini dinamik olarak optimize etti.",
      step4_title: "Sonuçlar ve Karşılaştırma",
      step4_text: "Sabit zamanlı sisteme kıyasla bekleme sürelerinde %50+ iyileşme sağlandı.",

      // ── Tech Stack ──
      tech_title: "Teknoloji Yığını",

      // ── Algorithms ──
      algo_title: "Algoritmalar",

      ppo_name: "PPO",
      ppo_full: "Proximal Policy Optimization",
      ppo_verdict: "✅ En İyi Performans",
      ppo_verdict_type: "success",
      ppo_desc: "Politika güncellemelerini bir 'clipping' mekanizması ile sınırlandırarak kararlı öğrenme sağlar. Ajanın ani ve büyük adımlar atmasını engellediği için eğitim boyunca performans hiç çökmedi.",
      ppo_analogy: "Bir araba kullanırken direksiyonu yavaşça çevirirsiniz — ani manevra yaparsanız kaza olur. PPO da aynı mantıkla çalışır: her adımda politikayı çok az değiştirir, böylece öğrenme sürecinde 'kaza' olmaz.",
      ppo_analysis: "PPO'nun kırpma mekanizması, çok ajanlı ortamdaki belirsizliğe rağmen politikayı korur. On-policy olduğu için güncel deneyimlerden öğrenir. LLM'in ödül ağırlıklarını dinamik ayarlamasıyla bekleme süresini 254s'den 52s'ye düşürdü.",
      ppo_wait: "52.3s",
      ppo_co2: "1393g",

      dqn_name: "DQN",
      dqn_full: "Deep Q-Network",
      dqn_verdict: "⚠️ Sınırlı Performans",
      dqn_verdict_type: "limited",
      dqn_desc: "Her sinyal fazının değerini tahmin eden derin sinir ağı kullanır. Ayrık eylem uzayları için güçlü bir temel yöntemdir.",
      dqn_analogy: "Bir sınav için ders çalışırken eski notlarınıza bakarsınız. Ama sınav soruları değişmişse, eski notlar sizi yanıltır. DQN de eski deneyimlerden öğrenir — trafik sürekli değiştiğinde bu eski veriler yetersiz kalır.",
      dqn_analysis: "Off-policy yapısı nedeniyle eski deneyimlerden (replay buffer) öğrenir. Çok ajanlı ortamda diğer ajanlar politikasını değiştirdikçe bu veriler bayatlar. Q-değeri aşırı tahmin sorunu da yanlış faz seçimlerine yol açtı.",
      dqn_wait: "206.9s",
      dqn_co2: "2069g",

      ddpg_name: "DDPG",
      ddpg_full: "Deep Deterministic Policy Gradient",
      ddpg_verdict: "⚠️ Sınırlı Performans",
      ddpg_verdict_type: "limited",
      ddpg_desc: "Sürekli eylem uzayları için tasarlanmış aktör-kritik algoritması. Robot kontrolü gibi alanlarda etkili olsa da, trafik sinyalizasyonuna tam uyum sağlayamadı.",
      ddpg_analogy: "Bir dimmer ışık düğmesi ile açık/kapalı anahtar arasındaki fark gibidir. Trafik ışıkları 'açık/kapalı' çalışır ama DDPG 'dimmer' gibi sürekli çıktı üretir — bu uyumsuzluk performansı sınırlar.",
      ddpg_analysis: "Trafik ışıkları doğası gereği ayrık (kırmızı/yeşil) çalışır. DDPG'nin sürekli çıktısını ayrık faza dönüştürmek ek yakınsama hatası getirir. 25 bölüm boyunca bekleme süreleri 223s-310s arasında savruldu.",
      ddpg_wait: "221.6s",
      ddpg_co2: "1988g",

      a2c_name: "A2C",
      a2c_full: "Advantage Actor-Critic",
      a2c_verdict: "✅ En İyi Performans",
      a2c_verdict_type: "success",
      a2c_desc: "Aktör-Kritik mimarisinin senkron versiyonu. 'Avantaj' fonksiyonu sayesinde eğitimdeki varyansı azaltır ve daha hızlı yakınsama sağlar.",
      a2c_analogy: "Bir takımda hem oyuncu (aktör) hem de koç (kritik) aynı anda çalışır. Koç, her hamlenin ortalamanın üstünde mi altında mı olduğunu söyler — sadece iyi hamleler tekrarlanır.",
      a2c_analysis: "Avantaj fonksiyonu (A = Q - V) ile yalnızca ortalamanın üstünde olan eylemleri güçlendirir, gereksiz faz değişikliklerini engeller. LLM desteğiyle bölüm 7'de 55.6s'ye ulaştı — en hızlı yakınsayan algoritma.",
      a2c_wait: "53.1s",
      a2c_co2: "1422g",

      // ── Results ──
      results_title: "Sonuçlar",
      results_note: "Tüm değerler, simülasyondaki her bir araç için hesaplanan ortalamalardır (araç başına topluluk ortalaması).",
      chart_wait_title: "Ort. Bekleme Süresi",
      chart_wait_unit: "saniye / araç",
      chart_co2_title: "CO₂ Emisyonu",
      chart_co2_unit: "gram / araç",

      baseline_label: "Sabit Zamanlı",
      ppo_llm_label: "PPO + LLM",
      a2c_llm_label: "A2C + LLM",
      dqn_llm_label: "DQN + LLM",
      ddpg_llm_label: "DDPG + LLM",

      // ── Discussion ──
      discussion_title: "Performans Farkları Nereden Kaynaklanıyor?",
      discussion_text: "4 algoritmayı aynı koşullarda test ettik. Sonuçlar, trafik sinyalizasyonu gibi çok ajanlı, ayrık ve dinamik bir ortamda her algoritmanın eşit performans göstermediğini kanıtladı.",
      discussion_onpolicy: "On-Policy vs Off-Policy",
      discussion_onpolicy_text: "PPO ve A2C, güncel deneyimlerden (on-policy) öğrenir — değişen trafik koşullarına hızla uyum sağlar. DQN ise eski deneyimleri (replay buffer) kullanır; çok ajanlı ortamda bu veriler hızla geçerliliğini yitirir.",
      discussion_action: "Eylem Uzayı Uyumu",
      discussion_action_text: "Trafik ışıkları ayrık çalışır (kırmızı/yeşil). PPO, DQN ve A2C buna uygundur ancak DDPG sürekli çıktı üretir. Bu dönüşüm ek yakınsama hatası getirir.",
      discussion_stability: "Eğitim Kararlılığı",
      discussion_stability_text: "PPO'nun kırpma mekanizması büyük politika değişikliklerini engeller. DQN'de Q-değeri aşırı tahmin (overestimation) problemi ve A2C'nin avantaj fonksiyonu farkı belirleyen temel etkenlerdir.",

      // ── Team ──
      team_title: "Proje Ekibi",
      footer_text: "CENG401 Bitirme Projesi • 2025-2026",
      footer_uni: "Ankara Yıldırım Beyazıt Üniversitesi • Bilgisayar Mühendisliği",
      footer_advisor: "Danışman: Öğr. Gör. Yusuf Evren Aykaç"
    }
  },
  en: {
    translation: {
      badge: "CENG401 Graduation Project",
      hero_title: "AI-Powered Smart Traffic Signal Optimization",
      hero_desc: "Optimizing traffic flow on a digital twin of the Ankara Etlik intersection using LLM-assisted reinforcement learning.",
      stat_wait: "Wait ↓",
      stat_co2: "CO₂ ↓",
      stat_speed: "Speed ↑",
      stat_queue: "Queue ↓",

      sumo_title: "Simulation Environment",
      sumo_desc: "Ankara Etlik district — Halil Sezai Erkut & Akşemsettin Avenues intersection. High-fidelity digital twin created in SUMO using OpenStreetMap data.",
      sumo_label_1: "Real-world map data",
      sumo_label_2: "Krauss car-following model",
      sumo_label_3: "Stochastic traffic demand",

      how_title: "How Does It Work?",
      step1_title: "Digital Twin Creation",
      step1_text: "The Ankara Etlik intersection was modeled in SUMO simulator using OpenStreetMap data.",
      step2_title: "Training RL Agents",
      step2_text: "Each intersection was trained as an independent agent with 4 different algorithms (PPO, DQN, DDPG, A2C).",
      step3_title: "LLM Meta-Controller",
      step3_text: "Llama 3.1 dynamically optimized reward function parameters at the end of each episode.",
      step4_title: "Results & Comparison",
      step4_text: "Achieved 50%+ improvement in wait times compared to fixed-time signal systems.",

      tech_title: "Tech Stack",

      algo_title: "Algorithms",

      ppo_name: "PPO",
      ppo_full: "Proximal Policy Optimization",
      ppo_verdict: "✅ Best Performance",
      ppo_verdict_type: "success",
      ppo_desc: "Ensures stable learning by limiting policy updates via a clipping mechanism. The agent never collapses during training because large, risky steps are prevented.",
      ppo_analogy: "Like driving a car — you turn the steering wheel gradually. A sudden jerk causes a crash. PPO works the same way: small policy changes at each step prevent 'crashes' during learning.",
      ppo_analysis: "PPO's clipping mechanism protects the policy despite multi-agent uncertainty. Being on-policy, it learns from fresh experience. Combined with LLM's dynamic reward tuning, it reduced wait time from 254s to 52s.",
      ppo_wait: "52.3s",
      ppo_co2: "1393g",

      dqn_name: "DQN",
      dqn_full: "Deep Q-Network",
      dqn_verdict: "⚠️ Limited Performance",
      dqn_verdict_type: "limited",
      dqn_desc: "Uses a deep neural network to predict the value of each traffic signal phase. A strong foundational method for discrete action spaces.",
      dqn_analogy: "Like studying for an exam from old notes. If the exam questions have changed, old notes mislead you. DQN learns from old experience — when traffic constantly changes, this data becomes insufficient.",
      dqn_analysis: "Its off-policy nature means it learns from old experiences (replay buffer). In a multi-agent setting, this data becomes stale as other agents change. Q-value overestimation also led to incorrect phase selections.",
      dqn_wait: "206.9s",
      dqn_co2: "2069g",

      ddpg_name: "DDPG",
      ddpg_full: "Deep Deterministic Policy Gradient",
      ddpg_verdict: "⚠️ Limited Performance",
      ddpg_verdict_type: "limited",
      ddpg_desc: "An actor-critic algorithm designed for continuous action spaces. While effective in robotics, it couldn't fully adapt to traffic signal control.",
      ddpg_analogy: "Like the difference between a dimmer switch and an on/off switch. Traffic lights work as 'on/off' but DDPG produces 'dimmer-like' continuous output — this mismatch limits performance.",
      ddpg_analysis: "Traffic lights are inherently discrete (red/green). Converting DDPG's continuous output to discrete phases introduces approximation error. Over 25 episodes, wait times oscillated between 223s-310s.",
      ddpg_wait: "221.6s",
      ddpg_co2: "1988g",

      a2c_name: "A2C",
      a2c_full: "Advantage Actor-Critic",
      a2c_verdict: "✅ Best Performance",
      a2c_verdict_type: "success",
      a2c_desc: "The synchronous version of the actor-critic architecture. Reduces variance during training through its advantage function, leading to faster convergence.",
      a2c_analogy: "Like a team with both a player (actor) and a coach (critic) working simultaneously. The coach tells whether each move is above or below average — only good moves get reinforced.",
      a2c_analysis: "The advantage function (A = Q - V) only reinforces above-average actions, preventing unnecessary phase flickering. With LLM support, it reached 55.6s by episode 7 — the fastest convergence.",
      a2c_wait: "53.1s",
      a2c_co2: "1422g",

      results_title: "Results",
      results_note: "All values are per-vehicle averages computed across the entire simulation fleet (ensemble mean per vehicle).",
      chart_wait_title: "Avg. Wait Time",
      chart_wait_unit: "seconds / vehicle",
      chart_co2_title: "CO₂ Emissions",
      chart_co2_unit: "grams / vehicle",

      baseline_label: "Fixed-Time",
      ppo_llm_label: "PPO + LLM",
      a2c_llm_label: "A2C + LLM",
      dqn_llm_label: "DQN + LLM",
      ddpg_llm_label: "DDPG + LLM",

      discussion_title: "What Caused the Performance Differences?",
      discussion_text: "We tested 4 algorithms under identical conditions. The results show that not every algorithm performs equally in a multi-agent, discrete, and dynamic environment like traffic signal control.",
      discussion_onpolicy: "On-Policy vs Off-Policy",
      discussion_onpolicy_text: "PPO and A2C learn from current experience (on-policy) — they adapt quickly to changing traffic. DQN uses old experience (replay buffer) that becomes stale in a multi-agent setting.",
      discussion_action: "Action Space Compatibility",
      discussion_action_text: "Traffic lights operate discretely (red or green). PPO, DQN, and A2C are suited for this, but DDPG produces continuous outputs. This conversion introduces additional error.",
      discussion_stability: "Training Stability",
      discussion_stability_text: "PPO's clipping mechanism prevents large policy changes. DQN's Q-value overestimation problem and A2C's advantage function are key differentiating factors.",

      team_title: "Project Team",
      footer_text: "CENG401 Graduation Project • 2025-2026",
      footer_uni: "Ankara Yıldırım Beyazıt University • Computer Engineering",
      footer_advisor: "Advisor: Lect. Yusuf Evren Aykaç"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
