'use strict';
const CATS = {
  work:  { n: 'Работа', c: 'var(--work)' },
  study: { n: 'Учеба',  c: 'var(--study)' },
  other: { n: 'Другое', c: 'var(--other)' },
};
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- даты ---------- */
const iso = d => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 6e4); return z.toISOString().slice(0, 10); };
const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const today = () => iso(new Date());
const mondayOf = s => addDays(s, -((parse(s).getDay() + 6) % 7));
const fmt = (s, o) => parse(s).toLocaleDateString('ru-RU', o);
const diff = (a, b) => Math.round((parse(a) - parse(b)) / 864e5);
function dueLabel(s) {
  if (!s) return '';
  const n = diff(s, today());
  if (n === 0) return 'Сегодня';
  if (n === 1) return 'Завтра';
  if (n === -1) return 'Вчера';
  return fmt(s, { day: 'numeric', month: 'short' });
}

/* ---------- данные ---------- */
let tasks = [];
try { tasks = JSON.parse(localStorage.getItem('planner.tasks') || '[]'); } catch (e) { tasks = []; }
const save = () => { try { localStorage.setItem('planner.tasks', JSON.stringify(tasks)); } catch (e) {} };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const progress = t => t.done ? 100 : (t.sub.length ? Math.round(t.sub.filter(x => x.done).length / t.sub.length * 100) : 0);

const state = {
  tab: 'tasks', open: new Set(), filter: 'all', calFilter: 'all',
  month: today().slice(0, 7), sel: today(), week: mondayOf(today()),
};

/* ---------- действия ---------- */
function toggleTask(id) {
  const t = tasks.find(x => x.id === id); if (!t) return;
  t.done = !t.done;
  if (t.done) t.sub.forEach(s => s.done = true);
  if (t.done && t.repeat === 'weekly' && t.due) {
    tasks.push({ ...t, id: uid(), done: false, due: addDays(t.due, 7), sub: t.sub.map(s => ({ ...s, done: false })) });
  }
  save(); render();
}
function toggleSub(id, i) {
  const t = tasks.find(x => x.id === id); if (!t) return;
  t.sub[i].done = !t.sub[i].done;
  t.done = t.sub.length > 0 && t.sub.every(s => s.done);
  save(); render();
}

/* ---------- карточка задачи ---------- */
function card(t) {
  const c = CATS[t.cat];
  const overdue = t.due && !t.done && t.due < today();
  const p = progress(t);
  return `<div class="task ${t.done ? 'done' : ''}">
    <button class="chk ${t.done ? 'on' : ''}" data-toggle="${t.id}" aria-label="Выполнить">✓</button>
    <div class="title" data-edit="${t.id}">
      <span class="t">${esc(t.title)}</span>${t.star ? '<span class="star">★</span>' : ''}${t.repeat === 'weekly' ? '<span style="color:var(--mute);font-size:12px">↻</span>' : ''}
    </div>
    <div class="meta">
      ${t.hours ? `<span>${t.hours} ч</span>` : ''}
      ${t.due ? `<span style="${overdue ? 'color:#d6453d;font-weight:700' : ''}">${dueLabel(t.due)}</span>` : ''}
      <span class="tag" style="background:${c.c}">${c.n}</span>
    </div>
    ${t.desc ? `<div class="desc ${state.open.has(t.id) ? 'open' : ''}" data-desc="${t.id}">${esc(t.desc)}</div>` : ''}
    ${(t.sub.length || t.done) ? `<div class="prog"><div class="bar"><i style="width:${p}%"></i></div>${p}%</div>` : ''}
    ${t.sub.length ? `<div class="subs">${t.sub.map((s, i) => `<div class="sub ${s.done ? 'on' : ''}" data-sub="${t.id}:${i}"><span class="chk ${s.done ? 'on' : ''}">✓</span><span>${esc(s.t)}</span></div>`).join('')}</div>` : ''}
  </div>`;
}
const byDue = (a, b) => (a.due || '9') .localeCompare(b.due || '9') || (b.star ? 1 : 0) - (a.star ? 1 : 0);

