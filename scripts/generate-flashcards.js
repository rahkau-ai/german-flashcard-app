/**
 * generate-flashcards.js
 *
 * Reads all .docx files in ../source/, parses them with mammoth + cheerio,
 * and writes structured flashcard JSON to ../src/data/flashcards.json.
 *
 * Run: node scripts/generate-flashcards.js
 */

import mammoth from 'mammoth';
import * as cheerioLib from 'cheerio';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cheerio = cheerioLib.load ? cheerioLib : cheerioLib.default;
const load = cheerio.load || cheerioLib.load;

// ─── Color dictionary ─────────────────────────────────────────────────────────

const VERB_COLOR    = { color: '#D32F2F', colorType: 'fg' };
const MODAL_COLOR   = { color: '#1565C0', colorType: 'fg' };
const ADJ_COLOR     = { color: '#E65100', colorType: 'fg' };
const PRONOUN_COLOR = { color: '#1B5E20', colorType: 'fg' };
const NEG_COLOR     = { color: '#AD1457', colorType: 'fg' };
const PREP_COLOR    = { color: '#6A1B9A', colorType: 'fg' };

const WORD_COLORS = {
  // Konjunktiv II verb forms
  'wäre': VERB_COLOR, 'wärst': VERB_COLOR, 'wären': VERB_COLOR, 'wärt': VERB_COLOR,
  'hätte': VERB_COLOR, 'hättest': VERB_COLOR, 'hätten': VERB_COLOR, 'hättet': VERB_COLOR,
  'könnte': VERB_COLOR, 'könntest': VERB_COLOR, 'könnten': VERB_COLOR, 'könntet': VERB_COLOR,
  'müsste': VERB_COLOR, 'müsstest': VERB_COLOR, 'müssten': VERB_COLOR, 'müsstet': VERB_COLOR,
  'dürfte': VERB_COLOR, 'dürftest': VERB_COLOR, 'dürften': VERB_COLOR, 'dürftet': VERB_COLOR,
  'sollte': VERB_COLOR, 'solltest': VERB_COLOR, 'sollten': VERB_COLOR, 'solltet': VERB_COLOR,
  'wollte': VERB_COLOR, 'wolltest': VERB_COLOR, 'wollten': VERB_COLOR, 'wolltet': VERB_COLOR,
  'möchte': VERB_COLOR, 'möchtest': VERB_COLOR, 'möchten': VERB_COLOR, 'möchtet': VERB_COLOR,
  'würde': VERB_COLOR, 'würdest': VERB_COLOR, 'würden': VERB_COLOR, 'würdet': VERB_COLOR,

  // Common verbs
  'helfen': VERB_COLOR, 'zeigen': VERB_COLOR, 'reisen': VERB_COLOR,
  'sagen': VERB_COLOR, 'hinstellen': VERB_COLOR, 'drücken': VERB_COLOR,
  'funktioniert': VERB_COLOR, 'hängt': VERB_COLOR, 'gesehen': VERB_COLOR,
  'muss': MODAL_COLOR, 'kann': MODAL_COLOR, 'ist': VERB_COLOR,
  'sind': VERB_COLOR, 'hat': VERB_COLOR, 'haben': VERB_COLOR,
  'sein': VERB_COLOR, 'werden': VERB_COLOR,

  // Pronouns
  'mir': PRONOUN_COLOR, 'dir': PRONOUN_COLOR, 'ihm': PRONOUN_COLOR,
  'ihr': PRONOUN_COLOR, 'uns': PRONOUN_COLOR, 'euch': PRONOUN_COLOR,
  'ihnen': PRONOUN_COLOR, 'sie': PRONOUN_COLOR, 'ich': PRONOUN_COLOR,
  'du': PRONOUN_COLOR, 'er': PRONOUN_COLOR, 'wir': PRONOUN_COLOR, 'man': PRONOUN_COLOR,

  // Adjectives/Adverbs
  'reich': ADJ_COLOR, 'krank': ADJ_COLOR, 'halb': ADJ_COLOR,
  'zuerst': ADJ_COLOR, 'dann': ADJ_COLOR, 'glücklich': ADJ_COLOR,

  // Negation
  'nicht': NEG_COLOR, 'kein': NEG_COLOR, 'keine': NEG_COLOR,

  // Prepositions
  'mit': PREP_COLOR, 'in': PREP_COLOR, 'auf': PREP_COLOR,
  'bei': PREP_COLOR, 'nach': PREP_COLOR, 'an': PREP_COLOR,
  'zu': PREP_COLOR, 'von': PREP_COLOR, 'aus': PREP_COLOR,
};

// ─── Sentence tokenizer + colorizer ──────────────────────────────────────────

