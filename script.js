const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); } });
  }, { threshold:0.12 });
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

/* ---------- MOBILE NAV TOGGLE ---------- */
  (function(){
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');
    if (toggle && nav){
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > 760){
          nav.classList.remove('open');
          toggle.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  })();

/* ---------- THEME TOGGLE (dark / light) ---------- */
  (function(){
    const root = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light') root.setAttribute('data-theme', 'light');
    btn.addEventListener('click', function(){
      const isLight = root.getAttribute('data-theme') === 'light';
      if (isLight){
        root.removeAttribute('data-theme');
        localStorage.setItem('portfolio-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('portfolio-theme', 'light');
      }
    });
  })();

/* ---------- ANIMATED CLOUD / DEVOPS NETWORK BACKGROUND ---------- */
  (function(){
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    const glowLayer = document.getElementById('bg-glow-layer');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w, h, dpr, nodes = [];

    function themeVar(name){
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    }

    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    }

    function initNodes(){
      const count = Math.min(140, Math.round((w * h) / 14000));
      nodes = [];
      for (let i = 0; i < count; i++){
        const baseX = Math.random() * w;
        const baseY = Math.random() * h;
        nodes.push({
          baseX, baseY,
          x: baseX, y: baseY,
          r: Math.random() * 1.8 + 1.3,
          phase: Math.random() * Math.PI * 2,
          twinklePhase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.35,
          drift: Math.random() * 26 + 14
        });
      }
    }

    function draw(t){
      ctx.clearRect(0, 0, w, h);
      const nodeColor = themeVar('--node-color') || '231,236,244';
      const linkColor = themeVar('--link-color') || '62,207,142';

      nodes.forEach(n => {
        n.x = n.baseX + Math.sin(t * 0.00018 * n.speed + n.phase) * n.drift;
        n.y = n.baseY + Math.cos(t * 0.00013 * n.speed + n.phase) * n.drift * 0.6;
      });

      const maxDist = 150;
      for (let i = 0; i < nodes.length; i++){
        for (let j = i + 1; j < nodes.length; j++){
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist){
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = `rgba(${linkColor},${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        const twinkle = 0.55 + 0.45 * Math.sin(t * 0.0016 + n.twinklePhase);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeColor},${(0.55 * twinkle).toFixed(2)})`;
        ctx.shadowColor = `rgba(${nodeColor},0.9)`;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    function loop(t){
      draw(t);
      if (!reduceMotion) requestAnimationFrame(loop);
    }

    const cloudsLayer = document.getElementById('bg-clouds');

    function onScroll(){
      const y = window.scrollY;
      const rotation = y * 0.006;
      canvas.style.transform = `rotate(${rotation}deg) scale(1.06)`;
      glowLayer.style.transform = `translateY(${y * 0.12}px) rotate(${y * 0.01}deg)`;
      cloudsLayer.style.transform = `translateY(${y * 0.05}px)`;
    }

    window.addEventListener('resize', resize);
    resize();
    draw(0);
    if (!reduceMotion){
      requestAnimationFrame(loop);
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  })();

/* ---------- FLOATING CLOUD SILHOUETTES ---------- */
  (function(){
    const layer = document.getElementById('bg-clouds');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const CLOUD_PATH = 'M25,55 C10,55 0,45 0,33 C0,22 8,14 18,13 C21,5 29,0 38,0 C48,0 57,6 60,15 C72,15 82,24 82,35 C82,46 73,55 62,55 Z';

    const layout = [
      { top: '4%',  left: '2%',  size: 380, opacity: 0.40, dur: 46, dir: 'a', delay: 0 },
      { top: '14%', left: '64%', size: 300, opacity: 0.32, dur: 58, dir: 'b', delay: -6 },
      { top: '34%', left: '-6%', size: 420, opacity: 0.28, dur: 64, dir: 'b', delay: -20 },
      { top: '48%', left: '76%', size: 260, opacity: 0.36, dur: 40, dir: 'a', delay: -12 },
      { top: '64%', left: '26%', size: 340, opacity: 0.26, dur: 70, dir: 'a', delay: -30 },
      { top: '80%', left: '58%', size: 280, opacity: 0.34, dur: 52, dir: 'b', delay: -18 },
      { top: '22%', left: '32%', size: 220, opacity: 0.30, dur: 60, dir: 'a', delay: -40 },
      { top: '90%', left: '4%',  size: 300, opacity: 0.30, dur: 48, dir: 'b', delay: -8 }
    ];

    layout.forEach(function(c){
      const el = document.createElement('div');
      el.className = 'cloud-shape';
      el.style.top = c.top;
      el.style.left = c.left;
      el.style.width = c.size + 'px';
      el.style.height = (c.size * 0.67) + 'px';
      el.style.opacity = c.opacity;
      el.style.setProperty('--s', 1);
      if (!reduceMotion){
        el.style.animation = `cloud-drift-${c.dir} ${c.dur}s ease-in-out ${c.delay}s infinite`;
      }
      el.innerHTML = `<svg viewBox="0 0 82 55" fill="currentColor"><path d="${CLOUD_PATH}"/></svg>`;
      layer.appendChild(el);
    });
  })();

/* ---------- SCROLL WORLD: STAR SKY -> CLOUDS -> LAND ---------- */
  (function(){
    const canvas = document.getElementById('bg-canvas');
    const clouds = document.getElementById('bg-clouds');
    const land = document.getElementById('bg-land');

    function smoothstep(a, b, x){
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    }

    function progress(){
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }

    let ticking = false;

    function update(){
      const p = progress();

      // Star sky: full brightness at the top, fades out over the first ~30% of the page
      const starOpacity = 1 - smoothstep(0, 0.3, p);
      canvas.style.opacity = Math.max(0.1, starOpacity).toFixed(2);

      // Clouds: drift in shortly after the top, stay visible, thin out slightly near the ground
      const cloudIn = smoothstep(0.04, 0.3, p);
      const cloudOut = smoothstep(0.82, 1, p);
      clouds.style.opacity = (cloudIn * (1 - cloudOut * 0.3)).toFixed(2);

      // Land: rises into view only near the very end of the scroll
      const landIn = smoothstep(0.66, 0.97, p);
      land.style.opacity = landIn.toFixed(2);
      land.style.transform = `translateY(${(1 - landIn) * 70}px)`;

      ticking = false;
    }

    function onScroll(){
      if (!ticking){
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  })();

  
  /* ---------- WELCOME SCREEN LOGIC ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    // Lock scrolling while the welcome screen is active
    document.body.classList.add('locked');

    const greetings = [
      "Hello", "नमस्ते", "سلام", "કેમ છો", "வணக்கம்", 
      "ನಮಸ್ಕಾರ", "নমস্কার", "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", "स्वागतम्", "آداب"
    ];
    
    const container = document.getElementById("ws-greetings-container");
    const finalGreeting = document.getElementById("ws-final-greeting");
    const intro = document.getElementById("ws-intro");
    const welcomeScreen = document.getElementById("welcome-screen");
    
    // Inject greetings into the DOM
    greetings.forEach(text => {
      const el = document.createElement("div");
      el.className = "ws-greeting";
      el.textContent = text;
      container.appendChild(el);
    });

    const greetingElements = document.querySelectorAll(".ws-greeting");
    let currentIndex = 0;
    
    // ~180ms per language greeting to keep it within the 3 second target
    const rapidGreetingDuration = 180; 

    function cycleGreetings() {
      if (currentIndex > 0) {
        greetingElements[currentIndex - 1].classList.remove("active");
      }
      if (currentIndex < greetingElements.length) {
        greetingElements[currentIndex].classList.add("active");
        currentIndex++;
        setTimeout(cycleGreetings, rapidGreetingDuration);
      } else {
        container.style.display = 'none';
        showFinalGreeting();
      }
    }

    function showFinalGreeting() {
      finalGreeting.classList.add("active");
      // Hold the final dynamic greeting for ~1 second
      setTimeout(() => {
        finalGreeting.style.display = 'none';
        showIntro();
      }, 1000); 
    }

    function showIntro() {
      intro.classList.add("active");
      // Hold the personal intro for 2 seconds, then fade out
      setTimeout(() => {
        welcomeScreen.classList.add("hidden");
        document.body.classList.remove('locked');
      }, 2000); 
    }

    // Start the sequence shortly after load
    setTimeout(cycleGreetings, 200);
  });