/* ---------- экран: задачи ---------- */
function viewTasks() {
  const f = state.filter;
  const list = tasks.filter(t => f === 'all' || t.cat === f);
  const open = list.filter(t => !t.done).sort(byDue);
  const td = today(), wk = addDays(td, 7);
  const groups = [
    ['Просрочено', open.filter(t => t.due && t.due < td), 'red'],
    ['Сегодня', open.filter(t => t.due === td)],
    ['На этой неделе', open.filter(t => t.due > td && t.due <= wk)],
    ['Позже', open.filter(t => t.due > wk)],
    ['Без срока', open.filter(t => !t.due)],
  ].filter(g => g[1].length);
  const done = list.filter(t => t.done);
  const cnt = k => tasks.filter(t => !t.done && (k === 'all' || t.cat === k)).length;
  const chip = (k, name, dot) => `<button class="chip ${f === k ? 'on' : ''}" data-filter="${k}">${dot ? `<span class="dot" style="background:${dot}"></span>` : ''}${name}<small>${cnt(k)}</small></button>`;
  return `<div class="hero"><h1>Что нужно <i>сделать</i></h1>${dogSit()}</div>
  <div class="chips">${chip('all', 'Все')}${Object.entries(CATS).map(([k, c]) => chip(k, c.n, c.c)).join('')}</div>
  ${groups.map(([n, arr, cls]) => `<section class="group"><h3 class="${cls || ''}">${n}</h3>${arr.map(card).join('')}</section>`).join('')}
  ${!groups.length ? '<div class="empty">Пока пусто. Нажми «+ Задача».</div>' : ''}
  <div class="sleeper">${dogSleep()}</div>
  ${done.length ? `<details class="group"><summary class="link">Готово · ${done.length}</summary><div style="margin-top:10px">${done.sort(byDue).map(card).join('')}</div></details>` : ''}`;
}

/* ---------- экран: календарь ---------- */
function viewCal() {
  const f = state.calFilter;
  const [y, m] = state.month.split('-').map(Number);
  const first = iso(new Date(y, m - 1, 1));
  const start = mondayOf(first);
  const title = new Date(y, m - 1, 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  const open = tasks.filter(t => !t.done && t.due && (f === 'all' || t.cat === f));
  let cells = '';
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i);
    if (i >= 35 && parse(d).getMonth() !== m - 1) break;
    const ts = open.filter(t => t.due === d);
    const cats = [...new Set(ts.map(t => t.cat))];
    cells += `<button class="day ${parse(d).getMonth() !== m - 1 ? 'out' : ''} ${d === today() ? 'today' : ''} ${d === state.sel ? 'sel' : ''}" data-day="${d}">
      <span>${parse(d).getDate()}</span>
      <span class="dots">${cats.map(k => `<i style="background:${CATS[k].c}"></i>`).join('')}${ts.length > 1 ? `<b>${ts.length}</b>` : ''}</span></button>`;
  }
  const seg = (k, n) => `<button class="${f === k ? 'on' : ''}" data-calf="${k}">${n}</button>`;
  const dayTasks = tasks.filter(t => t.due === state.sel && (f === 'all' || t.cat === f));
  return `<div class="hero"><h1>Когда <i>горит</i></h1>${dogSit({ fur: '#d9a35f', fur2: '#a8702f', snout: '#f0cf9c', scarf: '#e58b97' })}</div>
  <div class="cal-top">
    <button class="arrow" data-m="-1">←</button><div class="ttl">${title}</div><button class="arrow" data-m="1">→</button>
    <div class="seg" style="margin-left:auto">${seg('work', 'Работа')}${seg('study', 'Учеба')}${seg('all', 'Всё вместе')}</div>
  </div>
  <div class="grid">${['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => `<div class="dow">${d}</div>`).join('')}${cells}</div>
  <div class="sel-head"><h3>${fmt(state.sel, { weekday: 'long', day: 'numeric', month: 'long' })}</h3><button class="pill ghost" data-add="${state.sel}">+ Добавить</button></div>
  ${dayTasks.length ? dayTasks.sort(byDue).map(card).join('') : '<div class="empty" style="padding:24px 0">На этот день дел нет</div>'}`;
}

