'use strict';
/* Нарисованные собачки (SVG). Анимация — в style.css */

function dogWalk(o = {}) {
  const c = { fur: '#6b3a22', fur2: '#44210f', belly: '#b27a4c', collar: '#78a974', ...o };
  const leg = (x, cls) => `<g class="leg ${cls}"><rect x="${x}" y="50" width="10" height="27" rx="5" fill="var(--fur2)"/><ellipse cx="${x + 5}" cy="77" rx="8" ry="3.6" fill="var(--fur2)"/></g>`;
  return `<svg class="dog walkdog" viewBox="0 0 210 90" style="--fur:${c.fur};--fur2:${c.fur2};--belly:${c.belly};--collar:${c.collar}" aria-hidden="true">
  <g class="bob">
    <path class="tail" d="M34 40 Q10 36 14 14" fill="none" stroke="var(--fur)" stroke-width="7" stroke-linecap="round"/>
    ${leg(46, 'a')}${leg(66, 'b')}${leg(122, 'b')}${leg(144, 'a')}
    <ellipse cx="92" cy="44" rx="66" ry="18" fill="var(--fur)"/>
    <ellipse cx="100" cy="55" rx="46" ry="6" fill="var(--belly)" opacity=".55"/>
    <ellipse cx="150" cy="38" rx="20" ry="16" fill="var(--fur)"/>
    <path d="M141 50 Q150 58 160 49" fill="none" stroke="var(--collar)" stroke-width="5" stroke-linecap="round"/>
    <ellipse cx="166" cy="32" rx="16" ry="13" fill="var(--fur)"/>
    <ellipse cx="185" cy="39" rx="15" ry="7" fill="var(--belly)"/>
    <circle cx="198" cy="37" r="4" fill="#241611"/>
    <circle cx="172" cy="29" r="2.5" fill="#1b1210"/>
    <g transform="rotate(16 160 38)"><ellipse class="ear" cx="160" cy="40" rx="7" ry="14" fill="var(--fur2)"/></g>
  </g></svg>`;
}

function dogSit(o = {}) {
  const c = { fur: '#6b3a22', fur2: '#44210f', snout: '#b27a4c', scarf: '#78a974', ...o };
  return `<svg class="dog sit" viewBox="0 0 140 175" style="--fur:${c.fur};--fur2:${c.fur2};--snout:${c.snout};--scarf:${c.scarf}" aria-hidden="true">
  <ellipse cx="70" cy="171" rx="42" ry="4" fill="rgba(0,0,0,.08)"/>
  <path class="tail" d="M96 152 Q124 152 126 124" fill="none" stroke="var(--fur2)" stroke-width="9" stroke-linecap="round"/>
  <ellipse cx="70" cy="124" rx="34" ry="44" fill="var(--fur)"/>
  <ellipse cx="70" cy="134" rx="17" ry="30" fill="var(--snout)" opacity=".5"/>
  <ellipse cx="54" cy="152" rx="9" ry="20" fill="var(--fur)"/><ellipse cx="86" cy="152" rx="9" ry="20" fill="var(--fur)"/>
  <ellipse cx="53" cy="168" rx="11" ry="5.5" fill="var(--fur2)"/><ellipse cx="87" cy="168" rx="11" ry="5.5" fill="var(--fur2)"/>
  <path d="M42 96 Q70 112 98 96 L90 117 Q70 127 50 117 Z" fill="var(--scarf)"/>
  <path d="M62 114 L70 140 L80 114 Z" fill="var(--scarf)"/>
  <g fill="#fff" opacity=".85"><circle cx="54" cy="103" r="2.2"/><circle cx="70" cy="109" r="2.2"/><circle cx="86" cy="103" r="2.2"/><circle cx="62" cy="118" r="2"/><circle cx="78" cy="118" r="2"/><circle cx="70" cy="128" r="2"/></g>
  <g class="head">
    <g transform="rotate(10 38 60)"><ellipse class="earL" cx="38" cy="70" rx="13" ry="27" fill="var(--fur2)"/></g>
    <g transform="rotate(-10 102 60)"><ellipse class="earR" cx="102" cy="70" rx="13" ry="27" fill="var(--fur2)"/></g>
    <ellipse cx="70" cy="62" rx="31" ry="29" fill="var(--fur)"/>
    <ellipse cx="70" cy="77" rx="16" ry="12.5" fill="var(--snout)"/>
    <ellipse class="tongue" cx="70" cy="85" rx="4" ry="5" fill="#e8838f"/>
    <path d="M70 73 V78 M62 79 Q70 85 78 79" fill="none" stroke="#241611" stroke-width="1.6" stroke-linecap="round"/>
    <ellipse cx="70" cy="69" rx="6.5" ry="4.5" fill="#241611"/>
    <ellipse cx="57" cy="46" rx="3.6" ry="2" fill="var(--snout)" opacity=".85"/><ellipse cx="83" cy="46" rx="3.6" ry="2" fill="var(--snout)" opacity=".85"/>
    <g class="eyes"><circle cx="57" cy="55" r="4" fill="#1b1210"/><circle cx="83" cy="55" r="4" fill="#1b1210"/><circle cx="58.4" cy="53.6" r="1.3" fill="#fff"/><circle cx="84.4" cy="53.6" r="1.3" fill="#fff"/></g>
  </g></svg>`;
}

