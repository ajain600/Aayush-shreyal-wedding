'use strict';
const I = window.INVITE, M = I.media || {};
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mapUrl = v => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(v.q);
const isImg = s => /\.(gif|jpe?g|png|webp)$/i.test(s);

/* ---------- text from config ---------- */
document.title = `${I.groom} & ${I.bride} · शुभ विवाह`;
for (const [id, t] of [['eG', I.groom], ['eB', I.bride], ['gName', I.groom], ['bName', I.bride], ['gPar', I.groomParents], ['bPar', I.brideParents],
  ['clDate', I.dateDisplay.toUpperCase()],
  ['cdLine', `${I.dateDisplay} · ${I.reveal.time.replace(' onwards', '')} IST`]]) $(id).textContent = t;
$('mono').innerHTML = $('mono2').innerHTML = `${I.groom[0]} <i>&amp;</i> ${I.bride[0]}`;
$('mono').setAttribute('aria-label', `${I.groom} and ${I.bride} home`);
$('clNames').innerHTML = `${I.groom} <i>&amp;</i> ${I.bride}`;
$('evIntro').textContent = `${['Two', 'Three', 'Four', 'Five', 'Six'][I.events.length - 2] || I.events.length} celebrations, countless memories.`;
$('dReveal').innerHTML = `<span>${I.reveal.day}</span><strong>${I.reveal.date}</strong><b>${I.reveal.year}</b><em>${I.reveal.time}</em>`;
$('eLamps').innerHTML = [6, 18, 82, 94].map((l, i) => `<i class="lamp" style="left:${l}%;top:${70 + (i % 2) * 40}px;--h:${50 + (i % 2) * 40}px;animation-delay:-${i * .7}s"></i>`).join('');

/* Symbol image + invocation line (image is simply removed if the file is missing) */
const sym = $('symbol');
sym.onerror = () => sym.remove();
if (M.symbol) sym.src = M.symbol; else sym.remove();
$('invocation').textContent = I.invocation ? `॥ ${I.invocation} ॥` : '';

/* ---------- your media (every slot is optional) ---------- */
function bg(src, poster, onReady) {
  if (!src) return null;
  if (isImg(src)) { const im = new Image(); im.className = 'bgv'; im.alt = ''; im.onload = () => onReady(im); im.src = src; return im; }
  const v = document.createElement('video'); v.className = 'bgv'; v.muted = true; v.playsInline = true; v.loop = true; v.preload = 'auto';
  v.setAttribute('aria-hidden', 'true'); if (poster) v.poster = poster;
  v.addEventListener('loadeddata', () => onReady(v)); v.src = src; return v;
}
const opening = $('opening');
const entrance = bg(M.entranceVideo, M.entrancePoster, el => { opening.classList.add('has-video'); if (el.play && !reduced) el.play().catch(() => {}); });
if (entrance) opening.prepend(entrance);

let tVid = null, tReady = false;
if (M.transitionVideo && !isImg(M.transitionVideo)) {
  tVid = document.createElement('video'); tVid.id = 'tVid'; tVid.muted = true; tVid.playsInline = true; tVid.preload = 'auto'; tVid.hidden = true;
  tVid.setAttribute('aria-hidden', 'true'); if (M.transitionPoster) tVid.poster = M.transitionPoster; tVid.addEventListener('canplay', () => tReady = true); tVid.src = M.transitionVideo; opening.append(tVid);
}

const home = $('home');
const garden = bg(M.gardenVideo, M.gardenPoster, el => { home.classList.add('has-bg'); syncGarden(); });
if (garden) { home.prepend(garden); if (garden.pause) garden.pause(); }
const heroImg = M.heroImage || M.gardenPoster;
if (heroImg) { const im = new Image(); im.onload = () => { home.style.background = `linear-gradient(rgba(251,245,232,.2),rgba(251,245,232,.2)), url("${heroImg}") center/cover no-repeat`; home.classList.add('has-bg'); }; im.src = heroImg; }
let gardenVisible = true, siteOpen = false;
function syncGarden() { if (!garden || !garden.play) return; if (siteOpen && gardenVisible && !document.hidden && !reduced) garden.play().catch(() => {}); else garden.pause(); }
if ('IntersectionObserver' in window) new IntersectionObserver(es => { gardenVisible = es[0].isIntersecting; syncGarden(); }).observe(home);
document.addEventListener('visibilitychange', syncGarden);