/* ---------- экран: нагрузка ---------- */
const level = h => h > 7 ? 2 : h > 4 ? 1 : 0;
const LV = ['Спокойно', 'Плотно', 'Перегруз'];
function viewLoad() {
  const days = Array.from({ length: 7 }, (_, i) => addDays(state.week, i));
  const data = days.map(d => {
    const ts = tasks.filter(t => !t.done && t.due === d);
    const by = { work: 0, study: 0, other: 0 };
    ts.forEach(t => by[t.cat] += (+t.hours || 1));
    return { d, by, total: by.work + by.study + by.other, n: ts.length };
  });
  const max = Math.max(10, ...data.map(x => x.total));
  const total = data.reduce((a, x) => a + x.total, 0);
  const busy = data.reduce((a, x) => x.total > a.total ? x : a, data[0]);
  const over = data.filter(x => x.total > 7);
  const label = `${fmt(days[0], { day: 'numeric', month: 'short' })} – ${fmt(days[6], { day: 'numeric', month: 'short' })}`;
  return `<div class="hero"><h1>Сколько <i>на мне</i></h1>${dogSit({ fur: '#a39a8e', fur2: '#6f675d', snout: '#cfc7bb', scarf: '#f0a64a' })}</div>
  <div class="cal-top"><button class="arrow" data-w="-7">←</button><div class="ttl">${label}</div><button class="arrow" data-w="7">→</button>
    <button class="pill ghost" data-w="0" style="margin-left:auto">Эта неделя</button></div>
  ${over.length ? `<div class="warn">⚠ Перегруз: ${over.map(x => `${fmt(x.d, { weekday: 'short' })} — ${x.total} ч`).join(', ')}. Подумай, что можно перенести.</div>` : ''}
  <div class="loadbox"><div class="cols">${data.map(x => `
    <div class="col">
      <span class="h">${x.total ? x.total + ' ч' : ''}</span>
      <div class="stack" style="height:${Math.max(x.total / max * 150, 4)}px">
        ${Object.keys(CATS).map(k => x.by[k] ? `<i style="height:${x.by[k] / x.total * 100}%;background:${CATS[k].c}"></i>` : '').join('')}
      </div>
      <span class="badge lv${level(x.total)}">${x.total ? LV[level(x.total)] : '—'}</span>
      <span class="d ${x.d === today() ? 'today' : ''}">${fmt(x.d, { weekday: 'short' })} ${parse(x.d).getDate()}</span>
    </div>`).join('')}</div>
    <div class="legend">${Object.values(CATS).map(c => `<span><i style="background:${c.c}"></i>${c.n}</span>`).join('')}<span style="margin-left:auto">без оценки времени считается как 1 ч</span></div>
  </div>
  <div class="sum">
    <div><b>${total} ч</b><small>за неделю</small></div>
    <div><b>${data.reduce((a, x) => a + x.n, 0)}</b><small>задач с дедлайном</small></div>
    <div><b>${busy.total ? fmt(busy.d, { weekday: 'short' }) : '—'}</b><small>самый тяжёлый день</small></div>
  </div>
  <div class="sleeper">${dogSleep({ fur: '#a39a8e', fur2: '#6f675d', snout: '#cfc7bb' })}</div>`;
}

