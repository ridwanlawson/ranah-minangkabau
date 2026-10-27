// RANAH — Rumah Gadang dari GLB asli + lingkungan prosedural.
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function canvasTex(w, h, draw, repeat) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  t.anisotropy = 8;
  return t;
}
const rnd = (a, b) => a + Math.random() * (b - a);

/* --- tekstur --- */
function texIjuk() {
  return canvasTex(512, 512, (x, W, H) => {
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#3a2f24"); g.addColorStop(.5, "#241d15"); g.addColorStop(1, "#14100b");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < 380; i++) {
        const px = Math.random() * W, len = H * rnd(.2, .6), y0 = Math.random() * H;
        x.strokeStyle = layer === 0 ? "rgba(0,0,0,.5)" : `rgba(${170 + rnd(-30, 30)|0},${135 + rnd(-25, 20)|0},${85 + rnd(-20, 15)|0},${rnd(.05, .22)})`;
        x.lineWidth = rnd(.6, 2.2);
        x.beginPath(); x.moveTo(px, y0);
        x.quadraticCurveTo(px + rnd(-9, 9), y0 + len / 2, px + rnd(-14, 14), y0 + len);
        x.stroke();
      }
    }
    // garis lapis sirap ijuk
    x.fillStyle = "rgba(0,0,0,.35)";
    for (let y = 0; y < H; y += 42) x.fillRect(0, y, W, 4);
  }, [6, 2]);
}
function texTimber() {
  return canvasTex(512, 512, (x, W, H) => {
    x.fillStyle = "#4d3a24"; x.fillRect(0, 0, W, H);
    const pw = W / 6;
    for (let p = 0; p < 6; p++) {
      x.fillStyle = `rgb(${72 + rnd(-12, 12)|0},${53 + rnd(-10, 10)|0},${33 + rnd(-8, 8)|0})`;
      x.fillRect(p * pw + 1, 0, pw - 2, H);
      // serat kayu
      for (let i = 0; i < 46; i++) {
        x.strokeStyle = `rgba(20,12,6,${rnd(.08, .28)})`;
        x.lineWidth = rnd(.5, 1.4);
        const gx = p * pw + rnd(3, pw - 3);
        x.beginPath(); x.moveTo(gx, 0);
        x.bezierCurveTo(gx + rnd(-6, 6), H * .3, gx + rnd(-6, 6), H * .6, gx + rnd(-4, 4), H);
        x.stroke();
      }
      // ukiran pucuak rabuang di tiap papan
      x.strokeStyle = "rgba(201,162,39,.34)"; x.lineWidth = 2;
      const cx = p * pw + pw / 2;
      for (let k = 0; k < 4; k++) {
        const y = 60 + k * 110;
        x.beginPath(); x.arc(cx, y, 16, Math.PI * .15, Math.PI * .85, false); x.stroke();
        x.beginPath(); x.arc(cx, y, 9, Math.PI * 1.15, Math.PI * 1.85, false); x.stroke();
        x.fillStyle = "rgba(201,162,39,.4)";
        x.fillRect(cx - 1.5, y - 34, 3, 12);
      }
    }
    x.fillStyle = "rgba(0,0,0,.5)";
    for (let p = 0; p <= 6; p++) x.fillRect(p * pw - 1, 0, 2, H);
  }, [2.5, 1]);
}
function texGround() {
  return canvasTex(512, 512, (x, W, H) => {
    x.fillStyle = "#0d120b"; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 5200; i++) {
      const g = rnd(0, 1);
      x.fillStyle = g > .82 ? `rgba(90,130,60,${rnd(.1, .4)})` : g > .5 ? `rgba(30,48,26,${rnd(.2, .5)})` : `rgba(0,0,0,${rnd(.15, .4)})`;
      x.fillRect(Math.random() * W, Math.random() * H, rnd(1, 3), rnd(1, 4));
    }
  }, [14, 14]);
}
/* Kulit batang karambia: ruas cincin + serat */
function texPalmTrunk() {
  return canvasTex(128, 256, (x, W, H) => {
    x.fillStyle = "#5a4630"; x.fillRect(0, 0, W, H);
    for (let y = 0; y < H; y += 26) {
      x.fillStyle = "rgba(20,12,6,.55)"; x.fillRect(0, y, W, 5);
      x.fillStyle = "rgba(220,190,140,.16)"; x.fillRect(0, y + 5, W, 3);
    }
    for (let i = 0; i < 500; i++) {
      x.fillStyle = `rgba(${30 + rnd(-10, 30)|0},${22 + rnd(-8, 22)|0},${14 + rnd(-6, 14)|0},${rnd(.2, .5)})`;
      x.fillRect(Math.random() * W, Math.random() * H, rnd(1, 3), rnd(2, 6));
    }
  }, [2, 3]);
}
/* Pelepah: lidi tengah + anak daun menyirip, transparan di sela */
function texFrond() {
  return canvasTex(256, 128, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    const cx = H / 2;
    x.strokeStyle = "#4a6a2a"; x.lineWidth = 5;
    x.beginPath(); x.moveTo(4, cx); x.lineTo(W - 4, cx - 8); x.stroke();
    for (let i = 0; i < 34; i++) {
      const px = 10 + i * (W - 20) / 34;
      const len = 44 * Math.sin((i / 34) * Math.PI) + 8;
      const droop = 10 + i * .5;
      [-1, 1].forEach(s => {
        const g = x.createLinearGradient(px, cx, px + droop, cx + s * len);
        g.addColorStop(0, "#2f5a26"); g.addColorStop(1, "#1c3a18");
        x.strokeStyle = g; x.lineWidth = 4.5;
        x.beginPath(); x.moveTo(px, cx);
        x.quadraticCurveTo(px + droop * .4, cx + s * len * .6, px + droop, cx + s * len);
        x.stroke();
      });
    }
  });
}
function texSongketWindow() {
  return canvasTex(128, 160, (x, W, H) => {
    const g = x.createRadialGradient(W / 2, H * .55, 4, W / 2, H * .55, W * .8);
    g.addColorStop(0, "#ffe3a3"); g.addColorStop(.4, "#f0a04a"); g.addColorStop(.75, "#7a3a14"); g.addColorStop(1, "#2a1208");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // siluet orang di dalam — bikin hidup
    x.fillStyle = "rgba(40,14,6,.55)";
    x.beginPath(); x.arc(W * .5, H * .52, 11, 0, 7); x.fill();
    x.fillRect(W * .5 - 13, H * .62, 26, 30);
    // kisi songket
    x.strokeStyle = "rgba(70,30,12,.9)"; x.lineWidth = 2.5;
    const s = 18;
    for (let i = -H / s; i < W / s + H / s; i++) {
      x.beginPath(); x.moveTo(i * s, 0); x.lineTo(i * s + H, H); x.stroke();
      x.beginPath(); x.moveTo(i * s, 0); x.lineTo(i * s - H, H); x.stroke();
    }
    // bingkai ukir emas
    x.strokeStyle = "#caa22f"; x.lineWidth = 5; x.strokeRect(3, 3, W - 6, H - 6);
    x.strokeStyle = "rgba(40,18,8,.95)"; x.lineWidth = 3;
    x.strokeRect(9, 9, W - 18, H - 18);
  });
}
function texGlow() {
  return canvasTex(128, 128, (x, W, H) => {
    const g = x.createRadialGradient(W / 2, H / 2, 1, W / 2, H / 2, W / 2);
    g.addColorStop(0, "rgba(255,250,230,1)"); g.addColorStop(.18, "rgba(255,220,150,.85)");
    g.addColorStop(.45, "rgba(255,180,90,.22)"); g.addColorStop(1, "rgba(255,160,60,0)");
    x.fillStyle = g; x.fillRect(0, 0, W, H);
  });
}
function texMist() {
  return canvasTex(256, 128, (x, W, H) => {
    x.clearRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) {
      const bx = rnd(W * .2, W * .8), by = rnd(H * .3, H * .7), r = rnd(20, 60);
      const g = x.createRadialGradient(bx, by, 2, bx, by, r);
      g.addColorStop(0, `rgba(200,190,175,${rnd(.05, .13)})`); g.addColorStop(1, "rgba(200,190,175,0)");
      x.fillStyle = g; x.fillRect(0, 0, W, H);
    }
  });
}

