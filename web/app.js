try { document.fonts && document.fonts.load("16px 'Demon Slave'"); } catch (e) {}
/* ══════════════════════════════════════════════════════════════
   NIZAR KILLFEED · NUI APP
   ══════════════════════════════════════════════════════════════ */
'use strict';

const RES = (window.GetParentResourceName && GetParentResourceName()) || 'Nizar-Killfeed';
const post = (name, data) =>
    fetch(`https://${RES}/${name}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(data || {}),
    }).catch(() => {});

/* ──────────────────────────────────────────────────────────────
   STATE
   ────────────────────────────────────────────────────────────── */
let S = {
    variant: 8, preset: '', uiColor: '#ee1c3e', font: 'Demon Slave', accent: '#ee1c3e', scale: 1.0,
    duration: 6, maxEntries: 5,
    streak: true, distance: false, headshotIcon: true, weaponIcons: true,
    envIcons: true, killFx: 2, fxY: 47, sounds: true, streamer: false,
    blood: true, bloodTime: 4, bloodAmount: 1.0,
    x: 72, y: 72,
};
let HARD_MAX = 6;
let editorOpen = false;
let demoTimer = null;
let saveTimer = null;

const FONTS = ['Demon Slave'];

const VARIANTS = [
    { id: 8,  name: 'Tactical' },
    { id: 1,  name: 'Classic Strip' },
    { id: 2,  name: 'Blade' },
    { id: 3,  name: 'Slim Line' },
    { id: 4,  name: 'Badge Chips' },
    { id: 7,  name: 'Glass Dark' },
    { id: 9,  name: 'Pill' },
    { id: 10, name: 'Heavy Block' },
    { id: 11, name: 'Ghost' },
    { id: 12, name: 'Gradient Sweep' },
    { id: 13, name: 'Sidebar' },
    { id: 14, name: 'Arcade' },
    { id: 15, name: 'Terminal' },
    { id: 16, name: 'Neon Glow' },
    { id: 18, name: 'CS:GO' },
    { id: 19, name: 'Modern Warfare' },
    { id: 20, name: 'Valorant' },
    { id: 22, name: 'Siege' },
    { id: 23, name: 'Elimination' },
    { id: 24, name: 'Apex' },
    { id: 25, name: 'Wasted' },
    { id: 26, name: 'Fragged' },
    { id: 28, name: 'Hologram' },
    { id: 30, name: 'Shard' },
    { id: 31, name: 'Royale' },
    { id: 32, name: 'Executioner' },
];

/* ──────────────────────────────────────────────────────────────
   THEME PRESETS - one click = full ready-made look
   (variant + font + accent + feature toggles)
   ────────────────────────────────────────────────────────────── */
const PRESETS = [
    { name: 'Minimal Clean',   sub: 'Slim Line',           patch: { variant: 3,  font: 'Demon Slave', accent: '#ffffff', streak: true,  distance: false, headshotIcon: true, weaponIcons: true,  envIcons: false, killFx: 0 } },
    { name: 'Pure Glass',      sub: 'Glass Dark',   patch: { variant: 7,  font: 'Demon Slave', accent: '#4d9dff', streak: true,  distance: false, headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 1 } },
    { name: 'Cyber Neon',      sub: 'Neon Glow',        patch: { variant: 16, font: 'Demon Slave', accent: '#2ee6d0', streak: true,  distance: false, headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 5 } },
    { name: 'Tactical Ops',    sub: 'Tactical',     patch: { variant: 8,  font: 'Demon Slave', accent: '#3fe05a', streak: true,  distance: true,  headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 0 } },
    { name: 'Street Arcade',   sub: 'Arcade',          patch: { variant: 14, font: 'Demon Slave', accent: '#ffd02e', streak: true,  distance: false, headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 4 } },
    { name: 'Terminal',        sub: 'Terminal',   patch: { variant: 15, font: 'Demon Slave', accent: '#3fe05a', streak: true,  distance: true,  headshotIcon: true, weaponIcons: true,  envIcons: false, killFx: 0 } },
    { name: 'Phantom',         sub: 'Ghost',    patch: { variant: 11, font: 'Demon Slave', accent: '#ffffff', streak: false, distance: false, headshotIcon: true, weaponIcons: true,  envIcons: false, killFx: 0 } },
    { name: 'Royal',           sub: 'Pill',         patch: { variant: 9,  font: 'Demon Slave', accent: '#b02eff', streak: true,  distance: false, headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 1 } },
    { name: 'Blade Runner',    sub: 'Blade',            patch: { variant: 2,  font: 'Demon Slave', accent: '#ff2e63', streak: true,  distance: false, headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 3 } },
    { name: 'Heavy Metal',     sub: 'Heavy Block',        patch: { variant: 10, font: 'Demon Slave', accent: '#ff8a00', streak: true,  distance: true,  headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 4 } },
    { name: 'CS Legacy',       sub: 'CS:GO',               patch: { variant: 18, font: 'Demon Slave', accent: '#e04444', streak: false, distance: false, headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 0 } },
    { name: 'Task Force',      sub: 'Modern Warfare',     patch: { variant: 19, font: 'Demon Slave', accent: '#c3d17a', streak: true,  distance: true,  headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 1 } },
    { name: 'Radiant',         sub: 'Valorant',         patch: { variant: 20, font: 'Demon Slave', accent: '#ff4655', streak: true,  distance: false, headshotIcon: true, weaponIcons: true,  envIcons: false, killFx: 2 } },
    { name: 'Champion',        sub: 'Apex',         patch: { variant: 24, font: 'Demon Slave', accent: '#ff3c3c', streak: true,  distance: false, headshotIcon: true, weaponIcons: true,  envIcons: true,  killFx: 2 } },
    { name: 'GTA Wasted',      sub: 'Wasted',             patch: { variant: 25, font: 'Demon Slave', accent: '#e8382f', streak: false, distance: false, headshotIcon: true, weaponIcons: true,  envIcons: false, killFx: 1 } },
];

/* ──────────────────────────────────────────────────────────────
   ICONS (inline SVG, fill = currentColor)
   ────────────────────────────────────────────────────────────── */
const svg = (inner, vb = '0 0 24 24') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

const GUN_VB = '0 0 34 16';
const ICONS = {
    pistol:   svg('<path d="M23.6 1.6h2.2v1.7h-2.2z"/><path d="M2 3.2h24v4.4h-6.2l-2 7.8h-6l1.8-7.4H10c-2 0-3.4-1-3.9-2.6L2 5.2z"/>', GUN_VB),
    smg:      svg('<rect x="1" y="3.6" width="27" height="4.6"/><rect x="28" y="4.7" width="5" height="2.3"/><rect x="4" y="1.7" width="2.8" height="1.9"/><path d="M12.6 8.2h5l-.4 7.2h-4.6z"/><path d="M20.4 8.2h4.6l-1.8 6h-4.4z"/><path d="M1 8.2h3.8v2.4H1z"/>', GUN_VB),
    rifle:    svg('<path d="M1 5.2h6.4v5.2l-6.4.8z"/><rect x="6.4" y="4.4" width="17.6" height="4.2"/><rect x="24" y="5.2" width="9" height="2.2"/><rect x="9.6" y="2.3" width="2.2" height="2.1"/><rect x="20.4" y="2.3" width="2.2" height="2.1"/><path d="M13.4 8.6h4.8l-1.8 6.6h-4.6z"/><path d="M19.6 8.6h3.8l-1.7 5h-3.6z"/>', GUN_VB),
    sniper:   svg('<path d="M1 6.6h6.6v4.8H1z"/><rect x="7.4" y="6" width="15" height="3.2"/><rect x="22.4" y="6.8" width="9.4" height="1.7"/><rect x="31.4" y="6.1" width="2" height="3.1"/><rect x="10.4" y="1.8" width="8.6" height="2.8" rx="1.4"/><rect x="13.6" y="4.6" width="2.2" height="1.4"/><path d="M16.8 9.2h3.6l-1.3 4.8h-3.5z"/><rect x="9.4" y="9.2" width="3.8" height="3.2"/>', GUN_VB),
    shotgun:  svg('<path d="M1 5h6.8v5.6H1z"/><rect x="7.4" y="4.6" width="12.4" height="3.8"/><rect x="19.6" y="5.2" width="12.8" height="2.1"/><rect x="19.6" y="8" width="7.2" height="2.8" rx="1.3"/>', GUN_VB),
    mg:       svg('<path d="M1 4.6h6.4v5H1z"/><rect x="7" y="4" width="16.6" height="4.4"/><rect x="23.4" y="4.9" width="9" height="2.2"/><rect x="10.6" y="8.4" width="6.2" height="5.8"/><path d="M18.8 8.4h3.8l-1.5 5h-3.6z"/><path d="M25.4 7.1h1.6l-2.2 6.3H23z"/><path d="M28.8 7.1h1.6l2.4 6.3H31z"/>', GUN_VB),
    heavy:    svg('<path d="M1.6 5.4l3.6 1v3.2l-3.6 1z"/><rect x="5" y="6" width="20" height="3.2"/><path d="M25 4.2l8 3.4-8 3.4z"/><rect x="12.6" y="2.6" width="3.6" height="3.4"/><path d="M9.6 9.2h4l-1.3 5H8.4z"/><rect x="16.2" y="9.2" width="3.2" height="3"/>', GUN_VB),
    melee:    svg('<path d="M12.4 4.6L33 7.4l-20.6 3.2q-2.9-3.1 0-6z"/><rect x="9.6" y="3.2" width="2.4" height="9.6" rx="1"/><path d="M1.6 5.2h7.4v5.4H1.6q-1.9-2.7 0-5.4z"/>', GUN_VB),
    unarmed:  svg('<path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11h1V4.8a1.5 1.5 0 0 1 3 0V11h1V5.6a1.5 1.5 0 0 1 3 0V13h1V8.4a1.4 1.4 0 0 1 2.8 0V15c0 4-2.6 7-6.9 7C10 22 7.6 19.7 6 16.7L4.2 13c-.6-1.2.9-2.4 2-1.5z"/>'),
    throwable:svg('<rect x="9.2" y="1.2" width="6.4" height="2.7" rx="1.2"/><rect x="11" y="3.7" width="2.8" height="1.8"/><ellipse cx="12.4" cy="13" rx="6.7" ry="7.6"/><path d="M15.9 1.5q4.5.5 5.5 5l-2 .5q-.8-3.3-3.9-3.7z"/>'),
    fire:     svg('<path d="M12 1.8c3.2 4 7.2 6.4 7.2 12.1A7.2 7.2 0 0 1 4.8 14c0-2.9 1.5-5 3.1-7 .5 2 1.5 3.2 3.2 3.3-1.1-3-.2-6 .9-8.5z"/>'),
    stun:     svg('<path d="M13.5 1.5L4 14h6.2L9 22.5 19.8 9.5h-6.5z"/>'),
    car:      svg('<path d="M2.6 12.6l1.9-4.8C4.9 6.8 5.7 6.4 6.7 6.4h10.6c1 0 1.8.4 2.2 1.4l1.9 4.8v5.2h-2.6a2.1 2.1 0 0 1-4.2 0H9.4a2.1 2.1 0 0 1-4.2 0H2.6zM5.9 8.1l-1.2 3.3h14.6l-1.2-3.3c-.1-.3-.4-.5-.8-.5H6.7c-.4 0-.7.2-.8.5z"/>'),
    bike:     svg('<circle cx="5.6" cy="16.4" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="18.4" cy="16.4" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.6 16.4l3.7-7h4.4l3 5.6-1.7 1-2.5-4.6H10.5l-3.2 6z"/><path d="M13 6.8h3.5l1.3 2.6-1.6.8-1-2h-2.2z"/>'),
    heli:     svg('<path d="M2 3.4h20V5H2z"/><path d="M11.2 5h1.6v2.4h-1.6z"/><ellipse cx="10.8" cy="12.4" rx="6.4" ry="4.6"/><path d="M16.4 10.6h6.2L20.8 14h-4.4z"/><path d="M5.6 18.6h12.8v1.6H5.6z"/><path d="M10 17h1.6v1.6H10z"/>'),
    plane:    svg('<path d="M10.4 2h3.2l1 8 7.4 4.2v2.2l-7.4-1.4-.8 4.2 2.2 1.8V22H8v-1l2.2-1.8-.8-4.2L2 16.4v-2.2L9.4 10z"/>'),
    boat:     svg('<path d="M2.6 15h18.8l-3.2 5.4H5.8z"/><path d="M11 3h1.8v10H11z"/><path d="M13.6 4.2l6 8.2h-6z"/>'),
    fall:     svg('<path d="M10.9 2h2.2v10.4l4.2-4.2 1.6 1.6L12 16.7 5.1 9.8l1.6-1.6 4.2 4.2z"/><path d="M4 19h16v2.2H4z"/>'),
    drown:    svg('<path d="M1.5 8.2c1.8-2.4 3.7-2.4 5.5 0s3.7 2.4 5.5 0 3.7-2.4 5.5 0 3.4 2.4 4.5.6v3.4c-1.8 2-3.4 1.7-5 -.4-1.8-2.4-3.7-2.4-5.5 0s-3.7 2.4-5.5 0c-1.6-2.1-3.2-2.4-5-.4z"/><path d="M1.5 14.6c1.8-2.4 3.7-2.4 5.5 0s3.7 2.4 5.5 0 3.7-2.4 5.5 0 3.4 2.4 4.5.6v3.4c-1.8 2-3.4 1.7-5-.4-1.8-2.4-3.7-2.4-5.5 0s-3.7 2.4-5.5 0c-1.6-2.1-3.2-2.4-5-.4z"/>'),
    animal:   svg('<ellipse cx="6" cy="8.2" rx="2.1" ry="2.8"/><ellipse cx="18" cy="8.2" rx="2.1" ry="2.8"/><ellipse cx="10.2" cy="5.4" rx="2" ry="2.7"/><ellipse cx="13.8" cy="5.4" rx="2" ry="2.7"/><path d="M12 10c3.2 0 6 2.6 6 5.4 0 2.4-1.6 3.8-3.4 3.8-1 0-1.8-.4-2.6-.4s-1.6.4-2.6.4c-1.8 0-3.4-1.4-3.4-3.8C6 12.6 8.8 10 12 10z"/>'),
    skull:    svg('<path fill-rule="evenodd" d="M12 1.8a8.7 8.7 0 0 0-8.7 8.7c0 3.4 1.9 6 4.6 7.4v3h2.3v-2.3h1.6v2.3h1.6v-2.3H15v2.3h2.3v-3.2c2.8-1.4 4.6-4 4.6-7.2A8.7 8.7 0 0 0 12 1.8zM8.4 13a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4zm7.2 0a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4zm-4.4 2.6l.8-1.8.8 1.8z"/>'),
    headshot: svg(
        // speed lines + bullet flying in
        '<rect x="0" y="9.3" width="3.4" height="1.3" rx="0.65"/><rect x="0" y="12.4" width="2.4" height="1.3" rx="0.65"/>' +
        '<path d="M4 9.7h3.3c1.9 0 3.2.7 3.9 1.9-.7 1.2-2 1.9-3.9 1.9H4z"/>' +
        // impact burst fragments
        '<path d="M12.4 5.3l1.2 3-2.1.7zM8.8 8.1l2.7 1.7-1.5 1.6zM12.8 18l-1-3 2.1-.6zM9 15.6l2.5-1.8 1.1 1.9z"/>' +
        // skull with entry hole + cranium crack (even-odd cutouts)
        '<g transform="translate(11 1.2) scale(0.8)"><path fill-rule="evenodd" d="M12 1.8a8.7 8.7 0 0 0-8.7 8.7c0 3.4 1.9 6 4.6 7.4v3h2.3v-2.3h1.6v2.3h1.6v-2.3H15v2.3h2.3v-3.2c2.8-1.4 4.6-4 4.6-7.2A8.7 8.7 0 0 0 12 1.8zM8.4 13a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4zm7.2 0a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4zm-4.4 2.6l.8-1.8.8 1.8zM6.4 9.2a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM4.6 7.6l.9-2.1-.6-1.9.8-.3.7 2.1-.9 2.1z"/></g>',
        '0 0 30 24'),
    dist:     svg('<path d="M8.6 7.4h6.8v3.4H8.6z"/><circle cx="6.6" cy="14.4" r="4.6"/><circle cx="17.4" cy="14.4" r="4.6"/>'),
    other:    svg('<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 6h2v7h-2zM11 15h2v2.4h-2z"/>'),
};
ICONS.suicide = ICONS.skull;
ICONS.vehicle = ICONS.car;

const ENV_ICONS = { car: ICONS.car, bike: ICONS.bike, heli: ICONS.heli, plane: ICONS.plane, boat: ICONS.boat };

/* editor option icons (periwinkle) */
const OICONS = {
    font:  svg('<path d="M4 20L10.8 4h2.4L20 20h-2.9l-1.6-4H8.4l-1.6 4zm5.3-6.4h5.3L12 7z"/>'),
    color: svg('<path d="M12 2a10 10 0 0 0 0 20c1.2 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 10.8C22 5.9 17.5 2 12 2zM6.5 12a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zm3.6-4.6a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zm5.4 0a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zm3.4 4a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2z"/>'),
    streak: ICONS.skull,
    dist:  ICONS.dist,
    hs:    ICONS.headshot,
    weap:  ICONS.rifle,
    env:   ICONS.car,
    flash: svg('<path d="M13.5 1.5L4 14h6.2L9 22.5 19.8 9.5h-6.5z"/>'),
    sound: svg('<path d="M3 9v6h4l6 5V4L7 9zm14.6 3a4.4 4.4 0 0 0-2.4-4v8a4.4 4.4 0 0 0 2.4-4zm-2.4-8.6v2.1a6.6 6.6 0 0 1 0 13v2.1a8.7 8.7 0 0 0 0-17.2z"/>'),
    blood: svg('<path d="M12 2.2c3.6 5 7 8.2 7 12.6a7 7 0 0 1-14 0c0-4.4 3.4-7.6 7-12.6z"/>'),
    time:  svg('<path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 5h-2v6l4.6 2.8 1-1.7-3.6-2.1z"/>'),
    scale: svg('<path d="M3 3h8v2.4H7.1l4.4 4.4-1.7 1.7-4.4-4.4V11H3zm18 18h-8v-2.4h3.9l-4.4-4.4 1.7-1.7 4.4 4.4V13H21z"/>'),
    rows:  svg('<path d="M3 4h18v3.4H3zm0 6.3h18v3.4H3zm0 6.3h18V20H3z"/>'),
    cam:   svg('<path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h9A2.5 2.5 0 0 1 16 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 2 17.5zM17 10l5-3.4v10.8L17 14z"/>'),
    move:  svg('<path d="M12 1l3.2 3.2h-2.2v5.6h5.6V7.6L22 11l-3.4 3.4v-2.2h-5.6v5.6h2.2L12 21l-3.2-3.2h2.2v-5.6H5.4v2.2L2 11l3.4-3.4v2.2H11V4.2H8.8z"/>'),
    reset: svg('<path d="M12 4V0L7 5l5 5V6a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/>'),
    play:  svg('<path d="M7 4l13 8-13 8z"/>'),
    edit:  svg('<path d="M3 17.2V21h3.8L18 9.8 14.2 6zM20.7 7.1a1 1 0 0 0 0-1.4l-2.4-2.4a1 1 0 0 0-1.4 0l-1.8 1.8 3.8 3.8z"/>'),
};

/* ──────────────────────────────────────────────────────────────
   AUDIO (tiny web-audio synth)
   ────────────────────────────────────────────────────────────── */
let AC = null;
function beep(freq, dur, vol, delay = 0, type = 'triangle') {
    if (!S.sounds) return;
    try {
        AC = AC || new AudioContext();
        const t = AC.currentTime + delay;
        const o = AC.createOscillator();
        const g = AC.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(AC.destination);
        o.start(t);
        o.stop(t + dur + 0.05);
    } catch (e) {}
}
const sfxKill     = () => { beep(880, 0.09, 0.06); beep(1320, 0.11, 0.05, 0.07); };
const sfxHeadshot = () => { beep(1180, 0.08, 0.06); beep(1760, 0.13, 0.06, 0.06); beep(2350, 0.1, 0.04, 0.13); };
const sfxUi       = () => beep(640, 0.05, 0.025, 0, 'sine');

/* ──────────────────────────────────────────────────────────────
   SETTINGS APPLY
   ────────────────────────────────────────────────────────────── */
function hexToRgba(hex, a) {
    const m = hex.replace('#', '');
    const n = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    const v = parseInt(n, 16);
    return `rgba(${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255}, ${a})`;
}

function hexToHsl(hex) {
    const m = hex.replace('#', '');
    const n = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    const v = parseInt(n, 16);
    const r = ((v >> 16) & 255) / 255, g = ((v >> 8) & 255) / 255, b = (v & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
    }
    return [h, s * 100, l * 100];
}

function uiShift(hex, dh, dl) {
    const [h, s, l] = hexToHsl(hex);
    return hslToHex((h + dh + 360) % 360, Math.min(100, s), Math.max(4, Math.min(96, l + dl)));
}

function applySettings() {
    S.font = 'Demon Slave'; // single font: Demon Slave
    S.killFx = 2; // Skull Pop is the only kill effect
    const r = document.documentElement.style;
    const L = hexToHsl(S.accent)[2];
    // one GLOBAL color drives the killfeed accent AND the whole editor UI
    S.uiColor = S.accent;
    r.setProperty('--accent', S.accent);
    r.setProperty('--accent-soft', hexToRgba(S.accent, L > 75 ? 0.16 : 0.28));
    r.setProperty('--accent-glow', hexToRgba(S.accent, L > 75 ? 0.28 : 0.55));
    // dark text on light accent backgrounds (white-on-white fix)
    r.setProperty('--accent-text', L > 62 ? '#14171e' : '#ffffff');
    r.setProperty('--ui', S.accent);
    r.setProperty('--ui-2', uiShift(S.accent, 8, 9));
    r.setProperty('--ui-dark', uiShift(S.accent, -4, -16));
    r.setProperty('--ui-soft', hexToRgba(S.accent, 0.14));
    r.setProperty('--ui-glow', hexToRgba(S.accent, 0.35));
    r.setProperty('--ui-text', L > 62 ? '#14171e' : '#ffffff');
    r.setProperty('--kfx-y', S.fxY);
    // very light accents: disable decorative glows (they read as white smudges)
    document.body.classList.toggle('flat-accent', L > 75);
    r.setProperty('--kf-x', S.x);
    r.setProperty('--kf-y', S.y);
    r.setProperty('--kf-scale', S.scale);
    r.setProperty('--kf-font', "'Demon Slave', sans-serif");
    const feed = document.getElementById('feed');
    feed.classList.toggle('align-right', S.x > 50);
    feed.classList.toggle('align-left', S.x <= 50);
}

function queueSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => post('save', S), 350);
}

/* ──────────────────────────────────────────────────────────────
   ENTRY RENDERER
   ────────────────────────────────────────────────────────────── */
function fmtName(who, isMine, isVictim, d) {
    if (!who) return ['??', ''];
    if (S.streamer || d.demo === 'streamer') {
        if (isMine) return ['YOU', '#??'];
        return [isVictim ? 'ENEMY' : 'PLAYER', '#??'];
    }
    const shown = (who.cid && who.cid > 0) ? who.cid : who.id;
    return [who.name, shown > 0 ? `#${shown}` : ''];
}

