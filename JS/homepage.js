/* =========================================================
   BLOOM WITHIN - HOMEPAGE JAVASCRIPT
   ========================================================= */

/* =========================================================
   AFFIRMATIONS
   ========================================================= */

const affirmations = [
  "I am allowed to move gently through today.",
  "I do not need to have everything figured out.",
  "Rest is part of the journey, not a reward for finishing it.",
  "I can make space for what I feel without becoming it.",
  "Small steps still count.",
  "I deserve kindness from myself, too.",
  "Today does not have to be perfect to be meaningful.",
  "I can pause, breathe, and begin again.",
];

/* =========================================================
   FLOWER WREATH
   ========================================================= */

const flowerHost = document.getElementById("flowers");

const ringFlowers = [
  [21, 18, "var(--petal)", -10],
  [31, 12, "#d9a0ad", 6],
  [42, 10, "#e2c68e", -4],
  [54, 12, "#b9cba9", 8],
  [66, 18, "#d1b5d3", -8],
  [78, 30, "#e6c39d", 10],
  [89, 47, "#dca3ab", -4],
  [84, 63, "#b7cba8", 8],
  [74, 77, "#e4b9b9", -8],
  [59, 89, "#cdb0d4", 5],
  [41, 91, "#dfc18d", -6],
  [27, 80, "#d39eaa", 9],
  [13, 65, "#b9cba9", -6],
  [10, 48, "#d0b2d2", 5],
  [14, 34, "#e6c39d", -8],
  [7, 55, "#d7c09d", 10],
  [18, 46, "#c7dbc0", -8],
  [23, 29, "#d9aebc", 7],
  [72, 18, "#d8c8a6", -7],
  [87, 34, "#c9d7be", 10],
  [90, 62, "#e0bd9f", -5],
  [75, 90, "#d0c3da", 6],
  [49, 96, "#f0c6a0", -9],
  [34, 96, "#d4a7b7", 8],
];

ringFlowers.forEach(([x, y, color, tilt], index) => {
  const el = document.createElement("div");

  el.className =
    "flower " + (index % 3 === 0 ? "" : index % 2 ? "small" : "tiny");

  el.style.left = x + "%";
  el.style.top = y + "%";

  el.style.setProperty("--flower-color", color);

  el.style.setProperty("--stem-tilt", tilt + "deg");

  el.innerHTML = `
    <span class="petal"></span>
    <span class="petal"></span>
    <span class="petal"></span>
    <span class="petal"></span>
    <span class="petal"></span>
    <span class="core"></span>
    <span class="leaf"></span>
    <span class="leaf right"></span>
  `;

  flowerHost.appendChild(el);
});

const innerFlowers = [
  [29, 34, "#e4c29a", -16],
  [38, 27, "#d5a4b0", 8],
  [49, 30, "#b6c8a6", -7],
  [60, 33, "#c9add0", 12],
  [70, 42, "#dfb995", -9],
  [69, 57, "#dca6af", 7],
  [59, 67, "#b8caa8", -12],
  [48, 72, "#d5b0cf", 5],
  [38, 68, "#e3bf8f", 11],
  [29, 58, "#d8a5af", -6],
  [27, 46, "#b9caa9", 8],
  [49, 46, "#ead0a0", 0],
  [23, 45, "#d7a4b1", 12],
  [35, 40, "#c9d9bf", -5],
  [52, 20, "#e6c79d", 6],
  [65, 22, "#d1b8d7", 10],
  [72, 52, "#b8caa6", -8],
  [61, 79, "#d9c19a", 4],
  [33, 78, "#d4b5ce", -9],
  [21, 62, "#bfd6ba", 7],
];

innerFlowers.forEach(([x, y, color, tilt], i) => {
  const el = document.createElement("div");

  el.className = "flower " + (i % 2 ? "small" : "tiny");

  el.style.left = x + "%";
  el.style.top = y + "%";

  el.style.setProperty("--flower-color", color);

  el.style.setProperty("--stem-tilt", tilt + "deg");

  el.style.opacity = ".92";

  el.innerHTML = `
    <span class="petal"></span>
    <span class="petal"></span>
    <span class="petal"></span>
    <span class="petal"></span>
    <span class="petal"></span>
    <span class="core"></span>
    <span class="leaf"></span>
    <span class="leaf right"></span>
  `;

  flowerHost.appendChild(el);
});

/* =========================================================
   AFFIRMATION BUTTON
   ========================================================= */

const affirmation = document.getElementById("affirmation");

let affirmationIndex = 0;

document.getElementById("refreshAffirmation").addEventListener("click", () => {
  affirmation.classList.add("fade");

  setTimeout(() => {
    affirmationIndex = (affirmationIndex + 1) % affirmations.length;

    affirmation.textContent = affirmations[affirmationIndex];

    affirmation.classList.remove("fade");
  }, 200);
});

/* =========================================================
   ANNOUNCEMENT ELEMENTS
   ========================================================= */

const announcement = document.getElementById("announcement");

