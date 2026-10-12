# 🧠 디지털트윈 AI 랩 | Digital Twin AI Lab

> 3D 트윈 + AI 이상탐지 · 트렌드 분석 · AI 서비스 체험  
> 3D twin, AI anomaly detection, trend analysis and AI playground

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=flat-square)](https://metasongi.github.io/digital-twin-ai-lab/) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square) ![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square)

🌐 **Live:** https://metasongi.github.io/digital-twin-ai-lab/

---

디지털트윈 AI 논문·현장 노하우·최신 트렌드 분석을 **개발자 관점**으로 정리하고,
사람들이 많이 찾는 AI 서비스를 **웹에서 바로 체험**할 수 있는 단일 페이지 웹앱입니다.


## 탭 구성

### 🏭 3D 디지털트윈
- Three.js 기반 공장 셀 시뮬레이션 (컨베이어 + 로봇팔 픽앤플레이스 + 상태 램프)
- **AI 이상탐지 엔진**: 온도 시계열 롤링 z-score(|z|>3.5) 실시간 감시
- **예지 정비**: 열화 모델 기반 잔여수명(RUL) 추정
- 고장 주입 / 복구, 속도 조절, AI 이벤트 로그

### 📈 트렌드 분석
- AI 디지털트윈 시장 전망 차트 (2025 ~$31.5B → 2032 ~$225.4B)
- 제조업 디지털트윈 시장 전망 (2025 ~$9.5B → 2035 ~$190B)
- 2025–2026 핵심 트렌드 6 (Agentic AI, 파운데이션 모델, 엣지 AI, PINN, DTaaS, 합성데이터)
- 트렌드 타임라인 2023→2026, 개발자 구현 스택 가이드, 참고 자료 링크

### 🤖 AI 서비스
- 사람들이 많이 찾는 AI 서비스 9종 소개 (챗봇·이상탐지·리포트·이미지 생성·TTS·번역·코드 어시스턴트 등)
- **디지털트윈 AI 어시스턴트**: 규칙 기반 한국어 Q&A 챗봇 (브라우저 내 동작)
- **AI 리포트 생성기**: 시뮬레이션 실시간 데이터를 읽어 한국어 설비 상태 리포트 자동 작성

## 실행 방법

정적 웹앱이라 서버가 필요 없습니다. `index.html`을 브라우저로 열면 됩니다.

```bash
# 로컬 확인
python3 -m http.server 8000
# → http://localhost:8000
```

## 기술 스택

- Three.js (3D 디지털트윈) — CDN
- Vanilla JS + Canvas (시장 차트, 온도 차트)
- 규칙 기반 NLP (어시스턴트), z-score 이상탐지, 열화 모델 RUL 추정
- 모든 처리는 클라이언트(브라우저)에서 수행 — 백엔드 불필요

## 파일 구성

| 파일 | 설명 |
|---|---|
| `index.html` | 3개 탭 SPA 구조 |
| `style.css` | 다크 인더스트리 테마 |
| `app.js` | 3D 트윈 + AI 이상탐지 엔진 |
| `trends.js` | 시장 차트·트렌드 카드·타임라인·스택 가이드 |
| `ai.js` | AI 서비스 그리드·챗봇·리포트 생성기 |

---

## English Summary

3D twin, AI anomaly detection, trend analysis and AI playground.