function buildEntry(d) {
    const el = document.createElement('div');
    el.className = 'kf';
    el.dataset.v = S.variant;
    el.dataset.cat = d.cat || 'other';
    if (d.mine) el.classList.add('mine');
    if (d.victimMine) el.classList.add('vmine');
    if (d.headshot && S.headshotIcon) el.classList.add('hs');

    const inn = document.createElement('div');
    inn.className = 'kf-in';

    const span = (cls, html) => {
        const s = document.createElement('span');
        s.className = 'p ' + cls;
        s.innerHTML = html;
        inn.appendChild(s);
        return s;
    };

    // streak
    if (S.streak && d.mine && d.streak > 1) {
        span('pk-streak', `${ICONS.skull}${d.streak}x`);
    }

    const suicide = d.suicide || !d.killer;

    if (!suicide) {
        const [kn, ki] = fmtName(d.killer, d.mine, false, d);
        span('pk-killer', `${esc(kn)}<em>${ki}</em>`);
        if (S.envIcons && d.kEnv && ENV_ICONS[d.kEnv]) span('pk-kenv', ENV_ICONS[d.kEnv]);
    }

    if (S.weaponIcons) {
        // real GTA weapon icon (RAGE wiki) when available, SVG category fallback
        const img = d.wkey && window.WEAPON_IMG && window.WEAPON_IMG[d.wkey];
        span('pk-weap', img ? `<img src="img/weapons/${img}" alt="">` : (ICONS[d.cat] || ICONS.other));
    }
    if (d.headshot && S.headshotIcon) span('pk-hs', ICONS.headshot);

    if (S.envIcons && d.vEnv && ENV_ICONS[d.vEnv] && !suicide) span('pk-venv', ENV_ICONS[d.vEnv]);

    const [vn, vi] = fmtName(d.victim, d.victimMine, true, d);
    span('pk-victim', `${esc(vn)}<em>${d.npc ? '' : vi}</em>`);

    if (S.distance && d.distance > 0 && !suicide) {
        span('pk-dist', `${ICONS.dist}${d.distance}m`);
    }

    el.appendChild(inn);
    return el;
}

