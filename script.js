// ── SCROLL & NAV HIDE/SHOW ──
var nav = document.getElementById('mainNav');
var ctaBar = document.getElementById('scrollCtaBar');
var lastScrollY = 0;
var scrollThreshold = 80;

window.addEventListener('scroll', function () {
  var currentY = window.scrollY;

  if (currentY > scrollThreshold) {
    nav.classList.add('scrolled');
    if (ctaBar) ctaBar.classList.add('visible');
  } else {
    nav.classList.remove('scrolled');
    if (ctaBar) ctaBar.classList.remove('visible');
  }

  if (currentY > scrollThreshold) {
    if (currentY > lastScrollY + 5) {
      nav.classList.add('nav-hidden');
    } else if (currentY < lastScrollY - 5) {
      nav.classList.remove('nav-hidden');
    }
  } else {
    nav.classList.remove('nav-hidden');
  }

  lastScrollY = currentY;
});

// ── NAV TOGGLE (hamburger menu) ──
var navToggleBtn = document.getElementById('navToggle');
if (navToggleBtn) {
  navToggleBtn.addEventListener('click', function () {
    document.getElementById('navLinks').classList.toggle('open');
  });
}

// ── DESKTOP vs MOBILE TABS LAYOUT ──
function checkTabsLayout() {
  var desktopTabs = document.getElementById('desktopTabs');
  var mobileTabs = document.getElementById('mobileTabs');
  if (!desktopTabs || !mobileTabs) return;
  if (window.innerWidth <= 768) {
    desktopTabs.style.display = 'none';
    mobileTabs.style.display = 'block';
  } else {
    desktopTabs.style.display = 'block';
    mobileTabs.style.display = 'none';
  }
}
checkTabsLayout();
window.addEventListener('resize', checkTabsLayout);

// ── SCROLL TO SECTION HELPER ──
// These are the possible id="" values for each experience section in your HTML.
// The script tries each one in order and scrolls to the first match it finds.
// ✏️  If none work, open your HTML, find the <section id="..."> for each experience,
//     and add that id to the matching array below.
var sectionTargets = {
  journey:  ['journey',  'journey-section',  'couples-journey',  'experience-journey',  'couples'],
  valkyrie: ['valkyrie', 'valkyrie-section', 'womens-experience','experience-valkyrie', 'womens'],
  odin:     ['odin',     'odin-section',     'mens-experience',  'experience-odin',     'mens']
};

function scrollToExperience(key) {
  var ids = sectionTargets[key];
  if (!ids) return false;

  for (var i = 0; i < ids.length; i++) {
    var el = document.getElementById(ids[i]);
    if (el) {
      // Close modal if it's open
      var modal = document.getElementById('couplesModal');
      if (modal) modal.classList.remove('open');

      // Account for fixed nav height
      var navHeight = nav ? nav.offsetHeight : 80;
      var top = el.getBoundingClientRect().top + window.scrollY - navHeight - 20;
      window.scrollTo({ top: top, behavior: 'smooth' });
      return true;
    }
  }
  return false; // no matching section found in HTML
}

// ── COUPLES EXPERIENCE — click scrolls to section, falls back to modal ──
var couplesExperiences = {
  journey: {
    tag: '01 — Featured',
    title: 'Journey to Valhalla',
    subtitle: "The Complete Couple's Experience",
    body: 'Embark on an unforgettable journey together. A carefully curated experience that weaves ancient Norse mythology with modern luxury, designed for two souls seeking adventure and connection beyond the ordinary.'
  },
  valkyrie: {
    tag: "02 — Women's Experience",
    title: "Valhalla's Valkyrie",
    subtitle: "A Women's Experience",
    body: 'Step into the power of the Valkyrie. An immersive journey crafted exclusively for women — honoring strength, grace, and the warrior spirit within. A transformative experience guided by the sacred feminine.'
  },
  odin: {
    tag: "03 — Men's Experience",
    title: "Odin's Hall",
    subtitle: "A Men's Experience",
    body: 'Enter the legendary hall of Odin. A rite of passage forged for men — drawing on the wisdom, endurance, and nobility of the Norse gods. An experience that awakens purpose and brotherhood.'
  }
};

function openCouplesModal(key) {
  // Try to scroll to the matching section first
  var scrolled = scrollToExperience(key);

  // If no section was found in the HTML, open the modal as fallback
  if (!scrolled) {
    var data = couplesExperiences[key];
    if (!data) return;
    document.getElementById('couplesModalTag').textContent      = data.tag;
    document.getElementById('couplesModalTitle').textContent    = data.title;
    document.getElementById('couplesModalSubtitle').textContent = data.subtitle;
    document.getElementById('couplesModalBody').textContent     = data.body;
    document.getElementById('couplesModal').classList.add('open');
  }
}