/* ---------- petals + confetti ---------- */
if (!reduced) {
  const tones = ['#a52a3b', '#c8394a', '#e8a0a8'];
  $('petalLayer').innerHTML = Array.from({ length: 22 }, (_, i) =>
    `<span class="petal-fall" style="left:${Math.random() * 100}%;--t:${13 + Math.random() * 13}s;--d:${-Math.random() * 26}s;--dr:${-65 + Math.random() * 130}px"><i class="petal" style="--s:${7 + Math.random() * 8}px;--pc:${tones[i % 3]}"></i></span>`).join('');
}
function confetti(x, y) {
  if (reduced) return;
  const b = document.createElement('div'); b.className = 'confetti'; b.style.left = x + 'px'; b.style.top = y + 'px';
  const cols = ['#741e2c', '#c59346', '#f0c87b', '#e6c0a2'];
  for (let i = 0; i < 36; i++) { const a = Math.random() * 6.283, d = 70 + Math.random() * 180, e = document.createElement('i');
    e.style.cssText = `--x:${Math.cos(a) * d}px;--y:${Math.sin(a) * d + 100}px;--r:${-360 + Math.random() * 720}deg;background:${cols[i % 4]}`; b.appendChild(e); }
  document.body.append(b); setTimeout(() => b.remove(), 1700);
}

/* ---------- music (your mp3, or a hidden YouTube player) ---------- */
let yt, ytReady = false, wantPlay = false;
const mbtn = $('music');
function ui(on) { mbtn.dataset.playing = String(on); mbtn.setAttribute('aria-pressed', String(on)); mbtn.setAttribute('aria-label', on ? 'Turn music off' : 'Turn music on'); }
function playMusic() {
  wantPlay = true; ui(true);
  if (I.music.file) { const a = $('mp3'); a.src = I.music.file; a.volume = .4; a.play().catch(() => ui(false)); }
  else if (ytReady) yt.playVideo();
}
function pauseMusic() { wantPlay = false; ui(false); if (I.music.file) $('mp3').pause(); else if (ytReady) yt.pauseVideo(); }
window.onYouTubeIframeAPIReady = () => { const id = I.music.youtubeId;
  yt = new YT.Player('ytp', { width: 200, height: 200, videoId: id, playerVars: { loop: 1, playlist: id, controls: 0, playsinline: 1 },
    events: { onReady: () => { ytReady = true; yt.setVolume(60); if (wantPlay) yt.playVideo(); } } }); };
if (!I.music.file && I.music.youtubeId) { const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(s); }
mbtn.onclick = () => mbtn.dataset.playing === 'true' ? pauseMusic() : playMusic();

/* ---------- entrance ---------- */
let opened = false, timer;
function finish() {
  if (opened) return; opened = true; clearTimeout(timer);
  if (tVid) tVid.pause(); if (entrance && entrance.pause) entrance.pause();
  opening.classList.add('open'); $('site').inert = false; document.body.classList.remove('locked'); scrollTo(0, 0);
  siteOpen = true; syncGarden(); setTimeout(() => opening.remove(), 1000);
}
$('openInvite').onclick = () => {
  if (opening.classList.contains('transitioning')) return;
  playMusic(); confetti(innerWidth / 2, innerHeight * .48);
  opening.classList.add('transitioning');
  if (tVid && tReady && !reduced) {
    if (entrance && entrance.pause) entrance.pause();
    tVid.hidden = false; tVid.currentTime = 0; tVid.onended = finish; tVid.onerror = finish;
    timer = setTimeout(finish, 45000); tVid.play().catch(finish);
  } else timer = setTimeout(finish, reduced ? 300 : opening.classList.contains('has-video') ? 2800 : 3600);
};
$('skip').onclick = finish;

/* ---------- countdown (hearts) ---------- */
const target = new Date(I.countdownTo).getTime();
function tick() {
  const d = Math.max(0, target - Date.now());
  $('countdown').innerHTML = [[Math.floor(d / 864e5), 'Days'], [Math.floor(d % 864e5 / 36e5), 'Hours'], [Math.floor(d % 36e5 / 6e4), 'Minutes'], [Math.floor(d % 6e4 / 1e3), 'Seconds']]
    .map(([n, l]) => `<div><b>${String(n).padStart(2, '0')}</b><span>${l}</span></div>`).join('');
  if (!d) $('cdLine').textContent = 'Our wedding day has arrived!';
}
tick(); setInterval(tick, 1000);

