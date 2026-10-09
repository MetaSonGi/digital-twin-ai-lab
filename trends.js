/* 트렌드 분석 탭: 시장 차트 + 트렌드 카드 + 타임라인 + 개발자 스택 + 참고자료 */
(function () {
  'use strict';

  /* ---------- 시장 차트 (캔버스 직접 렌더링) ---------- */
  function lineChart(id, labels, values, color) {
    const cv = document.getElementById(id);
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, P = { l: 56, r: 14, t: 16, b: 30 };
    const max = Math.max(...values) * 1.15;
    ctx.clearRect(0, 0, W, H);
    ctx.font = '11px sans-serif'; ctx.fillStyle = '#8b949e';
    for (let g = 0; g <= 4; g++) {
      const v = (max / 4) * g, y = H - P.b - ((H - P.t - P.b) / 4) * g;
      ctx.strokeStyle = '#1c2330'; ctx.beginPath(); ctx.moveTo(P.l, y); ctx.lineTo(W - P.r, y); ctx.stroke();
      ctx.fillText('$' + v.toFixed(0) + 'B', 6, y + 4);
    }
    const xs = labels.map((_, i) => P.l + ((W - P.l - P.r) / (labels.length - 1)) * i);
    const ys = values.map((v) => H - P.b - (v / max) * (H - P.t - P.b));
    const grad = ctx.createLinearGradient(0, P.t, 0, H - P.b);
    grad.addColorStop(0, color + '55'); grad.addColorStop(1, color + '00');
    ctx.beginPath(); ctx.moveTo(xs[0], ys[0]);
    xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
    ctx.lineTo(xs[xs.length - 1], H - P.b); ctx.lineTo(xs[0], H - P.b); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.moveTo(xs[0], ys[0]);
    xs.forEach((x, i) => ctx.lineTo(x, ys[i]));
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke();
    xs.forEach((x, i) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, ys[i], 4, 0, 7); ctx.fill();
      ctx.fillStyle = '#e6edf3';
      ctx.fillText('$' + values[i].toFixed(1) + 'B', x - 22, ys[i] - 10);
      ctx.fillStyle = '#8b949e'; ctx.fillText(labels[i], x - 14, H - 10);
    });
  }

  // AI 디지털트윈 시장: 2025 $31.5B → 2032 $225.4B (CAGR ~32.6%)
  lineChart('chartMarket1',
    ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032'],
    [31.5, 41.8, 55.4, 73.5, 97.4, 129.2, 171.3, 225.4], '#2f81f7');
  // 제조업 디지털트윈 시장: 2025 $9.5B → 2035 $190B (CAGR ~34.9%)
  lineChart('chartMarket2',
    ['2025', '2027', '2029', '2031', '2033', '2035'],
    [9.5, 17.9, 33.8, 63.7, 120.0, 190.0], '#00d4aa');

  /* ---------- 핵심 트렌드 6 ---------- */
  const trends = [
    { tag: 'TREND 01 · 자율운영', title: '🤖 Agentic AI 기반 자율 정비',
      body: '예측을 넘어 AI 에이전트가 정비 스케줄·예비부품·기술자 파견까지 엔드투엔드로 자동화. 선도 제조사는 2026년 정기 정비 업무의 40~60%를 자동화할 전망. 디지털트윈이 마모 시뮬레이션으로 개입 시점을 정밀하게 계산합니다.' },
    { tag: 'TREND 02 · 생성형 AI', title: '🧠 파운데이션 모델 × 물리 시뮬레이션',
      body: 'NVIDIA Omniverse + Cosmos 월드 파운데이션 모델처럼 물리적으로 정확한 가상 세계를 대규모로 생성. 디지털트윈이 "보는 거울"에서 "판단하는 에이전트"로 진화하는 결정적 변곡점입니다.' },
    { tag: 'TREND 03 · 엣지 AI', title: '⚡ 하이브리드 엣지-클라우드 아키텍처',
      body: '지연 민감 작업은 Machine Edge·Factory Edge에서, 대규모 학습은 클라우드에서. 2025년 온프레미스 47%·클라우드 30%·하이브리드 23%에서 하이브리드 비중이 2035년 32%까지 확대될 전망.' },
    { tag: 'TREND 04 · 물리정보 AI', title: '🔬 Physics-Informed AI (PINN)',
      body: '물리 법칙을 신경망 손실함수에 내장해 적은 데이터로도 정확한 시뮬레이션. 설비 고장 모드처럼 데이터가 희귀한 제조 현장에서 특히 강력한 접근법으로 부상 중.' },
    { tag: 'TREND 05 · 서비스화', title: '☁️ DTaaS (Digital Twin as a Service)',
      body: '클라우드 네이티브 시뮬레이션 플랫폼과 AI/ML 분석 엔진을 구독형으로 제공. 중소 제조사가 큰 초기 투자 없이 디지털트윈을 도입하는 경로가 열리고 있습니다.' },
    { tag: 'TREND 06 · 합성데이터', title: '🧪 생성형 합성 데이터',
      body: '고장 데이터가 부족한 현장의 고질적 문제를 생성형 AI가 해결. 가상 고장 시나리오를 대량 생성해 이상탐지 모델을 사전 학습시키는 파이프라인이 표준화되는 중.' },
  ];
  document.getElementById('trendCards').innerHTML = trends.map((t) => `
    <div class="tcard"><span class="tag">${t.tag}</span><h3>${t.title}</h3><p>${t.body}</p></div>
  `).join('');

  /* ---------- 타임라인 ---------- */
  const tl = [
    ['2023', '<b>모니터링 시대</b> — IoT 센서 + 3D 가시화 중심의 1세대 디지털트윈 확산'],
    ['2024', '<b>예측정비 확산</b> — 머신러닝 기반 이상탐지·고장 예측이 제조 현장 표준 기능으로'],
    ['2025', '<b>GenAI 결합</b> — LLM 코파일럿·RAG 매뉴얼·합성데이터로 트윈이 "설명"하기 시작'],
    ['2026', '<b>Agentic 자율운영</b> — AI 에이전트가 트윈을 조회·시뮬레이션하고 조치까지 권고/실행'],
  ];
  document.getElementById('timeline').innerHTML = tl.map(([y, p]) => `
    <div class="tl-item"><span class="tl-year">${y}</span><p>${p}</p></div>
  `).join('');

  /* ---------- 개발자 스택 가이드 ---------- */
  const stack = [
    ['🎥 3D 가시화', 'Three.js / WebGL, OpenUSD, NVIDIA Omniverse — 이 앱은 Three.js 사용'],
    ['📡 실시간 데이터', 'MQTT, OPC-UA, WebSocket — 센서 스트림을 트윈에 동기화'],
    ['🗄 시계열 저장', 'TimescaleDB, InfluxDB — 센서 이력·이상 이벤트 적재'],
    ['🧠 이상탐지', 'z-score, Isolation Forest, Autoencoder — 이 앱은 롤링 z-score 내장'],
    ['🔮 예측 모델', 'ONNX Runtime, TensorFlow.js — 브라우저 내 추론까지 가능'],
    ['💬 AI 어시스턴트', 'LLM + RAG(설비 매뉴얼) — 이 앱은 규칙 기반 데모 탑재'],
    ['⚙️ 시뮬레이션', '물리 엔진 + PINN — 가상 시나리오 what-if 분석'],
    ['🚀 배포', 'GitHub Pages, Docker, Edge 디바이스 — 이 앱은 Pages 정적 배포'],
  ];
  document.getElementById('devStack').innerHTML = stack.map(([h, p]) => `
    <div class="stack"><h4>${h}</h4><p>${p}</p></div>
  `).join('');

  /* ---------- 참고 자료 ---------- */
  const refs = [
    ['Five Predictions for Manufacturing in 2026 and Beyond — Agentic AI·자율 정비 전망', 'https://medium.com/@marketing_37026/five-predictions-for-manufacturing-in-2026-and-beyond-5ec2309099c7'],
    ['AI-Powered Digital Twin 시장 전망 2025–2032 (약 $31.5B → $225.4B)', 'http://prsync.com/marektsandmarkets/ai-powered-digital-twin-market-size-share-growth-trends-and-forecast--5189294/'],
    ['제조업 디지털트윈 시장 2035년 $190B 전망 — AI가 가상 공장을 바꾼다', 'https://timestech.in/digital-twin-in-manufacturing-market-to-reach-190-billion-by-2035-as-ai-transforms-virtual-factories/'],
    ['Industrial AI 시장 2035년 $3,267억 전망 — AI 에이전트가 산업을 바꾼다', 'https://timestech.in/industrial-ai-market-to-reach-326-72-billion-by-2035-as-ai-agents-transform-industry/'],
    ['Unilever, Accenture와 AI 디지털트윈을 글로벌 공장으로 확대 (2026)', 'https://www.trendhunter.com/trends/aipowered-digital-twins-in-manufacturing'],
  ];
  document.getElementById('refList').innerHTML = refs.map(([t, u]) => `
    <li><a href="${u}" target="_blank" rel="noopener">${t}</a></li>
  `).join('');
})();
