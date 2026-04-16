// ── NAV SCROLL: hide on scroll down, show on scroll up ──
var nav = document.getElementById('mainNav');
var ctaBar = document.getElementById('scrollCtaBar');
var lastScrollY = 0;
var scrollThreshold = 80;

window.addEventListener('scroll', function() {
  var currentY = window.scrollY;

  // Scrolled state (compact nav)
  if (currentY > scrollThreshold) {
    nav.classList.add('scrolled');
    ctaBar.classList.add('visible');
  } else {
    nav.classList.remove('scrolled');
    ctaBar.classList.remove('visible');
  }

  // Hide nav links when scrolling DOWN past threshold
  if (currentY > scrollThreshold) {
    if (currentY > lastScrollY + 5) {
      // scrolling down — hide nav
      nav.classList.add('nav-hidden');
    } else if (currentY < lastScrollY - 5) {
      // scrolling up — show nav
      nav.classList.remove('nav-hidden');
    }
  } else {
    nav.classList.remove('nav-hidden');
  }

  lastScrollY = currentY;
});

// ── NAV TOGGLE ──
document.getElementById('navToggle').addEventListener('click', function() {
  document.getElementById('navLinks').classList.toggle('open');
});

// ── COUPLES EXPERIENCE MODAL ──
var couplesExperiences = {
  journey: {
    tag: "01 — Featured",
    title: "Journey to Valhalla",
    subtitle: "The Complete Couple's Experience",
    body: "Embark on an unforgettable journey together. A carefully curated experience that weaves ancient Norse mythology with modern luxury, designed for two souls seeking adventure and connection beyond the ordinary."
  },
  valkyrie: {
    tag: "02 — Women's Experience",
    title: "Valhalla's Valkyrie",
    subtitle: "A Women's Experience",
    body: "Step into the power of the Valkyrie. An immersive journey crafted exclusively for women — honoring strength, grace, and the warrior spirit within. A transformative experience guided by the sacred feminine."
  },
  odin: {
    tag: "03 — Men's Experience",
    title: "Odin's Hall",
    subtitle: "A Men's Experience",
    body: "Enter the legendary hall of Odin. A rite of passage forged for men — drawing on the wisdom, endurance, and nobility of the Norse gods. An experience that awakens purpose and brotherhood."
  }
};

function openCouplesModal(key) {
  var data = couplesExperiences[key];
  document.getElementById('couplesModalTag').textContent = data.tag;
  document.getElementById('couplesModalTitle').textContent = data.title;
  document.getElementById('couplesModalSubtitle').textContent = data.subtitle;
  document.getElementById('couplesModalBody').textContent = data.body;
  document.getElementById('couplesModal').classList.add('open');
}
function closeCouplesModal() {
  document.getElementById('couplesModal').classList.remove('open');
}
function closeCouplesModalOutside(e) {
  if (e.target === document.getElementById('couplesModal')) closeCouplesModal();
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeCouplesModal();
});

// ── TABS ──
var tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    var tab = this.getAttribute('data-tab');
    tabBtns.forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
    this.classList.add('active');
    var panel = document.getElementById('tab-' + tab);
    if (panel) panel.classList.add('active');
  });
});

// ── BEFORE/AFTER SLIDER ──
document.querySelectorAll('.ba-card').forEach(function(card) {
  var divider = card.querySelector('.ba-divider');
  var afterWrap = card.querySelector('.ba-after-wrap');
  var dragging = false;
  function setPos(x) {
    var rect = card.getBoundingClientRect();
    var pct = Math.min(Math.max((x - rect.left) / rect.width * 100, 0), 100);
    divider.style.left = pct + '%';
    afterWrap.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
  }
  divider.addEventListener('mousedown', function(e) { dragging = true; e.preventDefault(); });
  document.addEventListener('mousemove', function(e) { if (dragging) setPos(e.clientX); });
  document.addEventListener('mouseup', function() { dragging = false; });
  divider.addEventListener('touchstart', function(e) { dragging = true; }, {passive:true});
  document.addEventListener('touchmove', function(e) { if (dragging) setPos(e.touches[0].clientX); }, {passive:true});
  document.addEventListener('touchend', function() { dragging = false; });
});

