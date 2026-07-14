function parseGrammarText(text) {
  const grammar = {};
  text.split('\n').map(l => l.trim()).filter(Boolean).forEach(line => {
    const [left, right] = line.split('->');
    if (!left || !right) return;
    grammar[left.trim()] = right.split('|').map(p => p.trim());
  });
  return grammar;
}

function isNT(symbol) { return /^[A-Z]$/.test(symbol); }

function isRegularGrammar(grammar) {
  for (const nt in grammar) {
    for (const prod of grammar[nt]) {
      if (prod === 'ε') continue;
      if (!/^[a-z0-9]$/.test(prod) && !/^[a-z0-9][A-Z]$/.test(prod)) return false;
    }
  }
  return true;
}

function runChomsky() {
  const grammar = parseGrammarText(document.getElementById('cnfGrammarInput').value);
  const startSymbol = document.getElementById('cnfStartSymbol').value.trim();
  const regular = isRegularGrammar(grammar);
  const type = regular ? 'Tipe 3 (Reguler)' : 'Tipe 2 (Bebas Konteks)';

  document.getElementById('classifyResultBox').innerHTML =
    '<div class="result accepted"><span>' + type + '</span>' +
    '<span style="font-weight:400;font-size:12px">berdasarkan bentuk aturan produksi</span></div>';

  runCNFConversion(grammar, startSymbol);
}

function runCNFConversion(grammar, startSymbol) {
  const steps = [];
  let g = JSON.parse(JSON.stringify(grammar));
  steps.push({ title: 'Grammar awal', grammar: g });

  g = eliminateEpsilon(g, startSymbol);
  steps.push({ title: 'Setelah eliminasi produksi ε (nullable)', grammar: g });

  g = eliminateUnit(g);
  steps.push({ title: 'Setelah eliminasi produksi unit (A→B)', grammar: g });

  g = separateTerminals(g);
  steps.push({ title: 'Setelah pemisahan terminal pada produksi panjang', grammar: g });

  g = breakLongProductions(g);
  steps.push({ title: 'Hasil akhir dalam Bentuk Normal Chomsky', grammar: g });

  renderCNFSteps(steps);
}

function findNullable(grammar) {
  const nullable = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const nt in grammar) {
      if (nullable.has(nt)) continue;
      for (const prod of grammar[nt]) {
        if (prod === 'ε' || [...prod].every(s => nullable.has(s))) { nullable.add(nt); changed = true; }
      }
    }
  }
  return nullable;
}

function eliminateEpsilon(grammar, startSymbol) {
  const nullable = findNullable(grammar);
  const result = {};
  for (const nt in grammar) {
    const newProds = new Set();
    for (const prod of grammar[nt]) {
      if (prod === 'ε') continue;
      const symbols = prod.split('');
      const nullableIdx = symbols.map((s, i) => nullable.has(s) ? i : -1).filter(i => i >= 0);
      subsets(nullableIdx).forEach(combo => {
        const kept = symbols.filter((_, i) => !combo.includes(i));
        if (kept.length > 0) newProds.add(kept.join(''));
      });
    }
    result[nt] = [...newProds];
  }
  if (nullable.has(startSymbol)) result[startSymbol].push('ε');
  return result;
}

function subsets(arr) {
  if (arr.length === 0) return [[]];
  const rest = subsets(arr.slice(1));
  return [...rest, ...rest.map(s => [arr[0], ...s])];
}

function eliminateUnit(grammar) {
  const result = {};
  for (const nt in grammar) {
    const visited = new Set([nt]), queue = [nt], finalProds = new Set();
    while (queue.length) {
      const current = queue.shift();
      for (const prod of grammar[current] || []) {
        if (prod.length === 1 && isNT(prod) && grammar[prod]) {
          if (!visited.has(prod)) { visited.add(prod); queue.push(prod); }
        } else {
          finalProds.add(prod);
        }
      }
    }
    result[nt] = [...finalProds];
  }
  return result;
}

function separateTerminals(grammar) {
  const result = JSON.parse(JSON.stringify(grammar));
  const terminalNT = {};
  let counter = 0;
  for (const nt in result) {
    result[nt] = result[nt].map(prod => {
      if (prod.length < 2) return prod;
      return prod.split('').map(sym => {
        if (isNT(sym)) return sym;
        if (!terminalNT[sym]) {
          const newName = 'T' + counter++;
          terminalNT[sym] = newName;
          result[newName] = [sym];
        }
        return terminalNT[sym];
      }).join('');
    });
  }
  return result;
}

function breakLongProductions(grammar) {
  const result = JSON.parse(JSON.stringify(grammar));
  let counter = 0;
  for (const nt in grammar) {
    const newProds = [];
    for (const prod of grammar[nt]) {
      if (prod.length <= 2) { newProds.push(prod); continue; }
      const symbols = prod.split('');
      let currentLeft = symbols[0];
      for (let i = 1; i < symbols.length - 1; i++) {
        const newNT = 'X' + counter++;
        result[newNT] = [currentLeft + symbols[i]];
        currentLeft = newNT;
      }
      newProds.push(currentLeft + symbols[symbols.length - 1]);
    }
    result[nt] = newProds;
  }
  return result;
}

function renderCNFSteps(steps) {
  document.getElementById('cnfStepsCard').style.display = 'block';
  document.getElementById('cnfStepsOutput').innerHTML = steps.map(step => {
    const lines = Object.entries(step.grammar).map(([nt, prods]) => nt + ' → ' + prods.join(' | ')).join('\n');
    return '<p class="hint" style="margin-top:16px;margin-bottom:6px">' + step.title + '</p>' +
      '<div class="grammar-list" style="white-space:pre-line">' + lines + '</div>';
  }).join('');
}

function loadExampleChomsky() {
  document.getElementById('cnfGrammarInput').value = 'S->aAb\nA->aA|ε';
  document.getElementById('cnfStartSymbol').value = 'S';
}