/* ---------- диалог ---------- */
function openDlg(id, due) {
  const t = id ? tasks.find(x => x.id === id) : { title: '', desc: '', cat: 'work', due: due || today(), hours: '', star: false, repeat: 'none', sub: [] };
  let cat = t.cat, star = t.star;
  const dlg = $('#dlg');
  const subRow = (v = '', done = false) => `<div class="subrow" data-done="${done}"><input class="inp" value="${esc(v)}" placeholder="Подзадача"><button type="button" data-rm>×</button></div>`;
  dlg.innerHTML = `<form method="dialog" id="f">
    <div class="dog-mini">${dogSit({ fur: '#d9a35f', fur2: '#a8702f', snout: '#f0cf9c', scarf: '#78a974' })}</div>
    <h2>${id ? 'Изменить <i>задачу</i>' : 'Новая <i>задача</i>'}</h2>
    <label>Название</label><input class="inp" id="f-title" value="${esc(t.title)}" required autofocus>
    <label>Описание</label><textarea class="inp" id="f-desc" placeholder="Подробности, ссылки, что именно нужно сделать">${esc(t.desc || '')}</textarea>
    <label>Тип</label>
    <div class="seg" id="f-cat">${Object.entries(CATS).map(([k, c]) => `<button type="button" data-c="${k}" class="${cat === k ? 'on' : ''}"><span class="dot" style="background:${c.c}"></span>${c.n}</button>`).join('')}</div>
    <div class="row">
      <div><label>Дедлайн</label><input class="inp" type="date" id="f-due" value="${t.due || ''}"></div>
      <div><label>Время, часов</label><input class="inp" type="number" min="0" step="0.5" id="f-hours" value="${t.hours || ''}" placeholder="1"></div>
    </div>
    <div class="row">
      <div><label>Повтор</label><select class="inp" id="f-rep"><option value="none">Нет</option><option value="weekly" ${t.repeat === 'weekly' ? 'selected' : ''}>Каждую неделю</option></select></div>
      <div><label>Важное</label><div class="seg"><button type="button" id="f-star" class="${star ? 'on' : ''}">★ Важное</button></div></div>
    </div>
    <label>Подзадачи</label>
    <div id="f-subs">${t.sub.map(s => subRow(s.t, s.done)).join('')}</div>
    <button type="button" class="link" id="f-addsub">+ подзадача</button>
    <div class="actions">
      ${id ? '<button type="button" class="del" id="f-del">Удалить</button>' : ''}
      <button type="button" class="pill ghost" id="f-cancel" style="margin-left:${id ? '0' : 'auto'}">Отмена</button>
      <button type="submit" class="pill black">Сохранить</button>
    </div></form>`;
  dlg.showModal();
  $('#f-cat').onclick = e => { const b = e.target.closest('[data-c]'); if (!b) return; cat = b.dataset.c; [...$('#f-cat').children].forEach(x => x.classList.toggle('on', x === b)); };
  $('#f-star').onclick = e => { star = !star; e.currentTarget.classList.toggle('on', star); };
  $('#f-addsub').onclick = () => { $('#f-subs').insertAdjacentHTML('beforeend', subRow()); $('#f-subs').lastElementChild.querySelector('input').focus(); };
  $('#f-subs').onclick = e => { if (e.target.matches('[data-rm]')) e.target.parentElement.remove(); };
  $('#f-subs').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); $('#f-addsub').click(); } };
  $('#f-cancel').onclick = () => dlg.close();
  if (id) $('#f-del').onclick = () => { tasks = tasks.filter(x => x.id !== id); save(); dlg.close(); render(); };
  $('#f').onsubmit = () => {
    const sub = [...$('#f-subs').children].map(r => ({ t: r.querySelector('input').value.trim(), done: r.dataset.done === 'true' })).filter(s => s.t);
    const obj = {
      id: id || uid(), title: $('#f-title').value.trim(), desc: $('#f-desc').value.trim(), cat, due: $('#f-due').value, hours: +$('#f-hours').value || '',
      star, repeat: $('#f-rep').value, sub, done: sub.length ? sub.every(s => s.done) : (t.done || false),
    };
    if (id) tasks[tasks.findIndex(x => x.id === id)] = obj; else tasks.push(obj);
    save(); render();
  };
}

/* ---------- рендер и события ---------- */
function render() {
  $('#view').innerHTML = { tasks: viewTasks, cal: viewCal, load: viewLoad }[state.tab]();
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab));
}
document.addEventListener('click', e => {
  const g = s => e.target.closest(s);
  let el;
  if ((el = g('[data-tab]'))) { state.tab = el.dataset.tab; render(); }
  else if (g('#addBtn')) openDlg(null, state.tab === 'cal' ? state.sel : null);
  else if ((el = g('[data-add]'))) openDlg(null, el.dataset.add);
  else if ((el = g('[data-toggle]'))) toggleTask(el.dataset.toggle);
  else if ((el = g('[data-sub]'))) { const [id, i] = el.dataset.sub.split(':'); toggleSub(id, +i); }
  else if ((el = g('[data-desc]'))) { const k = el.dataset.desc; state.open.has(k) ? state.open.delete(k) : state.open.add(k); render(); }
  else if ((el = g('[data-edit]'))) openDlg(el.dataset.edit);
  else if ((el = g('[data-filter]'))) { state.filter = el.dataset.filter; render(); }
  else if ((el = g('[data-calf]'))) { state.calFilter = el.dataset.calf; render(); }
  else if ((el = g('[data-day]'))) { state.sel = el.dataset.day; render(); }
  else if ((el = g('[data-m]'))) { const [y, m] = state.month.split('-').map(Number); state.month = iso(new Date(y, m - 1 + +el.dataset.m, 1)).slice(0, 7); render(); }
  else if ((el = g('[data-w]'))) { const n = +el.dataset.w; state.week = n ? addDays(state.week, n) : mondayOf(today()); render(); }
});
render();
pawsLayer();
walkers();