function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ──────────────────────────────────────────────────────────────
   FEED
   ────────────────────────────────────────────────────────────── */
function addKill(d) {
    const feed = document.getElementById('feed');
    const el = buildEntry(d);
    feed.prepend(el);

    while (feed.children.length > Math.min(S.maxEntries, HARD_MAX)) {
        feed.lastChild.remove();
    }

    setTimeout(() => {
        if (!el.parentNode) return;
        el.classList.add('out');
        setTimeout(() => el.remove(), 320);
    }, S.duration * 1000);

    if (d.mine && !d.demo) {
        playKillFx(d.headshot);
        d.headshot ? sfxHeadshot() : sfxKill();
    }
}

/* ──────────────────────────────────────────────────────────────
   KILL EFFECTS - full-screen flourish on your own kills
   0=off 1=Pulse 2=Skull Pop 3=Blade Slash 4=Shockwave 5=Glitch
   ────────────────────────────────────────────────────────────── */
const KILLFX_NAMES = ['Off', 'Pulse', 'Skull Pop', 'Blade Slash', 'Shockwave', 'Glitch'];

/* filtered noise burst for whooshes / booms / static */
function noiseBurst(dur, freq, vol, delay = 0, type = 'lowpass') {
    if (!S.sounds) return;
    try {
        AC = AC || new AudioContext();
        const t = AC.currentTime + delay;
        const len = Math.max(1, Math.ceil(AC.sampleRate * dur));
        const buf = AC.createBuffer(1, len, AC.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
        const src = AC.createBufferSource();
        src.buffer = buf;
        const f = AC.createBiquadFilter();
        f.type = type;
        f.frequency.setValueAtTime(freq, t);
        f.Q.value = 0.8;
        const g = AC.createGain();
        g.gain.setValueAtTime(vol, t);
        src.connect(f); f.connect(g); g.connect(AC.destination);
        src.start(t);
    } catch (e) {}
}

/* particle spawner - shards, sparks, spikes, dust, noise blocks */
function fxParticles(layer, cls, n, o = {}) {
    const spread = o.spread ?? 220, minDist = o.minDist ?? 55;
    const size = o.size ?? [3, 7], dur = o.dur ?? [0.45, 0.9];
    const delay = o.delay ?? 0, aim = o.aim ?? false;
    const ox = o.ox ?? 50, oy = o.oy ?? 47;
    for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const dist = minDist + Math.random() * spread;
        const tx = Math.cos(a) * dist, ty = Math.sin(a) * dist;
        const s = size[0] + Math.random() * (size[1] - size[0]);
        const d = dur[0] + Math.random() * (dur[1] - dur[0]);
        const rot = aim ? (a * 180 / Math.PI + 90).toFixed(1) : (Math.random() * 720 - 360).toFixed(0);
        const p = document.createElement('i');
        p.className = cls;
        p.style.cssText =
            `left:${ox}%;top:${oy}%;width:${s.toFixed(1)}px;height:${(o.tall ? s * (3.4 + Math.random() * 2.4) : s).toFixed(1)}px;` +
            `--tx:${tx.toFixed(0)}px;--ty:${ty.toFixed(0)}px;--rot:${rot}deg;` +
            `animation-duration:${d.toFixed(2)}s;animation-delay:${(delay + Math.random() * 0.09).toFixed(2)}s`;
        layer.appendChild(p);
    }
}

