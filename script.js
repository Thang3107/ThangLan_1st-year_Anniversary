// ========== script.js (updated) ==========
// Handles intro, floating hearts, timeline animation, gallery reveal, countdown (from 20/10/2024),
// music toggle, easter-egg filling (10 clicks -> show unlock modal -> video modal)

document.addEventListener("DOMContentLoaded", () => {
  // Intro decorative hearts and particles
  createIntroHearts()
  createIntroParticles()

  const enterBtn = document.getElementById("enter-button")
  const intro = document.getElementById("intro-screen")
  const main = document.getElementById("main-content")

  enterBtn.addEventListener("click", () => {
    intro.classList.add("fade-out")
    setTimeout(() => {
      intro.style.display = "none"
      intro.setAttribute("aria-hidden", "true")
      main.classList.remove("hidden")
      startMain()
    }, 900)
  })

  // Music player
  const musicToggle = document.getElementById("music-toggle")
  const bgAudio = document.getElementById("background-music")
  let playing = false
  musicToggle.addEventListener("click", () => {
    if (!bgAudio) return
    if (playing) {
      bgAudio.pause()
      musicToggle.classList.remove("playing")
      musicToggle.setAttribute("aria-pressed", "false")
    } else {
      bgAudio.play().catch(() => {
        // autoplay might be blocked; user clicked, so should play
      })
      musicToggle.classList.add("playing")
      musicToggle.setAttribute("aria-pressed", "true")
    }
    playing = !playing
  })

  // Countdown
  updateCountdown()
  setInterval(updateCountdown, 1000)

  // scroll animations observer prepared
  setupScrollAnimations()

  // Initialize easter egg (clickable heart)
  initEasterEgg()
})

// ------------- Intro hearts (improved: start near bottom, float up with nice delay) -------------
function createIntroHearts() {
  const container = document.getElementById("intro-hearts")
  if (!container) return
  const emojis = ["❤️", "💕", "💖", "💗", "💓"]
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const el = document.createElement("div")
      el.className = "intro-heart"
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
      // Start position: bottom with some vertical variation
      el.style.left = 8 + Math.random() * 84 + "%"
      el.style.top = 62 + Math.random() * 30 + "%" // start near lower area
      el.style.fontSize = 14 + Math.random() * 30 + "px"
      // duration & delay for introFloat
      const dur = 3500 + Math.random() * 2200
      el.style.animationDuration = dur + "ms"
      el.style.animationDelay = Math.random() * 600 + "ms"
      container.appendChild(el)
      // auto remove after animation
      setTimeout(() => {
        try {
          el.remove()
        } catch (e) {}
      }, dur + 900)
    }, i * 140)
  }
}

function createIntroParticles() {
  const container = document.getElementById("intro-particles")
  if (!container) return
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div")
    p.className = "particle"
    p.style.left = Math.random() * 92 + "%"
    p.style.top = 60 + Math.random() * 36 + "%"
    p.style.width = 4 + Math.random() * 6 + "px"
    p.style.height = p.style.width
    p.style.animationDuration = 1800 + Math.random() * 2600 + "ms"
    container.appendChild(p)
    setTimeout(
      () => {
        try {
          p.remove()
        } catch (e) {}
      },
      3000 + Math.random() * 3000,
    )
  }
}

// ------------- Main animations -------------
function startMain() {
  // floating hearts in background
  startFloatingHearts()

  // reveal initial animation for visible elements
  document.querySelectorAll("[data-animate]").forEach((el) => {
    // small delay so they animate in when user enters
    setTimeout(() => {
      /* will be observed by IO */
    }, 200)
  })
  // ensure observer runs
  observeScrollAnimations()
}

/* Floating hearts (main page) — gentle and non-intrusive */
function startFloatingHearts() {
  const container = document.getElementById("floating-hearts")
  if (!container) return
  const emojis = ["❤️", "💕", "💖", "💗", "💓", "💝"]
  // spawn at interval, each floats up via CSS animation 'floatUp'
  let spawned = 0
  const maxSpawn = 80 // safety cap
  const iv = setInterval(() => {
    if (spawned++ > maxSpawn) {
      clearInterval(iv)
      return
    }
    const el = document.createElement("div")
    el.className = "floating-heart"
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    el.style.left = 5 + Math.random() * 90 + "%"
    el.style.bottom = -10 - Math.random() * 10 + "px" // start slightly off-screen bottom
    el.style.fontSize = 12 + Math.random() * 22 + "px"
    const dur = 7000 + Math.random() * 6000
    el.style.animationDuration = dur + "ms"
    el.style.animationDelay = Math.random() * 800 + "ms"
    container.appendChild(el)
    // remove after animation
    setTimeout(() => {
      try {
        el.remove()
      } catch (e) {}
    }, dur + 600)
  }, 420)
  // clear after 8 minutes to be safe
  setTimeout(() => clearInterval(iv), 1000 * 60 * 8)
}

// ------------- Countdown (from 20/10/2024) -------------
function updateCountdown() {
  const start = new Date("2024-10-20T00:00:00")
  const now = new Date()
  const diff = now - start
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  const elD = document.getElementById("days")
  const elH = document.getElementById("hours")
  const elM = document.getElementById("minutes")
  const elS = document.getElementById("seconds")
  if (elD) elD.textContent = days
  if (elH) elH.textContent = hours
  if (elM) elM.textContent = minutes
  if (elS) elS.textContent = seconds
}

