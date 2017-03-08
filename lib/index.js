const exec = require('node-spawn-util');
const path = require('path');

function printTraversalPath( partialFileName, viewFileDirectory ) {
  gitGrep(partialFileName, viewFileDirectory).then(
    (grepStdout) => {
      const readerFiles = grepStdout.split('\n')
        .map( (line) => {
          return line.replace( /:.*/, '');
        })
        .filter( (line) => {
          return line.length >= 1;
        });

      return readerFiles;
    },
    (err) => {
      console.log(err);
    }
  );
}

function findFilesByGitGrep( keyword, directory ) {
  return new Promise( (resolve, reject) => {
    exec('git', ['grep', keyword, '--', directory], (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }
      const readerFiles = stdout.split('\n')
        .map( (line) => {
          return line.replace( /:.*/, '');
        })
        .filter( (line) => {
          return line.length >= 1;
        });

      resolve(readerFiles);
    });
  });
}

function convertToActiveViewPartialSpecifiedString( partialFileName, viewFileDirectory ) {
  const pathFromViewDirectory = path.relative( viewFileDirectory, partialFileName );
  const {dir, base} = parsedPath = path.parse(pathFromViewDirectory);

  return path.join(dir, base.replace('_', '').split('.')[0]);
}

module.exports = {
  printTraversalPath,
  findFilesByGitGrep,
  convertToActiveViewPartialSpecifiedString
};
