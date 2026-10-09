/* AI 서비스 탭: 인기 AI 서비스 그리드 + 규칙 기반 어시스턴트 + 리포트 생성기 */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);

  /* ---------- 사람들이 많이 찾는 AI 서비스 ---------- */
  const services = [
    { tag: '대화', demo: true, title: '💬 AI 챗봇 어시스턴트',
      body: '사람들이 가장 많이 찾는 AI 서비스 1순위. 이 앱 아래 챗봇에서 디지털트윈·AI 주제로 바로 체험할 수 있습니다.' },
    { tag: '분석', demo: true, title: '🔍 AI 이상탐지',
      body: '3D 트윈 탭에서 실시간으로 동작 중. 온도 시계열 z-score 분석으로 고장 전조를 자동 포착합니다.' },
    { tag: '분석', demo: true, title: '📝 AI 리포트 생성',
      body: '설비 상태 데이터를 읽어 한국어 상태 리포트를 자동 작성. 아래 생성기로 체험하세요.' },
    { tag: '생성', demo: false, title: '🎨 AI 이미지 생성',
      body: '텍스트 프롬프트로 이미지·미디어아트 생성. 별도 프로젝트 ai-media-art-generator에서 체험할 수 있습니다.' },
    { tag: '생성', demo: false, title: '🎙 AI 음성 합성 (TTS)',
      body: '텍스트를 자연스러운 음성으로 변환. 설비 경보 음성 안내·다국어 안내 방송에 활용됩니다.' },
    { tag: '언어', demo: false, title: '🌐 AI 번역·요약',
      body: '해외 설비 매뉴얼·논문을 한국어로 즉시 번역하고 핵심만 요약. RAG와 결합하면 현장 지식 베이스가 됩니다.' },
    { tag: '개발', demo: false, title: '💻 AI 코드 어시스턴트',
      body: 'PLC·로봇 제어 코드, 데이터 분석 스크립트 자동 생성. 별도 프로젝트 dev-automation-agent에서 체험할 수 있습니다.' },
    { tag: '예측', demo: false, title: '🔮 수요·품질 예측',
      body: '생산 계획 최적화와 불량 예측. 시계열 파운데이션 모델이 2026년 핵심 키워드입니다.' },
    { tag: '3D', demo: false, title: '🧊 이미지→3D 변환',
      body: '사진 한 장으로 3D 모델 생성. 별도 프로젝트 image-to-3d-viewer / camera-to-3d-viewer에서 체험할 수 있습니다.' },
  ];
  $('serviceGrid').innerHTML = services.map((s) => `
    <div class="tcard"><span class="tag">${s.tag}</span>${s.demo ? '<span class="badge-demo">✓ 이 앱에서 체험</span>' : ''}
    <h3>${s.title}</h3><p>${s.body}</p></div>
  `).join('');

  /* ---------- 규칙 기반 AI 어시스턴트 ---------- */
  const KB = [
    { k: ['예측정비', 'predictive', '예지 정비', '예방 정비'],
      a: '예측정비(Predictive Maintenance)는 센서 데이터로 고장 시점을 미리 예측해 필요한 때만 정비하는 방식입니다. AI 이상탐지 → 잔여수명(RUL) 추정 → 정비 스케줄 최적화 순서로 동작하고, 반응적 정비 대비 다운타임을 20~50% 줄인 사례가 보고됩니다. 이 앱 3D 탭의 RUL 표시가 바로 그 축소판이에요.' },
    { k: ['이상탐지', 'anomaly', '이상 탐지'],
      a: '이상탐지는 "정상 패턴에서 벗어난 순간"을 찾는 기술입니다. 이 앱은 롤링 윈도우 z-score(|z|>3.5) 방식을 쓰는데, 실무에서는 Isolation Forest·오토인코더 같은 비지도학습이 표준입니다. 고장 데이터가 희귀한 제조 현장 특성상 정상 데이터만으로 학습하는 방식이 주류예요.' },
    { k: ['디지털트윈', 'digital twin', '트윈'],
      a: '디지털트윈은 물리 자산의 "살아있는 가상 복제본"입니다. 단순 시뮬레이션과 달리 실제 설비 데이터와 실시간으로 동기화되죠. 2026년 트렌드는 여기서 한 걸음 더 나아가 AI 에이전트가 트윈을 조회·시뮬레이션하고 조치까지 권고하는 자율운영입니다.' },
    { k: ['에이전트', 'agent', 'agentic', 'llm', '랭', 'rag'],
      a: 'Agentic AI는 목표를 주면 스스로 계획→도구 사용→실행을 반복하는 AI입니다. 제조 현장에서는 "트윈에서 마모 시뮬레이션 돌려봐 → 정비 시점 추천해줘" 같은 흐름이 가능해집니다. Gartner는 2020년대 후반이면 산업 현장의 표준 기능이 될 것으로 봅니다.' },
    { k: ['옴니버스', 'omniverse', 'usd', 'cosmos'],
      a: 'NVIDIA Omniverse는 OpenUSD 기반 산업용 메타버스 플랫폼이고, Cosmos는 물리적으로 정확한 가상 세계를 생성하는 월드 파운데이션 모델입니다. 실제 공장을 스캔하듯 가상 복제본을 만들고, 그 안에서 로봇 학습·레이아웃 검증을 돌리는 용도로 쓰입니다.' },
    { k: ['엣지', 'edge', '온프레미스'],
      a: '엣지 AI는 지연에 민감한 추론을 현장 장비 근처에서 처리하는 구조입니다. 2025년 기준 온프레미스 47%·클라우드 30%·하이브리드 23%에서 하이브리드 비중이 2035년 32%까지 커질 전망. "어디서 연산할 것인가"가 2026년 설계의 핵심 질문입니다.' },
    { k: ['rul', '잔여수명', '수명'],
      a: 'RUL(Remaining Useful Life)은 설비가 고장 나기까지 남은 시간을 추정하는 지표입니다. 이 앱은 온도가 임계(80°C)를 넘으면 마모가 가속되는 단순 열화 모델로 계산합니다. 실무에서는 생존분석·LSTM·트랜스포머 기반 회귀 모델을 씁니다.' },
    { k: ['논문', '연구', '페이퍼', 'paper'],
      a: '디지털트윈 AI 분야 핵심 키워드로 찾아보세요: "physics-informed neural networks", "digital twin predictive maintenance review", "foundation models time series", "agentic AI manufacturing". 트렌드 탭의 참고 자료 링크도 출발점으로 좋습니다.' },
    { k: ['트렌드', '전망', '시장'],
      a: '2025–2026 핵심 트렌드 6가지는 트렌드 탭에 정리했어요: ① Agentic AI 자율 정비 ② 파운데이션 모델×물리 시뮬레이션 ③ 하이브리드 엣지-클라우드 ④ 물리정보 AI(PINN) ⑤ DTaaS ⑥ 생성형 합성데이터. 시장 규모는 AI 디지털트윈이 2032년 약 $225B까지 성장할 전망입니다.' },
    { k: ['안녕', 'hello', 'hi', '하이'],
      a: '안녕하세요! 디지털트윈과 제조 AI에 대해 물어보세요. "예측정비가 뭐야?", "이상탐지 원리", "RUL" 같은 질문에 답할 수 있습니다.' },
  ];
  const FALLBACK = '좋은 질문이에요. 저는 디지털트윈·제조 AI 주제에 특화된 데모 어시스턴트라서요 — "예측정비", "이상탐지", "디지털트윈", "에이전트", "엣지AI", "RUL", "트렌드" 중 하나를 물어봐 주세요.';

  const chatLog = $('chatLog');
  function addMsg(text, who) {
    const d = document.createElement('div');
    d.className = 'msg ' + who;
    d.textContent = text;
    chatLog.appendChild(d);
    chatLog.scrollTop = chatLog.scrollHeight;
  }
  function answer(q) {
    const low = q.toLowerCase();
    for (const item of KB) {
      if (item.k.some((k) => low.includes(k.toLowerCase()))) return item.a;
    }
    return FALLBACK;
  }
  function send() {
    const v = $('chatInput').value.trim();
    if (!v) return;
    addMsg(v, 'user');
    $('chatInput').value = '';
    setTimeout(() => addMsg(answer(v), 'bot'), 350);
  }
  $('btnChat').addEventListener('click', send);
  $('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  const chips = ['예측정비가 뭐야?', '이상탐지 원리 알려줘', 'RUL이 뭐야?', '2026 트렌드 요약해줘', 'Agentic AI가 뭐야?'];
  $('chatChips').innerHTML = chips.map((c) => `<button class="chip">${c}</button>`).join('');
  document.querySelectorAll('#chatChips .chip').forEach((b) =>
    b.addEventListener('click', () => { $('chatInput').value = b.textContent; send(); }));
  addMsg('안녕하세요! 🏭 디지털트윈 AI 어시스턴트입니다. 예측정비·이상탐지·2026 트렌드에 대해 물어보세요.', 'bot');

  /* ---------- AI 리포트 생성기 ---------- */
  $('btnReport').addEventListener('click', () => {
    const st = window.__twinState || {};
    const t = st.temp ?? 0, v = st.vib ?? 0, c = st.count ?? 0, r = st.rulHours ?? 0;
    const n = (st.anomalies || []).length;
    const now = new Date();
    const pad = (x) => String(x).padStart(2, '0');
    const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    let grade, advice;
    if (t > 80 || v > 6) {
      grade = '🔴 위험'; advice = '즉시 가동 중단 후 모터·베어링 점검을 권고합니다. 냉각 시스템과 윤활 상태를 확인하세요.';
    } else if (t > 72 || n > 0) {
      grade = '🟡 주의'; advice = '온도 상승 추세가 관측됩니다. 예지 정비 일정을 앞당기고 진동 스펙트럼 정밀 분석을 권고합니다.';
    } else {
      grade = '🟢 정상'; advice = '모든 지표가 정상 범위입니다. 현재 운전 조건을 유지하고 정기 점검 주기를 준수하세요.';
    }
    $('reportOut').textContent =
`[AI 설비 상태 리포트] ${stamp}
━━━━━━━━━━━━━━━━━━━━━━
■ 종합 판정: ${grade}

■ 주요 지표
- 모터 온도: ${t.toFixed(1)} °C (정상 <72 / 주의 72~80 / 위험 >80)
- 진동: ${v.toFixed(2)} mm/s (정상 <4.0)
- 누적 생산량: ${c} 개
- AI 이상탐지 이벤트: ${n} 건
- 예상 잔여수명(RUL): ${r >= 24 ? Math.floor(r / 24) + '일 ' + Math.floor(r % 24) + '시간' : Math.floor(r) + '시간'}

■ AI 코멘트
${advice}

※ 본 리포트는 브라우저 내 시뮬레이션 데이터 기반 데모입니다.`;
  });
  $('btnCopyReport').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('reportOut').textContent);
      $('btnCopyReport').textContent = '✅ 복사됨';
      setTimeout(() => { $('btnCopyReport').textContent = '📋 복사'; }, 1500);
    } catch { alert('복사에 실패했습니다.'); }
  });
})();
