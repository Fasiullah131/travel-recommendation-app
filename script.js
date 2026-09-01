// ============================================
// Wayfarer — shared site behaviour
// ============================================

// Searchable destination index used across pages.
// Each entry links to a section on the home page by id.
const DESTINATIONS = [
  { name: "Anse Source d'Argent, Seychelles", type: "Beach", href: "index.html#beach-1" },
  { name: "Whitehaven Beach, Australia", type: "Beach", href: "index.html#beach-2" },
  { name: "Angkor Wat, Cambodia", type: "Temple", href: "index.html#temple-1" },
  { name: "Kinkaku-ji, Kyoto, Japan", type: "Temple", href: "index.html#temple-2" },
  { name: "Japan", type: "Country", href: "index.html#country-1" },
  { name: "Portugal", type: "Country", href: "index.html#country-2" },
];

function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function renderSearchResults(query) {
  const panel = document.getElementById("search-results");
  if (!panel) return;

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    panel.innerHTML = "";
    return;
  }

  const matches = DESTINATIONS.filter(
    (d) =>
      d.name.toLowerCase().includes(trimmed) ||
      d.type.toLowerCase().includes(trimmed)
  );

  const items = matches.length
    ? matches
        .map(
          (d) =>
            `<li><a href="${d.href}">${d.name}</a> <span style="color:#8a8578; font-size:0.85rem;">— ${d.type}</span></li>`
        )
        .join("")
    : `<li class="none">No destinations match "${escapeHtml(query)}". Try “beach”, “temple”, or a country name.</li>`;

  panel.innerHTML = `
    <div class="search-panel" role="region" aria-live="polite">
      <button class="close-search" type="button" aria-label="Close search results">Close ✕</button>
      <h2>Results for “${escapeHtml(query)}”</h2>
      <ul>${items}</ul>
    </div>
  `;

  const closeBtn = panel.querySelector(".close-search");
  closeBtn.addEventListener("click", () => {
    panel.innerHTML = "";
    const input = document.querySelector(".nav-search input");
    if (input) input.value = "";
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function initSearch() {
  const form = document.querySelector(".nav-search");
  if (!form) return;
  const input = form.querySelector("input");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    renderSearchResults(input.value);
  });

  // Live filtering as the visitor types, once they've typed something.
  input.addEventListener("input", () => {
    if (input.value.trim().length >= 2) {
      renderSearchResults(input.value);
    } else {
      const panel = document.getElementById("search-results");
      if (panel) panel.innerHTML = "";
    }
  });
}

// "Save to trip list" toggle buttons on destination cards.
function initSaveButtons() {
  document.querySelectorAll(".js-save").forEach((btn) => {
    btn.addEventListener("click", () => {
      const saved = btn.classList.toggle("saved");
      btn.textContent = saved ? "Saved ✓" : "Save to trip";
      btn.setAttribute("aria-pressed", String(saved));
    });
  });
}

// "Read more" expandable detail panels on destination cards.
function initDetailButtons() {
  document.querySelectorAll(".js-toggle-detail").forEach((btn) => {
    const targetId = btn.getAttribute("aria-controls");
    const panel = document.getElementById(targetId);
    if (!panel) return;
    btn.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("open");
      btn.textContent = isOpen ? "Show less" : "Read more";
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

// Contact form validation + friendly confirmation (no backend — front-end only demo).
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fields = {
    name: { el: form.querySelector("#name"), validate: (v) => v.trim().length > 1 },
    email: {
      el: form.querySelector("#email"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    },
    message: { el: form.querySelector("#message"), validate: (v) => v.trim().length > 9 },
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let allValid = true;

    Object.values(fields).forEach(({ el, validate }) => {
      const wrapper = el.closest(".field");
      const valid = validate(el.value);
      wrapper.classList.toggle("invalid", !valid);
      if (!valid) allValid = false;
    });

    const status = document.getElementById("form-status");
    if (allValid) {
      status.textContent = `Thanks, ${fields.name.el.value.trim().split(" ")[0]} — your message has been noted. We'll reply to ${fields.email.el.value.trim()} soon.`;
      status.classList.add("show");
      form.reset();
    } else {
      status.textContent = "Please fix the highlighted fields before sending.";
      status.classList.add("show");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initSearch();
  initSaveButtons();
  initDetailButtons();
  initContactForm();
});