// BA mobile nav
var baCurrent = 0;
var baCards = document.querySelectorAll('.ba-card');
var baDots = document.querySelectorAll('.ba-dot');
function baGo(n) {
  baCards[baCurrent].classList.remove('active');
  baDots[baCurrent].classList.remove('active');
  baCurrent = (n + baCards.length) % baCards.length;
  baCards[baCurrent].classList.add('active');
  baDots[baCurrent].classList.add('active');
}
document.getElementById('baPrev').addEventListener('click', function() { baGo(baCurrent - 1); });
document.getElementById('baNext').addEventListener('click', function() { baGo(baCurrent + 1); });
baDots.forEach(function(dot) {
  dot.addEventListener('click', function() { baGo(parseInt(this.getAttribute('data-dot'))); });
});

// ── ROTATION GALLERY ──
var rgActive = 2;
var rgThumbs = document.querySelectorAll('.rg-thumb');
var rgMinis = document.querySelectorAll('.rg-thumb-mini');
var rgStrip = document.getElementById('rgStrip');
function rgSetActive(i) {
  rgActive = i;
  rgThumbs.forEach(function(t, idx) {
    t.classList.remove('active','semi-active');
    if (idx === i) t.classList.add('active');
    else if (idx === i-1 || idx === i+1) t.classList.add('semi-active');
  });
  rgMinis.forEach(function(m, idx) {
    m.classList.toggle('active', idx === i);
  });
  var activeEl = rgThumbs[i];
  if (activeEl) {
    var offset = activeEl.offsetLeft - rgStrip.parentElement.offsetWidth/2 + activeEl.offsetWidth/2;
    rgStrip.style.transform = 'translateX(-' + Math.max(0, offset) + 'px)';
  }
}
rgThumbs.forEach(function(t, i) { t.addEventListener('click', function() { rgSetActive(i); }); });
rgMinis.forEach(function(m, i) { m.addEventListener('click', function() { rgSetActive(i); }); });
document.getElementById('rgPrev').addEventListener('click', function() { rgSetActive(Math.max(0, rgActive-1)); });
document.getElementById('rgNext').addEventListener('click', function() { rgSetActive(Math.min(rgThumbs.length-1, rgActive+1)); });

// ── PROJECT FILTER ──
var filterBtns = document.querySelectorAll('.filter-btn');
var projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    filterBtns.forEach(function(b) { b.classList.remove('active'); });
    this.classList.add('active');
    var filter = this.getAttribute('data-filter');
    projectCards.forEach(function(card) {
      if (filter === 'all' || card.getAttribute('data-cat') === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── TAG FILTERS ──
function applyTagFilters() {
  var checked = [];
  document.querySelectorAll('.sidebar-checks input:checked').forEach(function(cb) {
    checked.push(cb.getAttribute('data-tag'));
  });
  document.querySelectorAll('.tag-photo').forEach(function(photo) {
    if (checked.length === 0) { photo.classList.remove('hidden'); return; }
    var tags = photo.getAttribute('data-tags');
    var match = checked.every(function(t) { return tags.indexOf(t) !== -1; });
    photo.classList.toggle('hidden', !match);
  });
}
function tagSearchFilter() {
  var q = document.getElementById('tagSearch').value.toLowerCase();
  document.querySelectorAll('.tag-photo').forEach(function(photo) {
    var name = photo.getAttribute('data-name').toLowerCase();
    var tags = photo.getAttribute('data-tags').toLowerCase();
    photo.classList.toggle('hidden', q && name.indexOf(q) === -1 && tags.indexOf(q) === -1);
  });
}

// ── MULTI-STEP FORM ──
function goStep(n) {
  document.querySelectorAll('.form-step').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById('form-step-' + n).classList.add('active');
  for (var i = 1; i <= 3; i++) {
    var ind = document.getElementById('step-indicator-' + i);
    ind.classList.remove('active','completed');
    if (i < n) ind.classList.add('completed');
    else if (i === n) ind.classList.add('active');
  }
}

// ── WCU DIAGRAM HOVER ──
document.querySelectorAll('.wcu-card').forEach(function(card) {
  card.addEventListener('mouseenter', function() {
    var slice = this.getAttribute('data-slice');
    document.querySelectorAll('.wcu-svg-slice').forEach(function(s) { s.style.opacity = '0.3'; });
    var el = document.getElementById('wcu-slice-' + slice);
    if (el) { el.style.opacity = '1'; el.style.fill = 'rgba(201,169,110,0.2)'; }
  });
  card.addEventListener('mouseleave', function() {
    document.querySelectorAll('.wcu-svg-slice').forEach(function(s) {
      s.style.opacity = '1'; s.style.fill = '';
    });
  });
});