/* HIBIITO Sleep v7 — visual-only stage tint. Keeps canonical demo intervals / handlers intact. */
(() => {
  const svg = document.querySelector('#timeline-a svg');
  if (!svg || svg.querySelector('#sleep-v7-gradient-deep')) return;
  const ns = 'http://www.w3.org/2000/svg';
  const create = (tag, attrs) => {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    return node;
  };
  const defs = create('defs', {});
  for (const type of ['deep', 'light', 'rem', 'awake']) {
    const gradient = create('linearGradient', {
      id: `sleep-v7-gradient-${type}`,
      x1: '0%', y1: '0%', x2: '0%', y2: '100%'
    });
    gradient.appendChild(create('stop', { offset: '0%', class: `sleep-v7-${type}-top` }));
    gradient.appendChild(create('stop', { offset: '100%', class: `sleep-v7-${type}-bottom` }));
    defs.appendChild(gradient);
  }
  svg.insertBefore(defs, svg.firstChild);
  // Mildly rounded corners, with real boundaries/timing unchanged.
  svg.querySelectorAll('rect.stage-segment').forEach(rect => rect.setAttribute('rx', '5'));
})();