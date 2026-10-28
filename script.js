(() => {
  "use strict";

  // Evita criar o jogo duas vezes na mesma página
  if (document.getElementById("enduro-retro-game")) return;

  const script = document.currentScript;
  const root = document.createElement("section");
  root.id = "enduro-retro-game";

  const css = document.createElement("style");
  css.textContent = `
    #enduro-retro-game {
      width: 100%;
      max-width: 900px;
      margin: 20px auto;
      color: #fff;
      font-family: 'Courier New', monospace;
      box-sizing: border-box;
      user-select: none;
    }
    #enduro-retro-game * { box-sizing: border-box; }
    #enduro-retro-game .er-shell {
      overflow: hidden;
      background: #080b16;
      border: 3px solid #596078;
      border-radius: 10px;
      box-shadow: 0 0 25px #0008;
    }
    #enduro-retro-game .er-header {
      padding: 14px;
      text-align: center;
      background: #171b31;
      border-bottom: 2px solid #454c69;
    }
    #enduro-retro-game .er-title {
      margin: 0;
      color: #ffdb4d;
      font-size: clamp(23px, 5vw, 38px);
      font-weight: 900;
      letter-spacing: 5px;
      text-shadow: 3px 3px #e84949;
    }
    #enduro-retro-game .er-subtitle {
      margin-top: 7px;
      color: #a9c9ff;
      font-size: 11px;
      letter-spacing: 2px;
    }
    #enduro-retro-game .er-hud {
      display: flex;
      justify-content: space-around;
      gap: 8px;
      padding: 12px 8px;
      background: #101426;
      font-size: clamp(11px, 2.5vw, 15px);
      flex-wrap: wrap;
    }
    #enduro-retro-game .er-hud span { color: #ffdb4d; }
    #enduro-retro-game .er-screen {
      position: relative;
      width: 100%;
      background: #111;
      line-height: 0;
    }
    #enduro-retro-game canvas {
      display: block;
      width: 100%;
      height: auto;
      aspect-ratio: 800 / 520;
      image-rendering: pixelated;
      touch-action: none;
    }
    #enduro-retro-game .er-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      padding: 20px;
      text-align: center;
      line-height: 1.5;
      background: #060a16c9;
    }
    #enduro-retro-game .er-overlay[hidden] { display: none; }
    #enduro-retro-game .er-overlay h2 {
      color: #ffdb4d;
      margin: 0;
      font-size: clamp(22px, 5vw, 38px);
      text-shadow: 3px 3px #e84949;
    }
    #enduro-retro-game .er-overlay p {
      max-width: 390px;
      margin: 0;
      font-size: 13px;
      color: #e0e8ff;
    }
    #enduro-retro-game .er-btn {
      border: 2px solid #fff;
      border-radius: 4px;
      padding: 12px 24px;
      background: #ffdb4d;
      color: #111;
      font-family: inherit;
      font-size: 14px;
      font-weight: 900;
      cursor: pointer;
    }
    #enduro-retro-game .er-btn:hover {
      background: #fff;
      transform: translateY(-1px);
    }
    #enduro-retro-game .er-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      padding: 14px;
      background: #171b31;
    }
    #enduro-retro-game .er-pad {
      display: flex;
      gap: 10px;
    }
    #enduro-retro-game .er-control {
      width: 62px;
      height: 48px;
      border: 2px solid #596078;
      border-radius: 7px;
      background: #242b46;
      color: white;
      font-size: 23px;
      cursor: pointer;
      touch-action: none;
    }
    #enduro-retro-game .er-control:active,
    #enduro-retro-game .er-control.er-active {
      background: #ffdb4d;
      color: #111;
    }
    #enduro-retro-game .er-help {
      padding: 12px;
      text-align: center;
      color: #9faaca;
      font-size: 11px;
      line-height: 1.8;
    }
    @media (max-width: 450px) {
      #enduro-retro-game .er-controls { gap: 8px; }
      #enduro-retro-game .er-control {
        width: 52px;
        height: 44px;
      }
    }
  `;

  root.innerHTML = `
    <div class="er-shell">
      <header class="er-header">
        <h1 class="er-title">ENDURO</h1>
        <div class="er-subtitle">RETRO RACING • 8-BIT EDITION</div>
      </header>

      <div class="er-hud">
        <div>PONTOS: <span id="er-score">000000</span></div>
        <div>VELOCIDADE: <span id="er-speed">0</span></div>
        <div>ULTRAPASSAGENS: <span id="er-passes">0</span></div>
      </div>

      <div class="er-screen">
        <canvas id="er-canvas" width="800" height="520"
          aria-label="Jogo de corrida retrô"></canvas>

        <div class="er-overlay" id="er-overlay">
          <h2 id="er-overlay-title">READY?</h2>
          <p id="er-overlay-text">
            Desvie dos carros, acelere e ultrapasse todo mundo!
            Quanto mais tempo você sobreviver, maior será sua pontuação.
          </p>
          <button class="er-btn" id="er-start">INICIAR CORRIDA</button>
          <p>← → ou A/D para virar<br>↑ ou W para acelerar</p>
        </div>
      </div>

      <div class="er-controls">
        <div class="er-pad">
          <button class="er-control" data-key="left"
            aria-label="Virar à esquerda">◀</button>
          <button class="er-control" data-key="right"
            aria-label="Virar à direita">▶</button>
        </div>
        <button class="er-control" data-key="gas"
          aria-label="Acelerar">▲</button>
      </div>

      <div class="er-help">
        TECLADO: ← → / A D para dirigir · ↑ / W para acelerar ·
        P para pausar<br>
        Celular: use os botões acima para controlar o carro.
      </div>
    </div>
  `;

  // O estilo fica isolado do restante da página.
  document.head.appendChild(css);

  // Se o script estiver dentro de uma aba, coloca o jogo nela.
  // Se estiver no head ou em outro local, adiciona ao final da página.
  if (script && script.parentElement &&
      script.parentElement !== document.head &&
      script.parentElement !== document.body) {
    script.insertAdjacentElement("beforebegin", root);
  } else {
    document.body.appendChild(root);
  }

  const canvas = root.querySelector("#er-canvas");
  const ctx = canvas.getContext("2d");
  const overlay = root.querySelector("#er-overlay");
  const overlayTitle = root.querySelector("#er-overlay-title");
  const overlayText = root.querySelector("#er-overlay-text");
  const startButton = root.querySelector("#er-start");

  const scoreEl = root.querySelector("#er-score");
  const speedEl = root.querySelector("#er-speed");
  const passesEl = root.querySelector("#er-passes");

  const W = canvas.width;
  const H = canvas.height;
  const HORIZON = 165;
  const ROAD_BOTTOM = H + 20;

  const keys = {
    left: false,
    right: false,
    gas: false
  };

  let running = false;
  let crashed = false;
  let paused = false;
  let animationId = 0;
  let lastTime = 0;

  let score = 0;
  let passes = 0;
  let speed = 0;
  let playerX = 0;
  let playerY = 0;
  let steering = 0;
  let roadOffset = 0;
  let spawnTimer = 0;
  let traffic = [];
  let particles = [];

  const MAX_SPEED = 260;

  function resetGame() {
    score = 0;
    passes = 0;
    speed = 0;
    playerX = 0;
    playerY = 0;
    steering = 0;
    roadOffset = 0;
    spawnTimer = 0.6;
    traffic = [];
    particles = [];
    crashed = false;
    paused = false;
    keys.left = false;
    keys.right = false;
    keys.gas = false;
    updateHUD();
  }

  function updateHUD() {
    scoreEl.textContent = Math.floor(score)
      .toString().padStart(6, "0");
    speedEl.textContent = Math.floor(speed);
    passesEl.textContent = passes;
  }

  function roadWidthAt(y) {
    const t = Math.max(0, Math.min(1,
      (y - HORIZON) / (ROAD_BOTTOM - HORIZON)));
    return 90 + Math.pow(t, 1.15) * 510;
  }

  function roadCenterAt(y) {
    const t = Math.max(0, Math.min(1,
      (y - HORIZON) / (ROAD_BOTTOM - HORIZON)));
    return W / 2 +
      Math.sin(roadOffset * 0.003 + t * 2.2) * t * 45;
  }

  function drawBackground() {
    // Céu em gradiente
    const sky = ctx.createLinearGradient(0, 0, 0, HORIZON);
    sky.addColorStop(0, "#111a48");
    sky.addColorStop(0.6, "#7d456b");
    sky.addColorStop(1, "#ffad68");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, HORIZON + 1);

    // Sol
    ctx.fillStyle = "#ffdb75";
    ctx.beginPath();
    ctx.arc(400, 110, 38, 0, Math.PI * 2);
    ctx.fill();

    // Montanhas pixeladas
    ctx.fillStyle = "#44375e";
    ctx.beginPath();
    ctx.moveTo(0, HORIZON);
    for (let x = 0; x <= W; x += 35) {
      const y = 80 + Math.sin(x * 0.025) * 28 +
        Math.sin(x * 0.071) * 15;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, HORIZON);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#252c43";
    ctx.beginPath();
    ctx.moveTo(0, HORIZON);
    for (let x = 0; x <= W; x += 28) {
      ctx.lineTo(x, 115 + Math.sin(x * 0.035 + 2) * 25);
    }
    ctx.lineTo(W, HORIZON);
    ctx.closePath();
    ctx.fill();

    // Gramado
    ctx.fillStyle = "#285b38";
    ctx.fillRect(0, HORIZON, W, H - HORIZON);

    // Faixas de grama em movimento
    const stripeH = 18;
    const offset = roadOffset % (stripeH * 2);

    for (let y = HORIZON - stripeH * 2 + offset;
         y < H; y += stripeH * 2) {
      if (y < HORIZON) continue;
      ctx.fillStyle = "#326b3c";
      ctx.fillRect(0, y, W, stripeH);
    }
  }

  function drawRoad() {
    // Desenha a pista em faixas horizontais para criar perspectiva
    for (let y = HORIZON; y < H; y += 3) {
      const center = roadCenterAt(y);
      const width = roadWidthAt(y);
      const left = center - width / 2;
      const t = (y - HORIZON) / (ROAD_BOTTOM - HORIZON);
      const stripe = (Math.floor((y + roadOffset * 0.6) / 20) % 2);

      ctx.fillStyle = stripe ? "#d9d9d9" : "#f3f3f3";
      ctx.fillRect(left - 5 * t, y, width + 10 * t, 3);

      ctx.fillStyle = "#55545d";
      ctx.fillRect(left, y, width, 3);

      // Linhas centrais
      const dash = Math.floor((y + roadOffset) / 35) % 2 === 0;
      if (dash) {
        ctx.fillStyle = "#f4f0d9";
        for (let lane = 1; lane <= 2; lane++) {
          const x = left + width * lane / 3;
          ctx.fillRect(x - 2 * t, y, Math.max(1, 4 * t), 3);
        }
      }
    }
  }

  function drawCar(x, y, width, height, color, isPlayer) {
    const x0 = x - width / 2;
    const y0 = y - height / 2;

    // Rodas
    ctx.fillStyle = "#11131b";
    ctx.fillRect(x0 - width * 0.08, y0 + height * 0.2,
      width * 0.19, height * 0.32);
    ctx.fillRect(x0 + width * 0.89, y0 + height * 0.2,
      width * 0.19, height * 0.32);
    ctx.fillRect(x0 - width * 0.08, y0 + height * 0.68,
      width * 0.19, height * 0.25);
    ctx.fillRect(x0 + width * 0.89, y0 + height * 0.68,
      width * 0.19, height * 0.25);

    // Carroceria
    ctx.fillStyle = color;
    ctx.fillRect(x0 + width * 0.08, y0 + height * 0.08,
      width * 0.84, height * 0.84);

    // Capô
    ctx.fillStyle = isPlayer ? "#ffdb4d" : "#ffffff";
    ctx.fillRect(x0 + width * 0.19, y0 + height * 0.14,
      width * 0.62, height * 0.13);

    // Para-brisa
    ctx.fillStyle = "#18243b";
    ctx.fillRect(x0 + width * 0.22, y0 + height * 0.31,
      width * 0.56, height * 0.22);

    // Reflexo no vidro
    ctx.fillStyle = "#83d5ee";
    ctx.fillRect(x0 + width * 0.28, y0 + height * 0.34,
      width * 0.12, height * 0.13);

    // Faróis
    ctx.fillStyle = isPlayer ? "#fff4ac" : "#ffefb0";
    ctx.fillRect(x0 + width * 0.13, y0 + height * 0.79,
      width * 0.2, height * 0.08);
    ctx.fillRect(x0 + width * 0.67, y0 + height * 0.79,
      width * 0.2, height * 0.08);

    if (isPlayer) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x0 + width * 0.46, y0 + height * 0.18,
        width * 0.08, height * 0.55);
    }
  }

  function spawnTraffic() {
    const lanes = [-1, 0, 1];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];

    const colors = ["#ed4b4b", "#4e9dff", "#e7e7e7",
      "#a96af2", "#ff914d", "#3cdbad"];

    traffic.push({
      lane,
      y: HORIZON + 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      passed: false,
      speedFactor: 0.35 + Math.random() * 0.3
    });
  }

  function updateTraffic(dt) {
    const difficulty = Math.min(1, score / 15000);
    spawnTimer -= dt;

    if (spawnTimer <= 0) {
      spawnTraffic();
      spawnTimer = Math.max(0.48, 1.15 - difficulty * 0.48) +
        Math.random() * 0.35;
    }

    for (const car of traffic) {
      const previousY = car.y;
      car.y += (50 + speed * car.speedFactor) * dt;

      // Conta a ultrapassagem quando o carro passa pelo jogador
      if (!car.passed && previousY < playerY &&
          car.y >= playerY) {
        car.passed = true;
        passes++;
        score += 100;
      }

      // Colisão aproximada, respeitando as dimensões dos carros
      if (car.y > playerY - 22 && car.y < playerY + 24) {
        const roadWidth = roadWidthAt(car.y);
        const roadCenter = roadCenterAt(car.y);
        const enemyX = roadCenter + car.lane * roadWidth * 0.29;
        const playerRoadCenter = roadCenterAt(playerY);
        const playerRoadWidth = roadWidthAt(playerY);
        const playerScreenX = playerRoadCenter +
          playerX * playerRoadWidth * 0.42;

        if (Math.abs(enemyX - playerScreenX) <
            (roadWidth * 0.075 + 15)) {
          endGame();
          return;
        }
      }
    }

    traffic = traffic.filter(car => car.y < H + 70);
  }

  function drawTraffic() {
    for (const car of traffic) {
      const t = Math.max(0, Math.min(1,
        (car.y - HORIZON) / (ROAD_BOTTOM - HORIZON)));
      const roadWidth = roadWidthAt(car.y);
      const center = roadCenterAt(car.y);
      const x = center + car.lane * roadWidth * 0.29;
      const width = 13 + t * 36;
      const height = width * 1.65;
      drawCar(x, car.y, width, height, car.color, false);
    }
  }

  function drawPlayer() {
    const roadWidth = roadWidthAt(playerY);
    const center = roadCenterAt(playerY);
    const x = center + playerX * roadWidth * 0.42;
    const width = 48;
    const height = 76;

    // Sombra
    ctx.fillStyle = "#0006";
    ctx.fillRect(x - width / 2 + 5, playerY + height / 2 - 2,
      width, 8);

    drawCar(x, playerY, width, height, "#e73e43", true);

    // Pequenos detalhes de movimento
    if (speed > 180) {
      ctx.fillStyle = "#ffdb4d";
      ctx.fillRect(x - 13, playerY + 43, 5, 12);
      ctx.fillRect(x + 8, playerY + 43, 5, 12);
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life / 0.6);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 5, 5);
    }
    ctx.globalAlpha = 1;
  }

  function createCrashParticles() {
    const x = W / 2 + playerX * 130;
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 35,
        y: playerY + (Math.random() - 0.5) * 45,
        vx: (Math.random() - 0.5) * 200,
        vy: (Math.random() - 0.5) * 200,
        life: 0.6,
        color: Math.random() > 0.5 ? "#ffdb4d" : "#ff694d"
      });
    }
  }

  function update(dt) {
    if (!running || paused || crashed) return;

    // Aceleração e desaceleração
    if (keys.gas) {
      speed += 105 * dt;
    } else {
      speed -= 35 * dt;
    }
    speed = Math.max(0, Math.min(MAX_SPEED, speed));

    // Direção do carro
    let direction = 0;
    if (keys.left) direction -= 1;
    if (keys.right) direction += 1;

    steering += (direction - steering) * Math.min(1, dt * 7);

    const steeringPower = 0.9 + speed / MAX_SPEED * 1.5;
    playerX += steering * steeringPower * dt;

    // Saiu da pista: perde velocidade
    if (Math.abs(playerX) > 0.88) {
      speed = Math.max(50, speed - 100 * dt);
      playerX = Math.max(-1.15, Math.min(1.15, playerX));
    }

    roadOffset += speed * dt;
    score += speed * dt * 0.8;

    updateTraffic(dt);

    particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    });
    particles = particles.filter(p => p.life > 0);

    updateHUD();
  }

  function render() {
    drawBackground();
    drawRoad();
    drawTraffic();
    drawParticles();

    if (!crashed) drawPlayer();

    // Indicador de velocidade
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px monospace";
    ctx.fillText("KM/H", 16, 25);

    ctx.fillStyle = "#ffdb4d";
    ctx.fillRect(16, 34, 100 * speed / MAX_SPEED, 7);
    ctx.strokeStyle = "#ffffff88";
    ctx.strokeRect(16, 34, 100, 7);

    if (paused) {
      ctx.fillStyle = "#0009";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#ffdb4d";
      ctx.font = "bold 42px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PAUSADO", W / 2, H / 2);
      ctx.textAlign = "left";
    }
  }

  function loop(timestamp) {
    if (!running) return;

    const dt = Math.min((timestamp - lastTime) / 1000 || 0, 0.04);
    lastTime = timestamp;

    update(dt);
    render();

    animationId = requestAnimationFrame(loop);
  }

  function startGame() {
    cancelAnimationFrame(animationId);
    resetGame();
    running = true;
    overlay.hidden = true;
    lastTime = performance.now();
    animationId = requestAnimationFrame(loop);
  }

  function endGame() {
    if (crashed) return;

    crashed = true;
    running = false;
    createCrashParticles();
    render();

    overlayTitle.textContent = "FIM DE JOGO!";
    overlayText.textContent =
      "Pontuação: " + Math.floor(score) +
      " • Ultrapassagens: " + passes +
      ". Tente novamente e bata seu recorde!";
    startButton.textContent = "CORRER NOVAMENTE";
    overlay.hidden = false;
  }

  function togglePause() {
    if (!running || crashed) return;
    paused = !paused;
    if (!paused) lastTime = performance.now();
    render();
  }

  // Teclado
  const onKeyDown = (event) => {
    const key = event.key.toLowerCase();
    const handled = [
      "arrowleft", "arrowright", "arrowup", "a", "d", "w", "p"
    ];

    if (handled.includes(key)) event.preventDefault();

    if (key === "arrowleft" || key === "a") keys.left = true;
    if (key === "arrowright" || key === "d") keys.right = true;
    if (key === "arrowup" || key === "w") keys.gas = true;

    if (key === "p" && !event.repeat) togglePause();
  };

  const onKeyUp = (event) => {
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") keys.left = false;
    if (key === "arrowright" || key === "d") keys.right = false;
    if (key === "arrowup" || key === "w") keys.gas = false;
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Botões de controle: teclado virtual para celular e computador
  root.querySelectorAll("[data-key]").forEach(button => {
    const key = button.dataset.key;

    const press = (event) => {
      event.preventDefault();
      keys[key] = true;
      button.classList.add("er-active");
      if (button.setPointerCapture &&
          event.pointerId !== undefined) {
        try { button.setPointerCapture(event.pointerId); } catch (_) {}
      }
    };

    const release = (event) => {
      if (event) event.preventDefault();
      keys[key] = false;
      button.classList.remove("er-active");
    };

    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
    button.addEventListener("contextmenu", e => e.preventDefault());
  });

  startButton.addEventListener("click", startGame);

  // Solta todos os controles quando a página perde o foco
  window.addEventListener("blur", () => {
    keys.left = false;
    keys.right = false;
    keys.gas = false;
  });

  // Desenha a tela inicial antes de começar
  resetGame();
  render();

  // Permite limpar o jogo caso a aba seja removida.
  root.destroyEnduro = () => {
    running = false;
    cancelAnimationFrame(animationId);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("blur", () => {});
    css.remove();
    root.remove();
  };
})();
