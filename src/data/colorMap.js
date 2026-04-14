// Maps part-of-speech types to CSS color values.
// type: "fg" = text color, "bg" = background highlight

export const COLOR_MAP = {
  verb:        { color: '#D32F2F', type: 'fg' }, // red
  modalVerb:   { color: '#1565C0', type: 'fg' }, // blue
  perfekt:     { color: '#6D4C41', type: 'fg' }, // brown
  futur:       { color: '#2E7D32', type: 'fg' }, // dark green
  nounFem:     { color: '#C2185B', type: 'fg' }, // pink
  nounMasc:    { color: '#1976D2', type: 'fg' }, // blue
  nounNeut:    { color: '#388E3C', type: 'fg' }, // green
  nounPlural:  { color: '#F9A825', type: 'fg' }, // yellow
  pronoun:     { color: '#1B5E20', type: 'fg' }, // dark green
  adjAdv:      { color: '#E65100', type: 'fg' }, // orange
  preposition: { color: '#6A1B9A', type: 'fg' }, // purple
  conjunction: { color: '#EC407A', type: 'fg' }, // pink
  negation:    { color: '#AD1457', type: 'fg' }, // dark pink
  wQuestion:   { color: '#00897B', type: 'fg' }, // teal
  sepPrefix:   { color: '#F9A825', type: 'fg' }, // yellow
  timeExpr:    { color: '#BBDEFB', type: 'bg' }, // light blue bg
  placeExpr:   { color: '#C8E6C9', type: 'bg' }, // light green bg
  frequency:   { color: '#FFF9C4', type: 'bg' }, // light yellow bg
  number:      { color: '#4A148C', type: 'fg' }, // dark purple
  reflexive:   { color: '#F8BBD0', type: 'bg' }, // light pink bg
};
