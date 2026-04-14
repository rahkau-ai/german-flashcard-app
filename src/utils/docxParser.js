/**
 * Browser-side .docx parser.
 * Converts a .docx ArrayBuffer to flashcard objects using mammoth (lazy-loaded).
 * Color segments are left uncolored — the user edits the JSON for full color coding.
 */

function textToSegments(text) {
  return text.split(/(\s+)/).map(t => ({ text: t, color: null, colorType: null }));
}

function parsePairs(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const paras = Array.from(doc.querySelectorAll('p'));
  const pairs = [];

  for (let i = 0; i < paras.length; i++) {
    const text = paras[i].textContent.trim();
    if (!text) continue;

    // "German – English" on the same line
    if (text.includes(' – ') || text.includes(' - ')) {
      const sep = text.includes(' – ') ? ' – ' : ' - ';
      const idx = text.indexOf(sep);
      const german = text.slice(0, idx).trim();
      const english = text.slice(idx + sep.length).trim();
      if (german && english) { pairs.push({ german, english }); continue; }
    }

    // German line followed by English line
    if (/[äöüÄÖÜß]/.test(text) && i + 1 < paras.length) {
      const next = paras[i + 1].textContent.trim();
      if (next && /^[A-Z]/.test(next) && !/[äöüÄÖÜß]/.test(next) && next.length > 8) {
        pairs.push({ german: text, english: next });
        i++;
      }
    }
  }
  return pairs;
}

function parseTableRows(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const cards = [];

  doc.querySelectorAll('table').forEach(table => {
    const rows = Array.from(table.querySelectorAll('tr'));
    if (rows.length < 2) return;
    const headers = Array.from(rows[0].querySelectorAll('td,th')).map(el => el.textContent.trim());
    const col1 = headers[0] || 'Term';
    const col2 = headers[1] || 'Translation';

    for (let r = 1; r < rows.length; r++) {
      const cells = Array.from(rows[r].querySelectorAll('td')).map(el => el.textContent.trim());
      if (!cells[0] || !cells[1]) continue;
      cards.push({ german: cells[0], english: cells[1] });
    }
  });
  return cards;
}

export async function parseDocx(arrayBuffer, deckTitle) {
  const mammoth = (await import('mammoth')).default;
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  const deckId = deckTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const pairs = [...parsePairs(html), ...parseTableRows(html)];

  const seen = new Set();
  const cards = pairs
    .filter(p => {
      if (seen.has(p.german)) return false;
      seen.add(p.german);
      return p.german.length > 2;
    })
    .map((p, i) => ({
      id: `${deckId}-upload-${i + 1}`,
      deckId,
      tags: ['uploaded', deckId],
      side2: {
        signal: { emoji: '🔴', label: 'Verb' },
        word: null,
        grammar: null,
        sentence: { text: p.german, segments: textToSegments(p.german) },
      },
      side1: { wordTranslation: null, sentenceTranslation: p.english },
    }));

  const deck = { id: deckId, title: deckTitle, source: `${deckTitle}.docx`, cardCount: cards.length };
  return { deck, cards };
}
