// --- parser regex sederhana: mendukung | * () dan konkatenasi ---
// grammar: expr := term ('|' term)* | term := factor+ | factor := base '*'? | base := char | '(' expr ')'

function parseRegex(pattern) {
  let pos = 0;
  const chars = pattern.replace(/\s/g, '').split('');

  function peek() { return chars[pos]; }
  function consume() { return chars[pos++]; }

  function parseExpr() {
    let node = parseTerm();
    while (peek() === '|') {
      consume();
      node = { type: 'union', left: node, right: parseTerm() };
    }
    return node;
  }

  function parseTerm() {
    let node = null;
    while (pos < chars.length && peek() !== '|' && peek() !== ')') {
      const factor = parseFactor();
      node = node ? { type: 'concat', left: node, right: factor } : factor;
    }
    return node || { type: 'epsilon' };
  }

  function parseFactor() {
    let node = parseBase();
    while (peek() === '*') {
      consume();
      node = { type: 'star', child: node };
    }
    return node;
  }

  function parseBase() {
    if (peek() === '(') {
      consume();
      const node = parseExpr();
      if (peek() === ')') consume();
      return node;
    }
    const ch = consume();
    return { type: 'char', value: ch };
  }

  return parseExpr();
}

// --- Thompson's Construction: bangun NFA dari syntax tree ---
let stateCounter = 0;
function newState() { return 'q' + stateCounter++; }

function thompson(node, transitions) {
  if (node.type === 'char') {
    const s = newState(), e = newState();
    addTrans(transitions, s, node.value, e);
    return { start: s, end: e };
  }
  if (node.type === 'epsilon') {
    const s = newState(), e = newState();
    addTrans(transitions, s, 'ε', e);
    return { start: s, end: e };
  }
  if (node.type === 'concat') {
    const a = thompson(node.left, transitions);
    const b = thompson(node.right, transitions);
    addTrans(transitions, a.end, 'ε', b.start);
    return { start: a.start, end: b.end };
  }
  if (node.type === 'union') {
    const a = thompson(node.left, transitions);
    const b = thompson(node.right, transitions);
    const s = newState(), e = newState();
    addTrans(transitions, s, 'ε', a.start);
    addTrans(transitions, s, 'ε', b.start);
    addTrans(transitions, a.end, 'ε', e);
    addTrans(transitions, b.end, 'ε', e);
    return { start: s, end: e };
  }
  if (node.type === 'star') {
    const a = thompson(node.child, transitions);
    const s = newState(), e = newState();
    addTrans(transitions, s, 'ε', a.start);
    addTrans(transitions, s, 'ε', e);
    addTrans(transitions, a.end, 'ε', a.start);
    addTrans(transitions, a.end, 'ε', e);
    return { start: s, end: e };
  }
}

function addTrans(transitions, from, symbol, to) {
  const key = from + '|' + symbol;
  if (!transitions[key]) transitions[key] = [];
  transitions[key].push(to);
}

function buildNFA(pattern) {
  stateCounter = 0;
  const tree = parseRegex(pattern);
  const transitions = {};
  const frag = thompson(tree, transitions);

  const states = new Set();
  for (const key in transitions) {
    states.add(key.split('|')[0]);
    transitions[key].forEach(t => states.add(t));
  }
  states.add(frag.start);
  states.add(frag.end);

  const alphabet = new Set();
  for (const key in transitions) {
    const sym = key.split('|')[1];
    if (sym !== 'ε') alphabet.add(sym);
  }

  return {
    states: [...states].sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))),
    alphabet: [...alphabet],
    startState: frag.start,
    finalStates: [frag.end],
    transitions
  };
}

// epsilon-closure dan simulasi NFA
function epsilonClosure(states, transitions) {
  const stack = [...states], closure = new Set(states);
  while (stack.length) {
    const s = stack.pop();
    const targets = transitions[s + '|ε'];
    if (targets) targets.forEach(t => { if (!closure.has(t)) { closure.add(t); stack.push(t); } });
  }
  return closure;
}