/* ---------- scratch the heart (opens by itself with a splash when this part of the page is on screen) ---------- */
(function () {
  const c = $('scratchCanvas'), card = $('scratchCard'), ctx = c.getContext('2d');
  let down = false, last = null, dist = 0, done = false, autoTimer = 0;
  function cover() {
    if (done) return; const r = card.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    c.width = r.width * d; c.height = r.height * d; ctx.setTransform(d, 0, 0, d, 0, 0); ctx.globalCompositeOperation = 'source-over';
    const gr = ctx.createLinearGradient(0, 0, r.width, r.height); gr.addColorStop(0, '#aa7340'); gr.addColorStop(.45, '#eed2a0'); gr.addColorStop(1, '#bb884d');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, r.width, r.height);
    ctx.fillStyle = '#612033'; ctx.textAlign = 'center'; ctx.font = 'italic 29px Georgia'; ctx.fillText('Scratch here', r.width / 2, r.height * .46);
    ctx.font = '13px Arial'; ctx.fillText('to reveal our wedding date', r.width / 2, r.height * .56);
    ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = 42;
  }
  function ring(x, y, delay) {
    const el = document.createElement('i'); el.className = 'ring'; el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.animationDelay = delay + 's';
    document.body.append(el); setTimeout(() => el.remove(), 2000);
  }
  function reveal() {
    if (done) return; done = true; clearTimeout(autoTimer);
    card.classList.add('done', 'splash'); c.tabIndex = -1;
    $('revealBtn').textContent = `${I.reveal.day}, ${I.reveal.date} ${I.reveal.year}`; $('revealBtn').disabled = true;
    const r = card.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (!reduced) { ring(x, y, 0); ring(x, y, .25); ring(x, y, .5); }
    confetti(x, y); setTimeout(() => confetti(x, y), 280);
  }
  function move(e) {
    if (!down || done) return; const r = c.getBoundingClientRect(), p = { x: e.clientX - r.left, y: e.clientY - r.top };
    ctx.beginPath(); if (last) { ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); dist += Math.hypot(p.x - last.x, p.y - last.y); } else { ctx.arc(p.x, p.y, 21, 0, 7); ctx.fill(); }
    last = p; if (dist > r.width * 2.7) reveal();
  }
  c.addEventListener('pointerdown', e => { down = true; last = null; c.setPointerCapture(e.pointerId); move(e); });
  c.addEventListener('pointermove', move);
  for (const n of ['pointerup', 'pointercancel', 'lostpointercapture']) c.addEventListener(n, () => { down = false; last = null; });
  c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reveal(); } });
  $('revealBtn').onclick = () => reveal(); cover(); addEventListener('resize', cover);

  /* auto open: heart on screen for ~2 seconds and nobody is scratching -> splash open */
  const AUTO_OPEN_MS = 2000;
  if ('IntersectionObserver' in window) new IntersectionObserver(es => {
    clearTimeout(autoTimer);
    if (es[0].isIntersecting && !done) autoTimer = setTimeout(function wait() { if (down) autoTimer = setTimeout(wait, 800); else reveal(); }, AUTO_OPEN_MS);
  }, { threshold: .6 }).observe(card);
})();

/* ---------- events (cards + detail popup) ---------- */
const art = e => `<div class="earch"><span class="hindi" lang="hi">${e.hi}</span></div>${e.image ? `<img src="${e.image}" alt="Illustration for ${e.name}" loading="lazy" onerror="this.remove()">` : ''}`;
$('eventGrid').innerHTML = I.events.map((e, i) => `<article class="event-card" style="--c:${e.color}"><div class="event-art">${art(e)}</div>
  <div class="event-details"><p class="eyebrow">${e.short}</p><h3>${e.name}</h3><time>${e.time}</time><p class="event-venue">${I.venues[e.venue].name}</p>
  <button class="text-link" type="button" data-i="${i}" aria-label="View ${e.name} details">View celebration details ↗</button></div></article>`).join('');