const fxHTML = (layer, html) => layer.insertAdjacentHTML('beforeend', html);

function playKillFx(hs) {
    S.killFx = S.killFx || 2;
    const layer = document.getElementById('flash');
    layer.innerHTML = '';
    void layer.offsetWidth;

    switch (S.killFx) {
        case 1: // PULSE - white core, double-beat vignette, chromatic ghosts
            fxHTML(layer,
                '<div class="kfx-flashcore"></div>' +
                `<div class="kfx-pulse${hs ? ' hs' : ''}"></div>` +
                '<div class="kfx-chroma c1"></div><div class="kfx-chroma c2"></div>');
            fxParticles(layer, 'kfx-dust', 8, { minDist: 180, spread: 320, size: [2, 4], dur: [0.7, 1.1] });
            break;

        case 2: { // SKULL POP - dim spotlight, slam + ghosts, rings, shards, streaks
            const icon = hs ? ICONS.headshot : ICONS.skull;
            fxHTML(layer,
                '<div class="kfx-dim"></div><div class="kfx-glowspot"></div>' +
                '<div class="kfx-streakline l1"></div><div class="kfx-streakline l2"></div>' +
                '<div class="kfx-ring"></div><div class="kfx-ring r2"></div><div class="kfx-ring r3"></div>' +
                `<div class="kfx-skull ghost g1">${icon}</div><div class="kfx-skull ghost g2">${icon}</div>` +
                `<div class="kfx-skull main${hs ? ' hs' : ''}">${icon}</div>` +
                (hs ? '<div class="kfx-flashcore hs"></div>' : ''));
            fxParticles(layer, 'kfx-shard', hs ? 18 : 12, { minDist: 70, spread: 260, dur: [0.5, 0.95], delay: 0.06, oy: S.fxY });
            fxParticles(layer, 'kfx-spark', hs ? 10 : 6, { minDist: 50, spread: 180, size: [2, 4], dur: [0.4, 0.7], delay: 0.05, oy: S.fxY });
            noiseBurst(0.28, 220, 0.16);
            beep(70, 0.22, 0.1, 0, 'sine');
            break;
        }

        case 3: // BLADE SLASH - glint, blurred streaks, lingering cut lines, sparks
            fxHTML(layer,
                '<div class="kfx-glint"></div>' +
                '<div class="kfx-slashblur"></div><div class="kfx-slash"></div>' +
                '<div class="kfx-slashblur b2"></div><div class="kfx-slash s2"></div>' +
                '<div class="kfx-cutline"></div><div class="kfx-cutline c2"></div>' +
                (hs ? '<div class="kfx-slash s3"></div>' : ''));
            fxParticles(layer, 'kfx-spark', hs ? 16 : 10, { minDist: 30, spread: 200, size: [2, 4], dur: [0.35, 0.7], delay: 0.2, oy: 50 });
            noiseBurst(0.16, 3400, 0.1, 0, 'bandpass');
            noiseBurst(0.16, 2600, 0.1, 0.1, 'bandpass');
            break;

        case 4: // SHOCKWAVE - bright core, triple ring (white/accent/dark), spikes, thump
            fxHTML(layer,
                '<div class="kfx-wavecore"></div>' +
                '<div class="kfx-wave"></div><div class="kfx-wave w2"></div><div class="kfx-wave w3"></div>' +
                '<div class="kfx-thump"></div>' +
                (hs ? '<div class="kfx-flashcore hs"></div>' : ''));
            fxParticles(layer, 'kfx-spike', hs ? 20 : 14, { minDist: 90, spread: 340, size: [2, 3], dur: [0.5, 0.8], aim: true, tall: true, oy: 50 });
            fxParticles(layer, 'kfx-dust', 10, { minDist: 120, spread: 300, size: [2, 5], dur: [0.8, 1.3], oy: 50 });
            noiseBurst(0.4, 140, 0.2);
            beep(55, 0.3, 0.12, 0, 'sine');
            break;

        case 5: { // GLITCH - chromatic panes, slices, noise blocks, scanline sweep
            fxHTML(layer,
                '<div class="kfx-chromapane c-cyan"></div><div class="kfx-chromapane c-mag"></div>' +
                '<div class="kfx-glfade"></div><div class="kfx-scan"></div>');
            const n = hs ? 12 : 8;
            for (let i = 0; i < n; i++) {
                const top = Math.random() * 100, h = 2 + Math.random() * 9;
                const dx = Math.random() * 38 - 19;
                const hue = i % 3 === 0 ? 'var(--accent)' : (i % 3 === 1 ? 'rgba(0,255,240,0.5)' : 'rgba(255,0,180,0.5)');
                fxHTML(layer, `<i class="kfx-slice" style="top:${top.toFixed(1)}%;height:${h.toFixed(1)}px;background:${hue};--dx:${dx.toFixed(0)}px;animation-delay:${(Math.random() * 0.16).toFixed(2)}s"></i>`);
            }
            for (let i = 0; i < (hs ? 14 : 9); i++) {
                const w = 8 + Math.random() * 60, h2 = 3 + Math.random() * 14;
                fxHTML(layer, `<i class="kfx-noise" style="left:${(Math.random() * 96).toFixed(1)}%;top:${(Math.random() * 96).toFixed(1)}%;width:${w.toFixed(0)}px;height:${h2.toFixed(0)}px;animation-delay:${(Math.random() * 0.2).toFixed(2)}s"></i>`);
            }
            for (let i = 0; i < 3; i++) beep(300 + Math.random() * 900, 0.05, 0.05, i * 0.06, 'square');
            noiseBurst(0.2, 5000, 0.06, 0, 'highpass');
            break;
        }
    }
    clearTimeout(layer._t);
    layer._t = setTimeout(() => { layer.innerHTML = ''; }, 1500);
}

