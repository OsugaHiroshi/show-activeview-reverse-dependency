const test = require('ava');
const {
  convertToActiveViewPartialSpecifiedString,
  findFilesByGitGrep
} = require('./lib');

test('convertToActiveViewPartialSpecifiedString', t => {
  const result = convertToActiveViewPartialSpecifiedString('A/B/C/_D.ext.ext', 'A/B');
  t.is(result, 'C/D');
});

test('findFilesByGitGrep', async t => {
  const files = await findFilesByGitGrep('A/a', './fixture');
  t.is(files.length, 1);
  t.is(files[0], 'fixture/B/_b.txt');
});