$('eventGrid').onclick = ev => {
  const b = ev.target.closest('[data-i]'); if (!b) return; const e = I.events[+b.dataset.i], v = I.venues[e.venue];
  $('eventModal').style.setProperty('--c', e.color); $('mArt').style.setProperty('--c', e.color); $('mArt').innerHTML = art(e);
  $('mDate').textContent = e.date; $('mTitle').textContent = e.name; $('mTime').textContent = e.time + ' · IST'; $('mText').textContent = e.desc;
  $('mVenue').textContent = v.addr; $('mMap').href = mapUrl(v);
  $('mGcal').href = gcalUrl(e); $('mIcs').onclick = () => downloadIcs([e], e.name.replace(/\W+/g, '-').toLowerCase() + '.ics');
  $('eventModal').showModal();
};
$('venueGrid').innerHTML = I.venues.map((v, i) => { const evs = I.events.filter(e => e.venue === i);
  const ds = [...new Set(evs.map(e => e.short.replace(/ \d{4}$/, '')))], mo = ds.map(d => d.split(' ')[1]);
  const when = ds.length > 1 && mo.every(m => m === mo[0]) ? `${ds[0].split(' ')[0]} – ${ds[ds.length - 1]}` : ds.join(' & ');
  return `<article class="venue-card"><span class="venue-number">0${i + 1}</span><p class="eyebrow">${when}</p><h3>${v.name}</h3><p>${v.addr}</p>
  <p class="ve">${evs.map(e => e.name.replace(/ (Ceremony|Night)$/, '')).join(' · ')}</p><a class="primary" target="_blank" rel="noopener" href="${mapUrl(v)}">View on Google Maps ↗</a></article>`; }).join('');

/* ---------- gallery + lightbox (hidden until photos are added) ---------- */
(function () {
  const P = (I.photos || []).map(p => typeof p === 'string' ? { src: p, caption: '' } : p);
  if (!P.length) { document.querySelectorAll('[data-nav=gallery],#gallery').forEach(n => n.remove()); return; }
  let k = 0;
  const show = n => { k = (n + P.length) % P.length; $('lbImg').src = P[k].src; $('lbImg').alt = P[k].caption || 'Photograph'; $('lbCap').textContent = P[k].caption || ''; $('lbCount').textContent = `${k + 1} / ${P.length}`; if (!$('lightbox').open) $('lightbox').showModal(); };
  $('galleryTrack').innerHTML = P.map((p, i) => `<button type="button" class="photo" data-i="${i}" style="border:1px solid #dfcdb0"><img loading="lazy" src="${p.src}" alt="${p.caption || 'Photograph ' + (i + 1)}"><span>${p.caption || ''}</span></button>`).join('');
  $('galleryTrack').onclick = e => { const b = e.target.closest('.photo'); if (b) show(+b.dataset.i); };
  $('lbPrev').onclick = () => show(k - 1); $('lbNext').onclick = () => show(k + 1);
  addEventListener('keydown', e => { if (!$('lightbox').open) return; if (e.key === 'ArrowLeft') show(k - 1); if (e.key === 'ArrowRight') show(k + 1); });
})();

/* ---------- menu + dialogs ---------- */
$('menuBtn').onclick = () => $('menuDlg').showModal();
$('menuDlg').querySelectorAll('a').forEach(a => a.addEventListener('click', () => $('menuDlg').close()));
for (const d of document.querySelectorAll('dialog')) {
  d.querySelector('[data-close]').onclick = () => d.close();
  d.addEventListener('click', e => { const r = d.getBoundingClientRect(); if (e.target === d && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) d.close(); });
}

/* ---------- forms -> WhatsApp ---------- */
const contacts = (I.contacts || []).map(c => typeof c === 'string' ? { number: c } : c);
const waLink = (c, t) => `https://wa.me/${c.number}?text=${encodeURIComponent(t)}`;
const pretty = n => '+' + n.replace(/^(\d{2})(\d{5})(\d{5})$/, '$1 $2 $3');
function wa(t, form) {
  window.open(waLink(contacts[0], t), '_blank');
  form.querySelector('.also').innerHTML = contacts.length > 1 ? '<span class="tiny">Want the others in the family to get it too?</span>' +
    contacts.slice(1).map(c => `<a class="text-link" target="_blank" rel="noopener" href="${waLink(c, t)}">Also send to ${c.name || pretty(c.number)} ↗</a>`).join('') : '';
}
const rsvp = $('rsvpForm');
rsvp.addEventListener('change', () => { const no = rsvp.elements.attending.value === 'Sadly unable to attend'; rsvp.elements.guests.disabled = no; $('gcLabel').hidden = no; });
rsvp.addEventListener('submit', e => { e.preventDefault(); const f = new FormData(rsvp), no = f.get('attending') === 'Sadly unable to attend';
  wa(`RSVP for ${I.groom} & ${I.bride}'s wedding\nName: ${f.get('name')}\nResponse: ${f.get('attending')}` + (no ? '' : `\nGuests: ${f.get('guests')}`), rsvp); });