/* ──────────────────────────────────────────────────────────────
   BLOOD
   ────────────────────────────────────────────────────────────── */
const SPLAT_PATHS = [
    'M50 8c14 2 22 10 26 22 3 10 14 8 16 18 2 11-9 14-10 24-1 9 6 17-2 23-9 7-16-3-27-2-10 1-15 9-25 5-11-4-8-14-14-22-6-7-16-8-14-19 2-10 12-9 16-18C20 28 22 18 32 12c6-3 12-5 18-4z',
    'M55 12c10-4 20 2 24 11 4 8 15 7 16 17 1 9-8 12-10 20-2 9 8 16 0 22-7 6-14-2-23 0-8 2-12 11-21 8-10-3-7-13-13-19-6-6-17-5-17-15 0-9 10-10 13-18 3-7 0-16 8-21 7-5 16-1 23-5z',
    'M48 10c12-3 22 4 26 14 3 8 13 9 14 18 1 10-9 12-12 21-2 8 5 18-4 22-8 4-13-6-23-5-9 1-14 8-22 3-9-5-4-14-10-21-5-7-14-9-11-18 3-9 12-7 17-15 4-7 3-15 12-18 4-2 9-1 13-1z',
    'M52 6c8 0 15 6 18 14 3 9 16 6 19 16 3 9-7 14-8 23-1 8 7 15 0 21-8 6-15-1-24 1-9 2-14 10-23 6-9-4-5-14-11-20-6-6-16-6-15-16 1-9 11-9 14-17 3-8-1-17 7-22 6-4 15-6 23-6z',
];
const dropletCircles = () => {
    let out = '';
    for (let i = 0; i < 7; i++) {
        const a = Math.random() * 6.28, r = 46 + Math.random() * 16;
        out += `<circle cx="${50 + Math.cos(a) * r}" cy="${50 + Math.sin(a) * r}" r="${1.5 + Math.random() * 4}"/>`;
    }
    return out;
};

function bloodHit(amount) {
    if (!S.blood) return;
    const layer = document.getElementById('blood');
    const mult = S.bloodAmount;
    const strength = Math.min(1, (amount / 45)) * mult;
    const count = Math.max(2, Math.round((2 + amount / 9) * mult));
    const fade = Math.max(0.6, S.bloodTime * 0.62);
    const hold = S.bloodTime * 1000 * 0.38;

    // vignette pulse
    let vig = layer.querySelector('.blood-vig');
    if (!vig) {
        vig = document.createElement('div');
        vig.className = 'blood-vig';
        layer.appendChild(vig);
    }
    vig.style.setProperty('--fade', fade + 's');
    vig.classList.remove('fade');
    vig.classList.add('show');
    clearTimeout(vig._t);
    vig._t = setTimeout(() => vig.classList.add('fade'), hold);

    for (let i = 0; i < Math.min(count, 9); i++) {
        const sp = document.createElement('div');
        sp.className = 'splat';
        const size = (70 + Math.random() * 210) * (0.6 + strength * 0.8);
        // bias splatter towards screen edges so the center stays playable
        const edge = Math.random() < 0.65;
        let x, y;
        if (edge) {
            const side = Math.floor(Math.random() * 4);
            x = side === 0 ? Math.random() * 18 : side === 1 ? 82 + Math.random() * 18 : Math.random() * 100;
            y = side === 2 ? Math.random() * 20 : side === 3 ? 78 + Math.random() * 20 : Math.random() * 100;
        } else {
            x = 15 + Math.random() * 70;
            y = 12 + Math.random() * 70;
        }
        sp.style.width = sp.style.height = size + 'px';
        sp.style.left = `calc(${x}vw - ${size / 2}px)`;
        sp.style.top = `calc(${y}vh - ${size / 2}px)`;
        sp.style.transform = `rotate(${Math.random() * 360}deg)`;
        sp.style.setProperty('--o', (0.5 + Math.random() * 0.35) * Math.min(1, 0.55 + strength));
        sp.style.setProperty('--fade', fade + 's');
        const hue = 350 + Math.random() * 10;
        const light = 16 + Math.random() * 12;
        sp.innerHTML = `<svg viewBox="0 0 100 100" style="fill:hsl(${hue},78%,${light}%)"><path d="${SPLAT_PATHS[Math.floor(Math.random() * SPLAT_PATHS.length)]}"/>${dropletCircles()}</svg>`;
        layer.appendChild(sp);
        requestAnimationFrame(() => requestAnimationFrame(() => sp.classList.add('show')));
        setTimeout(() => sp.classList.add('fade'), hold + Math.random() * 400);
        setTimeout(() => sp.remove(), hold + (fade + 1.2) * 1000);
    }
}

/* ──────────────────────────────────────────────────────────────
   DEMO DATA (live preview)
   ────────────────────────────────────────────────────────────── */
const DEMOS = [
    { killer: { id: 12, name: 'You' },   victim: { id: 31, name: 'Enemy' },  cat: 'pistol',  wkey: 'pistol_mk2',    mine: true, streak: 12, demo: 'streamer' },
    { killer: { id: 4, name: 'Nyx' },    victim: { id: 77, name: 'Rex' },    cat: 'sniper',  wkey: 'heavysniper',   headshot: true, distance: 214, demo: 1 },
    { killer: { id: 8, name: 'Ghost' },  victim: { id: 5, name: 'Viper' },   cat: 'rifle',   wkey: 'carbinerifle',  kEnv: 'car', demo: 1 },
    { killer: { id: 3, name: 'Blaze' },  victim: { id: 22, name: 'Tango' },  cat: 'shotgun', wkey: 'pumpshotgun',   headshot: true, mine: true, streak: 5, demo: 1 },
    { killer: { id: 6, name: 'Hawk' },   victim: { id: 2, name: 'Dodo' },    cat: 'heavy',   wkey: 'rpg',           kEnv: 'heli', distance: 96, demo: 1 },
    { killer: { id: 9, name: 'Wraith' }, victim: { id: 14, name: 'Bishop' }, cat: 'smg',     wkey: 'microsmg',      vEnv: 'bike', demo: 1 },
    { victim: { id: 9, name: 'Unlucky' }, suicide: true, cat: 'fall', demo: 1 },
    { killer: { id: 2, name: 'Titan' },  victim: { id: 40, name: 'Pixel' },  cat: 'melee',   wkey: 'knife',         demo: 1 },
    { killer: { id: 5, name: 'Vex' },    victim: { id: 3, name: 'Echo' },    cat: 'fire',    wkey: 'molotov',       demo: 1 },
    { killer: { id: 7, name: 'Storm' },  victim: { id: 55, name: 'Frost' },  cat: 'mg',      wkey: 'combatmg',      kEnv: 'boat', distance: 61, demo: 1 },
];

