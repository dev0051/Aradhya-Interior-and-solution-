window.addEventListener("load", () => {
  const p = document.getElementById("preloader");
  setTimeout(() => p?.classList.add("hide"), 450);
});

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.setAttribute("data-theme", savedTheme);
themeToggle?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

const cursorDot = document.getElementById("cursorDot");
const cursorGlow = document.getElementById("cursorGlow");
window.addEventListener("mousemove", (e) => {
  if (!cursorDot || !cursorGlow) return;
  cursorDot.style.left = `${e.clientX}px`; cursorDot.style.top = `${e.clientY}px`;
  cursorGlow.style.left = `${e.clientX}px`; cursorGlow.style.top = `${e.clientY}px`;
});
document.querySelectorAll("a,button,input,textarea,select,.portfolio-item,.faq-question").forEach(el => {
  el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
});

document.querySelectorAll(".magnetic").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.16}px, ${y * 0.2}px)`;
  });
  btn.addEventListener("mouseleave", () => btn.style.transform = "translate(0,0)");
});

const header = document.getElementById("header");
const navMenu = document.getElementById("navMenu");
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelectorAll(".nav-link");
const backToTop = document.getElementById("backToTop");

hamburger?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
});
navLinks.forEach(link => link.addEventListener("click", () => {
  navMenu.classList.remove("open");
  hamburger.setAttribute("aria-expanded", "false");
}));

function onScrollUI() {
  const y = window.scrollY;
  header?.classList.toggle("scrolled", y > 20);
  backToTop?.classList.toggle("show", y > 320);
  document.querySelectorAll("section[id]").forEach(section => {
    const top = section.offsetTop - 140;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (y >= top && y < top + height) {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
}
window.addEventListener("scroll", onScrollUI);
onScrollUI();
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
  });
}, { threshold: 0.14 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// HERO particles
const canvas = document.getElementById("particleCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [], rafId;
  const mouse = { x: null, y: null, radius: 120 };

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.6; this.vy = (Math.random() - 0.5) * 0.6;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < mouse.radius) { this.x += dx / 20; this.y += dy / 20; }
      }
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(232,245,189,0.8)"; ctx.fill();
    }
  }
  function initParticles() {
    particles = [];
    const count = Math.max(42, Math.floor((canvas.width * canvas.height) / 17000));
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.strokeStyle = `rgba(199,234,187,${1 - d / 120})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
        }
      }
    }
  }
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    rafId = requestAnimationFrame(animateParticles);
  }
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initParticles();
  }
  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener("mouseout", () => { mouse.x = null; mouse.y = null; });
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  animateParticles();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else animateParticles();
  });
}

// Portfolio (keep your real filenames here)
const portfolioGrid = document.getElementById("portfolioGrid");
const portfolioImages = [
  { file: "WhatsApp Image 2026-03-19 at 16.32.40.jpeg", category: "interior", title: "Kitchen", subtitle: "Interior Design" },
  { file: "WhatsApp Image 2026-03-19 at 16.30.51 (1).jpeg", category: "interior", title: "Living Room", subtitle: "Interior Design" },
  { file: "WhatsApp Image 2026-03-19 at 16.32.52 (1).jpeg", category: "furniture", title: "Entrance", subtitle: "Furniture" },
  { file: "WhatsApp Image 2026-03-19 at 16.30.51 (3).jpeg", category: "furniture", title: "Bedroom Set", subtitle: "Furniture" },
  { file: "WhatsApp Image 2026-03-19 at 16.32.51 (3).jpeg", category: "renovation", title: "Living Hall", subtitle: "Renovation" },
  { file: "WhatsApp Image 2026-03-19 at 16.32.53.jpeg", category: "interior", title: "Main Door", subtitle: "Interior Design" }
];

if (portfolioGrid) {
  portfolioGrid.innerHTML = portfolioImages.map(img => `
    <article class="portfolio-item reveal" data-category="${img.category}">
      <img src="assets/images/portfolio/${img.file}" alt="${img.title}" loading="lazy" />
      <div class="portfolio-caption"><h3>${img.title}</h3><p>${img.subtitle}</p></div>
    </article>
  `).join("");
  document.querySelectorAll("#portfolioGrid .reveal").forEach(el => revealObserver.observe(el));
}