function dogSleep(o = {}) {
  const c = { fur: '#c98f55', fur2: '#8f5a2c', snout: '#e8c796', ...o };
  return `<svg class="dog sleep" viewBox="0 0 200 100" style="--fur:${c.fur};--fur2:${c.fur2};--snout:${c.snout}" aria-hidden="true">
  <ellipse cx="105" cy="95" rx="84" ry="4" fill="rgba(0,0,0,.08)"/>
  <g class="breathe">
    <path d="M176 72 Q198 68 190 90" fill="none" stroke="var(--fur2)" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="110" cy="68" rx="72" ry="26" fill="var(--fur)"/>
    <ellipse cx="160" cy="86" rx="16" ry="9" fill="var(--fur2)"/>
  </g>
  <ellipse cx="52" cy="74" rx="24" ry="19" fill="var(--fur)"/>
  <ellipse cx="34" cy="80" rx="14" ry="9" fill="var(--snout)"/>
  <ellipse cx="22" cy="78" rx="4.2" ry="3" fill="#241611"/>
  <path d="M46 68 q6 5 12 0" fill="none" stroke="#241611" stroke-width="2" stroke-linecap="round"/>
  <g transform="rotate(-10 68 76)"><ellipse cx="68" cy="78" rx="9" ry="16" fill="var(--fur2)"/></g>
  <ellipse cx="46" cy="92" rx="13" ry="5.5" fill="var(--fur2)"/>
  <g font-family="Montserrat,sans-serif" font-style="italic" font-weight="600" fill="#777">
    <text class="z z1" x="30" y="52" font-size="12">z</text>
    <text class="z z2" x="40" y="44" font-size="15">z</text>
    <text class="z z3" x="52" y="34" font-size="18">z</text>
  </g></svg>`;
}

/* лапки на фоне */
function pawsLayer() {
  const el = document.createElement('div');
  el.className = 'paws'; el.setAttribute('aria-hidden', 'true');
  const paw = '<svg viewBox="0 0 40 40"><ellipse cx="20" cy="27" rx="9" ry="8"/><ellipse cx="8" cy="17" rx="4" ry="5.5"/><ellipse cx="16" cy="9" rx="4" ry="5.5"/><ellipse cx="25" cy="9" rx="4" ry="5.5"/><ellipse cx="33" cy="17" rx="4" ry="5.5"/></svg>';
  for (let i = 0; i < 9; i++) {
    const s = document.createElement('span');
    s.className = 'paw'; s.innerHTML = paw;
    s.style.cssText = `left:${6 + i * 11 + Math.random() * 5}%;width:${26 + Math.random() * 20}px;--d:${16 + Math.random() * 14}s;--r:${-30 + Math.random() * 60}deg;animation-delay:${-Math.random() * 28}s`;
    el.appendChild(s);
  }
  document.body.prepend(el);
}

/* гуляющие по низу экрана */
function walkers() {
  const w = document.createElement('div');
  w.setAttribute('aria-hidden', 'true');
  w.innerHTML = `<div class="walker r">${dogWalk()}</div>
    <div class="walker l">${dogWalk({ fur: '#d9a96a', fur2: '#a8742f', belly: '#f0d3a2', collar: '#e58b97' })}</div>`;
  document.body.appendChild(w);
}
