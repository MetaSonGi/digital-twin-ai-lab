import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ================= 상태 ================= */
const S = {
  running: true, speed: 1, simTime: 0, fault: false,
  temp: 62, vib: 2.1, count: 0, rulHours: 720,
  hist: [], anomalies: [], armPhase: 0,
};
window.__twinState = S;

/* ================= DOM ================= */
const $ = (id) => document.getElementById(id);
const viewport = $('viewport');

document.querySelectorAll('.tab').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tabpage').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    $('tab-' + btn.dataset.tab).classList.add('active');
    onResize();
  });
});

/* ================= Three.js 장면 ================= */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070c);
scene.fog = new THREE.Fog(0x05070c, 30, 70);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
camera.position.set(12, 10, 14);
const renderer = new THREE.WebGLRenderer({ antialias: true });
viewport.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.maxPolarAngle = Math.PI / 2.05;

scene.add(new THREE.AmbientLight(0x8899bb, 0.7));
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(10, 18, 8);
scene.add(key);
const rim = new THREE.DirectionalLight(0x2f81f7, 0.6);
rim.position.set(-12, 8, -10);
scene.add(rim);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(60, 60),
  new THREE.MeshStandardMaterial({ color: 0x11161d, roughness: 0.9 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);
scene.add(new THREE.GridHelper(60, 60, 0x2f81f7, 0x1a2230));

/* 컨베이어 */
const beltMat = new THREE.MeshStandardMaterial({ color: 0x232b38, roughness: 0.7 });
const belt = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 2.4), beltMat);
belt.position.set(0, 1.0, 0);
scene.add(belt);
const railMat = new THREE.MeshStandardMaterial({ color: 0x3a4657, metalness: 0.6, roughness: 0.4 });
[-1.35, 1.35].forEach((z) => {
  const rail = new THREE.Mesh(new THREE.BoxGeometry(16, 0.25, 0.15), railMat);
  rail.position.set(0, 1.25, z);
  scene.add(rail);
});
const rollers = [];
for (let i = 0; i < 12; i++) {
  const r = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.2, 12), railMat);
  r.rotation.x = Math.PI / 2;
  r.position.set(-7.5 + i * 1.36, 1.05, 0);
  scene.add(r); rollers.push(r);
}
[[-7.5], [7.5]].forEach(([x]) => {
  [-1, 1].forEach((z) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.0, 0.25), railMat);
    leg.position.set(x, 0.5, z);
    scene.add(leg);
  });
});

/* 제품 박스 */
const prodMat = new THREE.MeshStandardMaterial({ color: 0x00d4aa, roughness: 0.5 });
const prodMatHot = new THREE.MeshStandardMaterial({ color: 0xf85149, roughness: 0.5, emissive: 0x550000 });
const products = [];
for (let i = 0; i < 6; i++) {
  const p = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), prodMat.clone());
  p.position.set(-8 + i * 2.8, 1.6, (i % 2 ? 0.45 : -0.45));
  scene.add(p); products.push(p);
}

/* 로봇팔 (픽앤플레이스) */
const armMat = new THREE.MeshStandardMaterial({ color: 0x2f81f7, metalness: 0.5, roughness: 0.35 });
const armBase = new THREE.Group();
armBase.position.set(0, 0, 4.2);
const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 1.2, 20), armMat);
pedestal.position.y = 0.6; armBase.add(pedestal);
const shoulder = new THREE.Group(); shoulder.position.y = 1.2; armBase.add(shoulder);
const upper = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.4, 0.5), armMat);
upper.position.y = 1.2; shoulder.add(upper);
const elbow = new THREE.Group(); elbow.position.y = 2.4; shoulder.add(elbow);
const fore = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.0, 0.4), armMat);
fore.position.y = 1.0; elbow.add(fore);
const gripper = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7),
  new THREE.MeshStandardMaterial({ color: 0xd29922, metalness: 0.5, roughness: 0.4 }));
gripper.position.y = 2.1; elbow.add(gripper);
scene.add(armBase);

/* 상태 램프 타워 */
const lampMeshes = [];
[[-6, -4], [0, -4], [6, -4]].forEach(([x, z]) => {
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3, 10), railMat);
  pole.position.set(x, 1.5, z); scene.add(pole);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x3fb950, emissive: 0x1a5c2a }));
  lamp.position.set(x, 3.2, z); scene.add(lamp); lampMeshes.push(lamp);
});
function setLamps(mode) {
  const c = mode === 'bad' ? [0xf85149, 0x5c1a1a] : mode === 'warn' ? [0xd29922, 0x5c4a1a] : [0x3fb950, 0x1a5c2a];
  lampMeshes.forEach((l) => { l.material.color.setHex(c[0]); l.material.emissive.setHex(c[1]); });
}