const DEMO_WKEYS = {
    pistol: ['pistol', 'pistol_mk2', 'combatpistol', 'appistol', 'revolver'],
    smg: ['microsmg', 'smg', 'assaultsmg', 'machinepistol'],
    rifle: ['assaultrifle', 'carbinerifle', 'specialcarbine', 'bullpuprifle', 'advancedrifle'],
    sniper: ['sniperrifle', 'heavysniper', 'marksmanrifle'],
    shotgun: ['pumpshotgun', 'sawnoffshotgun', 'assaultshotgun', 'heavyshotgun'],
    mg: ['mg', 'combatmg', 'gusenberg'],
    heavy: ['rpg', 'grenadelauncher', 'minigun', 'hominglauncher'],
    melee: ['knife', 'bat', 'machete', 'hatchet', 'switchblade'],
    fire: ['molotov'],
    throwable: ['grenade', 'stickybomb', 'pipebomb'],
};

const rnd = a => a[Math.floor(Math.random() * a.length)];
function randomDemo() {
    const names = ['Nyx', 'Ghost', 'Blaze', 'Hawk', 'Wraith', 'Titan', 'Vex', 'Storm', 'Echo', 'Frost', 'Viper', 'Rex'];
    const cats = ['pistol', 'smg', 'rifle', 'sniper', 'shotgun', 'mg', 'heavy', 'melee', 'fire', 'throwable'];
    const cat = rnd(cats);
    const d = {
        killer: { id: 1 + Math.floor(Math.random() * 60), name: rnd(names) },
        victim: { id: 1 + Math.floor(Math.random() * 60), name: rnd(names) },
        cat: cat,
        wkey: rnd(DEMO_WKEYS[cat] || ['pistol']),
        headshot: Math.random() < 0.3,
        distance: Math.floor(Math.random() * 260),
        demo: 1,
    };
    if (Math.random() < 0.28) d.kEnv = rnd(['car', 'bike', 'heli', 'plane', 'boat']);
    if (Math.random() < 0.18) d.vEnv = rnd(['car', 'bike']);
    if (Math.random() < 0.3) { d.mine = true; d.streak = 2 + Math.floor(Math.random() * 14); }
    return d;
}

/* ──────────────────────────────────────────────────────────────
   EDITOR
   ────────────────────────────────────────────────────────────── */
function markCustom() {
    if (S.preset !== '') {
        S.preset = '';
        renderPresets();
    }
}

function renderPresets() {
    const wrap = document.getElementById('ed-presets');
    if (!wrap) return;
    wrap.innerHTML = '';
    PRESETS.forEach(p => {
        const card = document.createElement('div');
        card.className = 'pcard' + (S.preset === p.name ? ' sel' : '');
        card.style.setProperty('--pc', p.patch.accent);
        card.style.setProperty('--pc-soft', hexToRgba(p.patch.accent, 0.3));
        card.innerHTML = `<span class="pdot"></span><span><div class="pname">${p.name}</div><div class="psub">${p.sub}</div></span>`;
        card.addEventListener('click', () => {
            Object.assign(S, p.patch);
            S.preset = p.name;
            applySettings();
            sfxUi();
            queueSave();
            renderPresets();
            renderVariants();
            renderOptions();
            renderHero();
            heroPush(randomDemo());
        });
        wrap.appendChild(card);
    });
}

/* Scale an entry down so it never gets clipped by its preview box.
   NOTE: the scale must go on an animation-free element - the kf-in
   entry animation (fill: both) overrides inline transforms. */
function fitKf(el, pad = 16, boxEl = null) {
    requestAnimationFrame(() => {
        const box = boxEl || el.parentElement;
        if (!box) return;
        const w = el.scrollWidth || el.offsetWidth;
        const avail = box.clientWidth - pad;
        if (w > 0 && avail > 0 && w > avail) {
            el.style.transform = `scale(${Math.max(0.5, avail / w)})`;
            el.style.transformOrigin = 'center';
        } else {
            el.style.transform = '';
        }
    });
}

/* live preview - external floating panel on the right of the editor */
function heroWrap(d) {
    const w = document.createElement('div');
    w.className = 'fitwrap';
    w.appendChild(buildEntry(d));
    return w;
}

function renderHero() {
    const hero = document.getElementById('hero-feed');
    if (!hero) return;
    hero.innerHTML = '';
    [DEMOS[1], DEMOS[3], DEMOS[7]].forEach(d => {
        const w = heroWrap(d);
        hero.appendChild(w);
        fitKf(w, 16, hero);
    });
}

function heroPush(d) {
    const hero = document.getElementById('hero-feed');
    if (!hero) return;
    const w = heroWrap(d);
    hero.prepend(w);
    fitKf(w, 16, hero);
    while (hero.children.length > 4) hero.lastChild.remove();
}

function renderVariants() {
    const wrap = document.getElementById('ed-variants');
    wrap.innerHTML = '';
    VARIANTS.forEach((v, i) => {
        const card = document.createElement('div');
        card.className = 'vcard' + (S.variant === v.id ? ' sel' : '');
        card.innerHTML = "";
        const zone = document.createElement('div');
        zone.className = 'vprev-zone';
        const prev = document.createElement('div');
        prev.className = 'vprev';
        const saved = S.variant;
        S.variant = v.id;
        const entry = buildEntry(DEMOS[i % DEMOS.length]);
        S.variant = saved;
        prev.appendChild(entry);
        zone.appendChild(prev);
        card.appendChild(zone);
        fitKf(entry, 26, zone);
        card.addEventListener('click', () => {
            S.variant = v.id;
            markCustom();
            sfxUi();
            queueSave();
            renderVariants();
            refreshFeedVariant();
            renderHero();
            heroPush(randomDemo());
        });
        wrap.appendChild(card);
    });
}

function refreshFeedVariant() {
    document.querySelectorAll('#feed .kf').forEach(el => { el.dataset.v = S.variant; });
}

/* option row factory */
function orow(icon, title, desc, ctlEl) {
    const row = document.createElement('div');
    row.className = 'orow';
    row.innerHTML = `<div class="oicon">${icon}</div><div class="otext"><h3>${title}</h3><p>${desc}</p></div>`;
    const ctl = document.createElement('div');
    ctl.className = 'octl';
    ctl.appendChild(ctlEl);
    row.appendChild(ctl);
    return row;
}

function toggle(key, onChange) {
    const b = document.createElement('button');
    const paint = () => {
        b.className = 'tgl' + (S[key] ? ' on' : '');
        b.textContent = S[key] ? 'ON' : 'OFF';
    };
    paint();
    b.addEventListener('click', () => {
        S[key] = !S[key];
        paint();
        markCustom();
        sfxUi();
        queueSave();
        renderHero();
        renderVariants();
        if (onChange) onChange();
    });
    return b;
}

function slider(key, min, max, step, fmt, onChange) {
    const wrap = document.createElement('div');
    wrap.className = 'sldwrap';
    const val = document.createElement('span');
    val.className = 'sldval';
    const inp = document.createElement('input');
    inp.type = 'range';
    inp.min = min; inp.max = max; inp.step = step;
    inp.value = S[key];
    val.textContent = fmt(S[key]);
    inp.addEventListener('input', () => {
        S[key] = parseFloat(inp.value);
        val.textContent = fmt(S[key]);
        queueSave();
        if (onChange) onChange();
    });
    wrap.appendChild(inp);
    wrap.appendChild(val);
    return wrap;
}