function simulateNFA(machine, str) {
  let current = epsilonClosure([machine.startState], machine.transitions);
  const trace = [{ states: [...current], symbol: null }];

  for (const symbol of str) {
    const moved = new Set();
    for (const s of current) {
      const targets = machine.transitions[s + '|' + symbol];
      if (targets) targets.forEach(t => moved.add(t));
    }
    if (moved.size === 0) {
      trace.push({ states: [], symbol, dead: true });
      current = moved;
      break;
    }
    current = epsilonClosure([...moved], machine.transitions);
    trace.push({ states: [...current], symbol });
  }

  const accepted = [...current].some(s => machine.finalStates.includes(s));
  return { accepted, trace, finalActive: [...current] };
}

// --- fungsi utama ---
function runRegex() {
  const pattern = document.getElementById('pattern').value;
  const text = document.getElementById('testText').value;

  let machine;
  try {
    machine = buildNFA(pattern);
  } catch (e) {
    showResultRegex('error', 'Pola regex tidak valid.', 'periksa kembali sintaks pola Anda');
    return;
  }

  const result = simulateNFA(machine, text);
  showResultRegex(result.accepted ? 'accepted' : 'rejected', result.accepted ? 'Cocok' : 'Tidak cocok',
    result.accepted ? 'string diterima oleh NFA hasil konversi' : 'string ditolak oleh NFA hasil konversi');

  showFormalDefinition(machine);
  showTransitionTable(machine);
  document.getElementById('diagramCard').style.display = 'block';
  drawStateDiagram('diagramOutput', machine, result.finalActive);
  showGrammarRules(machine);
}

function showResultRegex(type, title, subtitle) {
  document.getElementById('resultBox').innerHTML =
    '<div class="result ' + type + '"><span>' + title + '</span>' +
    (subtitle ? '<span style="font-weight:400;font-size:12px">' + subtitle + '</span>' : '') + '</div>';
}

function showFormalDefinition(m) {
  document.getElementById('formalCard').style.display = 'block';
  document.getElementById('formalGrid').innerHTML =
    field('Q', '{ ' + m.states.join(', ') + ' }') +
    field('Σ', '{ ' + m.alphabet.join(', ') + ' }') +
    field('S (state awal)', m.startState) +
    field('F (state akhir)', '{ ' + m.finalStates.join(', ') + ' }');
}

function field(label, value) {
  return '<div class="formal-card"><div class="label">' + label + '</div><div class="value">' + value + '</div></div>';
}

function showTransitionTable(m) {
  document.getElementById('tableCard').style.display = 'block';
  const symbols = [...m.alphabet, 'ε'];
  let html = '<table class="transition-table readonly"><thead><tr><th>State</th>';
  html += symbols.map(s => '<th>' + s + '</th>').join('');
  html += '</tr></thead><tbody>';
  m.states.forEach(state => {
    html += '<tr><td>' + state + (state === m.startState ? ' (S)' : '') + (m.finalStates.includes(state) ? ' (F)' : '') + '</td>';
    symbols.forEach(sym => {
      const targets = m.transitions[state + '|' + sym];
      html += '<td>' + (targets ? targets.join(', ') : '-') + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  document.getElementById('tableOutput').innerHTML = html;
}

// setiap state NFA jadi non-terminal, tiap transisi jadi aturan produksi
function showGrammarRules(m) {
  document.getElementById('grammarCard').style.display = 'block';
  const rules = [];
  m.states.forEach(state => {
    const productions = [];
    for (const key in m.transitions) {
      const [from, symbol] = key.split('|');
      if (from !== state) continue;
      m.transitions[key].forEach(to => {
        productions.push(symbol === 'ε' ? to : symbol + to);
      });
    }
    if (m.finalStates.includes(state)) productions.push('ε');
    if (productions.length) {
      rules.push('<div class="rule"><span class="nt">' + state + '</span> → ' + productions.join(' | ') + '</div>');
    }
  });
  document.getElementById('grammarOutput').innerHTML = rules.join('');
}

function loadExampleRegex() {
  document.getElementById('pattern').value = 'a*b*';
  document.getElementById('testText').value = 'aaabb';
}