function closeCouplesModal() {
  document.getElementById('couplesModal').classList.remove('open');
}

function closeCouplesModalOutside(e) {
  if (e.target === document.getElementById('couplesModal')) closeCouplesModal();
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeCouplesModal();
});

// ── SERVICE GALLERY TABS ──
var tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var tab = this.getAttribute('data-tab');
    tabBtns.forEach(function (b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
    this.classList.add('active');
    var panel = document.getElementById('tab-' + tab);
    if (panel) panel.classList.add('active');
  });
});

// ── BEFORE & AFTER SLIDER ──
document.querySelectorAll('.ba-card').forEach(function (card) {
  var divider = card.querySelector('.ba-divider');
  var afterWrap = card.querySelector('.ba-after-wrap');
  var dragging = false;

  function setPos(x) {
    var rect = card.getBoundingClientRect();
    var pct = Math.min(Math.max((x - rect.left) / rect.width * 100, 0), 100);
    divider.style.left = pct + '%';
    afterWrap.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
  }

  divider.addEventListener('mousedown', function (e) { dragging = true; e.preventDefault(); });
  document.addEventListener('mousemove', function (e) { if (dragging) setPos(e.clientX); });
  document.addEventListener('mouseup', function () { dragging = false; });
  divider.addEventListener('touchstart', function () { dragging = true; }, { passive: true });
  document.addEventListener('touchmove', function (e) { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('touchend', function () { dragging = false; });
});

// ── BEFORE & AFTER MOBILE NAV ──
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

var baPrev = document.getElementById('baPrev');
var baNext = document.getElementById('baNext');
if (baPrev) baPrev.addEventListener('click', function () { baGo(baCurrent - 1); });
if (baNext) baNext.addEventListener('click', function () { baGo(baCurrent + 1); });
baDots.forEach(function (dot) {
  dot.addEventListener('click', function () { baGo(parseInt(this.getAttribute('data-dot'))); });
});

// ── ROTATION GALLERY ──
var rgActive = 2;
var rgThumbs = document.querySelectorAll('.rg-thumb');
var rgMinis = document.querySelectorAll('.rg-thumb-mini');
var rgStrip = document.getElementById('rgStrip');

function rgSetActive(i) {
  rgActive = i;
  rgThumbs.forEach(function (t, idx) {
    t.classList.remove('active', 'semi-active');
    if (idx === i) t.classList.add('active');
    else if (idx === i - 1 || idx === i + 1) t.classList.add('semi-active');
  });
  rgMinis.forEach(function (m, idx) {
    m.classList.toggle('active', idx === i);
  });
  var activeEl = rgThumbs[i];
  if (activeEl && rgStrip) {
    var offset = activeEl.offsetLeft - rgStrip.parentElement.offsetWidth / 2 + activeEl.offsetWidth / 2;
    rgStrip.style.transform = 'translateX(-' + Math.max(0, offset) + 'px)';
  }
}

rgThumbs.forEach(function (t, i) { t.addEventListener('click', function () { rgSetActive(i); }); });
rgMinis.forEach(function (m, i) { m.addEventListener('click', function () { rgSetActive(i); }); });

var rgPrev = document.getElementById('rgPrev');
var rgNext = document.getElementById('rgNext');
if (rgPrev) rgPrev.addEventListener('click', function () { rgSetActive(Math.max(0, rgActive - 1)); });
if (rgNext) rgNext.addEventListener('click', function () { rgSetActive(Math.min(rgThumbs.length - 1, rgActive + 1)); });

// ── PROJECT FILTER ──
var filterBtns = document.querySelectorAll('.filter-btn');
var projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterBtns.forEach(function (b) { b.classList.remove('active'); });
    this.classList.add('active');
    var filter = this.getAttribute('data-filter');
    projectCards.forEach(function (card) {
      if (filter === 'all' || card.getAttribute('data-cat') === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── TAG GALLERY FILTERS ──
function applyTagFilters() {
  var checked = [];
  document.querySelectorAll('.sidebar-checks input:checked').forEach(function (cb) {
    checked.push(cb.getAttribute('data-tag'));
  });
  document.querySelectorAll('.tag-photo').forEach(function (photo) {
    if (checked.length === 0) { photo.classList.remove('hidden'); return; }
    var tags = photo.getAttribute('data-tags') || '';
    var match = checked.every(function (t) { return tags.indexOf(t) !== -1; });
    photo.classList.toggle('hidden', !match);
  });
}

function tagSearchFilter() {
  var searchEl = document.getElementById('tagSearch');
  if (!searchEl) return;
  var q = searchEl.value.toLowerCase();
  document.querySelectorAll('.tag-photo').forEach(function (photo) {
    var name = (photo.getAttribute('data-name') || '').toLowerCase();
    var tags = (photo.getAttribute('data-tags') || '').toLowerCase();
    photo.classList.toggle('hidden', q && name.indexOf(q) === -1 && tags.indexOf(q) === -1);
  });
}

// ── MULTI-STEP FORM ──
function goStep(n) {
  document.querySelectorAll('.form-step').forEach(function (s) { s.classList.remove('active'); });
  var target = document.getElementById('form-step-' + n);
  if (target) target.classList.add('active');
  for (var i = 1; i <= 3; i++) {
    var ind = document.getElementById('step-indicator-' + i);
    if (!ind) continue;
    ind.classList.remove('active', 'completed');
    if (i < n) ind.classList.add('completed');
    else if (i === n) ind.classList.add('active');
  }
}

// ── MOBILE ACCORDION (Services) ──
document.querySelectorAll('.mobile-accordion-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var allBtns = document.querySelectorAll('.mobile-accordion-btn');
    var allPanels = document.querySelectorAll('.mobile-accordion-panel');
    var panel = this.parentElement.querySelector('.mobile-accordion-panel');
    var isOpen = panel.classList.contains('open');
    allBtns.forEach(function (b) { b.classList.remove('active'); });
    allPanels.forEach(function (p) { p.classList.remove('open'); });
    if (!isOpen) {
      this.classList.add('active');
      panel.classList.add('open');
    }
  });
});

// ── WCU INFOGRAPHIC — MOBILE CLICK PANEL ──
(function () {
  var panel     = document.getElementById('wcuMobilePanel');
  var indicator = document.getElementById('wcuPanelIndicator');
  var arrowEl   = document.getElementById('wcuArrowUp');
  var orbEl     = document.getElementById('wcuPanelOrb');
  var labelEl   = document.getElementById('wcuPanelLabel');
  var titleEl   = document.getElementById('wcuPanelTitle');
  var textEl    = document.getElementById('wcuPanelText');
  var nodes     = document.querySelectorAll('.wcu-node');

  if (!panel || !nodes.length) return;

  var nodeConfig = {
    'wcu-node-tl': { color: '#b3913e', icon: 'fa-arrows-rotate', label: 'Our Philosophy'  },
    'wcu-node-tr': { color: '#4a5e35', icon: 'fa-award',          label: 'Our Promise'     },
    'wcu-node-bl': { color: '#4a5e35', icon: 'fa-fist-raised',    label: 'Our Approach'    },
    'wcu-node-br': { color: '#b3913e', icon: 'fa-person-circle-plus', label: 'Your Journey' }
  };

  var arrowPct = {
    'wcu-node-tl': '26.75%',
    'wcu-node-tr': '73.25%',
    'wcu-node-bl': '37.5%',
    'wcu-node-br': '64.5%'
  };

  function isMobile() { return window.innerWidth <= 600; }

  nodes.forEach(function (node) {
    ['click', 'touchend'].forEach(function (evtName) {
      node.addEventListener(evtName, function (e) {
        if (!isMobile()) return;
        e.preventDefault();
        e.stopPropagation();

        var cfg   = { color: '#b3913e', icon: 'fa-arrows-rotate', label: 'Section' };
        var arrow = '50%';
        Object.keys(nodeConfig).forEach(function (cls) {
          if (node.classList.contains(cls)) {
            cfg   = nodeConfig[cls];
            arrow = arrowPct[cls];
          }
        });

        var title = node.getAttribute('data-title') || '';
        var text  = node.getAttribute('data-text')  || '';
        var alreadyActive = node.classList.contains('active');

        nodes.forEach(function (n) {
          n.classList.remove('active');
          n.style.removeProperty('--node-color');
        });
        panel.classList.remove('open');

        if (!alreadyActive) {
          node.classList.add('active');
          node.style.setProperty('--node-color', cfg.color);

          indicator.style.background = cfg.color;

          if (arrowEl) {
            arrowEl.style.setProperty('--arrow-left', arrow);
            arrowEl.style.setProperty('--arrow-color', cfg.color);
            arrowEl.style.left = arrow;
            arrowEl.style.borderBottomColor = cfg.color;
          }

          if (orbEl) {
            orbEl.style.background = cfg.color;
            orbEl.innerHTML = '<i class="fa-solid ' + cfg.icon + '"></i>';
          }

          if (labelEl) { labelEl.textContent = cfg.label; labelEl.style.color = cfg.color; }
          if (titleEl) titleEl.textContent = title;
          if (textEl)  textEl.textContent  = text;

          requestAnimationFrame(function () {
            panel.classList.add('open');
          });

          setTimeout(function () {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      }, { passive: false });
    });
  });

  window.addEventListener('resize', function () {
    if (!isMobile()) {
      nodes.forEach(function (n) {
        n.classList.remove('active');
        n.style.removeProperty('--node-color');
      });
      panel.classList.remove('open');
    }
  });
})();