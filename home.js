// 官网首页的动效：入场、滚动显现、产品窗口的演示分镜、卡片跟随光。
// 内容在没有脚本时也完整可见（首屏窗口直接停在最终画面）；系统开了「减弱动态效果」时不放任何动画。
(() => {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add("ready")));
  setTimeout(() => root.classList.add("ready"), 1500);

  // 顶栏：离开顶部后显出分隔线
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // 滚动显现
  const reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -12% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  // 最新版本号：问 GitHub 发布仓库的最新一版，查到才显示（国内访问 GitHub 常常很慢，超时就算了）。
  const version = document.querySelector("[data-version]");
  if (version && "AbortController" in window) {
    const abort = new AbortController();
    setTimeout(() => abort.abort(), 6000);
    fetch("https://api.github.com/repos/oktiger/openbeast-releases/releases/latest", { signal: abort.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((release) => {
        const tag = release && typeof release.tag_name === "string" ? release.tag_name.replace(/^v/, "") : "";
        if (!/^\d+\.\d+\.\d+/.test(tag)) return;
        version.querySelector("b").textContent = tag;
        version.hidden = false;
      })
      .catch(() => {});
  }

  // 卡片：光斑跟着指针走（只在有精确指针的设备上）
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        card.style.setProperty("--my", `${event.clientY - rect.top}px`);
      });
    });
  }

  const demo = document.getElementById("demo");
  if (!demo || reduced) return;

  // 产品窗口：进入视野时从后仰转正
  let ticking = false;
  const tilt = () => {
    ticking = false;
    const rect = demo.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(Math.max((vh - rect.top) / (vh * 0.75), 0), 1);
    demo.style.setProperty("--tilt", `${(1 - progress) * 14}deg`);
  };
  tilt();
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(tilt); } }, { passive: true });
  window.addEventListener("resize", tilt, { passive: true });

  // 演示分镜：打字 → 发送 → AI 一步步做 → 侧栏出现「记账」→ 停一会儿 → 重来
  const field = demo.querySelector(".field");
  const send = demo.querySelector(".send");
  const ask = demo.querySelector('[data-beat="ask"]');
  const beat = (name) => demo.querySelector(`[data-beat="${name}"]`);
  const text = ask.textContent.trim();
  const steps = ["s1", "s2", "s3"].map(beat);
  const all = demo.querySelectorAll("[data-beat]");

  let visible = false;
  let run = 0;
  const wait = (ms, id) => new Promise((resolve, reject) => setTimeout(() => (id === run ? resolve() : reject()), ms));
  const waitVisible = (id) => new Promise((resolve, reject) => {
    const check = () => (id !== run ? reject() : visible ? resolve() : setTimeout(check, 300));
    check();
  });

  const reset = () => {
    all.forEach((el) => el.classList.remove("is-shown", "is-flash"));
    steps.forEach((el) => el.classList.remove("is-running"));
    field.textContent = "";
    field.classList.remove("is-typing");
    send.classList.remove("is-armed", "is-pressed");
  };

  const play = async (id) => {
    for (;;) {
      await waitVisible(id);
      reset();
      await wait(900, id);
      field.classList.add("is-typing");
      for (let i = 1; i <= text.length; i++) {
        field.textContent = text.slice(0, i);
        if (i === 1) send.classList.add("is-armed");
        await wait(60 + Math.random() * 70, id);
      }
      await wait(450, id);
      send.classList.add("is-pressed");
      await wait(160, id);
      field.textContent = "";
      field.classList.remove("is-typing");
      send.classList.remove("is-armed", "is-pressed");
      ask.classList.add("is-shown");
      await wait(800, id);
      beat("reply").classList.add("is-shown");
      for (const step of steps) {
        await wait(350, id);
        step.classList.add("is-shown", "is-running");
        await wait(1100, id);
        step.classList.remove("is-running");
      }
      await wait(500, id);
      beat("done").classList.add("is-shown");
      await wait(400, id);
      const item = beat("new");
      item.classList.add("is-shown", "is-flash");
      await wait(1800, id);
      item.classList.remove("is-flash");
      await wait(4200, id);
    }
  };

  demo.classList.remove("is-final");
  const start = () => { run += 1; play(run).catch(() => {}); };
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.35 }).observe(demo);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
  start();
})();