/* ================= 센서 시뮬 + AI 이상탐지 ================= */
const WINDOW = 120;
function randn() { return (Math.random() + Math.random() + Math.random() - 1.5) * 1.2; }

function stepSim(dt) {
  S.simTime += dt;
  const targetTemp = S.fault ? 96 : 62;
  S.temp += (targetTemp - S.temp) * 0.02 * dt * 60 * 0.016 + randn() * 0.35;
  const targetVib = S.fault ? 8.5 : 2.1;
  S.vib += (targetVib - S.vib) * 0.03 + randn() * 0.12;
  S.vib = Math.max(0.4, S.vib);

  // 잔여수명: 온도가 임계(80도) 위면 가속 소모
  const wear = S.temp > 80 ? (S.temp - 80) * 0.05 + 0.02 : 0.008;
  S.rulHours = Math.max(0, S.rulHours - wear * dt);

  // 롤링 z-score 이상탐지
  S.hist.push(S.temp);
  if (S.hist.length > WINDOW) S.hist.shift();
  let anomaly = false;
  if (S.hist.length >= 30) {
    const m = S.hist.reduce((a, b) => a + b, 0) / S.hist.length;
    const v = S.hist.reduce((a, b) => a + (b - m) ** 2, 0) / S.hist.length;
    const z = (S.temp - m) / (Math.sqrt(v) || 1);
    if (Math.abs(z) > 3.5 && !S._cool) {
      anomaly = true; S._cool = 3;
      S.anomalies.push({ t: S.simTime, temp: S.temp, z });
      addLog(`AI 이상탐지 — 온도 z-score ${z.toFixed(2)} (임계 3.5 초과)`, 'bad');
      showAlarm(`⚠ AI 이상탐지 — 온도 이상 패턴 감지! (z=${z.toFixed(2)}) 설비 감속 중`);
    }
  }
  if (S._cool > 0) S._cool -= dt;

  // 제품 이동
  const spd = (S.fault || anomaly ? 0.9 : 2.2) * S.speed;
  products.forEach((p) => {
    p.position.x += spd * dt;
    if (p.position.x > 8.5) {
      p.position.x = -8.5; S.count++;
      p.material.color.setHex(S.fault ? 0xf85149 : 0x00d4aa);
    }
    p.rotation.y += dt * 0.4;
  });
  rollers.forEach((r) => { r.rotation.y += spd * dt * 2; });

  // 로봇팔 픽앤플레이스 사이클
  S.armPhase += dt * S.speed * (S.fault ? 0.4 : 1);
  const ph = S.armPhase % (Math.PI * 2);
  shoulder.rotation.y = Math.sin(ph) * 0.9;
  elbow.rotation.x = -0.5 - Math.abs(Math.sin(ph)) * 0.5;
  gripper.position.y = 2.1 - Math.abs(Math.sin(ph * 2)) * 0.7;

  // AI 상태
  const aiMode = S.fault ? 'bad' : S.temp > 78 ? 'warn' : 'ok';
  setLamps(aiMode);
  const dot = document.querySelector('#aiStatus .dot');
  const txt = $('aiStatusText');
  if (aiMode === 'bad') { dot.className = 'dot bad'; txt.textContent = '고장 상태 — AI가 감속 운전 권고 중'; }
  else if (aiMode === 'warn') { dot.className = 'dot warn'; txt.textContent = '주의 — 온도 상승 추세, 예지 정비 검토'; }
  else { dot.className = 'dot ok'; txt.textContent = '정상 운전 중 — 이상 패턴 없음'; }

  // HUD
  $('mTemp').textContent = S.temp.toFixed(1) + ' °C';
  $('mTemp').style.color = S.temp > 80 ? '#f85149' : S.temp > 72 ? '#d29922' : '#e6edf3';
  $('mVib').textContent = S.vib.toFixed(2) + ' mm/s';
  $('mVib').style.color = S.vib > 6 ? '#f85149' : '#e6edf3';
  $('mCount').textContent = S.count + ' 개';
  $('mRul').textContent = S.rulHours >= 24
    ? Math.floor(S.rulHours / 24) + '일 ' + Math.floor(S.rulHours % 24) + '시간'
    : Math.floor(S.rulHours) + '시간';
  $('mRul').style.color = S.rulHours < 48 ? '#f85149' : '#e6edf3';
  const h = Math.floor(S.simTime / 3600), m = Math.floor(S.simTime / 60) % 60, s = Math.floor(S.simTime) % 60;
  $('simTime').textContent = [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
  drawTempChart();
}

/* 온도 차트 */
const tc = $('tempChart'), tctx = tc.getContext('2d');
function drawTempChart() {
  const W = tc.width, H = tc.height;
  tctx.clearRect(0, 0, W, H);
  tctx.strokeStyle = '#f85149'; tctx.setLineDash([5, 4]); tctx.beginPath();
  const y80 = H - ((80 - 40) / 70) * H;
  tctx.moveTo(0, y80); tctx.lineTo(W, y80); tctx.stroke(); tctx.setLineDash([]);
  tctx.fillStyle = '#8b949e'; tctx.font = '10px sans-serif';
  tctx.fillText('임계 80°C', 6, y80 - 4);
  if (S.hist.length < 2) return;
  tctx.strokeStyle = '#2f81f7'; tctx.lineWidth = 1.6; tctx.beginPath();
  S.hist.forEach((t, i) => {
    const x = (i / (WINDOW - 1)) * W;
    const y = H - ((Math.min(110, Math.max(40, t)) - 40) / 70) * H;
    i ? tctx.lineTo(x, y) : tctx.moveTo(x, y);
  });
  tctx.stroke();
  tctx.fillStyle = '#f85149';
  S.anomalies.slice(-20).forEach((a) => {
    const idx = S.hist.length - 1 - Math.round((S.simTime - a.t) * 10);
    if (idx < 0) return;
    const x = (idx / (WINDOW - 1)) * W;
    const y = H - ((Math.min(110, Math.max(40, a.temp)) - 40) / 70) * H;
    tctx.beginPath(); tctx.arc(x, y, 3.5, 0, 7); tctx.fill();
  });
}

/* 로그/알람 */
function fmtT() {
  const h = Math.floor(S.simTime / 3600), m = Math.floor(S.simTime / 60) % 60, s = Math.floor(S.simTime) % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}
function addLog(msg, cls = '') {
  const li = document.createElement('li');
  if (cls) li.className = cls;
  li.innerHTML = `<span class="t">${fmtT()}</span>${msg}`;
  const log = $('eventLog');
  log.prepend(li);
  while (log.children.length > 40) log.lastChild.remove();
}
function showAlarm(msg) {
  $('alarmText').textContent = msg;
  $('alarmBanner').classList.remove('hidden');
}
function hideAlarm() { $('alarmBanner').classList.add('hidden'); }

/* 컨트롤 */
$('btnToggle').addEventListener('click', (e) => {
  S.running = !S.running;
  e.target.textContent = S.running ? '⏸ 일시정지' : '▶ 재개';
});
$('btnReset').addEventListener('click', () => {
  Object.assign(S, { simTime: 0, fault: false, temp: 62, vib: 2.1, count: 0, rulHours: 720, hist: [], anomalies: [] });
  hideAlarm(); addLog('시뮬레이션 리셋 — 설비 상태 초기화', 'ok');
});
$('speedRange').addEventListener('input', (e) => {
  S.speed = parseFloat(e.target.value);
  $('speedVal').textContent = S.speed.toFixed(2).replace(/0$/, '') + '×';
});
$('btnFault').addEventListener('click', () => {
  if (S.fault) return;
  S.fault = true;
  addLog('고장 주입 — 모터 과열 시나리오 시작', 'warn');
  showAlarm('⚠ 고장 주입됨 — 모터 온도 급상승 예상. AI가 감시 중입니다.');
});
const clearFault = () => {
  if (!S.fault && $('alarmBanner').classList.contains('hidden')) return;
  S.fault = false; hideAlarm();
  addLog('고장 복구 — 정상 운전으로 복귀', 'ok');
};
$('btnClearFault').addEventListener('click', clearFault);
$('btnClearFaultTop').addEventListener('click', clearFault);

/* 리사이즈 + 루프 */
function onResize() {
  const w = viewport.clientWidth, h = viewport.clientHeight;
  if (!w || !h) return;
  camera.aspect = w / h; camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener('resize', onResize);
onResize();
addLog('디지털트윈 가동 — AI 이상탐지 엔진 활성화', 'ok');

let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (S.running && $('tab-twin').classList.contains('active')) stepSim(dt * 10);
  else if (S.running) { S.simTime += dt * 10; }
  controls.update();
  renderer.render(scene, camera);
}
loop(last);