// ------------- Scroll animations (IntersectionObserver) -------------
let globalObserver = null
function setupScrollAnimations() {
  if (globalObserver) return
  globalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    },
    { threshold: 0.12, rootMargin: "0px 0px -80px 0px" },
  )
  // Observe elements with data-animate and common classes
  document
    .querySelectorAll("[data-animate], .photo-item, .letter-card, .countdown-item, .wish-card, .timeline-item")
    .forEach((el) => {
      globalObserver.observe(el)
    })
}
function observeScrollAnimations() {
  setupScrollAnimations()
}

// ------------- Easter egg (fillable heart) -------------
function initEasterEgg() {
  const egg = document.getElementById("easter-egg")
  const fillRect = document.getElementById("heart-fill-rect")
  const eggText = document.getElementById("egg-text")
  const unlockModal = document.getElementById("egg-unlock-modal")
  const startBtn = document.getElementById("egg-start-btn")
  const skipBtn = document.getElementById("egg-skip-btn")
  const videoModal = document.getElementById("egg-modal")
  const videoClose = document.getElementById("egg-modal-close")
  const videoEl = document.getElementById("egg-video")

  if (!egg || !fillRect) return
  let clicks = 0
  const MAX = 10

  // init: fillRect transform at 100% (hidden)
  fillRect.style.transform = "translateY(100%)"
  eggText.textContent = `0/${MAX}`

  egg.addEventListener("click", (e) => {
    e.preventDefault()
    if (clicks >= MAX) {
      // already unlocked -> open unlock modal
      openUnlockModal()
      return
    }
    clicks++
    eggText.textContent = `${clicks}/${MAX}`
    // compute translateY: 100% -> 0% as clicks increase
    const percent = Math.max(0, 100 - (clicks / MAX) * 100)
    fillRect.style.transform = `translateY(${percent}%)`
    // subtle pulse
    egg.classList.add("pulse-click")
    setTimeout(() => egg.classList.remove("pulse-click"), 300)

    if (clicks >= MAX) {
      // unlocked: small confetti-like effect (create few floating hearts)
      burstHeartsAt(egg)
      // show unlock modal after short delay
      setTimeout(openUnlockModal, 650)
    }
  })

  function openUnlockModal() {
    if (!unlockModal) return
    unlockModal.classList.remove("hidden")
    unlockModal.setAttribute("aria-hidden", "false")
  }

  if (startBtn) {
    startBtn.addEventListener("click", () => {
      // close unlock modal, open video modal
      unlockModal.classList.add("hidden")
      unlockModal.setAttribute("aria-hidden", "true")
      openVideoModal()
    })
  }
  if (skipBtn) {
    skipBtn.addEventListener("click", () => {
      unlockModal.classList.add("hidden")
      unlockModal.setAttribute("aria-hidden", "true")
    })
  }

  function openVideoModal() {
    if (!videoModal) return
    videoModal.classList.remove("hidden")
    videoModal.setAttribute("aria-hidden", "false")
    // try to reset video to start but wait for user to press play if autoplay blocked
    try {
      videoEl.currentTime = 0
    } catch (e) {}
  }

  if (videoClose) {
    videoClose.addEventListener("click", () => {
      videoModal.classList.add("hidden")
      videoModal.setAttribute("aria-hidden", "true")
      try {
        videoEl.pause()
      } catch (e) {}
    })
  }
  if (videoModal) {
    videoModal.addEventListener("click", (ev) => {
      if (ev.target === videoModal) {
        videoModal.classList.add("hidden")
        videoModal.setAttribute("aria-hidden", "true")
        try {
          videoEl.pause()
        } catch (e) {}
      }
    })
  }
}

// helper: create small floating hearts burst near element
function burstHeartsAt(el) {
  const rect = el.getBoundingClientRect()
  const parent = document.body
  const emojis = ["💖", "💗", "💞", "💕"]
  for (let i = 0; i < 12; i++) {
    const h = document.createElement("div")
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)]
    h.style.position = "fixed"
    h.style.left = rect.left + rect.width / 2 + (Math.random() * 120 - 60) + "px"
    h.style.top = rect.top + rect.height / 2 + (Math.random() * 60 - 30) + "px"
    h.style.fontSize = 12 + Math.random() * 18 + "px"
    h.style.zIndex = 2000
    h.style.opacity = "1"
    h.style.pointerEvents = "none"
    h.style.transition = "transform 900ms cubic-bezier(.2,.9,.2,1), opacity 900ms ease"
    parent.appendChild(h)
    requestAnimationFrame(() => {
      h.style.transform = `translateY(${-(80 + Math.random() * 140)}px) scale(${1 + Math.random()}) rotate(${Math.random() * 60 - 30}deg)`
      h.style.opacity = "0"
    })
    setTimeout(() => {
      try {
        h.remove()
      } catch (e) {}
    }, 1200)
  }
}

// ------------- Small accessibility & helpers -------------
window.scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

// ensure IntersectionObserver exists in older browsers fallback
if (!window.IntersectionObserver) {
  // simply mark all as visible
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll("[data-animate], .photo-item, .letter-card, .countdown-item, .wish-card, .timeline-item")
      .forEach((el) => el.classList.add("visible"))
  })
}