const filterButtons = document.querySelectorAll(".filter-btn");
function bindPortfolioFiltersAndLightbox() {
  const items = document.querySelectorAll(".portfolio-item");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      items.forEach(item => item.classList.toggle("portfolio-hidden", !(filter === "all" || item.dataset.category === filter)));
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  items.forEach(item => {
    const img = item.querySelector("img");
    item.addEventListener("click", () => {
      lightboxImg.src = img.src; lightboxImg.alt = img.alt;
      lightbox.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
  }
  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
}
bindPortfolioFiltersAndLightbox();

// counters
const counters = document.querySelectorAll(".counter");
let countersStarted = false;
function animateCounter(el) {
  const target = Number(el.dataset.target), duration = 1300, start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(frame); else el.textContent = target;
  }
  requestAnimationFrame(frame);
}
const statsSection = document.getElementById("stats");
if (statsSection) {
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        counters.forEach(animateCounter);
        countersStarted = true;
      }
    });
  }, { threshold: 0.35 }).observe(statsSection);
}

// testimonials
const slides = document.querySelectorAll(".testimonial-slide");
const prevBtn = document.getElementById("prevTestimonial");
const nextBtn = document.getElementById("nextTestimonial");
const dotsWrap = document.getElementById("sliderDots");
let currentSlide = 0, autoTimer;
function createDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    if (i === 0) d.classList.add("active");
    d.addEventListener("click", () => showSlide(i));
    dotsWrap.appendChild(d);
  });
}
function showSlide(i) {
  slides.forEach(s => s.classList.remove("active"));
  const dots = dotsWrap.querySelectorAll("button");
  dots.forEach(d => d.classList.remove("active"));
  currentSlide = (i + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
  dots[currentSlide]?.classList.add("active");
}
function startAuto() { autoTimer = setInterval(() => showSlide(currentSlide + 1), 4500); }
function resetAuto() { clearInterval(autoTimer); startAuto(); }
if (slides.length) {
  createDots();
  startAuto();
  prevBtn?.addEventListener("click", () => { showSlide(currentSlide - 1); resetAuto(); });
  nextBtn?.addEventListener("click", () => { showSlide(currentSlide + 1); resetAuto(); });
}

// FAQ
document.querySelectorAll(".faq-item").forEach(item => {
  item.querySelector(".faq-question").addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});

// forms
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = v => /^[0-9]{10,14}$/.test(v.replace(/\s+/g, ""));
function setError(input, msg) { input.closest(".form-row").querySelector(".error").textContent = msg; }
function clearError(input) { input.closest(".form-row").querySelector(".error").textContent = ""; }

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const service = document.getElementById("service");
  const message = document.getElementById("message");
  let valid = true;
  formSuccess.textContent = "";

  if (name.value.trim().length < 3) { setError(name, "Please enter at least 3 characters."); valid = false; } else clearError(name);
  if (!isValidPhone(phone.value.trim())) { setError(phone, "Enter valid phone number."); valid = false; } else clearError(phone);
  if (!isValidEmail(email.value.trim())) { setError(email, "Enter valid email."); valid = false; } else clearError(email);
  if (!service.value) { setError(service, "Please select a service."); valid = false; } else clearError(service);
  if (message.value.trim().length < 10) { setError(message, "Please enter at least 10 characters."); valid = false; } else clearError(message);
  if (!valid) return;

  formSuccess.textContent = "Thank you! Inquiry submitted successfully.";
  const waText = `Hello Aradhya Interiors and Solutions,\nName: ${name.value}\nPhone: ${phone.value}\nEmail: ${email.value}\nService: ${service.value}\nMessage: ${message.value}`;
  contactForm.reset();
  setTimeout(() => window.open(`https://wa.me/919079886840?text=${encodeURIComponent(waText)}`, "_blank", "noopener"), 650);
});

document.getElementById("year").textContent = new Date().getFullYear();