const games = Array.isArray(window.TINYSTAR_GAMES) ? window.TINYSTAR_GAMES : [];
const gamesGrid = document.getElementById('gamesGrid');
const modal = document.getElementById('gameModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.querySelector('.modal-close');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

function fallbackCover(game) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760">
      <defs><radialGradient id="g" cx="70%" cy="25%" r="80%"><stop offset="0" stop-color="#6b5fd0"/><stop offset=".45" stop-color="#20223a"/><stop offset="1" stop-color="#090b12"/></radialGradient></defs>
      <rect width="1200" height="760" fill="url(#g)"/><circle cx="895" cy="215" r="115" fill="#8374eb" opacity=".45"/><circle cx="895" cy="215" r="170" fill="none" stroke="#9c90ff" stroke-width="3" opacity=".32"/>
      <path d="M0 620 L215 420 348 550 515 340 740 620 Z" fill="#0d1019" opacity=".92"/><path d="M430 620 L680 390 805 515 950 360 1200 620 Z" fill="#111526" opacity=".94"/>
      <text x="70" y="115" fill="#fff" opacity=".9" font-family="Arial" font-size="58" font-weight="700">${escapeHtml(game.title || 'TinyStarGames')}</text>
    </svg>`)} `;
}
function getCover(game) { return game.cover && game.cover.trim() ? game.cover : fallbackCover(game); }

function renderGames() {
  if (!games.length) { gamesGrid.innerHTML = '<div class="empty-games">Games will appear here as they are added to <code>games.js</code>.</div>'; return; }
  gamesGrid.innerHTML = games.map(game => `
    <article class="game-card reveal" tabindex="0" data-game-id="${escapeHtml(game.id)}" aria-label="Open ${escapeHtml(game.title)} details">
      <div class="game-card-bg" style="background-image:url('${getCover(game)}')"></div>
      <div class="game-card-content"><span class="game-status">${escapeHtml(game.status || 'Game')}</span><h3>${escapeHtml(game.title)}</h3><p>${escapeHtml(game.description)}</p>
        <div class="game-card-actions"><button class="game-mini-button" type="button">View game</button>${game.playUrl ? `<a class="game-mini-button" href="${escapeHtml(game.playUrl)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Play ↗</a>` : ''}</div>
      </div>
    </article>`).join('');
  document.querySelectorAll('.game-card').forEach(card => {
    const open = () => openGame(card.dataset.gameId); card.addEventListener('click', open);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  observeReveals();
}

function openGame(id) {
  const game = games.find(item => item.id === id); if (!game) return;
  const screenshots = game.screenshots?.length ? game.screenshots.map((src,index) => `<div class="screenshot"><img src="${escapeHtml(src)}" alt="${escapeHtml(game.title)} screenshot ${index+1}" loading="lazy"></div>`).join('') : [1,2,3].map(i => `<div class="screenshot"><div class="screenshot-placeholder">Screenshot ${i}<br>Add image path in games.js</div></div>`).join('');
  const tutorials = game.tutorials?.length ? game.tutorials.map(t => `<${t.url ? 'a':'div'} class="tutorial-item" ${t.url ? `href="${escapeHtml(t.url)}" target="_blank" rel="noopener"` : ''}><strong>${escapeHtml(t.title)}</strong><span>${escapeHtml(t.note || (t.url ? 'Open guide ↗':'Coming soon'))}</span></${t.url ? 'a':'div'}>`).join('') : '<div class="tutorial-item"><strong>Tutorials</strong><span>Coming soon</span></div>';
  modalContent.innerHTML = `<div class="modal-hero" style="background-image:url('${getCover(game)}')"><span class="game-status">${escapeHtml(game.status || 'Game')}</span><h2>${escapeHtml(game.title)}</h2><p>${escapeHtml(game.description)}</p></div><div class="modal-body"><div class="modal-actions">${game.playUrl ? `<a class="button button-primary" href="${escapeHtml(game.playUrl)}" target="_blank" rel="noopener">Play on Roblox ↗</a>` : '<span class="button button-secondary disabled">Roblox link coming soon</span>'}</div><section class="modal-section"><h3>Screenshots</h3><div class="screenshot-grid">${screenshots}</div></section><section class="modal-section"><h3>Tutorials & Guides</h3><div class="tutorial-list">${tutorials}</div></section></div>`;
  modal.showModal(); document.body.classList.add('modal-open');
}
function closeModal(){ if(modal.open) modal.close(); document.body.classList.remove('modal-open'); }
modalClose.addEventListener('click',closeModal); modal.addEventListener('click',e=>{if(e.target===modal)closeModal();}); modal.addEventListener('close',()=>document.body.classList.remove('modal-open'));
navToggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('.nav-links a').forEach(link=>link.addEventListener('click',()=>{navLinks.classList.remove('open');navToggle.setAttribute('aria-expanded','false');}));
document.getElementById('year').textContent=new Date().getFullYear();
function observeReveals(){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.12});document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer.observe(el));}
renderGames(); observeReveals();
