const test = require('ava');
const {
  convertToActiveViewPartialSpecifiedString,
  findFilesByGitGrep,
  Node,
  traverse
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

test('findFilesByGitGrep but no files found', async t => {
  const files = await findFilesByGitGrep('D/d', './fixture');
  t.is(files, null);
});

test('traverse', async t => {
  const node = await traverse( new Node('./fixture/A/_a.txt'), './fixture');
  t.is(node.path, './fixture/A/_a.txt');
  t.is(node.children.length, 1)
  t.is(node.children[0].path, 'fixture/B/_b.txt');
  t.is(node.children[0].children.length, 1);
  t.is(node.children[0].children[0].path, 'fixture/C/c.txt');
});
