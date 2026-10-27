import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { buildRanahScene } from "./minang/scene.js";
import { STR } from "./minang/dict.js";
import "./minang/styles.css";

function Mark() {
  // Siluet gonjong rangkiang: 3 puncak runcing + songket merah — nuansa Minang
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M4 30 C8 22 10 14 11 5 C13 14 16 22 20 27 C23 20 25 12 26 4 C27 12 29 20 32 27 C36 22 39 14 41 5 C42 14 44 22 44 30 Z" fill="#2a2118" stroke="#C9A227" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 33 H38" stroke="#B91C1C" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M14 37 H34" stroke="#C9A227" strokeWidth="1.4" strokeDasharray="3 2" strokeLinecap="round" />
      <circle cx="26" cy="12" r="2.2" fill="#C9A227" />
    </svg>
  );
}

export function Scene() {
  const canvasRef = useRef(null);
  const [loaderHost] = useState(() => document.getElementById("boot-loader-content"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [sceneLoading, setSceneLoading] = useState(true);
  const [sceneError, setSceneError] = useState(false);
  const [sceneProgress, setSceneProgress] = useState(null);
  const [routeStart, setRouteStart] = useState("bukittinggi");
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("ranah-lang") || "id"; } catch { return "id"; }
  });
  const t = (k, id) => (lang === "id" ? id : (STR[lang] && STR[lang][k]) || id);
  const pick = (l) => { setLang(l); try { localStorage.setItem("ranah-lang", l); } catch { /* abaikan */ } };
  useLayoutEffect(() => {
    document.getElementById("boot-loader-initial")?.remove();
  }, []);

  const navigateToSection = (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    setMenuOpen(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const header = document.querySelector(".nav");
        const top = target.getBoundingClientRect().top + window.scrollY - (header?.getBoundingClientRect().height || 0) + 4;
        window.scrollTo({ top, behavior: "smooth" });
        window.history.replaceState(null, "", link.getAttribute("href"));
      });
    });
  };

  useEffect(() => {
    const loader = document.getElementById("boot-loader");
    loader?.classList.toggle("done", !sceneLoading && !sceneError);
  }, [sceneLoading, sceneError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let api;
    try {
      api = buildRanahScene(canvas, {
        onProgress: (progress) => setSceneProgress(progress),
        onReady: () => {
          setSceneProgress(100);
          setSceneLoading(false);
        },
        onError: (error) => {
          console.error("Ranah 3D assets could not be loaded.", error);
          setSceneLoading(false);
          setSceneError(true);
        },
      });
    } catch (error) {
      console.error("Ranah 3D scene could not be initialized.", error);
      setSceneLoading(false);
      setSceneError(true);
      return;
    }
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      api.setScroll(max > 0 ? scrollY / max : 0);
    };
    const onMouse = (e) => {
      api.setMouse(0, (e.clientY / innerHeight) * 2 - 1);
    };
    const onResize = () => api.onResize();
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("mousemove", onMouse, { passive: true });
    addEventListener("resize", onResize);
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); }
    }), { threshold: .12 });
    document.querySelectorAll("[data-rv]").forEach((el) => io.observe(el));
    document.querySelector(".ranah")?.classList.add("motion-ready");
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("mousemove", onMouse);
      removeEventListener("resize", onResize);
      io.disconnect(); api.dispose();
    };
  }, []);

  return (
    <>
    {loaderHost && createPortal(
      <div className="pre-in">
        <Mark />
        {sceneError ? (
          <>
            <p className="pre-jawi">Tampilan 3D belum tersedia</p>
            <p className="pre-copy">Panduan tetap bisa digunakan tanpa latar 3D.</p>
            <button className="pre-continue" onClick={() => setSceneError(false)}>
              Lanjutkan tanpa 3D
            </button>
          </>
        ) : (
          <>
            <p className="pre-jawi">Menyiapkan Rumah Gadang</p>
            <p className="pre-copy">Memuat rumah gadang dan lanskap Minangkabau.</p>
            <div className="pre-bar" role="progressbar" aria-label="Memuat tampilan 3D"
              aria-valuemin={0} aria-valuemax={100}
              aria-valuenow={sceneProgress === null ? undefined : sceneProgress}
              data-indeterminate={sceneProgress === null}>
              <i style={sceneProgress === null ? undefined : { transform: `scaleX(${sceneProgress / 100})` }} />
            </div>
            <div className="pre-meta">
              <span>{sceneProgress === null ? "Menyiapkan perjalanan" : sceneProgress >= 92 ? "Menyempurnakan tampilan" : "Memuat aset 3D"}</span>
              <b>{sceneProgress === null ? "" : `${sceneProgress}%`}</b>
            </div>
          </>
        )}
      </div>,
      loaderHost
    )}
    <div className="ranah" aria-busy={sceneLoading}>
      <canvas id="gl" ref={canvasRef} aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <a className="skip-link" href="#gadang">{t("skipContent", "Lewati ke konten")}</a>
      <header className={"nav" + (menuOpen ? " open" : "")} onClick={navigateToSection}>
        <a className="brand" href="#top"><Mark />
          <span className="brand-tx"><b>RANAH</b><i>RANAH MINANGKABAU</i></span></a>
        <nav className="nav-links" id="primary-navigation">
          <a href="#gadang">{t("nav1", "Rumah gadang")}</a>
          <a href="#ngarai">{t("nav2", "Lanskap")}</a>
          <a href="#adaik">{t("nav3", "Tradisi")}</a>
          <a href="#senja">{t("nav4", "Rute")}</a>
        </nav>
        <div className="nav-actions">
          <div className="lang" role="group" aria-label="Bahasa">
            {(["id", "min", "en"]).map((l) => (
              <button key={l} onClick={() => pick(l)} className={lang === l ? "on" : ""} aria-pressed={lang === l}>
                {l === "min" ? "MIN" : l.toUpperCase()}
              </button>
            ))}
          </div>
          <a className="nav-plan" href="#senja">{t("navAction", "Susun rute")}</a>
        </div>
        <button className="nav-burger" aria-label={menuOpen ? "Tutup menu" : "Buka menu"} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(!menuOpen)}><i /><i /></button>
      </header>

      <div className="page" id="top">
        <section className="hero">
          <div className="hero-top" data-rv>
            <h1 className="display h-hero">
              <span>{t("heroL1", "Ranah")}</span>
              <span>{t("heroL2", "Minangkabau")}</span>
            </h1>
            <p className="hero-sub body-sm">{t("heroSub", "Panduan perjalanan interaktif untuk melihat rumah gadang, lanskap, dan tradisi Minangkabau di Sumatera Barat.")}</p>
          </div>
          <div className="hero-foot" data-rv>
            <div className="chips">
              {[
                ["c1b", "Rumah gadang", "c1p", "Arsitektur Minangkabau.", "#gadang"],
                ["c2b", "Lanskap", "c2p", "Ngarai, sawah, dan danau.", "#ngarai"],
                ["c3b", "Tradisi", "c3p", "Tari, tenun, dan kuliner.", "#adaik"],
                ["c4b", "Rute", "c4p", "Contoh perjalanan tiga hari.", "#senja"],
              ].map(([bk, bd, pk, pd, href]) => (
                <a className="chip" key={bk} href={href}>
                  <span><b>{t(bk, bd)}</b><p>{t(pk, pd)}</p></span></a>
              ))}
            </div>
          </div>
        </section>

        <section className="sec" id="gadang">
          <div className="section-intro" data-rv>
            <h2 className="display h-sec">{t("gTitle", "Rumah yang bercerita")}</h2>
            <p>{t("gLead", "Istano Basa Pagaruyung di Tanah Datar menafsirkan bentuk rumah gadang lewat gonjong menjulang dan ukiran pada fasadnya.")}</p>
          </div>
          <div className="place-feature" data-rv>
            <img src="/img/gadang.jpg" alt="Rumah gadang dengan atap gonjong di Sumatera Barat" loading="lazy" />
            <div className="grid2">
              <p className="lead">{t("gBody", "Bentuk atapnya terangkat seperti tanduk kerbau. Perhatikan pertemuan garis atap, susunan ruang, dan ragam ukiran saat berkunjung.")}</p>
              <p className="body-sm">{t("gVisit", "Datang pada pagi atau menjelang sore untuk menikmati suasana dengan lebih leluasa.")}</p>
            </div>
          </div>
        </section>

        <section className="sec" id="ngarai">
          <div className="section-intro" data-rv>
            <h2 className="display h-sec">{t("kTitle", "Ngarai dan danau")}</h2>
            <p>{t("kBody", "Dari dinding Ngarai Sianok hingga kaldera Danau Maninjau, perjalanan darat memperlihatkan wajah Sumatera Barat yang beragam.")}</p>
          </div>
          <div className="cards">
            {[
              ["ngarai", "k1", "Ngarai Sianok", "/img/ngarai.jpg", "Ngarai Sianok dengan tebing hijau di Bukittinggi"],
              ["damar", "k2", "Pelita damar", "/img/damar.jpg", "Pelita damar menyala di halaman rumah"],
              ["maninjau", "k3", "Danau Maninjau", "/img/maninjau.jpg", "Pemandangan Danau Maninjau dari ketinggian"],
            ].map(([art, bk, bd, image, alt]) => (
              <article className="card" key={bk} data-rv>
                <img className={"card-art " + art} src={image} alt={alt} loading="lazy" />
                <div className="card-meta"><h3>{t(bk, bd)}</h3></div>
              </article>
            ))}
          </div>
          <div className="gallery-intro" data-rv>
            <h2 className="display h-sec">{t("galTitle", "Rasa dan rupa Minang")}</h2>
            <p>{t("galSub", "Lihat lebih dekat beberapa ikon budaya dan keseharian Sumatera Barat.")}</p>
          </div>
          <div className="gal" data-rv>
            {[
              ["g1", "Jam Gadang", "g1s", "Bukittinggi", "/img/jamgadang.jpg", "Jam Gadang di pusat Kota Bukittinggi"],
              ["g2", "Tari Piring", "g2s", "Tari tradisional", "/img/taripiring.jpg", "Penari membawakan Tari Piring"],
              ["g3", "Rendang", "g3s", "Masakan Minangkabau", "/img/rendang.jpg", "Rendang disajikan di atas piring"],
              ["g4", "Songket", "g4s", "Pandai Sikek", "/img/songket.jpg", "Kain songket dengan motif tenun"],
            ].map(([bk, bd, sk, sd, image, alt]) => (
              <figure className="gal-item" key={bk}>
                <img src={image} alt={alt} loading="lazy" />
                <figcaption><b>{t(bk, bd)}</b><i>{t(sk, sd)}</i></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="sec" id="adaik">
          <div className="section-intro" data-rv>
            <h2 className="display h-sec">{t("lTitle", "Tradisi yang terus dijalani")}</h2>
            <p>{t("lBody", "Kenali budaya Minangkabau melalui seni pertunjukan, kuliner, kerajinan, dan kehidupan sehari-hari.")}</p>
          </div>
          <div className="rows">
            {[
              ["l1", "Tari Piring", "l1p", "Tarian dengan piring yang dijaga seimbang di ujung jari."],
              ["l2", "Rendang", "l2p", "Masakan berbumbu yang dimasak perlahan hingga kaya rasa."],
              ["l3", "Songket Pandai Sikek", "l3p", "Kain tenun berhias benang emas dari nagari Pandai Sikek."],
              ["l4", "Pacu Jawi", "l4p", "Tradisi pacuan sapi yang berlangsung di sawah berlumpur."],
            ].map(([hk, hd, pk, pd]) => (
              <article className="row" key={hk} data-rv>
                <h3>{t(hk, hd)}</h3><p>{t(pk, pd)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sec" id="senja">
          <div className="route-planner" data-rv>
            <div className="route-copy">
              <h2 className="display h-sec">{t("eTitle", "Rute tiga hari")}</h2>
              <p className="lead">{t("eBody", "Pilih kota awal untuk melihat contoh susunan perjalanan. Sesuaikan jarak dan waktu singgah dengan kondisi di lapangan.")}</p>
              <div className="route-tabs" role="group" aria-label={t("routeLabel", "Pilih kota awal")}>
                <button type="button" className={routeStart === "bukittinggi" ? "active" : ""} aria-pressed={routeStart === "bukittinggi"} onClick={() => setRouteStart("bukittinggi")}>{t("routeBukittinggi", "Mulai dari Bukittinggi")}</button>
                <button type="button" className={routeStart === "batusangkar" ? "active" : ""} aria-pressed={routeStart === "batusangkar"} onClick={() => setRouteStart("batusangkar")}>{t("routeBatusangkar", "Mulai dari Batusangkar")}</button>
              </div>
            </div>
            <ol className="route-days" aria-live="polite">
              {(routeStart === "bukittinggi"
                ? [
                    ["routeDay1", "Hari pertama", "Bukittinggi", "routeDay1Text", "Kunjungi Jam Gadang dan jelajahi pusat kota."],
                    ["routeDay2", "Hari kedua", "Ngarai Sianok dan Danau Maninjau", "routeDay2Text", "Nikmati lanskap lembah, lalu lanjutkan perjalanan menuju danau."],
                    ["routeDay3", "Hari ketiga", "Batusangkar dan Istano Pagaruyung", "routeDay3Text", "Kenali arsitektur rumah gadang di Tanah Datar."],
                  ]
                : [
                    ["routeDay1", "Hari pertama", "Batusangkar dan Istano Pagaruyung", "routeDay3Text", "Kenali arsitektur rumah gadang di Tanah Datar."],
                    ["routeDay2", "Hari kedua", "Bukittinggi dan Ngarai Sianok", "routeDay2AltText", "Jelajahi pusat kota dan lanskap lembah."],
                    ["routeDay3", "Hari ketiga", "Danau Maninjau", "routeDay3Text", "Akhiri perjalanan dengan menikmati pemandangan danau."],
                  ]).map(([dayKey, day, place, textKey, description]) => (
                <li key={dayKey + place}>
                  <span>{t(dayKey, day)}</span>
                  <div><h3>{place}</h3><p>{t(textKey, description)}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <footer className="foot">
          <div className="foot-grid">
            <div className="foot-brand"><Mark />
              <p>{t("fBody", "Panduan untuk mengenal tempat, tradisi, dan rasa di Sumatera Barat.")}</p></div>
            <div><h4>{t("fChapters", "Jelajahi")}</h4><ul>
              <li><a href="#gadang">{t("f1", "Gonjong")}</a></li>
              <li><a href="#ngarai">{t("f2", "Ngarai & Sawah")}</a></li>
              <li><a href="#adaik">{t("f3", "Adaik & Karajo")}</a></li>
              <li><a href="#senja">{t("f4", "Rute perjalanan")}</a></li></ul></div>
          </div>
          <div className="foot-wordmark" aria-hidden="true">RANAH</div>
          <div className="foot-base">
            <span>{t("fBase1", "© 2026 RANAH · Sumatera Barat")}</span>
            <span>{t("fBase2", "Adat basandi syara', syara' basandi Kitabullah")}</span>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
}