$('wishForm').addEventListener('submit', e => { e.preventDefault(); const f = new FormData(e.target);
  wa(`Wishes for ${I.groom} & ${I.bride}\nFrom: ${f.get('name')}\n${f.get('message')}`, e.target); });

/* ---------- auto scroll (tap the arrow button in the header; touching or scrolling the page pauses it) ---------- */
(function () {
  const btn = $('autoScroll'), SPEED = 50;          // pixels per second - lower = slower
  let on = false, raf = 0, prev = 0, acc = 0;
  function step(t) {
    if (!on) return;
    if (document.querySelector('dialog[open]')) return stop();
    acc += SPEED * Math.min(t - prev, 64) / 1000; prev = t;
    if (acc >= 1) { const px = Math.floor(acc); acc -= px; scrollBy(0, px); }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) return stop();
    raf = requestAnimationFrame(step);
  }
  function start() { on = true; acc = 0; prev = performance.now(); document.documentElement.style.scrollBehavior = 'auto';
    btn.setAttribute('aria-pressed', 'true'); btn.setAttribute('aria-label', 'Pause auto scroll'); raf = requestAnimationFrame(step); }
  function stop() { on = false; cancelAnimationFrame(raf); document.documentElement.style.scrollBehavior = '';
    btn.setAttribute('aria-pressed', 'false'); btn.setAttribute('aria-label', 'Start auto scroll'); }
  btn.onclick = () => on ? stop() : start();
  addEventListener('wheel', () => { if (on) stop(); }, { passive: true });
  for (const ev of ['touchstart', 'mousedown', 'keydown']) addEventListener(ev, e => { if (on && !(e.target.closest && e.target.closest('#autoScroll'))) stop(); }, { passive: true });
})();

/* ---------- add to calendar (.ics file + Google Calendar link) ---------- */
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
function eventTimes(e) {
  const d = e.short.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/), t = e.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!d || !t) return null;
  const h = (+t[1] % 12) + (/pm/i.test(t[3]) ? 12 : 0);
  const start = Date.UTC(+d[3], MONTHS.indexOf(d[2].toLowerCase()), +d[1], h, +t[2]) - 330 * 60000;   // India time = UTC+5:30
  return [new Date(start), new Date(start + (e.hours || 3) * 3600000)];                                 // default length 3 hours (add hours: 4 to an event to change)
}
const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsEsc = s => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
function vevent(e) {
  const tm = eventTimes(e); if (!tm) return '';
  return ['BEGIN:VEVENT', `UID:${e.name.replace(/\W+/g, '-').toLowerCase()}-${stamp(tm[0])}@wedding-invite`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(tm[0])}`, `DTEND:${stamp(tm[1])}`, `SUMMARY:${icsEsc(`${e.name} - ${I.groom} & ${I.bride}`)}`,
    `LOCATION:${icsEsc(I.venues[e.venue].addr)}`, `DESCRIPTION:${icsEsc(e.desc || '')}`, 'END:VEVENT'].join('\r\n');
}
function downloadIcs(list, name) {
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', ...list.map(vevent).filter(Boolean), 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' })); a.download = name;
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
const gcalUrl = e => { const tm = eventTimes(e); return tm ? 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(`${e.name} - ${I.groom} & ${I.bride}`)
  + `&dates=${stamp(tm[0])}/${stamp(tm[1])}&details=${encodeURIComponent(e.desc || '')}&location=${encodeURIComponent(I.venues[e.venue].addr)}` : '#'; };
$('calAll').onclick = () => downloadIcs(I.events, 'wedding-events.ics');
