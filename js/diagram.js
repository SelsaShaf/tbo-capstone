// modul gambar diagram state (dipakai FSA dan Regex) + utilitas zoom bersama

function drawStateDiagram(containerId, machine, activeStates) {
  const n = machine.states.length;
  const radius = Math.max(120, n * 38);
  const cx = radius + 60, cy = radius + 60;
  const size = radius * 2 + 120;
  const nodeR = 26;

  const pos = {};
  machine.states.forEach((s, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    pos[s] = { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });

  const edgeLabels = {};
  for (const key in machine.transitions) {
    const [from, symbol] = key.split('|');
    for (const to of machine.transitions[key]) {
      const edgeKey = from + '->' + to;
      edgeLabels[edgeKey] = edgeLabels[edgeKey] ? edgeLabels[edgeKey] + ',' + symbol : symbol;
    }
  }

  let svg = '<svg width="' + size + '" height="' + size + '" xmlns="http://www.w3.org/2000/svg">';
  svg += '<defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">' +
    '<path d="M0,0 L8,4 L0,8 Z" fill="#5fc9a8"/></marker></defs>';

  for (const edgeKey in edgeLabels) {
    const [from, to] = edgeKey.split('->');
    if (from !== to) continue;
    const p = pos[from];
    svg += '<path d="M ' + (p.x - 14) + ' ' + (p.y - nodeR) + ' C ' + (p.x - 30) + ' ' + (p.y - nodeR - 40) + ', ' +
      (p.x + 30) + ' ' + (p.y - nodeR - 40) + ', ' + (p.x + 14) + ' ' + (p.y - nodeR) + '" fill="none" stroke="#5fc9a8" stroke-width="1.5" marker-end="url(#arrowhead)"/>';
    svg += '<text x="' + p.x + '" y="' + (p.y - nodeR - 46) + '" fill="#a3a7ae" font-size="11" text-anchor="middle">' + edgeLabels[edgeKey] + '</text>';
  }

  const processed = new Set();
  for (const edgeKey in edgeLabels) {
    const [from, to] = edgeKey.split('->');
    if (from === to || processed.has(edgeKey)) continue;
    const reverseKey = to + '->' + from;
    const hasReverse = !!edgeLabels[reverseKey];
    processed.add(edgeKey);
    if (hasReverse) {
      svg += curvedEdge(pos[from], pos[to], edgeLabels[edgeKey], nodeR, 16);
      svg += curvedEdge(pos[to], pos[from], edgeLabels[reverseKey], nodeR, 16);
      processed.add(reverseKey);
    } else {
      svg += straightEdge(pos[from], pos[to], edgeLabels[edgeKey], nodeR);
    }
  }

  machine.states.forEach(s => {
    const p = pos[s];
    const isActive = activeStates && activeStates.includes(s);
    const isFinal = machine.finalStates.includes(s);
    const stroke = isActive ? '#5fc9a8' : '#30333b';
    const fill = isActive ? 'rgba(95,201,168,0.15)' : '#1c1f25';
    svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + nodeR + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (isActive ? 2.5 : 1.5) + '"/>';
    if (isFinal) svg += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (nodeR - 5) + '" fill="none" stroke="' + stroke + '" stroke-width="1.5"/>';
    if (s === machine.startState) svg += '<line x1="' + (p.x - nodeR - 22) + '" y1="' + p.y + '" x2="' + (p.x - nodeR) + '" y2="' + p.y + '" stroke="#eceef0" stroke-width="1.5" marker-end="url(#arrowhead)"/>';
    svg += '<text x="' + p.x + '" y="' + (p.y + 4) + '" fill="#eceef0" font-size="12" text-anchor="middle" font-family="monospace">' + s + '</text>';
  });

  svg += '</svg>';
  renderZoomableSVG(containerId, svg, size, size);
}

function straightEdge(a, b, label, nodeR) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist, uy = dy / dist;
  const sx = a.x + ux * nodeR, sy = a.y + uy * nodeR;
  const ex = b.x - ux * nodeR, ey = b.y - uy * nodeR;
  const mx = (sx + ex) / 2, my = (sy + ey) / 2;
  return '<line x1="' + sx + '" y1="' + sy + '" x2="' + ex + '" y2="' + ey + '" stroke="#5fc9a8" stroke-width="1.5" marker-end="url(#arrowhead)"/>' +
    '<text x="' + mx + '" y="' + (my - 6) + '" fill="#a3a7ae" font-size="11" text-anchor="middle">' + label + '</text>';
}

function curvedEdge(a, b, label, nodeR, bow) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / dist, uy = dy / dist;
  const px = -uy, py = ux;
  const sx = a.x + ux * nodeR + px * bow, sy = a.y + uy * nodeR + py * bow;
  const ex = b.x - ux * nodeR + px * bow, ey = b.y - uy * nodeR + py * bow;
  const cxp = (sx + ex) / 2 + px * bow, cyp = (sy + ey) / 2 + py * bow;
  return '<path d="M ' + sx + ' ' + sy + ' Q ' + cxp + ' ' + cyp + ' ' + ex + ' ' + ey + '" fill="none" stroke="#5fc9a8" stroke-width="1.5" marker-end="url(#arrowhead)"/>' +
    '<text x="' + cxp + '" y="' + (cyp - 4) + '" fill="#a3a7ae" font-size="11" text-anchor="middle">' + label + '</text>';
}

// --- utilitas zoom + scroll, dipakai bareng oleh diagram state dan pohon penurunan ---

let zoomLevels = {};

function renderZoomableSVG(containerId, svgString, naturalWidth, naturalHeight) {
  const box = document.getElementById(containerId);
  box.innerHTML =
    '<div class="zoom-controls">' +
      '<button type="button" class="secondary zoom-btn" onclick="zoomDiagram(\'' + containerId + '\', 1.25)">+ Perbesar</button>' +
      '<button type="button" class="secondary zoom-btn" onclick="zoomDiagram(\'' + containerId + '\', 0.8)">− Perkecil</button>' +
      '<button type="button" class="secondary zoom-btn" onclick="resetZoomDiagram(\'' + containerId + '\', ' + naturalWidth + ')">Sesuaikan layar</button>' +
    '</div>' +
    '<div class="zoom-scroll" id="' + containerId + '_scroll">' +
      '<div class="zoom-inner" id="' + containerId + '_inner" style="width:' + naturalWidth + 'px;height:' + naturalHeight + 'px;">' + svgString + '</div>' +
    '</div>';
  resetZoomDiagram(containerId, naturalWidth);
}

function applyZoom(id) {
  document.getElementById(id + '_inner').style.transform = 'scale(' + zoomLevels[id] + ')';
}

function zoomDiagram(id, factor) {
  zoomLevels[id] = Math.max(0.2, Math.min(3, (zoomLevels[id] || 1) * factor));
  applyZoom(id);
}

function resetZoomDiagram(id, naturalWidth) {
  const scrollBox = document.getElementById(id + '_scroll');
  const available = (scrollBox && scrollBox.clientWidth) || 620;
  zoomLevels[id] = Math.min(1, available / naturalWidth);
  applyZoom(id);
}