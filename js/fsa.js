let currentStates = [];
let currentAlphabet = [];

function generateTable() {
  currentStates = document.getElementById('statesInput').value.split(',').map(s => s.trim()).filter(Boolean);
  currentAlphabet = document.getElementById('alphabetInput').value.split(',').map(s => s.trim()).filter(Boolean);

  if (currentStates.length === 0 || currentAlphabet.length === 0) {
    alert('Isi dulu alfabet dan state, minimal satu masing-masing.');
    return;
  }

  const startSelect = document.getElementById('startStateSelect');
  startSelect.innerHTML = currentStates.map(s => '<option value="' + s + '">' + s + '</option>').join('');

  const finalChecks = document.getElementById('finalChecks');
  finalChecks.innerHTML = currentStates.map(s =>
    '<label><input type="checkbox" value="' + s + '" class="finalCheckbox"> ' + s + '</label>'
  ).join('');

  let html = '<table class="transition-table"><thead><tr><th>State</th>';
  html += currentAlphabet.map(a => '<th>' + a + '</th>').join('');
  html += '</tr></thead><tbody>';
  for (const state of currentStates) {
    html += '<tr><td>' + state + '</td>';
    for (const symbol of currentAlphabet) {
      html += '<td><input type="text" data-state="' + state + '" data-symbol="' + symbol + '" placeholder="-"></td>';
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  document.getElementById('transitionTableWrap').innerHTML = html;

  document.getElementById('tableCard').style.display = 'block';
  document.getElementById('resultBox').innerHTML = '';
  document.getElementById('formalCard').style.display = 'none';
  document.getElementById('traceCard').style.display = 'none';
  document.getElementById('diagramCard').style.display = 'none';
}

function readTransitionsFromTable() {
  const transitions = {};
  document.querySelectorAll('#transitionTableWrap input').forEach(input => {
    const state = input.dataset.state, symbol = input.dataset.symbol;
    const value = input.value.trim();
    if (!value) return;
    transitions[state + '|' + symbol] = value.split(',').map(s => s.trim()).filter(Boolean);
  });
  return transitions;
}

function runFSA() {
  const startState = document.getElementById('startStateSelect').value;
  const finalStates = [...document.querySelectorAll('.finalCheckbox:checked')].map(cb => cb.value);
  const transitions = readTransitionsFromTable();
  const testString = document.getElementById('testString').value;

  const machine = { states: currentStates, alphabet: currentAlphabet, startState, finalStates, transitions };

  let states = new Set([startState]);
  const trace = [{ states: [...states], symbol: null }];

  for (const symbol of testString) {
    if (!currentAlphabet.includes(symbol)) {
      showResult('error', 'Simbol "' + symbol + '" bukan bagian dari alfabet.');
      return;
    }
    const next = new Set();
    for (const s of states) {
      const targets = transitions[s + '|' + symbol];
      if (targets) targets.forEach(t => next.add(t));
    }
    if (next.size === 0) {
      trace.push({ states: [], symbol, dead: true });
      states = next;
      break;
    }
    trace.push({ states: [...next], symbol });
    states = next;
  }

  const accepted = [...states].some(s => finalStates.includes(s));
  showResult(accepted ? 'accepted' : 'rejected', accepted ? 'Diterima' : 'Ditolak',
    accepted ? 'berakhir di state penerima' : 'tidak berakhir di state penerima');

  showFormalDefinition(machine);
  showTraceChain(trace);
  document.getElementById('diagramCard').style.display = 'block';
  drawStateDiagram('diagramOutput', machine, [...states]);
}

function showResult(type, title, subtitle) {
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

function showTraceChain(trace) {
  document.getElementById('traceCard').style.display = 'block';
  let html = '';
  trace.forEach(step => {
    if (step.symbol !== null) html += '<span class="arrow">' + step.symbol + ' →</span>';
    html += step.dead ? '<span class="step dead">buntu</span>' : '<span class="step">{' + step.states.join(',') + '}</span>';
  });
  document.getElementById('traceOutput').innerHTML = html;
}

function loadExample() {
  document.getElementById('alphabetInput').value = '0,1';
  document.getElementById('statesInput').value = 'q0,q1,q2';
  generateTable();
  document.querySelector('[data-state="q0"][data-symbol="0"]').value = 'q1';
  document.querySelector('[data-state="q0"][data-symbol="1"]').value = 'q2';
  document.querySelector('[data-state="q1"][data-symbol="0"]').value = 'q2';
  document.querySelector('[data-state="q1"][data-symbol="1"]').value = 'q0';
  document.querySelector('[data-state="q2"][data-symbol="0"]').value = 'q2';
  document.querySelector('[data-state="q2"][data-symbol="1"]').value = 'q2';
  document.querySelectorAll('.finalCheckbox').forEach(cb => { if (cb.value === 'q0') cb.checked = true; });
  document.getElementById('testString').value = '10';
}