const announcementText = document.getElementById("announcementText");

const closeAnnouncement = document.getElementById("closeAnnouncement");

/* =========================================================
   CREATE PETAL
   ========================================================= */

function createPetal(x, y, index) {
  const p = document.createElement("div");

  p.className = "petal";

  const colors = ["#e9b7ba", "#f1d09b", "#c8d9c2", "#d5bdd9"];

  p.style.left = x + "px";

  p.style.top = y + "px";

  p.style.setProperty("--pc", colors[index % colors.length]);

  p.style.setProperty("--drift", (Math.random() - 0.5) * 180 + "px");

  p.style.setProperty("--fall", 2.2 + Math.random() * 2.5 + "s");

  document.getElementById("petalLayer").appendChild(p);

  p.addEventListener("animationend", () => p.remove());
}

/* =========================================================
   NORMAL / ANNOUNCEMENT BIRD
   ========================================================= */

function makeBird({ mode = "normal", callback } = {}) {
  const bird = document.createElement("div");

  bird.className = "bird";

  const colors = ["#dca6b8", "#a9bdcd", "#d7b26f", "#b6c7a7"];

  const color = colors[Math.floor(Math.random() * colors.length)];

  bird.style.setProperty("--bird-color", color);

  /*
   * Announcement birds fly
   * lower across the screen.
   */

  if (mode === "announcement") {
    bird.style.setProperty("--top", "25%");

    bird.style.setProperty("--duration", "7s");
  } else {
    bird.style.setProperty("--top", 3 + Math.random() * 20 + "%");

    bird.style.setProperty("--duration", 11 + Math.random() * 6 + "s");
  }

  bird.innerHTML = `
    <div class="wing a"></div>
    <div class="wing b"></div>
    <div class="body"></div>
    <div class="tail"></div>
    <div class="beak"></div>
  `;

  document.getElementById("flyingLayer").appendChild(bird);

  let petalTimer = null;

  /* =======================================================
     ANNOUNCEMENT BIRD DROPS PETALS
     ======================================================= */

  if (mode === "announcement") {
    petalTimer = setInterval(() => {
      if (!document.body.contains(bird)) {
        clearInterval(petalTimer);

        return;
      }

      const r = bird.getBoundingClientRect();

      /*
       * Multiple petals are released
       * behind the bird.
       */

      for (let i = 0; i < 4; i++) {
        createPetal(
          r.left + r.width / 2 + (Math.random() * 30 - 15),

          r.top + r.height / 2,

          Math.floor(Math.random() * 10),
        );
      }
    }, 120);
  }

  /* =======================================================
     BIRD FINISHED FLYING
     ======================================================= */

  bird.addEventListener("animationend", () => {
    if (petalTimer) {
      clearInterval(petalTimer);
    }

    bird.remove();

    if (callback) {
      callback();
    }
  });

  return bird;
}

/* =========================================================
   BUTTERFLY
   ========================================================= */

function makeButterfly() {
  const b = document.createElement("div");

  b.className = "butterfly";

  const wings = ["#c8a9cf", "#e5aeb8", "#b7cfc3"];

  b.style.setProperty(
    "--wing",
    wings[Math.floor(Math.random() * wings.length)],
  );

  b.style.setProperty("--top", 5 + Math.random() * 18 + "%");

  b.style.setProperty("--duration", 14 + Math.random() * 7 + "s");

  b.innerHTML = '<div class="dot"></div>';

  document.getElementById("flyingLayer").appendChild(b);

  b.addEventListener("animationend", () => b.remove());
}

/* =========================================================
   CLOSE ANNOUNCEMENT
   ========================================================= */

closeAnnouncement.addEventListener("click", () => {
  announcement.classList.remove("show");
});

/* =========================================================
   FEATURE BOARDS
   ========================================================= */

document.querySelectorAll(".board").forEach((board) => {
  board.addEventListener("click", () => {
    /*
     * Keep existing rattle animation.
     */

    board.classList.remove("rattle");

    void board.offsetWidth;

    board.classList.add("rattle");

    /*
     * Go to login page.
     */

    setTimeout(() => {
      window.location.href = "login.html";
    }, 220);
  });
});

/* =========================================================
   AMBIENT BIRDS + BUTTERFLIES
   ========================================================= */

setInterval(() => {
  if (Math.random() > 0.45) {
    makeBird();
  } else {
    makeButterfly();
  }
}, 6500);

/* =========================================================
   DANGLING ROPE SYSTEM
   Draws animated SVG ropes from tree branch tips
   down to the top-center of each hanging board.

   The .hanging-strings SVG uses viewBox 0 0 100 100
   with inset:2% / width:96% / height:96%.
   So stage-% coords map as:
     stageX = 2 + (svgX / 100) * 96
     stageY = 2 + (svgY / 100) * 96

   Branch body coordinates (svgX, svgY):
     Left upper branch  → (8, 35)
     Left lower branch  → (8, 65)
     Right upper branch → (92, 35)
     Right lower branch → (92, 65)
   ========================================================= */

