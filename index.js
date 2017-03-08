/* eslint-disable no-console */
const program = require('commander');
program.version('0.0.1');

const { printTraversalPath } = require('./lib');

program
  .command('traverse <partialFileName> <viewFileDirectory>')
  .description('print traversal path that specified partial is read')
  .action( printTraversalPath );

program.parse(process.argv);