function fontCycler() {
    const wrap = document.createElement('div');
    wrap.className = 'octl';
    const label = document.createElement('span');
    label.className = 'cyc-label';
    label.textContent = S.font;
    label.style.fontFamily = `'${S.font}', sans-serif`;
    const move = dir => {
        const i = (FONTS.indexOf(S.font) + dir + FONTS.length) % FONTS.length;
        S.font = FONTS[i];
        label.textContent = S.font;
        label.style.fontFamily = `'${S.font}', sans-serif`;
        applySettings();
        markCustom();
        sfxUi();
        queueSave();
        renderVariants();
        renderHero();
    };
    const l = document.createElement('button'); l.className = 'arrow arrow-l';
    const r = document.createElement('button'); r.className = 'arrow arrow-r';
    l.addEventListener('click', () => move(-1));
    r.addEventListener('click', () => move(1));
    wrap.append(l, label, r);
    return wrap;
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const to = x => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${to(f(0))}${to(f(8))}${to(f(4))}`;
}

function hexToHsv(hex) {
    const m = hex.replace('#', '');
    const n = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
    const x = parseInt(n, 16);
    const r = ((x >> 16) & 255) / 255, g = ((x >> 8) & 255) / 255, b = (x & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (d !== 0) {
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
    }
    return [h, max === 0 ? 0 : (d / max) * 100, max * 100];
}

function hsvToHex(h, s, v) {
    s /= 100; v /= 100;
    const f = n => {
        const k = (n + h / 60) % 6;
        return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    };
    const to = x => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${to(f(5))}${to(f(3))}${to(f(1))}`;
}

/* ── GLOBAL color picker (Chrome-style: SV square + hue bar) ─── */
let cpickEl = null;

function closeColorPicker() {
    if (cpickEl) {
        cpickEl.remove();
        cpickEl = null;
        document.removeEventListener('mousedown', cpickOutside);
    }
}

function cpickOutside(e) {
    if (cpickEl && !cpickEl.contains(e.target)) closeColorPicker();
}

function openColorPicker(anchor) {
    closeColorPicker();
    let [H, Sv, V] = hexToHsv(S.accent);

    const el = document.createElement('div');
    el.className = 'cpick';
    el.innerHTML =
        '<div class="cp-sv"><div class="cp-cursor"></div></div>' +
        '<input type="range" class="hue cp-hue" min="0" max="360" step="1">' +
        '<div class="cp-foot"><span class="cp-prev"></span><span class="cp-hex"></span><button class="cp-ok">OK</button></div>';
    document.getElementById('editor').appendChild(el);
    cpickEl = el;

    // position next to the chip, clamped to the screen
    const rc = anchor.getBoundingClientRect();
    el.style.left = Math.max(10, Math.min(window.innerWidth - 272, rc.right - 262)) + 'px';
    el.style.top = Math.max(10, Math.min(window.innerHeight - 320, rc.bottom + 10)) + 'px';

    const sv = el.querySelector('.cp-sv');
    const cur = el.querySelector('.cp-cursor');
    const hue = el.querySelector('.cp-hue');
    const prev = el.querySelector('.cp-prev');
    const hexLab = el.querySelector('.cp-hex');
    hue.value = Math.round(H);

    const paint = (save) => {
        sv.style.background =
            `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, hsl(${H}, 100%, 50%))`;
        cur.style.left = Sv + '%';
        cur.style.top = (100 - V) + '%';
        const hex = hsvToHex(H, Sv, V);
        prev.style.background = hex;
        hexLab.textContent = hex.toUpperCase();
        S.accent = hex;
        applySettings();
        if (save) { markCustom(); queueSave(); }
    };

    const dragSv = e => {
        const b = sv.getBoundingClientRect();
        Sv = Math.max(0, Math.min(100, ((e.clientX - b.left) / b.width) * 100));
        V = Math.max(0, Math.min(100, 100 - ((e.clientY - b.top) / b.height) * 100));
        paint(true);
    };
    sv.addEventListener('mousedown', e => {
        e.preventDefault();
        dragSv(e);
        const mv = ev => dragSv(ev);
        const up = () => {
            window.removeEventListener('mousemove', mv);
            window.removeEventListener('mouseup', up);
            heroPush({ ...randomDemo(), headshot: true });
        };
        window.addEventListener('mousemove', mv);
        window.addEventListener('mouseup', up);
    });

    hue.addEventListener('input', () => {
        H = parseInt(hue.value, 10);
        paint(true);
    });
    hue.addEventListener('change', () => heroPush({ ...randomDemo(), headshot: true }));

    el.querySelector('.cp-ok').addEventListener('click', () => { sfxUi(); closeColorPicker(); });
    setTimeout(() => document.addEventListener('mousedown', cpickOutside), 0);
    paint(false);
}

function killFxCycler() {
    const wrap = document.createElement('div');
    wrap.className = 'octl';
    const label = document.createElement('span');
    label.className = 'cyc-label';
    const paint = () => { label.textContent = KILLFX_NAMES[S.killFx] || 'Off'; };
    paint();
    const move = dir => {
        S.killFx = (S.killFx + dir + KILLFX_NAMES.length) % KILLFX_NAMES.length;
        paint();
        markCustom();
        sfxUi();
        queueSave();
    };
    const l = document.createElement('button'); l.className = 'arrow arrow-l';
    const r = document.createElement('button'); r.className = 'arrow arrow-r';
    l.addEventListener('click', () => move(-1));
    r.addEventListener('click', () => move(1));
    const pv = button('Preview', OICONS.play, 'btn-primary', startFxPreview);
    wrap.append(l, label, r, pv);
    return wrap;
}

/* ── Kill effect PREVIEW MODE - UI hides, effect fires on screen ── */
function paintFxPrev() {
    document.getElementById('fxprev-name').textContent = KILLFX_NAMES[S.killFx] || 'Off';
}

function startFxPreview() {
    sfxUi();
    document.getElementById('editor').classList.add('hidden');
    document.getElementById('fxpreview').classList.remove('hidden');
    paintFxPrev();
    if (S.killFx > 0) playKillFx(false);
}

function stopFxPreview() {
    document.getElementById('fxpreview').classList.add('hidden');
    document.getElementById('editor').classList.remove('hidden');
    renderOptions();   // refresh the cycler label
}

function fxPrevMove(dir) {
    S.killFx = (S.killFx + dir + KILLFX_NAMES.length) % KILLFX_NAMES.length;
    paintFxPrev();
    markCustom();
    sfxUi();
    queueSave();
    if (S.killFx > 0) playKillFx(false);
}

function colorChip() {
    const b = document.createElement('button');
    b.className = 'colorchip';
    b.addEventListener('click', () => {
        if (cpickEl) { closeColorPicker(); return; }
        sfxUi();
        openColorPicker(b);
    });
    return b;
}

function button(label, icon, cls, fn) {
    const b = document.createElement('button');
    b.className = 'btn ' + cls;
    b.innerHTML = `${icon}${label}`;
    b.addEventListener('click', fn);
    return b;
}

function renderOptions() {
    const wrap = document.getElementById('ed-options');
    wrap.innerHTML = '';
    const add = r => wrap.appendChild(r);
    const SEC_ICONS = {
        'General': svg('<path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.4-2.5 1a7.6 7.6 0 0 0-1.7-1L15 3h-4l-.4 3a7.6 7.6 0 0 0-1.7 1l-2.5-1-2 3.4L6.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.4 2.5-1c.5.4 1.1.7 1.7 1l.4 3h4l.4-3c.6-.3 1.2-.6 1.7-1l2.5 1 2-3.4zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>'),
        'Feed Elements': OICONS.rows,
        'Effects': OICONS.flash,
        'Actions': svg('<path d="M12 2l2.6 6.4L21 9l-5 4.4L17.6 20 12 16.5 6.4 20 8 13.4 3 9l6.4-.6z"/>')
    };
    const sec = t => {
        const s = document.createElement('div');
        s.className = 'opt-sec';
        s.innerHTML = `<span class="sec-ico">${SEC_ICONS[t] || ''}</span><span class="sec-txt"></span>`;
        s.querySelector('.sec-txt').textContent = t;
        wrap.appendChild(s);
    };

    sec('General');
    add(orow(OICONS.color, 'Color', 'One global color for your killfeed and interface — click to pick any custom color.', colorChip()));

    sec('Feed Elements');
    add(orow(OICONS.streak, 'Streak', 'Toggle kill streak counter on or off.', toggle('streak')));
    add(orow(OICONS.dist, 'Distance', 'Toggle distance indicator on or off.', toggle('distance')));
    add(orow(OICONS.hs, 'Headshot Icon', 'Show a special badge on headshot kills.', toggle('headshotIcon')));
    add(orow(OICONS.weap, 'Weapon Icons', 'Show an icon matching the weapon type used.', toggle('weaponIcons')));
    add(orow(OICONS.env, 'Environment Icons', 'Show vehicle context — car, bike, heli, plane or boat kills.', toggle('envIcons')));
    add(orow(OICONS.cam, 'Streamer Mode', 'Hide player name, ID and info for privacy.', toggle('streamer', renderVariants)));

    sec('Effects');
    add(orow(OICONS.sound, 'Sounds', 'Kill and headshot sound feedback.', toggle('sounds')));
    add(orow(OICONS.blood, 'Blood FX', 'Realistic blood on your screen when you get shot.', toggle('blood')));

    sec('Actions');


    add(orow(OICONS.move, 'Edit Position', 'Drag to reposition your killfeed on screen.', button('Edit', OICONS.edit, 'btn-primary', startPosEdit)));

    add(orow(OICONS.reset, 'Reset', 'Restore every setting to default.', button('Reset All', OICONS.reset, 'btn-danger', () => {
        S = {
            ...S, variant: 8, preset: '', uiColor: '#ee1c3e', font: 'Demon Slave', accent: '#ee1c3e', scale: 1.0,
            duration: 6, maxEntries: 5, streak: true, distance: false, headshotIcon: true,
            weaponIcons: true, envIcons: true, killFx: 2, fxY: 47, sounds: true, streamer: false,
            blood: true, bloodTime: 4, bloodAmount: 1.0, x: 72, y: 72,
        };
        applySettings();
        queueSave();
        renderPresets();
        renderVariants();
        renderOptions();
        renderHero();
    })));
}