function colorizeSegments(sentence) {
  const tokens = sentence.split(/(\s+)/);
  return tokens.map(token => {
    const stripped = token.replace(/[.,!?;:–—"""()«»]/g, '').toLowerCase();
    const entry = WORD_COLORS[stripped];
    if (!entry) return { text: token, color: null, colorType: null };
    return { text: token, color: entry.color, colorType: entry.colorType };
  });
}

// ─── Example sentences per verb ───────────────────────────────────────────────

const EXAMPLE_SENTENCES = {
  sein:   { german: 'Wenn ich Zeit hätte, wäre ich glücklich.',    english: 'If I had time, I would be happy.' },
  haben:  { german: 'Wenn ich Geld hätte, würde ich reisen.',       english: 'If I had money, I would travel.' },
  können: { german: 'Könnten Sie mir helfen?',                      english: 'Could you help me?' },
  müssen: { german: 'Ich müsste mehr lernen.',                      english: 'I would have to study more.' },
  dürfen: { german: 'Dürfte ich hier sitzen?',                      english: 'Would I be allowed to sit here?' },
  sollen: { german: 'Was sollte ich ihr sagen?',                    english: 'What should I say to her?' },
  wollen: { german: 'Ich wollte früher aufstehen.',                 english: 'I wanted to get up earlier.' },
  mögen:  { german: 'Ich möchte einen Kaffee, bitte.',              english: 'I would like a coffee, please.' },
};

function getExampleSentence(infinitive) {
  return EXAMPLE_SENTENCES[infinitive] || {
    german: `Ich ${infinitive} gern mehr Zeit haben.`,
    english: `I would like to have more time.`,
  };
}

// ─── Extract conjugation tables ───────────────────────────────────────────────

function extractConjugationTables($) {
  const cards = [];

  $('table').each((tIdx, table) => {
    const rows = $(table).find('tr').toArray();
    if (rows.length < 2) return;

    const headers = $(rows[0]).find('td,th').map((_, el) => $(el).text().trim()).get();
    const isConjTable = headers.includes('ich') || headers.includes('Verb');
    if (!isConjTable) return;

    const verbCol    = headers.findIndex(h => h === 'Verb' || h === 'Person');
    const ichCol     = headers.findIndex(h => h === 'ich');
    const wirCol     = headers.findIndex(h => h === 'wir');
    const meaningCol = headers.findIndex(h => h === 'Meaning' || h === 'English');

    for (let r = 1; r < rows.length; r++) {
      const cells = $(rows[r]).find('td').map((_, el) => $(el).text().trim()).get();
      if (!cells.length) continue;

      const infinitive = verbCol >= 0 ? cells[verbCol] : cells[0];
      const ichForm    = ichCol  >= 0 ? cells[ichCol]  : '';
      const wirForm    = wirCol  >= 0 ? cells[wirCol]  : '';
      const meaning    = meaningCol >= 0 ? cells[meaningCol] : '';
      if (!infinitive || !ichForm) continue;

      const ex = getExampleSentence(infinitive);
      cards.push({
        id: `konj2-${infinitive.replace(/[^a-z]/gi, '')}-${r}`,
        deckId: 'konjunktiv-ii',
        tags: ['verb', 'konjunktiv-ii', infinitive],
        side2: {
          signal: { emoji: '🔴', label: 'Verb' },
          word: `${ichForm} / ${wirForm} (${infinitive}, irreg.)`,
          grammar: 'Konjunktiv II — unreal / polite',
          sentence: {
            text: ex.german,
            segments: colorizeSegments(ex.german),
          },
        },
        side1: {
          wordTranslation: meaning || `${infinitive} (subjunctive)`,
          sentenceTranslation: ex.english,
        },
      });
    }
  });

  return cards;
}

// ─── Extract dative pronoun table ─────────────────────────────────────────────

const DATIVE_SENTENCES = {
  'mir':    { german: 'Könnten Sie mir helfen?',         english: 'Could you help me?' },
  'dir':    { german: 'Könnte ich dir helfen?',          english: 'Could I help you?' },
  'ihm':    { german: 'Könnten Sie ihm sagen, wo es ist?', english: 'Could you tell him where it is?' },
  'ihr':    { german: 'Könnten Sie ihr das zeigen?',    english: 'Could you show her that?' },
  'uns':    { german: 'Könntest du uns das zeigen?',    english: 'Could you show that to us?' },
  'euch':   { german: 'Ich möchte euch helfen.',        english: 'I would like to help you all.' },
  'ihnen':  { german: 'Könnten Sie ihnen schreiben?',   english: 'Could you write to them?' },
  'ihnen/ihnen': { german: 'Könnten Sie Ihnen helfen?', english: 'Could you help you (formal)?' },
};

function extractDativeTable($) {
  const cards = [];

  $('table').each((_, table) => {
    const rows = $(table).find('tr').toArray();
    if (rows.length < 2) return;

    const headers = $(rows[0]).find('td,th').map((_, el) => $(el).text().trim()).get();
    const isDativeTable = headers.some(h => /Dative/i.test(h));
    if (!isDativeTable) return;

    const nomCol = headers.findIndex(h => /Nominative/i.test(h));
    const datCol = headers.findIndex(h => /Dative/i.test(h));
    const engCol = headers.findIndex(h => /English/i.test(h));
    const perCol = headers.findIndex(h => /Person/i.test(h));

    for (let r = 1; r < rows.length; r++) {
      const cells = $(rows[r]).find('td').map((_, el) => $(el).text().trim()).get();
      if (!cells.length) continue;

      const person = perCol >= 0 ? cells[perCol] : cells[0];
      const nom    = nomCol >= 0 ? cells[nomCol] : '';
      const dat    = datCol >= 0 ? cells[datCol] : '';
      const eng    = engCol >= 0 ? cells[engCol] : '';
      if (!dat || dat === 'Dative') continue;

      const ex = DATIVE_SENTENCES[dat.toLowerCase()] || {
        german: `Könnten Sie ${dat} helfen?`,
        english: `Could you help ${eng.split('→')[0].trim().toLowerCase()}?`,
      };

      cards.push({
        id: `dative-${dat.replace(/[^a-z]/gi, '')}-${r}`,
        deckId: 'konjunktiv-ii',
        tags: ['pronoun', 'dative', person],
        side2: {
          signal: { emoji: '💬', label: 'Pronoun' },
          word: `${dat}  (Dativ von ${nom || person})`,
          grammar: 'Dative case — indirect object',
          sentence: {
            text: ex.german,
            segments: colorizeSegments(ex.german),
          },
        },
        side1: {
          wordTranslation: eng || `to ${person}`,
          sentenceTranslation: ex.english,
        },
      });
    }
  });

  return cards;
}

// ─── Extract paragraph sentence pairs (German → English) ─────────────────────

function extractPairs($) {
  const pairs = [];
  const paras = $('p').toArray();

  for (let i = 0; i < paras.length; i++) {
    const text = $($('p').get(i)).text().trim();
    if (!text) continue;

    // "German – English" on same line
    if (text.includes(' – ') || text.includes(' - ')) {
      const sep = text.includes(' – ') ? ' – ' : ' - ';
      const idx = text.indexOf(sep);
      const german  = text.slice(0, idx).trim();
      const english = text.slice(idx + sep.length).trim();
      if (german && english && /[äöüÄÖÜß]|[A-Z]/.test(german)) {
        pairs.push({ german, english });
        continue;
      }
    }

    // German line followed immediately by English line (contains ä/ö/ü but next doesn't)
    if (/[äöüÄÖÜß]/.test(text) && i + 1 < paras.length) {
      const nextText = $($('p').get(i + 1)).text().trim();
      if (nextText && /^[A-Z]/.test(nextText) && !/[äöüÄÖÜß]/.test(nextText) && nextText.length > 8) {
        pairs.push({ german: text, english: nextText });
        i++;
      }
    }
  }

  return pairs;
}

function buildSentenceCards(pairs, deckId) {
  return pairs.map((pair, i) => ({
    id: `${deckId}-sent-${i + 1}`,
    deckId,
    tags: ['sentence', deckId],
    side2: {
      signal: { emoji: '🔴', label: 'Verb' },
      word: null,
      grammar: null,
      sentence: {
        text: pair.german,
        segments: colorizeSegments(pair.german),
      },
    },
    side1: {
      wordTranslation: null,
      sentenceTranslation: pair.english,
    },
  }));
}

// ─── Process a single .docx file ──────────────────────────────────────────────

async function processDocx(filePath) {
  console.log(`Processing: ${basename(filePath)}`);
  const result = await mammoth.convertToHtml({ path: filePath });
  const $ = load(result.value);

  const deckId = basename(filePath, '.docx')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const conjCards = extractConjugationTables($);
  const datCards  = extractDativeTable($);
  const pairs     = extractPairs($);
  const sentCards = buildSentenceCards(pairs, deckId);

  // Deduplicate by sentence text
  const seen = new Set();
  const allCards = [...conjCards, ...datCards, ...sentCards].filter(card => {
    const key = card.side2.sentence?.text;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`  → ${conjCards.length} verb cards, ${datCards.length} dative cards, ${sentCards.length} sentence cards → ${allCards.length} unique`);
  return { deckId, title: basename(filePath, '.docx'), source: basename(filePath), cards: allCards };
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const sourceDir = join(__dirname, '..', 'source');
  const outPath   = join(__dirname, '..', 'src', 'data', 'flashcards.json');

  const files = readdirSync(sourceDir)
    .filter(f => f.endsWith('.docx'))
    .map(f => join(sourceDir, f));

  if (!files.length) {
    console.error('No .docx files found in source/');
    process.exit(1);
  }

  const allCards = [];
  const decks = [];

  for (const file of files) {
    const { deckId, title, source, cards } = await processDocx(file);
    if (!cards.length) {
      console.log(`  ⚠ No cards extracted from ${basename(file)}`);
      continue;
    }
    allCards.push(...cards);
    decks.push({ id: deckId, title, source, cardCount: cards.length });
  }

  writeFileSync(outPath, JSON.stringify({ decks, cards: allCards }, null, 2), 'utf8');
  console.log(`\n✓ Written ${allCards.length} cards across ${decks.length} deck(s) to src/data/flashcards.json`);
}

main().catch(err => { console.error(err); process.exit(1); });
