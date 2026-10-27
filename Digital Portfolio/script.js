/* ==========================================================================
   MICHELLE S. AQUINO // TACTICAL DIGITAL PORTFOLIO SCRIPTS
   WebAudio SFX Synth, Canvas Telemetry HUD, Theme Manager & CLI Terminal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------------
     1. TACTICAL WEBAUDIO SFX SYNTHESIZER (NO EXTERNAL AUDIO FILES NEEDED)
     ------------------------------------------------------------------------- */
  class TacticalAudioEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.init();
    }

    init() {
      const saved = localStorage.getItem('aq_sfx_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
      this.updateButtonUI();
    }

    getAudioContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('aq_sfx_enabled', this.enabled);
      this.updateButtonUI();
      if (this.enabled) {
        this.playEquip();
      }
    }

    updateButtonUI() {
      const btn = document.getElementById('sfxToggle');
      if (!btn) return;
      const text = btn.querySelector('.ctrl-text');
      const iconPath = document.getElementById('sfxIconPath');
      if (this.enabled) {
        if (text) text.textContent = 'SFX: ON';
        if (iconPath) {
          iconPath.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
        }
        btn.classList.remove('muted');
      } else {
        if (text) text.textContent = 'SFX: MUTED';
        if (iconPath) {
          iconPath.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z');
        }
        btn.classList.add('muted');
      }
    }

    playClick() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(840, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {
        // AudioContext policy catch
      }
    }

    playHover() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.03);
      } catch (e) {}
    }

    playEquip() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } catch (e) {}
    }

    playSuccess() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.04, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.15);
        });
      } catch (e) {}
    }
  }

  const sfx = new TacticalAudioEngine();

  // Attach SFX listeners
  document.getElementById('sfxToggle')?.addEventListener('click', () => sfx.toggle());

  document.querySelectorAll('[data-sfx]').forEach(el => {
    const type = el.getAttribute('data-sfx');
    if (type === 'hover') {
      el.addEventListener('mouseenter', () => sfx.playHover());
    } else if (type === 'equip') {
      el.addEventListener('click', () => sfx.playEquip());
    } else {
      el.addEventListener('click', () => sfx.playClick());
    }
  });


  /* -------------------------------------------------------------------------
     2. THEME MANAGER (EMBER, BLUEPRINT, CYBER)
     ------------------------------------------------------------------------- */
  const themeBtn = document.getElementById('themeBtn');
  const themeMenu = document.getElementById('themeMenu');
  const themeNameSpan = document.getElementById('themeName');
  const themeOptions = document.querySelectorAll('.theme-opt');

  const themes = ['ember', 'blueprint', 'cyber'];

  function setTheme(newTheme) {
    if (!themes.includes(newTheme)) return;
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('aq_theme', newTheme);
    if (themeNameSpan) themeNameSpan.textContent = newTheme.toUpperCase();

    themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === newTheme);
    });
  }

  const savedTheme = localStorage.getItem('aq_theme') || 'ember';
  setTheme(savedTheme);

  themeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    themeMenu?.classList.toggle('show');
    sfx.playClick();
  });

  themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.dataset.theme;
      setTheme(theme);
      themeMenu?.classList.remove('show');
      sfx.playEquip();
      showToast(`TACTICAL THEME: ${theme.toUpperCase()} DEPLOYED`);
    });
  });

  document.addEventListener('click', (e) => {
    if (!themeBtn?.contains(e.target) && !themeMenu?.contains(e.target)) {
      themeMenu?.classList.remove('show');
    }
  });


  /* -------------------------------------------------------------------------
     3. LIVE ZULU CLOCK & TELEMETRY
     ------------------------------------------------------------------------- */
  const zuluTimeEl = document.getElementById('zuluTime');
  function updateZuluTime() {
    if (!zuluTimeEl) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    zuluTimeEl.textContent = `${utcHours}:${utcMinutes}:${utcSeconds} UTC`;
  }
  updateZuluTime();
  setInterval(updateZuluTime, 1000);


  /* -------------------------------------------------------------------------
     4. TACTICAL CANVAS TELEMETRY (GRID NODES & RADAR EFFECT)
     ------------------------------------------------------------------------- */
  const canvas = document.getElementById('hudCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 28;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        code: `0x${Math.floor(Math.random() * 0xffff).toString(16).toUpperCase()}`
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      const theme = document.body.getAttribute('data-theme') || 'ember';
      let nodeColor = 'rgba(255, 70, 85, 0.4)';
      let lineColor = 'rgba(255, 70, 85, 0.08)';

      if (theme === 'blueprint') {
        nodeColor = 'rgba(0, 210, 255, 0.4)';
        lineColor = 'rgba(0, 210, 255, 0.08)';
      } else if (theme === 'cyber') {
        nodeColor = 'rgba(193, 255, 37, 0.4)';
        lineColor = 'rgba(193, 255, 37, 0.08)';
      }

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles & tactical crosshair nodes
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = nodeColor;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);

        // Subtle crosshair tick
        ctx.strokeStyle = nodeColor;
        ctx.beginPath();
        ctx.moveTo(p.x - 6, p.y);
        ctx.lineTo(p.x + 6, p.y);
        ctx.moveTo(p.x, p.y - 6);
        ctx.lineTo(p.x, p.y + 6);
        ctx.stroke();
      });

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }


  /* -------------------------------------------------------------------------
     5. LOADOUT ARSENAL FILTERING
     ------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.loadout-tab-btn');
  const loadoutCards = document.querySelectorAll('.loadout-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      loadoutCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.3s ease-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* -------------------------------------------------------------------------
     6. MISSION INTEL MODAL SYSTEM
     ------------------------------------------------------------------------- */
  const missionModal = document.getElementById('missionModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalMissionTitle = document.getElementById('modalMissionTitle');
  const modalMissionBody = document.getElementById('modalMissionBody');
  const inspectBtns = document.querySelectorAll('.mission-inspect-btn');

  const missionDossiers = {
    agap: {
      title: 'Automated Grievance Assistance Platform (AGAP) — Capstone Briefing',
      html: `
        <h4>MISSION PROFILE // BRGY. TUMANA DISPUTE MANAGEMENT</h4>
        <p>
          AGAP is a mission-critical web application designed to digitize and automate the procedural justice workflows of <strong>Barangay Tumana, Marikina City</strong>. It streamlines the blotter registration, Katarungang Pambarangay (KP) dispute conciliation, mediation summon dispatch, and case settlement tracking.
        </p>

        <div class="modal-intel-grid">
          <div class="intel-stat"><span class="label">LOCATION</span><span class="val">Brgy. Tumana, Marikina City</span></div>
          <div class="intel-stat"><span class="label">ROLE</span><span class="val">Lead System &amp; Database Designer</span></div>
          <div class="intel-stat"><span class="label">TECH STACK</span><span class="val">MySQL, DrawSQL, Figma, Web Tech</span></div>
          <div class="intel-stat"><span class="label">SCHEMA STATE</span><span class="val">Normalized (3NF) Relational Architecture</span></div>
        </div>

        <h4>ARCHITECTURAL CONTRIBUTIONS:</h4>
        <ul>
          <li><strong>Normalized Database Schemas:</strong> Structured relational tables in MySQL (modeled via DrawSQL) to support multi-party dispute hearings, summon history, case logs, and official amicable settlements without data duplication.</li>
          <li><strong>System Process Modeling:</strong> Drafted Level-0 Context Diagrams, Level-1 Data Flow Diagrams (DFDs), and HIPO charts to bridge administrative municipal staff and citizen walk-ins.</li>
          <li><strong>High-Fidelity Wireframes:</strong> Produced full Figma component design systems, prototyping accessible mobile layouts for residents and high-throughput dashboards for Barangay Captains and Secretaries.</li>
        </ul>

        <h4>OPERATIONAL IMPACT:</h4>
        <p>
          Reduced average case retrieval and mediation schedule conflict rates, establishing a scalable digital archive complying with Philippine Katarungang Pambarangay judicial procedures.
        </p>
      `
    },
    attendance: {
      title: 'Attendance Monitoring System — Desktop & Database Engine',
      html: `
        <h4>MISSION PROFILE // STI COLLEGE MARIKINA ADVANCED DB</h4>
        <p>
          A high-throughput Windows desktop attendance logging system built in <strong>Visual Studio (C#/.NET)</strong> integrated with an enterprise <strong>SQL Server</strong> database back-end.
        </p>

        <div class="modal-intel-grid">
          <div class="intel-stat"><span class="label">ENVIRONMENT</span><span class="val">Visual Studio / Windows Desktop</span></div>
          <div class="intel-stat"><span class="label">ROLE</span><span class="val">Desktop &amp; Database Developer</span></div>
          <div class="intel-stat"><span class="label">CORE ENGINE</span><span class="val">C# / .NET Framework</span></div>
          <div class="intel-stat"><span class="label">DATABASE</span><span class="val">Microsoft SQL Server</span></div>
        </div>

        <h4>ARCHITECTURAL CONTRIBUTIONS:</h4>
        <ul>
          <li><strong>Parameterized SQL Queries &amp; Stored Procedures:</strong> Enforced strict SQL injection immunity and transactional atomicity when logging daily time in / time out records.</li>
          <li><strong>Role-Based Access Control (RBAC):</strong> Separated Administrative privileges (record overrides, schedule management, payroll exports) from standard Employee logging stations.</li>
          <li><strong>Real-Time Timestamp Drift Calculation:</strong> Programmed server-synchronized time delta calculations to monitor tardiness and overtime accurately.</li>
        </ul>

        <h4>OPERATIONAL IMPACT:</h4>
        <p>
          Eliminated manual attendance sheet discrepancies, providing automated CSV/PDF report generation and secure transaction audit trails.
        </p>
      `
    },
    sdo: {
      title: 'SwiftSchedule & BookFlow Marikina — SDO Client Systems',
      html: `
        <h4>MISSION PROFILE // DEPED SCHOOLS DIVISION OFFICE WORK IMMERSION</h4>
        <p>
          During work immersion client operations at the <strong>Schools Division Office (SDO) of Marikina City</strong>, co-developed two client solutions: <strong>SwiftSchedule</strong> (Appointment Booking Management) and <strong>BookFlow</strong> (Library Inventory &amp; Circulation Engine).
        </p>

        <div class="modal-intel-grid">
          <div class="intel-stat"><span class="label">CLIENT</span><span class="val">Schools Division Office – Marikina</span></div>
          <div class="intel-stat"><span class="label">ROLE</span><span class="val">UI Designer, Developer &amp; QA Tester</span></div>
          <div class="intel-stat"><span class="label">DEPLOYMENT</span><span class="val">HTML5, CSS3, JavaScript, PHP</span></div>
          <div class="intel-stat"><span class="label">QA METRIC</span><span class="val">100% Test Case Coverage Passed</span></div>
        </div>

        <h4>ARCHITECTURAL CONTRIBUTIONS:</h4>
        <ul>
          <li><strong>Operational Flowcharting:</strong> Formulated step-by-step logic matrices for teacher/public appointment slots and book catalog borrow/return cycles.</li>
          <li><strong>Frontend Engineering:</strong> Built responsive, semantic HTML5/CSS3 templates for cross-device compatibility across legacy government workstations and mobile devices.</li>
          <li><strong>QA Verification &amp; Software Testing:</strong> Authored test scripts, logged defect matrices, and executed user acceptance testing (UAT) with division office staff.</li>
        </ul>

        <h4>OPERATIONAL IMPACT:</h4>
        <p>
          Prevented lobby congestion by introducing orderly online time-slot allocations and digitized the division's reference book inventory.
        </p>
      `
    }
  };

  inspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const missionId = btn.dataset.missionId;
      const data = missionDossiers[missionId];
      if (data && missionModal) {
        modalMissionTitle.textContent = data.title;
        modalMissionBody.innerHTML = data.html;
        missionModal.classList.add('open');
        missionModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        sfx.playEquip();
      }
    });
  });

  function closeModal() {
    if (missionModal) {
      missionModal.classList.remove('open');
      missionModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      sfx.playClick();
    }
  }

  modalCloseBtn?.addEventListener('click', closeModal);
  modalDismissBtn?.addEventListener('click', closeModal);

  missionModal?.addEventListener('click', (e) => {
    if (e.target === missionModal) {
      closeModal();
    }
  });


  /* -------------------------------------------------------------------------
     7. TACTICAL COMMAND LINE INTERFACE (TERMINAL EASTER EGG)
     ------------------------------------------------------------------------- */
  const terminalBtn = document.getElementById('terminalBtn');
  const terminalDrawer = document.getElementById('terminalDrawer');
  const termCloseDot = document.getElementById('termCloseDot');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');

  function toggleTerminal() {
    const isOpen = terminalDrawer?.classList.contains('open');
    if (isOpen) {
      terminalDrawer?.classList.remove('open');
      terminalDrawer?.setAttribute('aria-hidden', 'true');
    } else {
      terminalDrawer?.classList.add('open');
      terminalDrawer?.setAttribute('aria-hidden', 'false');
      terminalInput?.focus();
      sfx.playEquip();
    }
  }

  terminalBtn?.addEventListener('click', toggleTerminal);
  termCloseDot?.addEventListener('click', toggleTerminal);

  // Keyboard shortcut: Press `~` (backtick) or Escape to toggle
  window.addEventListener('keydown', (e) => {
    if (e.key === '`' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      toggleTerminal();
    } else if (e.key === 'Escape') {
      if (missionModal?.classList.contains('open')) closeModal();
      if (terminalDrawer?.classList.contains('open')) toggleTerminal();
    }
  });

  function addTermLine(text, className = '') {
    if (!terminalOutput) return;
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  terminalInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value.trim();
      terminalInput.value = '';
      if (!val) return;

      addTermLine(`guest@aquino-hud:~$ ${val}`, 'cmd-echo');
      sfx.playClick();

      const parts = val.toLowerCase().split(' ');
      const cmd = parts[0];
      const arg = parts[1];

      switch (cmd) {
        case 'help':
          addTermLine(`
            AVAILABLE DIRECTIVES:<br>
            &nbsp;&nbsp;<b>whoami</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Operator background &amp; credentials<br>
            &nbsp;&nbsp;<b>skills</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Core technical weaponry and databases<br>
            &nbsp;&nbsp;<b>projects</b>&nbsp;&nbsp;&nbsp;&nbsp;- Active deployments (AGAP, AMS, SDO)<br>
            &nbsp;&nbsp;<b>ojt</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Internship requirements &amp; timeline<br>
            &nbsp;&nbsp;<b>contact</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Direct frequencies and comms lines<br>
            &nbsp;&nbsp;<b>theme [opt]</b>&nbsp;- Switch theme (ember, blueprint, cyber)<br>
            &nbsp;&nbsp;<b>clear</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Wipe terminal buffer<br>
            &nbsp;&nbsp;<b>exit</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Close CLI drawer
          `);
          break;

        case 'whoami':
          addTermLine(`OPERATOR: Michelle S. Aquino<br>CAMPUS: STI College – Marikina (BSIT '27)<br>SPECIALTY: Database Management &amp; Systems Analysis<br>STATUS: Combat-Ready for 480-Hour OJT Internship.`);
          break;

        case 'skills':
          addTermLine(`
            [DATABASES] MySQL, Microsoft SQL Server, DrawSQL, Stored Procs, 3NF Normalization<br>
            [SYSTEMS] Figma, DFD Level-0/1, HIPO Charts, Process Flowcharts<br>
            [DEV &amp; QA] C#/.NET, Java, Kotlin, Python, JS, HTML5/CSS3, PHP, Git, Test Scripting
          `);
          break;

        case 'projects':
          addTermLine(`
            1. <b>AGAP (2026)</b>: Brgy. Tumana Grievance Platform (MySQL, DFD, Figma)<br>
            2. <b>AMS (2025)</b>: Attendance Monitoring Desktop System (C#/.NET, SQL Server)<br>
            3. <b>SwiftSchedule &amp; BookFlow (2023)</b>: SDO Marikina Appointment &amp; Library Engine
          `);
          break;

        case 'ojt':
          addTermLine(`TARGET: On-the-Job Training (OJT) Internship<br>REQUIRED HOURS: 480 Hours<br>START DATE: January 2027 / April 2027<br>LOCATION: Marikina City / Metro Manila / Hybrid`);
          break;

        case 'contact':
          addTermLine(`EMAIL: msartilloaquino@gmail.com / aquino.248901@marikina.sti.edu.ph<br>PHONE: 0947-525-0849<br>SECTOR: Marikina City, Philippines`);
          break;

        case 'theme':
          if (themes.includes(arg)) {
            setTheme(arg);
            addTermLine(`HUD Theme updated to: [${arg.toUpperCase()}]`);
            showToast(`THEME SWITCHED TO ${arg.toUpperCase()}`);
          } else {
            addTermLine(`Unknown theme. Choose: ember, blueprint, or cyber.`, 'error');
          }
          break;

        case 'clear':
          terminalOutput.innerHTML = '';
          break;

        case 'exit':
          toggleTerminal();
          break;

        default:
          addTermLine(`Command not recognized: "${cmd}". Type "help" for valid directives.`, 'error');
      }
    }
  });


  /* -------------------------------------------------------------------------
     8. TOAST NOTIFICATION UTILITY
     ------------------------------------------------------------------------- */
  const hudToast = document.getElementById('hudToast');
  let toastTimer = null;

  function showToast(msg) {
    if (!hudToast) return;
    hudToast.textContent = msg;
    hudToast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      hudToast.classList.remove('show');
    }, 2800);
  }


  /* -------------------------------------------------------------------------
     9. CLIPBOARD COPY BUTTONS
     ------------------------------------------------------------------------- */
  document.querySelectorAll('.copy-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.copy;
      if (val) {
        navigator.clipboard.writeText(val).then(() => {
          showToast(`COPIED TO CLIPBOARD: ${val}`);
          sfx.playSuccess();
        }).catch(() => {
          showToast(`COPIED: ${val}`);
        });
      }
    });
  });


  /* -------------------------------------------------------------------------
     10. CONTACT FORM SUBMISSION
     ------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('senderName')?.value.trim();
    const email = document.getElementById('senderEmail')?.value.trim();
    const subject = document.getElementById('msgSubject')?.value.trim();
    const msg = document.getElementById('msgBody')?.value.trim();

    if (!name || !email || !subject || !msg) {
      if (formFeedback) {
        formFeedback.textContent = 'ERROR: All dispatch fields are mandatory.';
        formFeedback.className = 'form-feedback error';
      }
      return;
    }

    // Direct mailto fallback construction so email client opens if desired
    const mailtoUrl = `mailto:msartilloaquino@gmail.com?subject=${encodeURIComponent(`[PORTFOLIO CONTACT] ${subject}`)}&body=${encodeURIComponent(`Sender: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`)}`;

    if (formFeedback) {
      formFeedback.innerHTML = `✓ DISPATCH TRANSMITTED // Launching secure mail client...`;
      formFeedback.className = 'form-feedback success';
    }

    sfx.playSuccess();
    showToast('PACKET TRANSMITTED SUCCESSFULLY');

    setTimeout(() => {
      window.location.href = mailtoUrl;
      contactForm.reset();
    }, 800);
  });


  /* -------------------------------------------------------------------------
     11. RESUME EXPORT / PRINT BUTTON
     ------------------------------------------------------------------------- */
  document.getElementById('printResumeBtn')?.addEventListener('click', () => {
    sfx.playEquip();
    showToast('PREPARING PRINT DOSSIER...');
    setTimeout(() => {
      window.print();
    }, 400);
  });


  /* -------------------------------------------------------------------------
     12. MOBILE NAVIGATION DRAWER
     ------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const hudNav = document.getElementById('hudNav');

  mobileToggle?.addEventListener('click', () => {
    hudNav?.classList.toggle('open');
    sfx.playClick();
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hudNav?.classList.remove('open');
    });
  });


  /* -------------------------------------------------------------------------
     13. ACTIVE NAVIGATION LINK ON SCROLL (INTERSECTION OBSERVER)
     ------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

});
