// Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
if (cursor && follower) {
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
  });
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px'; follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
  document.querySelectorAll('a, button, .service-card, .team-member, .postcard').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
  });
}

// Navbar scroll
const nav = document.querySelector('nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));

// Hamburger
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// Scroll Reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target + suffix; clearInterval(timer); }
    else el.textContent = Math.floor(current) + suffix;
  }, 16);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = true;
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ─── FORM — Email o WhatsApp ──────────────────────────────────────────────────
// Routing WhatsApp:
//   "Web Design & Sviluppo" → Nicholas (+39 350 966 4712)
//   tutti gli altri          → Giuliano (+39 331 147 1560)

const WA_GIULIANO = '393311471560';
const WA_NICHOLAS = '393509664712';

const WEB_SERVICES = ['Web Design & Sviluppo'];

const contactForm = document.getElementById('contact-form');
if (contactForm) {

  // Toggle visivo pulsanti canale
  const channelBtns = document.querySelectorAll('.channel-btn');
  channelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      channelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome      = document.getElementById('f-nome').value.trim();
    const cognome   = document.getElementById('f-cognome').value.trim();
    const email     = document.getElementById('f-email').value.trim();
    const tel       = document.getElementById('f-tel').value.trim();
    const servizio  = document.getElementById('f-servizio').value.trim();
    const msg       = document.getElementById('f-messaggio').value.trim();
    const canale    = document.querySelector('input[name="canale"]:checked').value;
    const nomeCompleto = `${nome} ${cognome}`;

    // Determina a chi va il messaggio WhatsApp
    const isWebService = WEB_SERVICES.includes(servizio);
    const waNumber     = isWebService ? WA_NICHOLAS : WA_GIULIANO;
    const waDestinatario = isWebService ? 'Nicholas' : 'Giuliano';

    if (canale === 'email') {
      const subject = encodeURIComponent(
        `Richiesta da ${nomeCompleto}${servizio ? ' — ' + servizio : ''}`
      );
      const body = encodeURIComponent(
        `Ciao Selfmanagers,\n\n` +
        `Mi chiamo ${nomeCompleto} e vi scrivo tramite il modulo di contatto del sito.\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `• Email: ${email}\n` +
        (tel ? `• Telefono: ${tel}\n` : '') +
        (servizio ? `• Servizio di interesse: ${servizio}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `• Messaggio:\n${msg}\n\n` +
        `In attesa di una vostra risposta,\n${nomeCompleto}`
      );
      window.location.href = `mailto:selfmanagers.it@gmail.com?subject=${subject}&body=${body}`;

    } else {
      // WhatsApp → numero corretto in base al servizio
      const waText = encodeURIComponent(
        `Ciao ${waDestinatario}! 👋\n\n` +
        `Sono *${nomeCompleto}* e vi contatto tramite il sito web.\n\n` +
        `📧 Email: ${email}\n` +
        (tel ? `📞 Telefono: ${tel}\n` : '') +
        (servizio ? `🎯 Servizio: ${servizio}\n` : '') +
        `\n💬 ${msg}`
      );
      window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
    }

    // Feedback visivo
    const btn = contactForm.querySelector('.btn-submit');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = canale === 'email'
      ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Email aperta!`
      : `<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg> WhatsApp aperto!`;
    btn.style.background = canale === 'email'
      ? 'linear-gradient(135deg, #22c55e, #16a34a)'
      : 'linear-gradient(135deg, #25d366, #128c7e)';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      contactForm.reset();
      channelBtns.forEach((b, i) => b.classList.toggle('active', i === 0));
    }, 3000);
  });
}

// ─── LIGHTBOX — hover preview (0.5s) + click locked ──────────────────────────
(function () {
  const HOVER_DELAY = 500;

  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.innerHTML = `
    <div id="lb-box">
      <button id="lb-close" aria-label="Chiudi">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <img id="lb-img" src="" alt="">
    </div>`;
  document.body.appendChild(overlay);

  const lbOverlay = document.getElementById('lb-overlay');
  const lbImg     = document.getElementById('lb-img');
  const lbClose   = document.getElementById('lb-close');
  let hoverTimer = null, isLocked = false, isOpen = false;

  const style = document.createElement('style');
  style.textContent = `
    #lb-overlay {
      position: fixed; inset: 0; z-index: 9000;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0); pointer-events: none; transition: background 0.25s;
    }
    #lb-overlay.visible { background: rgba(0,0,0,0.78); pointer-events: all; }
    #lb-box {
      position: relative; max-width: min(92vw, 900px); max-height: 92vh;
      opacity: 0; transform: scale(0.88); transition: opacity 0.22s, transform 0.22s; pointer-events: none;
    }
    #lb-overlay.visible #lb-box { opacity: 1; transform: scale(1); pointer-events: all; }
    #lb-img {
      display: block; max-width: 100%; max-height: 92vh; width: auto; height: auto;
      border-radius: 14px; box-shadow: 0 32px 80px rgba(0,0,0,0.55);
      object-fit: contain; user-select: none; -webkit-user-drag: none;
    }
    #lb-close {
      position: absolute; top: -14px; left: -14px; width: 38px; height: 38px;
      background: #fff; border: none; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.3); color: #0a0a0a;
      opacity: 0; pointer-events: none;
      transition: opacity 0.2s, transform 0.2s, background 0.15s, color 0.15s; z-index: 1;
    }
    #lb-close svg { width: 16px; height: 16px; display: block; }
    #lb-overlay.locked #lb-close { opacity: 1; pointer-events: auto; }
    #lb-close:hover { transform: scale(1.12); background: #f0e8ff; color: #5e03fc; }
    .team-full-card img, .about-main-block img, .postcard img, .portfolio-thumb img { cursor: zoom-in; }
  `;
  document.head.appendChild(style);

  function openPreview(src, locked) {
    lbImg.src = src; isLocked = locked; isOpen = true;
    lbOverlay.classList.add('visible');
    lbOverlay.classList.toggle('locked', locked);
  }
  function closeAll() {
    clearTimeout(hoverTimer); isOpen = false; isLocked = false;
    lbOverlay.classList.remove('visible', 'locked');
  }
  function attachToImage(img) {
    if (img.closest('.nav-logo, .footer-logo, .s-icon, .value-icon, .contact-item-icon, .about-block-watermark')) return;
    if (img.dataset.lbAttached) return;
    img.dataset.lbAttached = '1';
    const getSrc = () => img.src;

    img.addEventListener('mouseenter', () => {
      if (isLocked) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => openPreview(getSrc(), false), HOVER_DELAY);
    });
    img.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      if (!isLocked && isOpen) closeAll();
    });
    img.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      clearTimeout(hoverTimer);
      openPreview(getSrc(), true);
    });

    let touchTimer = null, touchMoved = false;
    img.addEventListener('touchstart', () => {
      touchMoved = false;
      touchTimer = setTimeout(() => { if (!touchMoved) openPreview(getSrc(), false); }, HOVER_DELAY);
    }, { passive: true });
    img.addEventListener('touchmove', () => { touchMoved = true; clearTimeout(touchTimer); }, { passive: true });
    img.addEventListener('touchend', () => {
      clearTimeout(touchTimer);
      if (!touchMoved && !isOpen) openPreview(getSrc(), true);
      else if (!touchMoved && isOpen && !isLocked) { isLocked = true; lbOverlay.classList.add('locked'); }
    });
  }

  document.querySelectorAll('img').forEach(attachToImage);
  new MutationObserver(() => {
    document.querySelectorAll('img:not([data-lb-attached])').forEach(attachToImage);
  }).observe(document.body, { childList: true, subtree: true });

  lbOverlay.addEventListener('click', (e) => { if (e.target === lbOverlay && isLocked) closeAll(); });
  lbClose.addEventListener('click', closeAll);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) closeAll(); });
})();