(function initRopes() {
  const canvas = document.getElementById("ropeCanvas");
  if (!canvas) return;

  const ns = "http://www.w3.org/2000/svg";

  /* --------------------------------------------------
     Branch tip positions in stage-% coordinates
     (the SVG canvas is 100x100 in viewBox units,
      which maps 1:1 to stage percentage)
  -------------------------------------------------- */
  const branches = {
    leftUpper: { x: 8, y: 30 } /* left upper branch body  */,
    leftLower: { x: 8, y: 65 } /* left lower branch body  */,
    rightUpper: { x: 92, y: 30 } /* right upper branch body */,
    rightLower: { x: 92, y: 65 } /* right lower branch body */,
  };

  /* --------------------------------------------------
     Board positions (centre of board element in %)
     and which branch each rope connects to.
  -------------------------------------------------- */
  const boardRopes = [
    /* pos 1 — Breathe  — left upper */
    {
      pos: "1",
      branch: branches.leftUpper,
      selector: ".board[data-pos='1']",
      swayAmp: 1.8,
      period: 4200,
    },
    /* pos 2 — Journal  — top center */
    {
      pos: "2",
      branch: { x: 50, y: 91 },
      selector: ".board[data-pos='2']",
      swayAmp: 1.8,
      period: 3800,
    },
    /* pos 6 — Announcement — bird perched a little higher above the bouquet */
    {
      pos: "6",
      branch: { x: 50, y: 1 },
      selector: ".board[data-pos='6']",
      swayAmp: 1.3,
      period: 5000,
    },
    /* pos 3 — Check In — shorter rope, still attached to the board */
    {
      pos: "3",
      branch: { x: branches.rightUpper.x, y: 31 },
      selector: ".board[data-pos='3']",
      swayAmp: 1.2,
      period: 4600,
    },
    /* pos 4 — Tiny Rituals — right lower */
    {
      pos: "4",
      branch: { x: branches.rightLower.x, y: 61 },
      selector: ".board[data-pos='4']",
      swayAmp: 1.5,
      period: 3900,
    },
    /* pos 5 — Gratitude — left lower */
    {
      pos: "5",
      branch: { x: branches.leftLower.x, y: 61 },
      selector: ".board[data-pos='5']",
      swayAmp: 1.5,
      period: 4400,
    },
  ];

  /* Board half-height in stage-% (boards are ~50px min,
     stage is ~780px max-width, so ≈ 3.2%) */
  const boardHalfH = 3.2;

  /* Each rope gets: a <path> for the curve + a <circle> knot */
  const ropeEls = boardRopes.map((r, i) => {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#947052");
    path.setAttribute("stroke-width", "0.55");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("opacity", "0.88");

    const knot = document.createElementNS(ns, "circle");
    knot.setAttribute("r", "0.75");
    knot.setAttribute("fill", "#c89f74");
    knot.setAttribute("stroke", "#7d5c40");
    knot.setAttribute("stroke-width", "0.18");

    canvas.appendChild(path);
    canvas.appendChild(knot);

    return { path, knot, ...r, phase: i * 0.72 };
  });

  /* --------------------------------------------------
     Animation: update rope paths every frame.
     The bottom endpoint of each rope tracks the
     board's current rotated top-centre.
  -------------------------------------------------- */
  function updateRopes(timestamp) {
    ropeEls.forEach((r) => {
      const board = document.querySelector(r.selector);
      if (!board) return;

      const canvasRect = canvas.getBoundingClientRect();
      const boardRect = board.getBoundingClientRect();

      const boardCenterX =
        ((boardRect.left + boardRect.width / 2 - canvasRect.left) /
          canvasRect.width) *
        100;
      const boardTopY =
        ((boardRect.top - canvasRect.top) / canvasRect.height) * 100;

      /* Current sway angle in radians */
      const t = (timestamp / r.period) * Math.PI * 2 + r.phase;
      const angle = Math.sin(t) * r.swayAmp * (Math.PI / 180);
      const tipX = boardCenterX + Math.sin(angle) * 0.9;
      const tipY = boardTopY + 0.4;

      /* Start point = branch tip */
      const bx = r.branch.x;
      const by = r.branch.y;

      const dx = tipX - bx;
      const dy = tipY - by;
      const dist = Math.hypot(dx, dy);
      const droop = Math.min(dist * 0.18, 8);

      const cx1 = bx + dx * 0.28;
      const cy1 = by + dy * 0.25 + droop;
      const cx2 = bx + dx * 0.72;
      const cy2 = by + dy * 0.75 + droop;

      r.path.setAttribute(
        "d",
        `M ${bx} ${by} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tipX} ${tipY}`,
      );

      /* Knot at the board attachment point */
      r.knot.setAttribute("cx", tipX);
      r.knot.setAttribute("cy", tipY);
    });

    requestAnimationFrame(updateRopes);
  }

  requestAnimationFrame(updateRopes);
})();
