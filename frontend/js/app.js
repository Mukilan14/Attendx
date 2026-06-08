// ════════════════════════════════════════════════════════
//  app.js — Page router, shared helpers, toast system
//  NO DOMContentLoaded here — boot is handled by index.html
// ════════════════════════════════════════════════════════

var pageHistory = [];

// ── Navigation ────────────────────────────────────────
function goTo(pageId, push) {
  if (push === undefined) push = true;
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  var page = document.getElementById('page-' + pageId);
  if (page) {
    page.classList.add('active');
    if (push) pageHistory.push(pageId);
  }
}

function goBack() {
  if (pageHistory.length > 1) {
    pageHistory.pop();
    var prev = pageHistory[pageHistory.length - 1];
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var el = document.getElementById('page-' + prev);
    if (el) el.classList.add('active');
  }
}

// ── Modal ─────────────────────────────────────────────
function openModal(id)  { var el = document.getElementById(id); if (el) el.classList.add('open'); }
function closeModal(id) { var el = document.getElementById(id); if (el) el.classList.remove('open'); }

// ── Toast ─────────────────────────────────────────────
function toast(msg, type, dur) {
  if (!type) type = 'info';
  if (!dur)  dur  = 3200;
  var c  = document.getElementById('toast-container');
  var el = document.createElement('div');
  el.className  = 'toast toast-' + type;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, dur);
}

// ── Date helpers ──────────────────────────────────────
function fmtDate(d) {
  if (!d) return '\u2014';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function today() {
  return new Date().toISOString().split('T')[0];
}

// ── HTML escape ───────────────────────────────────────
function esc(s) {
  if (s == null) return '\u2014';
  return String(s)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

// ── Badge HTML ────────────────────────────────────────
function badge(text) {
  var map = {
    present:'badge-present', absent:'badge-absent',
    od:'badge-od', leave:'badge-od',
    pending:'badge-warn', approved:'badge-green', rejected:'badge-red',
    hod:'badge-green', class_incharge:'badge-blue', mentor:'badge-purple',
    staff:'badge-gray', admin:'badge-gray', student:'badge-blue',
  };
  var cls = map[(text||'').toLowerCase()] || 'badge-gray';
  return '<span class="badge ' + cls + '">' + esc(text) + '</span>';
}

// ── Button loading state ──────────────────────────────
function btnLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.orig = btn.textContent;
    btn.textContent  = 'Loading\u2026';
    btn.disabled     = true;
  } else {
    btn.textContent = btn.dataset.orig || btn.textContent;
    btn.disabled    = false;
  }
}

// ── Empty table row ───────────────────────────────────
function emptyRow(cols, msg) {
  return '<tr><td colspan="' + cols + '" style="text-align:center;color:var(--mid);padding:30px;">' + msg + '</td></tr>';
}

// ── Session guard ─────────────────────────────────────
function requireAuth() {
  var user = getUser();
  if (!user || !getToken()) { goTo('home', false); return null; }
  return user;
}