/* Atap gonjong: melengkung ke dalam (cekung) seperti tanduk asli,
   ujung terangkat + sedikit menekuk ke luar. */
function gonjongRoof(L, W, eaveY, ridgeY, hornLift, mat) {
  const nx = 64, nz = 22;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= nx; i++) {
    const u = i / nx, px = (u - .5) * L;
    const endT = Math.pow(Math.abs(2 * u - 1), 3.4);
    for (let j = 0; j <= nz; j++) {
      const v = (j / nz) * 2 - 1, pz = v * W / 2;
      const av = Math.abs(v);
      // profil melintang: cekung di tengah, bibir atap sedikit terangkat
      const across = Math.cos(av * Math.PI * .5);
      const lip = Math.pow(av, 3) * .55;
      const py = eaveY + (ridgeY - eaveY) * Math.pow(across, .8) + lip
        + hornLift * endT * (0.25 + 0.75 * across) + Math.sin(u * Math.PI) * .12;
      pos.push(px, py, pz); uv.push(u * 3, j / nz);
    }
  }
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const a = i * (nz + 1) + j, b = a + nz + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat);
  // lis bawah atap (reng) biar tidak terlihat kertas tipis
  return m;
}
/* Atap sirap papan (seperti foto referensi: Museum / Gadang asli) + dinding rangkiang garis */
function texSirap() {
  return canvasTex(512, 512, (x, W, H) => {
    x.fillStyle = "#211a13"; x.fillRect(0, 0, W, H);
    const rh = 32, cw = 42;
    for (let r = 0; r < H / rh; r++) {
      for (let cI = 0; cI < W / cw + 1; cI++) {
        const off = (r % 2) * cw / 2;
        const px = cI * cw + off, py = r * rh;
        const v = rnd(-12, 12);
        x.fillStyle = `rgb(${52 + v|0},${40 + v * .8|0},${28 + v * .6|0})`;
        x.fillRect(px + 1, py + 1, cw - 2, rh - 2);
        x.fillStyle = "rgba(255,220,170,.07)"; x.fillRect(px + 1, py + 1, cw - 2, 3);
        x.fillStyle = "rgba(0,0,0,.5)"; x.fillRect(px + 1, py + rh - 3, cw - 2, 2);
      }
    }
  }, [7, 3]);
}
function texRangkiang() {
  return canvasTex(256, 256, (x, W, H) => {
    x.fillStyle = "#ddd6c4"; x.fillRect(0, 0, W, H);
    for (let i = 0; i < W; i += 22) {
      x.fillStyle = "#1c1a16"; x.fillRect(i, 0, 9, H);
      x.fillStyle = "rgba(0,0,0,.25)"; x.fillRect(i + 9, 0, 2, H);
    }
    x.fillStyle = "rgba(120,90,40,.18)"; x.fillRect(0, 0, W, H);
  }, [2, 1]);
}
function texCourtyard() {
  return canvasTex(512, 512, (x, W, H) => {
    x.fillStyle = "#33322f"; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${90 + rnd(-20, 30)|0},${88 + rnd(-20, 25)|0},${84 + rnd(-18, 22)|0},${rnd(.1, .35)})`; x.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
    x.strokeStyle = "rgba(20,20,20,.6)"; x.lineWidth = 2;
    for (let i = 0; i <= 8; i++) {
      x.beginPath(); x.moveTo(i * W / 8, 0); x.lineTo(i * W / 8, H); x.stroke();
      x.beginPath(); x.moveTo(0, i * H / 8); x.lineTo(W, i * H / 8); x.stroke();
    }
    // motif bintang / wajik khas halaman museum di foto 2
    x.save(); x.translate(W / 2, H / 2);
    x.strokeStyle = "rgba(200,190,170,.85)"; x.lineWidth = 5;
    x.beginPath();
    for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI * 2; const r = i % 2 ? 60 : 150; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    x.closePath(); x.stroke(); x.restore();
  }, [3, 3]);
}
/* Gonjong runcing tinggi seperti foto: segitiga melengkung ke atas */
function gonjongTower(w, h, depth, mat, trimMat) {
  const g = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.quadraticCurveTo(-w * .28, h * .45, -w * .10, h * .92);
  shape.lineTo(0, h);
  shape.lineTo(w * .10, h * .92);
  shape.quadraticCurveTo(w * .28, h * .45, w / 2, 0);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
  geo.translate(0, 0, -depth / 2);
  const front = new THREE.Mesh(geo, mat);
  front.castShadow = true; g.add(front);
  // lis merah-tepi khas museum (lihat foto 2: tepi gonjong merah)
  const edge = new THREE.Mesh(new THREE.TorusGeometry(.09, .05, 6, 12), trimMat);
  edge.position.set(0, h + .05, 0); edge.scale.set(1, 1.6, 1); g.add(edge);
  const spike = new THREE.Mesh(new THREE.CylinderGeometry(.03, .06, 1.4, 6), trimMat);
  spike.position.set(0, h + .7, 0); g.add(spike);
  return g;
}
/* Atap 5 gonjong sejajar seperti referensi — tetap 1 massa ramping, puncak runcing */
function fiveGonjongRoof(L, Wd, eaveY, ridgeY, mat, trimMat, parent) {
  const n = 5, segW = L / n;
  for (let i = 0; i < n; i++) {
    const cx = -L / 2 + segW * (i + .5);
    const edge = (i === 0 || i === n - 1) ? 2.6 : 1.5;
    const r = gonjongRoof(segW + .9, Wd, eaveY, ridgeY, edge, mat);
    r.position.x = cx; r.castShadow = true; parent.add(r);
  }
  // ujung tanduk runcing kiri-kanan saja, tipis elegan
  [-1, 1].forEach(d => {
    const tip = new THREE.Mesh(new THREE.ConeGeometry(.16, 2.6, 6), trimMat);
    tip.position.set(d * (L / 2 + .4), ridgeY + 3.1, 0);
    tip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(d * .6, .8, 0).normalize());
    parent.add(tip);
  });
}
function hornTips(group, halfL, tipY, mat, s) {
  [-1, 1].forEach(d => {
    const tip = new THREE.Mesh(new THREE.ConeGeometry(.26 * s, 2.2 * s, 7), mat);
    tip.position.set(d * (halfL + .35 * s), tipY + .75 * s, 0);
    tip.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(d * .72, .69, 0).normalize());
    group.add(tip);
    // ijuk rumbai di ujung gonjong
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(.5 * s, 1.1 * s, 6),
      new THREE.MeshStandardMaterial({ color: 0x1c150e, roughness: 1 }));
    tuft.position.set(d * (halfL - .15 * s), tipY - .1 * s, 0);
    tuft.rotation.z = d * -.5;
    group.add(tuft);
  });
}

export function buildRanahScene(canvas, { onProgress, onReady, onError } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  const pixelRatioCap = () => innerWidth < 768 ? 1.75 : 2;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, pixelRatioCap()));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.38;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0e18);
  scene.fog = new THREE.FogExp2(0x0e0f16, 0.012);

  const camera = new THREE.PerspectiveCamera(48, 1, .1, 500);
  camera.position.set(0, 4.2, 19);

  const MAT = {
    ijuk: new THREE.MeshStandardMaterial({ map: texSirap(), roughness: .9, side: THREE.DoubleSide }),
    trimRed: new THREE.MeshStandardMaterial({ color: 0x8f1f1a, roughness: .6 }),
    rangkiangWall: new THREE.MeshStandardMaterial({ map: texRangkiang(), roughness: .85 }),
    courtyard: new THREE.MeshStandardMaterial({ map: texCourtyard(), roughness: .95, color: 0x8a8a8a }),
    lawn: new THREE.MeshStandardMaterial({ map: texGround(), color: 0x9fb08a, roughness: 1 }),
    hill: new THREE.MeshStandardMaterial({ color: 0x131f15, roughness: 1, flatShading: true }),
    timber: new THREE.MeshStandardMaterial({ map: texTimber(), roughness: .72 }),
    post: new THREE.MeshStandardMaterial({ color: 0x2e2114, roughness: .85 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x4a4a4c, roughness: .95, flatShading: true }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: .3, metalness: .85, emissive: 0x2a1c05, emissiveIntensity: .5 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x12100b, roughness: 1 }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x1d4423, roughness: .8, side: THREE.DoubleSide }),
    leaf2: new THREE.MeshStandardMaterial({ color: 0x2a5a2c, roughness: .8, side: THREE.DoubleSide }),
    cliff: new THREE.MeshStandardMaterial({ color: 0x27332a, roughness: 1, flatShading: true }),
    ground: new THREE.MeshStandardMaterial({ map: texGround(), roughness: 1 }),
    terrace: new THREE.MeshStandardMaterial({ color: 0x2c4420, roughness: .55, metalness: .25 }),
    paddyWater: new THREE.MeshStandardMaterial({ color: 0x2a3f33, roughness: .12, metalness: .75, emissive: 0x1a2a33, emissiveIntensity: .7 }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x3d2d1c, roughness: .95 }),
    window: new THREE.MeshBasicMaterial({ map: texSongketWindow(), fog: true }),
  };
  const glowTex = texGlow(), mistTex = texMist();

  scene.add(new THREE.HemisphereLight(0x8f9cc8, 0x141008, .8));
  const moonLight = new THREE.DirectionalLight(0xbfd0ff, 1.4);
  moonLight.position.set(18, 32, -20); moonLight.castShadow = true;
  const shadowMapSize = () => innerWidth < 768 ? 1024 : 2048;
  moonLight.shadow.mapSize.set(shadowMapSize(), shadowMapSize());
  moonLight.shadow.camera.left = -30; moonLight.shadow.camera.right = 30;
  moonLight.shadow.camera.top = 30; moonLight.shadow.camera.bottom = -20;
  scene.add(moonLight);
  const warm = new THREE.DirectionalLight(0xff9a4a, .5);
  warm.position.set(-8, 6, 18); scene.add(warm);

  /* ---- langit ---- */
  {
    const n = 700, p = new Float32Array(n * 3), c = new Float32Array(n * 3);
    const col = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, e = rnd(.06, 1.45), r = rnd(160, 260);
      p[i * 3] = Math.cos(a) * Math.cos(e) * r;
      p[i * 3 + 1] = Math.sin(e) * r * .6 + 2;
      p[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r - 40;
      col.setHSL(rnd(.08, .14), rnd(.2, .7), rnd(.55, .95));
      if (Math.random() < .25) col.setHSL(.6, .5, .8);
      c[i * 3] = col.r; c[i * 3 + 1] = col.g; c[i * 3 + 2] = col.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    g.setAttribute("color", new THREE.BufferAttribute(c, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({
      size: 1.1, vertexColors: true, transparent: true, opacity: .85, fog: false, depthWrite: false, sizeAttenuation: false,
    })));
  }
  // gradasi horizon senja → malam
  {
    const sky = new THREE.Mesh(new THREE.SphereGeometry(280, 24, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide, fog: false, depthWrite: false,
        uniforms: { top: { value: new THREE.Color(0x05060f) }, mid: { value: new THREE.Color(0x2b2138) }, bot: { value: new THREE.Color(0xb4502a) } },
        vertexShader: "varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
        fragmentShader: "varying vec3 vP; uniform vec3 top,mid,bot; void main(){ float h=normalize(vP).y; vec3 c=h>0.25?mix(mid,top,smoothstep(.25,.8,h)):mix(bot,mid,smoothstep(-.05,.25,h)); gl_FragColor=vec4(c,1.);}",
      }));
    scene.add(sky);
  }
  /* ---- bulan KAGE plek: maria di posisi sisi-dekat asli + ray + kawah ---- */
  const KTAU = Math.PI * 2;
  const kageClamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const kageLerp = (a, b, t) => a + (b - a) * t;
  function kageCvs(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function kageMulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function kageFbmCanvas(W, H, seed, octaves, baseCells, contrast) {
    const out = kageCvs(W, H), o = out.getContext("2d");
    o.fillStyle = "#808080"; o.fillRect(0, 0, W, H);
    let cells = baseCells || 3, alpha = 1;
    for (let i = 0; i < (octaves || 5); i++) {
      const n = kageCvs(cells, cells), nx = n.getContext("2d");
      const im = nx.createImageData(cells, cells), d = im.data, r = kageMulberry32(seed + i * 977);
      for (let k = 0; k < cells * cells; k++) {
        const v = 128 + (r() - .5) * 255 * (contrast || 1);
        d[k * 4] = d[k * 4 + 1] = d[k * 4 + 2] = kageClamp(v, 0, 255); d[k * 4 + 3] = 255;
      }
      nx.putImageData(im, 0, 0);
      o.globalAlpha = alpha;
      o.globalCompositeOperation = i === 0 ? "source-over" : "overlay";
      o.imageSmoothingEnabled = true; o.imageSmoothingQuality = "high";
      o.drawImage(n, 0, 0, W, H);
      cells *= 2; alpha *= .62;
    }
    o.globalAlpha = 1; o.globalCompositeOperation = "source-over";
    return out;
  }
  function kageTexMoon() {
    const S = 512, c = kageCvs(S, S), x = c.getContext("2d");
    const R = S / 2 - 1, rndM = kageMulberry32(91);
    const px = (u, v) => [S / 2 + u * R, S / 2 + v * R];
    x.beginPath(); x.arc(S / 2, S / 2, R, 0, KTAU); x.closePath();
    x.save(); x.clip();
    const g = x.createRadialGradient(S * .46, S * .44, S * .05, S / 2, S / 2, R);
    g.addColorStop(0, "rgb(150,150,150)"); g.addColorStop(.55, "rgb(158,158,158)");
    g.addColorStop(.86, "rgb(178,178,178)"); g.addColorStop(1, "rgb(196,196,196)");
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = "overlay"; x.globalAlpha = .5;
    x.drawImage(kageFbmCanvas(256, 256, 517, 6, 4, 1.1), 0, 0, S, S);
    x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
    const seas = [
      [-.52, -.06, .46, .80], [-.26, -.38, .31, .92], [.13, -.31, .20, .88],
      [.30, -.08, .23, .84], [.45, .12, .15, .78], [.27, .27, .12, .74],
      [.57, -.30, .12, .95], [-.27, .30, .19, .70], [-.47, .25, .13, .72],
    ];
    const sea = kageCvs(S, S), sx = sea.getContext("2d");
    seas.forEach(([u, v, rad, dk]) => {
      for (let i = 0; i < 22; i++) {
        const a = rndM() * KTAU, off = rndM() * rad * .66;
        const [bx, by] = px(u + Math.cos(a) * off, v + Math.sin(a) * off * .8);
        const rr = rad * R * (.30 + rndM() * .46);
        const bg = sx.createRadialGradient(bx, by, rr * .2, bx, by, rr);
        bg.addColorStop(0, "rgba(0,0,0," + (dk * .14).toFixed(3) + ")");
        bg.addColorStop(1, "rgba(0,0,0,0)");
        sx.fillStyle = bg; sx.beginPath(); sx.arc(bx, by, rr, 0, KTAU); sx.fill();
      }
    });
    x.save(); x.filter = "blur(9px)"; x.globalAlpha = .90;
    x.drawImage(sea, 0, 0); x.restore();
    x.globalCompositeOperation = "overlay"; x.globalAlpha = .18;
    x.drawImage(kageFbmCanvas(256, 256, 811, 4, 11, 1.2), 0, 0, S, S);
    x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
    const ray = kageCvs(S, S), rx2 = ray.getContext("2d");
    [[-.10, .54, 150, 1], [-.28, -.07, 80, .6], [-.46, -.04, 60, .45]].forEach(([u, v, n, str]) => {
      const [ox, oy] = px(u, v);
      for (let i = 0; i < n; i++) {
        const a = rndM() * KTAU, len = R * (.30 + rndM() * rndM() * 1.3);
        const t0 = R * (.08 + rndM() * .06);
        const p0 = [ox + Math.cos(a) * t0, oy + Math.sin(a) * t0];
        const p1 = [ox + Math.cos(a) * len, oy + Math.sin(a) * len];
        const rg = rx2.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
        rg.addColorStop(0, "rgba(255,255,255," + (.085 * str).toFixed(3) + ")");
        rg.addColorStop(.4, "rgba(255,255,255," + (.055 * str).toFixed(3) + ")");
        rg.addColorStop(1, "rgba(255,255,255,0)");
        rx2.strokeStyle = rg; rx2.lineWidth = .8 + rndM() * 2.4; rx2.lineCap = "round";
        rx2.beginPath(); rx2.moveTo(p0[0], p0[1]);
        rx2.quadraticCurveTo(ox + Math.cos(a + .06) * len * .55, oy + Math.sin(a + .06) * len * .55, p1[0], p1[1]);
        rx2.stroke();
      }
    });
    x.save(); x.filter = "blur(2.4px)"; x.globalCompositeOperation = "lighter";
    x.globalAlpha = .62; x.drawImage(ray, 0, 0); x.restore();
    const inSea = (u, v) => seas.some(([su, sv, rad]) =>
      Math.hypot(u - su, (v - sv) * 1.15) < rad * .82);
    for (let i = 0; i < 620; i++) {
      const a = rndM() * KTAU, rr = Math.sqrt(rndM()) * .97;
      const u = Math.cos(a) * rr, v = Math.sin(a) * rr;
      if (inSea(u, v) && rndM() > .12) continue;
      const [cx2, cy] = px(u, v);
      const big = rndM() > .975;
      const r = (1 + rndM() * rndM() * rndM() * (big ? 34 : 11)) * (S / 512);
      const fade = .55 + .45 * Math.sqrt(Math.max(0, 1 - rr * rr));
      const sq = Math.sqrt(Math.max(0, 1 - rr * rr)) * .72 + .28;
      x.save(); x.translate(cx2, cy); x.rotate(Math.atan2(v, u)); x.scale(sq, 1);
      x.rotate(-Math.atan2(v, u));
      const rimW = Math.max(.8, r * .26);
      const lg = x.createLinearGradient(-r, -r, r, r);
      lg.addColorStop(0, "rgba(255,255,255," + (.34 * fade).toFixed(3) + ")");
      lg.addColorStop(.5, "rgba(255,255,255,0)");
      lg.addColorStop(1, "rgba(0,0,0," + (.38 * fade).toFixed(3) + ")");
      x.strokeStyle = lg; x.lineWidth = rimW;
      x.beginPath(); x.arc(0, 0, Math.max(.6, r - rimW * .5), 0, KTAU); x.stroke();
      if (r > 3) {
        const fg = x.createLinearGradient(-r, -r, r, r);
        fg.addColorStop(0, "rgba(0,0,0," + (.21 * fade).toFixed(3) + ")");
        fg.addColorStop(1, "rgba(255,255,255," + (.07 * fade).toFixed(3) + ")");
        x.fillStyle = fg; x.beginPath(); x.arc(0, 0, r - rimW, 0, KTAU); x.fill();
      }
      if (r > 13) {
        x.fillStyle = "rgba(255,255,255," + (.14 * fade).toFixed(3) + ")";
        x.beginPath(); x.arc(-r * .04, -r * .04, r * .11, 0, KTAU); x.fill();
      }
      x.restore();
    }
    x.globalCompositeOperation = "overlay"; x.globalAlpha = .13;
    x.drawImage(kageFbmCanvas(S, S, 977, 2, 210, 1.3), 0, 0, S, S);
    x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
    const sh = x.createRadialGradient(S * .40, S * .38, S * .18, S * .52, S * .56, S * .72);
    sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.30)");
    x.fillStyle = sh; x.fillRect(0, 0, S, S);
    x.restore();
    const fe = x.createRadialGradient(S / 2, S / 2, R - 2.5, S / 2, S / 2, R);
    fe.addColorStop(0, "rgba(0,0,0,1)"); fe.addColorStop(1, "rgba(0,0,0,0)");
    x.globalCompositeOperation = "destination-in";
    x.fillStyle = fe; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = "source-over";
    return c;
  }
  function kageTexGlow(inner, mid) {
    const S = 256, c = kageCvs(S, S), x = c.getContext("2d");
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, inner || "rgba(255,255,255,1)");
    g.addColorStop(.28, mid || "rgba(255,255,255,.36)");
    g.addColorStop(.62, "rgba(255,255,255,.07)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return c;
  }
  const MOON_K = { x: 17.9, y: 31.9, z: -72, r: 8.6 };
  const moonTexK = new THREE.CanvasTexture(kageTexMoon());
  moonTexK.colorSpace = THREE.SRGBColorSpace; moonTexK.anisotropy = 8;
  const moon = new THREE.Mesh(new THREE.PlaneGeometry(MOON_K.r * 2, MOON_K.r * 2),
    new THREE.MeshBasicMaterial({
      map: moonTexK, color: new THREE.Color(3.6, .64, .61),
      transparent: true, depthWrite: false, fog: false, toneMapped: false,
    }));
  moon.position.set(MOON_K.x, MOON_K.y, MOON_K.z); moon.renderOrder = 1; scene.add(moon);
  const haloTexK = new THREE.CanvasTexture(
    kageTexGlow("rgba(255,124,112,.90)", "rgba(206,52,48,.26)"));
  haloTexK.colorSpace = THREE.SRGBColorSpace;
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(MOON_K.r * 6.4, MOON_K.r * 6.4),
    new THREE.MeshBasicMaterial({
      map: haloTexK, transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, fog: false, opacity: .44,
    }));
  halo.position.set(MOON_K.x, MOON_K.y, MOON_K.z - .3); halo.renderOrder = 0; scene.add(halo);

  /* ---- tanah berundak alami ---- */
  {
    const gg = new THREE.CircleGeometry(140, 72);
    const pp = gg.attributes.position;
    for (let i = 0; i < pp.count; i++) {
      const vx = pp.getX(i), vy = pp.getY(i);
      const d = Math.hypot(vx, vy);
      if (d > 4) pp.setZ(i, Math.sin(vx * .14) * Math.cos(vy * .12) * 1.1 + Math.sin(vx * .5 + vy * .3) * .28);
    }
    gg.computeVertexNormals();
    const ground = new THREE.Mesh(gg, MAT.ground);
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  }

  /* ---- Rumah Gadang dari file GLB asli ---- */
  const house = new THREE.Group();
  scene.add(house);
  let modelReady = false;
  new GLTFLoader().load("rumah-gadang.glb",
    (glb) => {
      const model = glb.scene;
      // normalisasi: muat dalam box lalu skala agar panjang ±15
      const box = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3(); box.getSize(size);
      const ctr = new THREE.Vector3(); box.getCenter(ctr);
      model.position.sub(ctr); // tengahkan
      const s = 15 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(s);
      // model memanjang di sumbu z → putar agar menghadap kamera (panjang di x)
      const wrap = new THREE.Group();
      wrap.add(model);
      wrap.rotation.y = Math.PI / 2;
      // dudukkan di tanah + angkat sedikit: jalan & pohon bawaan GLB
      // dibiarkan 100% utuh, hanya dihindari z-fight dengan tanah
      const b2 = new THREE.Box3().setFromObject(wrap);
      wrap.position.y -= b2.min.y;
      wrap.position.y += .08;
      wrap.traverse(o => {
        if (o.isMesh) {
          o.castShadow = true; o.receiveShadow = true;
          // material bawaan Tripo metalik → di malam hari tampak hitam.
          // Kembalikan ke kayu/atap alami: tekstur asli tetap dipakai.
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach(m => {
            if (m && m.isMeshStandardMaterial) {
              m.metalness = 0.0; m.roughness = .85;
              const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
              ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap"].forEach((key) => {
                const texture = m[key];
                if (texture) texture.anisotropy = Math.min(maxAnisotropy, 16);
              });
              m.side = THREE.DoubleSide; m.needsUpdate = true;
            }
          });
        }
      });
      house.add(wrap);
      modelReady = true;
      onProgress?.(96);
    },
    (event) => {
      onProgress?.(event.total > 0 ? Math.min(92, Math.round(event.loaded / event.total * 92)) : null);
    },
    (error) => {
      console.error("The Rumah Gadang 3D model failed to load.", error);
      onError?.(error);
    });
  // cahaya hangat penghuni rumah
  const houseGlow = new THREE.PointLight(0xff9a3a, 130, 38, 2);
  houseGlow.position.set(0, 5.2, 6.5); house.add(houseGlow);
  const lampGlow = new THREE.PointLight(0xffb45e, 36, 16, 2);
  lampGlow.position.set(-8.5, 4.6, 3); house.add(lampGlow);

  /* ---- rangkiang ---- */
  function rangkiang(x, z, s, ry) {
    const g = new THREE.Group();
    [-1, 1].forEach(a => [-1, 1].forEach(b => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(.13, .17, 2.2, 8), MAT.post);
      p.position.set(a * 1.05, 1.1, b * .85); p.castShadow = true; g.add(p);
    }));
    const box = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.7, 2.2), MAT.rangkiangWall);
    box.position.y = 3.05; box.castShadow = true; g.add(box);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(2.9, .28, 2.3), MAT.gold);
    trim.position.y = 3.75; g.add(trim);
    const hatch = new THREE.Mesh(new THREE.PlaneGeometry(.7, .8), MAT.window);
    hatch.position.set(0, 3.05, 1.12); g.add(hatch);
    // tangga bersandar — khas rangkiang asli
    const ladder = new THREE.Group();
    [-.25, .25].forEach(lx => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.6, 6), MAT.post);
      rail.position.set(lx, 0, 0); ladder.add(rail);
    });
    for (let rI = 0; rI < 5; rI++) {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, .55, 6), MAT.post);
      rung.rotation.z = Math.PI / 2; rung.position.y = -1 + rI * .5; ladder.add(rung);
    }
    ladder.position.set(0, 1.3, 1.65); ladder.rotation.x = -.28;
    ladder.traverse(o => { if (o.isMesh) o.castShadow = true; });
    g.add(ladder);
    g.add(gonjongRoof(4.6, 3.4, 3.9, 5.1, 1.7, MAT.ijuk));
    hornTips(g, 2.3, 6.8, MAT.gold, .55);
    g.position.set(x, 0, z); g.scale.setScalar(s); g.rotation.y = ry || 0;
    scene.add(g);
  }
  // rangkiang: 2 pasang simetris sempurna (cermin kiri-kanan)
  rangkiang(-13.5, 8, .9, .18); rangkiang(13.5, 8, .9, -.18);
  rangkiang(-16, -6, 1, .3); rangkiang(16, -6, 1, -.3);
  /* halaman batu + rumput hijau + bukit belakang seperti foto 2 */
  {
    const yard = new THREE.Mesh(new THREE.PlaneGeometry(30, 20), MAT.courtyard);
    yard.rotation.x = -Math.PI / 2; yard.position.set(0, .04, 12);
    yard.receiveShadow = true; scene.add(yard);
    [-1, 1].forEach(s => {
      const lawn = new THREE.Mesh(new THREE.PlaneGeometry(22, 20), MAT.lawn);
      lawn.rotation.x = -Math.PI / 2; lawn.position.set(s * 26, .03, 12);
      lawn.receiveShadow = true; scene.add(lawn);
    });
    // bukit hijau berlapis di kejauhan
    [[-70, -90, 55, 22], [0, -110, 80, 28], [75, -92, 50, 20], [-120, -60, 45, 18], [120, -60, 45, 18]].forEach(([hx, hz, r, h]) => {
      const hill = new THREE.Mesh(new THREE.ConeGeometry(r, h, 7), MAT.hill);
      hill.position.set(hx, h / 2 - 1, hz); scene.add(hill);
    });
  }

  /* ---- ngarai: tebing + lumut ---- */
  function cliff(px, pz, ry, tint) {
    const g = new THREE.PlaneGeometry(75, 26, 48, 14);
    const p = g.attributes.position, col = [];
    const cA = new THREE.Color(tint), cB = new THREE.Color(0x0d1310);
    for (let i = 0; i < p.count; i++) {
      const vx = p.getX(i), vy = p.getY(i);
      const h = Math.sin(vx * .32) * Math.cos(vy * .45) * 2.6
        + Math.sin(vx * .85 + 1.7) * Math.sin(vy * .6 + .6) * 1.5
        + Math.sin(vx * 2.1 + vy * 1.3) * .4;
      p.setZ(i, h);
      const m = THREE.MathUtils.clamp((vy + 13) / 26 * .8 + h * .08 + rnd(-.05, .05), 0, 1);
      const c = cB.clone().lerp(cA, m);
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true }));
    m.position.set(px, 7.5, pz); m.rotation.y = ry;
    scene.add(m);
  }
  cliff(-38, -32, .55, 0x2e4028); cliff(38, -34, -.55, 0x33442c); cliff(0, -62, 0, 0x243320);
  // air terjun samar di ngarai
  const fall = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 18),
    new THREE.MeshBasicMaterial({ color: 0xafc8d8, transparent: true, opacity: .28, depthWrite: false }));
  fall.position.set(-14, 4, -52); scene.add(fall);

  /* ---- sawah: petak + air memantulkan bulan ---- */
  for (let i = 0; i < 5; i++) {
    const w = 10 - i * 1.0;
    const bund = new THREE.Mesh(new THREE.BoxGeometry(w, .8, 3.6), MAT.terrace);
    bund.position.set(17 - i * 1.1, .4 + i * .8, 9 + i * .4);
    bund.castShadow = true; bund.receiveShadow = true; scene.add(bund);
    const water = new THREE.Mesh(new THREE.PlaneGeometry(w - .7, 2.7), MAT.paddyWater);
    water.rotation.x = -Math.PI / 2;
    water.position.set(17 - i * 1.1, .82 + i * .8, 9 + i * .4);
    scene.add(water);
    // bibit padi: titik-titik hijau bergerombol
    for (let k = 0; k < 26; k++) {
      const tuft = new THREE.Mesh(new THREE.ConeGeometry(.09, rnd(.3, .55), 4), MAT.leaf2);
      tuft.position.set(17 - i * 1.1 + rnd(-w / 2 + .5, w / 2 - .5), 1.0 + i * .8, 9 + i * .4 + rnd(-1.1, 1.1));
      scene.add(tuft);
    }
  }

  /* ---- karambia realistis: batang beruas melengkung + pelepah menyirip ---- */
  const palmTrunkMat = new THREE.MeshStandardMaterial({ map: texPalmTrunk(), roughness: .95 });
  const frondMat = new THREE.MeshStandardMaterial({
    map: texFrond(), transparent: true, alphaTest: .35, side: THREE.DoubleSide, roughness: .8,
  });
  function palm(x, z, s) {
    const g = new THREE.Group();
    const lean = rnd(-.5, .5), lean2 = rnd(-.35, .35);
    // batang: 7 ruas mengikuti kurva lentur
    const H = 7.6;
    let px = 0, pz = 0;
    const pts = [];
    for (let i = 0; i <= 7; i++) {
      const k = i / 7;
      pts.push(new THREE.Vector3(lean * k * k * 3.2, k * H, lean2 * k * k * 2.2));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    for (let i = 0; i < 7; i++) {
      const k0 = i / 7, k1 = (i + 1) / 7;
      const p0 = curve.getPoint(k0), p1 = curve.getPoint(k1);
      const len = p0.distanceTo(p1) * 1.06;
      const r0 = .26 * (1 - k0 * .45), r1 = .26 * (1 - k1 * .45);
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, len, 9), palmTrunkMat);
      seg.position.copy(p0).lerp(p1, .5);
      seg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize());
      seg.castShadow = true; g.add(seg);
    }
    const top = curve.getPoint(1);
    px = top.x; pz = top.z;
    // gombak serabut di pucuk
    const mane = new THREE.Mesh(new THREE.SphereGeometry(.42, 8, 7),
      new THREE.MeshStandardMaterial({ color: 0x3a2a18, roughness: 1 }));
    mane.position.set(px, H - .1, pz); mane.scale.y = 1.25; g.add(mane);
    // 3 lapis tajuk: tegak, mendatar, menjuntai
    const layers = [
      { n: 5, tilt: -.95, len: [2.2, 2.7], y: H + .45 },
      { n: 8, tilt: -.35, len: [3.0, 3.7], y: H + .1 },
      { n: 7, tilt: .25, len: [2.8, 3.4], y: H - .25 },
    ];
    layers.forEach(L => {
      for (let i = 0; i < L.n; i++) {
        const a = (i / L.n) * Math.PI * 2 + rnd(-.25, .25) + L.tilt;
        const len = rnd(L.len[0], L.len[1]);
        const fg = new THREE.PlaneGeometry(len, 1.5, 10, 1);
        const pp3 = fg.attributes.position;
        for (let k = 0; k < pp3.count; k++) {
          const lx = pp3.getX(k);
          const t01 = (lx + len / 2) / len; // 0 pangkal → 1 ujung
          pp3.setY(k, pp3.getY(k) * (1 - t01 * .55) - t01 * t01 * 1.5);
        }
        fg.computeVertexNormals();
        fg.translate(len / 2 - .3, 0, 0); // pangkal di titik jepit
        const f = new THREE.Mesh(fg, frondMat);
        f.position.set(px, L.y + rnd(-.1, .1), pz);
        f.rotation.set(0, -a, L.tilt + rnd(-.12, .12), "YXZ");
        f.castShadow = true; g.add(f);
      }
    });
    // tandan buah bergerombol di bawah tajuk
    const nutCols = [0x6b4c26, 0x7a5a2e, 0x54401f];
    for (let i = 0; i < 7; i++) {
      const a = rnd(0, Math.PI * 2), r = rnd(.15, .55);
      const nut = new THREE.Mesh(new THREE.SphereGeometry(rnd(.17, .23), 9, 8),
        new THREE.MeshStandardMaterial({ color: nutCols[i % 3], roughness: .75 }));
      nut.position.set(px + Math.cos(a) * r, H - .55 + rnd(-.15, .1), pz + Math.sin(a) * r);
      nut.castShadow = true; g.add(nut);
    }
    g.position.set(x, 0, z); g.scale.setScalar(s);
    g.rotation.y = rnd(0, 6.28);
    g.userData.swayPhase = rnd(0, 6.28);
    scene.add(g);
    return g;
  }
  const palms = [palm(-11, 7, 1), palm(12.5, 3, 1.1), palm(-17, -11, 1.25), palm(19, -13, 1), palm(7, -15, .9), palm(-6.5, -12, 1.05)];

  /* semak + rumput liar biar tidak kaku */
  const swayTufts = [];
  function bush(x, z, s) {
    const g = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const b = new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(.3, .65), 1),
        i % 2 ? MAT.leaf : MAT.leaf2);
      b.position.set(rnd(-.9, .9), rnd(.2, .9), rnd(-.9, .9));
      b.scale.y = .75; b.castShadow = true; g.add(b);
    }
    g.position.set(x, 0, z); g.scale.setScalar(s); scene.add(g);
  }
  bush(-9.5, 5, 1.1); bush(9.5, 7, 1); bush(-13.5, 1, .9); bush(14, -2, 1.2); bush(4, 8.5, .8);
  for (let i = 0; i < 90; i++) {
    const gr = new THREE.Mesh(new THREE.ConeGeometry(.06, rnd(.35, .7), 4), MAT.leaf2);
    gr.position.set(rnd(-24, 24), .25, rnd(-16, 20));
    gr.rotation.set(rnd(-.2, .2), 0, rnd(-.25, .25));
    gr.userData.ph = rnd(0, 6.28);
    scene.add(gr); swayTufts.push(gr);
  }
  // batu-batu jalan
  for (let i = 0; i < 12; i++) {
    const r = new THREE.Mesh(new THREE.DodecahedronGeometry(rnd(.12, .3), 0), MAT.stone);
    r.position.set(-7 + rnd(-2.2, 2.2), .1, rnd(6, 24));
    r.rotation.set(rnd(0, 3), rnd(0, 3), rnd(0, 3));
    r.castShadow = true; scene.add(r);
  }

  /* ---- jalan batu tengah menuju rumah + damar simetris ---- */
  const path = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 26),
    new THREE.MeshStandardMaterial({ map: canvasTex(128, 256, (x, W, H) => {
      x.fillStyle = "#2b2a27"; x.fillRect(0, 0, W, H);
      for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${95 + rnd(-20, 30)|0},${92 + rnd(-20, 28)|0},${86 + rnd(-18, 24)|0},${rnd(.15, .5)})`; x.fillRect(Math.random() * W, Math.random() * H, rnd(1, 3), rnd(1, 3)); }
      x.strokeStyle = "rgba(15,15,15,.65)"; x.lineWidth = 2;
      for (let r = 0; r <= 12; r++) { x.beginPath(); x.moveTo(0, r * H / 12); x.lineTo(W, r * H / 12); x.stroke(); }
      x.beginPath(); x.moveTo(W / 2, 0); x.lineTo(W / 2, H); x.stroke();
    }, [1, 3]), roughness: 1 }));
  path.rotation.x = -Math.PI / 2; path.position.set(0, .05, 13);
  path.receiveShadow = true; scene.add(path);

  const flames = [], damarLights = [], damarGlows = [], torchSparks = [];
  /* Obor bambu asli: ruas bambu + lilitan tali + mangkuk minyak + api 3 lapis */
  function damar(x, z, withLight) {
    const g = new THREE.Group();
    const bambooMat = new THREE.MeshStandardMaterial({ color: 0x9a7a4a, roughness: .8 });
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x4a3420, roughness: 1 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(.36, .44, .34, 12), MAT.stone);
    base.position.y = .17; base.castShadow = true; g.add(base);
    // tiang bambu 3 ruas dengan buku (node) menonjol
    let py = .34;
    [.13, .115, .10].forEach((r, i) => {
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(r - .01, r, .85, 9), bambooMat);
      seg.position.y = py + .425; seg.castShadow = true; g.add(seg);
      const node = new THREE.Mesh(new THREE.TorusGeometry(r, .028, 6, 12), ropeMat);
      node.rotation.x = Math.PI / 2; node.position.y = py + .85; g.add(node);
      py += .85;
    });
    // lilitan tali ijuk di leher obor
    for (let i = 0; i < 3; i++) {
      const wrap = new THREE.Mesh(new THREE.TorusGeometry(.105, .03, 6, 12), ropeMat);
      wrap.rotation.x = Math.PI / 2; wrap.position.y = py - .15 + i * .09; g.add(wrap);
    }
    // mangkuk minyak tanah liat + permukaan minyak menyala
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.42, .16, .26, 14),
      new THREE.MeshStandardMaterial({ color: 0x6b3a22, roughness: .9 }));
    bowl.position.y = py + .2; bowl.castShadow = true; g.add(bowl);
    const oil = new THREE.Mesh(new THREE.CircleGeometry(.34, 14),
      new THREE.MeshBasicMaterial({ color: 0xff9a30, fog: false }));
    oil.rotation.x = -Math.PI / 2; oil.position.y = py + .32; g.add(oil);
    // sumbu kain
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(.05, .07, .22, 7), ropeMat);
    wick.position.y = py + .4; g.add(wick);
    // api 3 lapis: mantel oranye + lidah kuning + inti putih
    const fy = py + .55;
    const outer = new THREE.Mesh(new THREE.ConeGeometry(.17, .66, 9),
      new THREE.MeshBasicMaterial({ color: 0xe14a12, transparent: true, opacity: .85, fog: false }));
    outer.position.y = fy; g.add(outer); flames.push(outer);
    const mid = new THREE.Mesh(new THREE.ConeGeometry(.105, .44, 8),
      new THREE.MeshBasicMaterial({ color: 0xffb43a, transparent: true, opacity: .95, fog: false }));
    mid.position.y = fy - .02; g.add(mid); flames.push(mid);
    const core = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xfff6d8, fog: false }));
    core.position.y = fy - .16; g.add(core); flames.push(core);
    const gl = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: 0xff9440, transparent: true, opacity: .62, depthWrite: false,
    }));
    gl.scale.set(4.4, 4.4, 1); gl.position.y = fy; g.add(gl); damarGlows.push(gl);
    // bara beterbangan
    for (let i = 0; i < 4; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, color: 0xffc06a, transparent: true, opacity: 0,
        depthWrite: false, blending: THREE.AdditiveBlending,
      }));
      sp.scale.set(.14, .14, 1);
      sp.userData = { bx: x, bz: z, y0: fy, ph: rnd(0, 1), sp: rnd(.25, .5) };
      scene.add(sp); torchSparks.push(sp);
    }
    if (withLight) {
      const lt = new THREE.PointLight(0xff8a3a, 40, 26, 2);
      lt.position.y = fy + .1; g.add(lt); damarLights.push(lt);
    }
    g.position.set(x, 0, z); scene.add(g);
  }
  // 3 pasang obor simetris mengapit jalan tengah
  [-2.9, 2.9].forEach(x => {
    damar(x, 21, true); damar(x, 14.5, false); damar(x, 8, true);
  });

  /* (umbul marawa dicabut atas permintaan — jalan dibiarkan bersih) */

  /* ---- kunang-kunang realistis: sprite individual berkedip ---- */
  const fireflies = [];
  for (let i = 0; i < 55; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: new THREE.Color().setHSL(rnd(.1, .16), .95, rnd(.6, .75)),
      transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    const sc = rnd(.18, .42);
    s.scale.set(sc, sc, 1);
    s.userData = {
      base: new THREE.Vector3(rnd(-22, 22), rnd(.6, 8.5), rnd(-18, 20)),
      ph: rnd(0, Math.PI * 2), blinkSpeed: rnd(1.2, 3.2), blinkSharp: rnd(2.5, 6),
      drift: rnd(.3, 1.1), amp: new THREE.Vector3(rnd(.5, 1.8), rnd(.3, 1), rnd(.5, 1.8)),
    };
    s.position.copy(s.userData.base);
    scene.add(s); fireflies.push(s);
  }

  /* ---- kabut berlapis ---- */
  const mists = [];
  for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(rnd(26, 46), rnd(7, 13)),
      new THREE.MeshBasicMaterial({ map: mistTex, transparent: true, opacity: rnd(.1, .22), depthWrite: false }));
    m.position.set(rnd(-28, 28), rnd(1, 5.5), rnd(-36, -6));
    m.renderOrder = 5; m.userData.speed = rnd(.12, .4);
    scene.add(m); mists.push(m);
  }

  /* ---- kamera sinematik ---- */
  const lookBase = new THREE.Vector3(0, 5.5, 0);
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  const mouse = { x: 0, y: 0 }, sm = { x: 0, y: 0 };
  let scrollP = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function onResize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, pixelRatioCap()));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    const nextShadowMapSize = shadowMapSize();
    if (moonLight.shadow.mapSize.width !== nextShadowMapSize) {
      moonLight.shadow.map?.dispose();
      moonLight.shadow.map = null;
      moonLight.shadow.mapSize.set(nextShadowMapSize, nextShadowMapSize);
    }
  }
  onResize();

  const clock = new THREE.Clock();
  let raf = 0, t = 0;
  let readyNotified = false;
  function frame() {
    const dt = Math.min(clock.getDelta(), .05);
    t += reduce ? 0 : dt;
    sm.x += (mouse.x - sm.x) * .04; sm.y += (mouse.y - sm.y) * .04;
    // framing responsif: layar tegak (HP) mundur otomatis agar rumah tetap utuh di tengah
    const fit = Math.min(1.9, Math.max(1, 1.2 / (camera.aspect || 1)));
    camPos.set(
      0,
      (4.2 + scrollP * 2.4 + sm.y * -.9) * fit,
      (19 - scrollP * 8) * fit
    );
    camera.position.lerp(camPos, .06);
    camLook.set(lookBase.x, lookBase.y + scrollP * 2.0 + sm.y * -1.1, 0);
    camera.lookAt(camLook);

    // kunang: melayang + kedip tak sinkron (seperti asli: nyala-redup-nyala)
    for (const f of fireflies) {
      const u = f.userData;
      f.position.set(
        u.base.x + Math.sin(t * u.drift * .5 + u.ph) * u.amp.x + Math.sin(t * 1.7 + u.ph * 2) * .15,
        u.base.y + Math.sin(t * u.drift * .8 + u.ph * 1.7) * u.amp.y,
        u.base.z + Math.cos(t * u.drift * .4 + u.ph) * u.amp.z
      );
      const blink = Math.pow(Math.max(0, Math.sin(t * u.blinkSpeed + u.ph)), u.blinkSharp);
      f.material.opacity = blink * .95;
      const puls = 1 + blink * .6;
      const base = f.scale.x / puls; // jaga proporsi
      f.scale.set(base * puls, base * puls, 1);
    }

    mists.forEach((m, i) => {
      m.position.x += m.userData.speed * dt;
      if (m.position.x > 32) m.position.x = -32;
      m.lookAt(camera.position.x, m.position.y, camera.position.z);
      m.material.opacity = .1 + Math.sin(t * .3 + i * 1.9) * .05;
    });
    palms.forEach((p, i) => {
      p.rotation.z = Math.sin(t * .9 + p.userData.swayPhase + i) * .022;
      p.rotation.x = Math.cos(t * .7 + p.userData.swayPhase) * .015;
    });
    swayTufts.forEach(g => { g.rotation.z = Math.sin(t * 1.6 + g.userData.ph) * .12; });
    flames.forEach((f, i) => {
      const s = 1 + Math.sin(t * 11 + i * 2.4) * .16 + Math.sin(t * 27 + i * 1.3) * .08;
      f.scale.set(s, 2 - s, s);
      f.position.x += Math.sin(t * 13 + i) * .0015;
    });
    damarLights.forEach((l, i) => { l.intensity = 40 + Math.sin(t * 9 + i * 3) * 6 + Math.sin(t * 23 + i) * 3; });
    torchSparks.forEach(sp => {
      const u = sp.userData;
      const k = (t * u.sp + u.ph) % 1; // bara naik lalu padam
      sp.position.set(
        u.bx + Math.sin(t * 3 + u.ph * 9) * .25 * k,
        u.y0 + k * 2.0,
        u.bz + Math.cos(t * 2.4 + u.ph * 7) * .25 * k
      );
      sp.material.opacity = (1 - k) * .9;
    });
    damarGlows.forEach((g2, i) => { g2.material.opacity = .5 + Math.sin(t * 8 + i * 2) * .1; });
    halo.material.opacity = .44 + Math.sin(t * .6) * .05;
    fall.material.opacity = .22 + Math.sin(t * 2.2) * .06;

    renderer.render(scene, camera);
    if (modelReady && !readyNotified) {
      readyNotified = true;
      onReady?.();
    }
    raf = requestAnimationFrame(frame);
  }
  frame();

  function dispose() {
    cancelAnimationFrame(raf);
    removeEventListener("resize", onResize);
    scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
        for (const k in m) if (m[k] && m[k].isTexture) m[k].dispose();
        m.dispose();
      });
    });
    renderer.dispose();
  }
  return {
    setScroll(p) { scrollP = Math.max(0, Math.min(1, p)); },
    setMouse(x, y) { mouse.x = x; mouse.y = y; },
    onResize, dispose,
  };
}
