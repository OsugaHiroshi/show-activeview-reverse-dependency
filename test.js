const test = require('ava');
const {
  convertToActiveViewPartialSpecifiedString
} = require('./lib');

test('convertToActiveViewPartialSpecifiedString', t => {
  const result = convertToActiveViewPartialSpecifiedString('A/B/C/_D.ext.ext', 'A/B');
  t.is(result, 'C/D');
});