function openEditor() {
    editorOpen = true;
    document.getElementById('editor').classList.remove('hidden');
    renderPresets();
    renderVariants();
    renderOptions();
    renderHero();
    // rotating demo kills inside the hero preview (bright + readable)
    clearInterval(demoTimer);
    demoTimer = setInterval(() => {
        const busy = document.getElementById('posedit').matches(':not(.hidden)')
            || document.getElementById('fxpreview').matches(':not(.hidden)');
        if (editorOpen && !busy) {
            heroPush(randomDemo());
        }
    }, 3000);
}

function closeEditor() {
    editorOpen = false;
    clearInterval(demoTimer);
    closeColorPicker();
    document.getElementById('editor').classList.add('hidden');
    document.getElementById('posedit').classList.add('hidden');
    document.getElementById('fxpreview').classList.add('hidden');
    post('close');
}

/* ──────────────────────────────────────────────────────────────
   POSITION EDITOR
   ────────────────────────────────────────────────────────────── */
let posDrag = null;
let posTmp = { x: 0, y: 0 };

function startPosEdit() {
    document.getElementById('editor').classList.add('hidden');
    const pe = document.getElementById('posedit');
    pe.classList.remove('hidden');
    posTmp = { x: S.x, y: S.y };

    const ghost = document.getElementById('pos-ghost');
    ghost.innerHTML = '';
    // fill the ghost with as many sample kills as the player will actually see
    const count = Math.max(5, Math.min(S.maxEntries, HARD_MAX));
    const samples = [DEMOS[1], DEMOS[3], DEMOS[4], DEMOS[2], DEMOS[5], DEMOS[9], DEMOS[7], DEMOS[8]];
    for (let i = 0; i < count; i++) {
        ghost.appendChild(buildEntry(samples[i % samples.length]));
    }
    placeGhost();
}

function placeGhost() {
    const ghost = document.getElementById('pos-ghost');
    ghost.style.left = `min(${posTmp.x}vw, calc(100vw - 520px * ${S.scale || 1} - 8px))`;
    ghost.style.top = posTmp.y + 'vh';
    ghost.style.alignItems = posTmp.x > 50 ? 'flex-end' : 'flex-start';
}

document.addEventListener('mousedown', e => {
    const ghost = document.getElementById('pos-ghost');
    if (!ghost.contains(e.target)) return;
    posDrag = { mx: e.clientX, my: e.clientY, x: posTmp.x, y: posTmp.y };
});
document.addEventListener('mousemove', e => {
    if (!posDrag) return;
    posTmp.x = Math.max(0, Math.min(97, posDrag.x + ((e.clientX - posDrag.mx) / window.innerWidth) * 100));
    posTmp.y = Math.max(0, Math.min(96, posDrag.y + ((e.clientY - posDrag.my) / window.innerHeight) * 100));
    placeGhost();
});
document.addEventListener('mouseup', () => { posDrag = null; });

document.addEventListener('keydown', e => {
    const fxp = document.getElementById('fxpreview');
    if (!fxp.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') fxPrevMove(-1);
        if (e.key === 'ArrowRight') fxPrevMove(1);
        if (e.key === 'Enter' && S.killFx > 0) playKillFx(false);
        if ((e.key === 'h' || e.key === 'H') && S.killFx > 0) playKillFx(true);
        if (e.key === 'Escape') stopFxPreview();
        return;
    }
    const pe = document.getElementById('posedit');
    if (!pe.classList.contains('hidden')) {
        const step = e.shiftKey ? 1.0 : 0.2;
        if (e.key === 'ArrowLeft') { posTmp.x = Math.max(0, posTmp.x - step); placeGhost(); }
        if (e.key === 'ArrowRight') { posTmp.x = Math.min(97, posTmp.x + step); placeGhost(); }
        if (e.key === 'ArrowUp') { posTmp.y = Math.max(0, posTmp.y - step); placeGhost(); }
        if (e.key === 'ArrowDown') { posTmp.y = Math.min(96, posTmp.y + step); placeGhost(); }
        if (e.key === 'Enter') savePos();
        if (e.key === 'Escape') savePos();
        return;
    }
    if (e.key === 'Escape' && editorOpen) closeEditor();
});

function savePos() {
    S.x = Math.round(posTmp.x * 10) / 10;
    S.y = Math.round(posTmp.y * 10) / 10;
    applySettings();
    queueSave();
    backToEditor();
}
function cancelPos() { backToEditor(); }
function backToEditor() {
    document.getElementById('posedit').classList.add('hidden');
    document.getElementById('editor').classList.remove('hidden');
}

document.getElementById('pos-save').addEventListener('click', savePos);
document.getElementById('pos-cancel').addEventListener('click', cancelPos);
const _edClose = document.getElementById('ed-close'); if (_edClose) _edClose.addEventListener('click', closeEditor);
document.getElementById('fxprev-l').addEventListener('click', () => fxPrevMove(-1));
document.getElementById('fxprev-r').addEventListener('click', () => fxPrevMove(1));

/* ──────────────────────────────────────────────────────────────
   MESSAGES
   ────────────────────────────────────────────────────────────── */
window.addEventListener('message', ({ data }) => {
    switch (data.type) {
        case 'init':
            if (data.settings) S = { ...S, ...data.settings };
            if (!VARIANTS.some(v => v.id === S.variant)) S.variant = 8;
            if (data.hardMax) HARD_MAX = data.hardMax;
            applySettings();
            break;
        case 'kill':
            addKill(data.data || {});
            break;
        case 'blood':
            bloodHit(data.amount || 10);
            break;
        case 'playfx': {
            // export-driven effect: play a specific variant without changing settings
            const cur = S.killFx;
            if (data.id >= 1 && data.id <= 5) S.killFx = data.id;
            else if (!S.killFx) S.killFx = 1;
            playKillFx(data.hs === true);
            S.killFx = cur;
            break;
        }
        case 'resetStreak':
            break;
        case 'openEditor':
            openEditor();
            break;
    }
});

applySettings();
post('ready');

/* editor tilts in 3D following the mouse (smooth, eased) */
(function () {
    const wrap = document.querySelector('.ed-wrap');
    const editor = document.getElementById('editor');
    if (!wrap || !editor) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    const tick = () => {
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        wrap.style.setProperty('--mx', cx.toFixed(4));
        wrap.style.setProperty('--my', cy.toFixed(4));
        if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
            requestAnimationFrame(tick);
        } else { running = false; }
    };
    const kick = () => { if (!running) { running = true; requestAnimationFrame(tick); } };
    document.addEventListener('mousemove', e => {
        if (editor.classList.contains('hidden')) return;
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
        kick();
    });
    document.addEventListener('mouseleave', () => { tx = 0; ty = 0; kick(); });
})();
