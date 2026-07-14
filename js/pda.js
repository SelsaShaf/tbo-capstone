function parseGrammarText(text) {
  const grammar = {};
  text.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
    const [left, right] = line.split('->');
    if (!left || !right) return;
    grammar[left.trim()] = right.split('|').map(p => p.trim());
  });
  return grammar;
}

function isNonTerminal(symbol, grammar) {
  return /^[A-Z]$/.test(symbol) && grammar[symbol];
}

function tryParseSymbol(symbol, str, pos, grammar, depthBudget) {
  if (!isNonTerminal(symbol, grammar)) {
    if (symbol === 'ε') return { node: { symbol: 'ε', terminal: true }, next: pos };
    if (str[pos] === symbol) return { node: { symbol, terminal: true }, next: pos + 1 };
    return null;
  }
  if (depthBudget <= 0) return null;
  for (const production of grammar[symbol]) {
    const symbols = production === 'ε' ? [] : production.split('');
    const result = tryParseSequence(symbols, 0, str, pos, grammar, depthBudget - 1);
    if (result) return { node: { symbol, children: result.nodes, production }, next: result.next };
  }
  return null;
}

function tryParseSequence(symbols, idx, str, pos, grammar, depthBudget) {
  if (idx >= symbols.length) return { nodes: [], next: pos };
  const first = tryParseSymbol(symbols[idx], str, pos, grammar, depthBudget);
  if (!first) return null;
  const rest = tryParseSequence(symbols, idx + 1, str, first.next, grammar, depthBudget);
  if (!rest) return null;
  return { nodes: [first.node, ...rest.nodes], next: rest.next };
}

function runPDA() {
  const grammar = parseGrammarText(document.getElementById('grammarInput').value);
  const startSymbol = document.getElementById('startSymbol').value.trim();
  const testString = document.getElementById('pdaTestString').value;

  if (!grammar[startSymbol]) {
    showPDAResult('error', 'Simbol awal "' + startSymbol + '" tidak ada di aturan produksi.');
    return;
  }

  const result = tryParseSymbol(startSymbol, testString, 0, grammar, 60);
  const accepted = result && result.next === testString.length;

  showPDAResult(accepted ? 'accepted' : 'rejected', accepted ? 'Diterima' : 'Ditolak',
    accepted ? 'string sesuai grammar' : 'tidak ditemukan penurunan yang cocok');

  if (accepted) {
    showDerivation(result.node);
    showStack(grammar, startSymbol);
    showTree(result.node);
  } else {
    ['derivationCard', 'stackCard', 'treeCard'].forEach(id => document.getElementById(id).style.display = 'none');
  }
}

function showPDAResult(type, title, subtitle) {
  document.getElementById('pdaResultBox').innerHTML =
    '<div class="result ' + type + '"><span>' + title + '</span>' +
    (subtitle ? '<span style="font-weight:400;font-size:12px">' + subtitle + '</span>' : '') + '</div>';
}

function showDerivation(rootNode) {
  const card = document.getElementById('derivationCard');
  const output = document.getElementById('derivationOutput');
  card.style.display = 'block';
  let form = [rootNode];
  const steps = [renderForm(form)];
  let guard = 0;
  while (form.some(n => n.children) && guard < 200) {
    guard++;
    const idx = form.findIndex(n => n.children);
    form = [...form.slice(0, idx), ...form[idx].children, ...form.slice(idx + 1)];
    steps.push(renderForm(form));
  }
  output.innerHTML = steps.map(s => '<div>' + s + '</div>').join('');
}

function renderForm(form) {
  const str = form.map(n => n.symbol === 'ε' ? '' : n.symbol).join('');
  return str.length ? str : 'ε';
}

// visualisasi stack PDA sederhana: dorong simbol produksi pertama dari simbol awal
function showStack(grammar, startSymbol) {
  document.getElementById('stackCard').style.display = 'block';
  const firstProd = grammar[startSymbol][0];
  const symbols = firstProd === 'ε' ? ['ε'] : firstProd.split('').reverse();
  const cells = symbols.map((s, i) =>
    '<div class="cell' + (i === symbols.length - 1 ? ' bottom' : '') + '">' + s + '</div>'
  ).join('');
  document.getElementById('stackOutput').innerHTML = cells;
}

function showTree(node) {
  document.getElementById('treeCard').style.display = 'block';
  drawParseTree('treeOutput', node);
}

// gambar pohon penurunan sebagai SVG asli: kotak + garis penghubung, layout otomatis
function drawParseTree(containerId, root) {
  const spacingX = 55, levelHeight = 65, marginTop = 25, marginSide = 30;
  const counter = { i: 0 };
  layoutTreeNode(root, 0, counter, spacingX, levelHeight, marginTop, marginSide);
  const maxDepth = getMaxDepth(root);
  const width = Math.max(200, counter.i * spacingX + marginSide * 2);
  const height = (maxDepth + 1) * levelHeight + marginTop * 2;

  let svg = '<svg width="' + width + '" height="' + height + '" xmlns="http://www.w3.org/2000/svg">';
  svg += drawTreeEdges(root);
  svg += drawTreeNodesSVG(root);
  svg += '</svg>';

  renderZoomableSVG(containerId, svg, width, height);
}

// x diisi dari kiri ke kanan untuk daun (leaf), lalu node induk = rata-rata x anak-anaknya
function layoutTreeNode(node, depth, counter, spacingX, levelHeight, marginTop, marginSide) {
  node._depth = depth;
  node._y = marginTop + depth * levelHeight;
  if (!node.children || node.children.length === 0) {
    node._x = marginSide + counter.i * spacingX;
    counter.i++;
  } else {
    node.children.forEach(c => layoutTreeNode(c, depth + 1, counter, spacingX, levelHeight, marginTop, marginSide));
    const xs = node.children.map(c => c._x);
    node._x = (Math.min(...xs) + Math.max(...xs)) / 2;
  }
}

function getMaxDepth(node) {
  if (!node.children || node.children.length === 0) return node._depth;
  return Math.max(...node.children.map(getMaxDepth));
}

function drawTreeEdges(node) {
  let svg = '';
  if (node.children) {
    node.children.forEach(c => {
      svg += '<line x1="' + node._x + '" y1="' + (node._y + 14) + '" x2="' + c._x + '" y2="' + (c._y - 14) + '" stroke="#3d414a" stroke-width="1.5"/>';
      svg += drawTreeEdges(c);
    });
  }
  return svg;
}

function drawTreeNodesSVG(node) {
  let svg = '';
  const isLeaf = !!node.terminal;
  if (!isLeaf) {
    svg += '<rect x="' + (node._x - 16) + '" y="' + (node._y - 14) + '" width="32" height="28" rx="6" fill="#24272e" stroke="#30333b" stroke-width="1.5"/>';
  }
  const textColor = isLeaf ? '#a3a7ae' : '#5fc9a8';
  svg += '<text x="' + node._x + '" y="' + (node._y + 5) + '" fill="' + textColor + '" font-size="13" text-anchor="middle" font-family="monospace">' + node.symbol + '</text>';
  if (node.children) node.children.forEach(c => svg += drawTreeNodesSVG(c));
  return svg;
}

function loadExamplePDA() {
  document.getElementById('grammarInput').value = 'S->AB\nA->a\nB->b';
  document.getElementById('startSymbol').value = 'S';
  document.getElementById('pdaTestString').value = 'ab';
}