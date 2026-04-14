import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

red  = '#D32F2F'
blue = '#1565C0'
masc = '#1976D2'
fem  = '#C2185B'
neut = '#388E3C'
pron = '#1B5E20'
adj  = '#E65100'
prep = '#6A1B9A'
teal = '#00897B'
purp = '#4A148C'

def seg(text, color=None):
    return {'text': text, 'color': color, 'colorType': None if color is None else 'fg'}

def card(cid, tags, signal_emoji, signal_label, word, grammar, sent, segs, word_trans, sent_trans):
    return {
        'id': cid,
        'deckId': 'what-is-konjunktiv-ii',
        'tags': tags,
        'side2': {
            'signal': {'emoji': signal_emoji, 'label': signal_label},
            'word': word,
            'grammar': grammar,
            'sentence': {'text': sent, 'segments': segs}
        },
        'side1': {'wordTranslation': word_trans, 'sentenceTranslation': sent_trans}
    }

VERB   = ('\U0001f534', 'Verb')
PRON   = ('\U0001f4ac', 'Pronoun')

cards = [
    # ── 8 Konjunktiv II verb cards ───────────────────────────────────────────
    card('konj2-sein-1', ['verb', 'sein'], *VERB,
         'wäre / wären (sein, irreg.)', 'Konjunktiv II — unreal / polite',
         'Wenn ich Zeit hätte, wäre ich glücklich.',
         [seg('Wenn '), seg('ich ', pron), seg('Zeit ', fem), seg('hätte', red),
          seg(', '), seg('wäre ', red), seg('ich ', pron), seg('glücklich', adj), seg('.')],
         'would be (to be, irreg.)', 'If I had time, I would be happy.'),

    card('konj2-haben-2', ['verb', 'haben'], *VERB,
         'hätte / hätten (haben, irreg.)', 'Konjunktiv II — unreal / hypothetical',
         'Wenn ich mehr Zeit hätte, würde ich reisen.',
         [seg('Wenn '), seg('ich ', pron), seg('mehr ', adj), seg('Zeit ', fem), seg('hätte', red),
          seg(', '), seg('würde ', red), seg('ich ', pron), seg('reisen', red), seg('.')],
         'would have (to have, irreg.)', 'If I had more time, I would travel.'),

    card('konj2-koennen-3', ['verb', 'können'], *VERB,
         'könnte / könnten (können, irreg.)', 'Konjunktiv II — polite request',
         'Könnten Sie mir helfen?',
         [seg('Könnten ', red), seg('Sie ', pron), seg('mir ', pron), seg('helfen', red), seg('?')],
         'could (to be able to, irreg.)', 'Could you help me?'),

    card('konj2-muessen-4', ['verb', 'müssen'], *VERB,
         'müsste / müssten (müssen, irreg.)', 'Konjunktiv II — obligation / necessity',
         'Ich müsste mehr lernen.',
         [seg('Ich ', pron), seg('müsste ', red), seg('mehr ', adj), seg('lernen', red), seg('.')],
         'would have to (must, irreg.)', 'I would have to study more.'),

    card('konj2-duerfen-5', ['verb', 'dürfen'], *VERB,
         'dürfte / dürften (dürfen, irreg.)', 'Konjunktiv II — permission / possibility',
         'Dürfte ich hier sitzen?',
         [seg('Dürfte ', red), seg('ich ', pron), seg('hier ', adj), seg('sitzen', red), seg('?')],
         'might be allowed to (may, irreg.)', 'Would I be allowed to sit here?'),

    card('konj2-sollen-6', ['verb', 'sollen'], *VERB,
         'sollte / sollten (sollen, irreg.)', 'Konjunktiv II — should / obligation',
         'Was sollte ich ihr sagen?',
         [seg('Was ', teal), seg('sollte ', red), seg('ich ', pron), seg('ihr ', pron), seg('sagen', red), seg('?')],
         'should (to be supposed to, irreg.)', 'What should I say to her?'),

    card('konj2-wollen-7', ['verb', 'wollen'], *VERB,
         'wollte / wollten (wollen, irreg.)', 'Konjunktiv II — wish / intention',
         'Ich wollte früher aufstehen.',
         [seg('Ich ', pron), seg('wollte ', red), seg('früher ', adj), seg('aufstehen', red), seg('.')],
         'wanted to (to want to, irreg.)', 'I wanted to get up earlier.'),

    card('konj2-moegen-8', ['verb', 'mögen'], *VERB,
         'möchte / möchten (mögen, irreg.)', 'Konjunktiv II — polite wish',
         'Ich möchte einen Kaffee, bitte.',
         [seg('Ich ', pron), seg('möchte ', red), seg('einen '), seg('Kaffee', masc),
          seg(', '), seg('bitte', adj), seg('.')],
         'would like to (to like, irreg.)', 'I would like a coffee, please.'),

    # ── 7 Dative pronoun cards ───────────────────────────────────────────────
    card('dative-mir-9', ['pronoun', 'dative', 'ich'], *PRON,
         'mir  (Dativ von ich)', 'Dative case — indirect object (to me)',
         'Könnten Sie mir helfen?',
         [seg('Könnten ', red), seg('Sie ', pron), seg('mir ', pron), seg('helfen', red), seg('?')],
         'to me  (ich → mir)', 'Could you help me?'),

    card('dative-dir-10', ['pronoun', 'dative', 'du'], *PRON,
         'dir  (Dativ von du)', 'Dative case — indirect object (to you)',
         'Könnte ich dir helfen?',
         [seg('Könnte ', red), seg('ich ', pron), seg('dir ', pron), seg('helfen', red), seg('?')],
         'to you  (du → dir)', 'Could I help you?'),

    card('dative-ihm-er-11', ['pronoun', 'dative', 'er'], *PRON,
         'ihm  (Dativ von er)', 'Dative case — indirect object (to him)',
         'Könnten Sie ihm sagen, wo meine Jacke ist?',
         [seg('Könnten ', red), seg('Sie ', pron), seg('ihm ', pron), seg('sagen', red),
          seg(', '), seg('wo ', teal), seg('meine '), seg('Jacke ', fem), seg('ist', red), seg('?')],
         'to him  (er → ihm)', 'Could you tell him where my jacket is?'),

    card('dative-ihr-sie-12', ['pronoun', 'dative', 'sie'], *PRON,
         'ihr  (Dativ von sie — she)', 'Dative case — indirect object (to her)',
         'Könnten Sie ihr das zeigen?',
         [seg('Könnten ', red), seg('Sie ', pron), seg('ihr ', pron), seg('das '), seg('zeigen', red), seg('?')],
         'to her  (sie → ihr)', 'Could you show her that?'),

    card('dative-uns-13', ['pronoun', 'dative', 'wir'], *PRON,
         'uns  (Dativ von wir)', 'Dative case — indirect object (to us)',
         'Könntest du uns das zeigen?',
         [seg('Könntest ', red), seg('du ', pron), seg('uns ', pron), seg('das '), seg('zeigen', red), seg('?')],
         'to us  (wir → uns)', 'Could you show that to us?'),

    card('dative-euch-14', ['pronoun', 'dative', 'ihr-plural'], *PRON,
         'euch  (Dativ von ihr — plural)', 'Dative case — indirect object (to you all)',
         'Ich möchte euch helfen.',
         [seg('Ich ', pron), seg('möchte ', red), seg('euch ', pron), seg('helfen', red), seg('.')],
         'to you all  (ihr → euch)', 'I would like to help you all.'),

    card('dative-ihnen-15', ['pronoun', 'dative', 'sie-formal'], *PRON,
         'ihnen / Ihnen  (Dativ von sie / Sie)', 'Dative case — to them / to you (formal)',
         'Könnten Sie ihnen schreiben?',
         [seg('Könnten ', red), seg('Sie ', pron), seg('ihnen ', pron), seg('schreiben', red), seg('?')],
         'to them / to you (formal)  (sie/Sie → ihnen/Ihnen)', 'Could you write to them?'),

    # ── 10 Example sentence cards ────────────────────────────────────────────
    card('sent-time-q-16', ['sentence', 'indirect-question'], *VERB,
         None, 'Polite indirect question: Könnten Sie mir sagen, ...?',
         'Könnten Sie mir sagen, wie spät es ist?',
         [seg('Könnten ', red), seg('Sie ', pron), seg('mir ', pron), seg('sagen', red),
          seg(', '), seg('wie ', teal), seg('spät ', adj), seg('es ', pron), seg('ist', red), seg('?')],
         None, 'Could you tell me what time it is?'),

    card('sent-time-a-17', ['sentence', 'answer'], *VERB,
         None, None,
         'Es ist halb drei.',
         [seg('Es ', pron), seg('ist ', red), seg('halb ', adj), seg('drei', purp), seg('.')],
         None, 'It is half past two.'),

    card('sent-jacket-q-18', ['sentence', 'indirect-question'], *VERB,
         None, 'Indirect question with wo',
         'Könnten Sie mir sagen, wo meine Jacke ist?',
         [seg('Könnten ', red), seg('Sie ', pron), seg('mir ', pron), seg('sagen', red),
          seg(', '), seg('wo ', teal), seg('meine '), seg('Jacke ', fem), seg('ist', red), seg('?')],
         None, 'Could you tell me where my jacket is?'),

    card('sent-jacket-a-19', ['sentence', 'answer'], *VERB,
         None, None,
         'Sie hängt an der Garderobe.',
         [seg('Sie ', pron), seg('hängt ', red), seg('an ', prep), seg('der '), seg('Garderobe', fem), seg('.')],
         None, 'It is hanging on the coat rack.'),

    card('sent-coffee-q-20', ['sentence', 'indirect-question'], *VERB,
         None, 'Indirect question with wie',
         'Könnten Sie mir sagen, wie der Kaffeeautomat funktioniert?',
         [seg('Könnten ', red), seg('Sie ', pron), seg('mir ', pron), seg('sagen', red),
          seg(', '), seg('wie ', teal), seg('der '), seg('Kaffeeautomat ', masc), seg('funktioniert', red), seg('?')],
         None, 'Could you tell me how the coffee machine works?'),

    card('sent-coffee-a-21', ['sentence', 'answer'], *VERB,
         None, 'man muss + infinitive',
         'Man muss zuerst eine Tasse hinstellen und dann einen Knopf drücken.',
         [seg('Man ', pron), seg('muss ', blue), seg('zuerst ', adj), seg('eine '), seg('Tasse ', fem),
          seg('hinstellen ', red), seg('und '), seg('dann ', adj), seg('einen '),
          seg('Knopf ', masc), seg('drücken', red), seg('.')],
         None, 'First you need to place a cup and then press a button.'),

    card('sent-unreal-22', ['sentence', 'unreal-condition'], *VERB,
         None, 'Unreal condition: Wenn ... hätte, würde ...',
         'Wenn ich mehr Zeit hätte, würde ich reisen.',
         [seg('Wenn '), seg('ich ', pron), seg('mehr ', adj), seg('Zeit ', fem), seg('hätte', red),
          seg(', '), seg('würde ', red), seg('ich ', pron), seg('reisen', red), seg('.')],
         None, 'If I had more time, I would travel.'),

    card('sent-indirect-23', ['sentence', 'indirect-speech'], *VERB,
         None, 'Indirect speech: Er sagte, er wäre ...',
         'Er sagte, er wäre krank.',
         [seg('Er ', pron), seg('sagte', red), seg(', '), seg('er ', pron), seg('wäre ', red), seg('krank', adj), seg('.')],
         None, 'He said he was sick.'),

    card('sent-jacket-ob-24', ['sentence', 'indirect-question', 'perfekt'], *VERB,
         None, 'Indirect question with ob + Perfekt',
         'Könnten Sie mir sagen, ob ihr meine Jacke gesehen habt?',
         [seg('Könnten ', red), seg('Sie ', pron), seg('mir ', pron), seg('sagen', red),
          seg(', '), seg('ob '), seg('ihr ', pron), seg('meine '),
          seg('Jacke ', fem), seg('gesehen ', red), seg('habt', red), seg('?')],
         None, 'Could you tell me whether you (all) have seen my jacket?'),

    card('sent-jacket-ob-a-25', ['sentence', 'perfekt', 'answer'], *VERB,
         None, 'Perfekt tense: haben + past participle',
         'Ja, wir haben sie im Klassenzimmer gesehen.',
         [seg('Ja'), seg(', '), seg('wir ', pron), seg('haben ', red), seg('sie ', pron),
          seg('im ', prep), seg('Klassenzimmer ', neut), seg('gesehen', red), seg('.')],
         None, 'Yes, we saw it in the classroom.'),
]

data = {
    'decks': [{'id': 'what-is-konjunktiv-ii', 'title': 'Konjunktiv II',
               'source': 'What is Konjunktiv II.docx', 'cardCount': len(cards)}],
    'cards': cards
}

with open('src/data/flashcards.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Written {len(cards)} cards to src/data/flashcards.json')
