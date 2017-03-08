/* eslint-disable no-console */
const exec = require('node-spawn-util');
const path = require('path');

class Node {
  constructor (path) {
    this.path = path;
    this.children = null;
  }

  getPathForActiveView (dir) {
    return convertToActiveViewPartialSpecifiedString( this.path, dir );
  }
}

function traverse(currentNode, viewFileDirectory) {
  partialFileName = currentNode.getPathForActiveView(viewFileDirectory);

  return findFilesByGitGrep(partialFileName, viewFileDirectory).then(
    (files) => {
      if (!files) {
        return null;
      }

      const nodes = files.map( (file) => {
        return new Node(file);
      });

      return Promise.all( nodes.map( (node) => {
        return traverse(node, viewFileDirectory);
      }));
    }
  ).then( (nodes) => {
    currentNode.children = nodes;

    return currentNode;
  });
}

function printTraversalPath( partialFileName, viewFileDirectory ) {
  const node = new Node( partialFileName );
  traverse(node, viewFileDirectory);
}

function findFilesByGitGrep( keyword, directory ) {
  keyword = '[\'"]' + keyword + '[\'"]';
  return new Promise( (resolve, reject) => {
    exec('git', ['grep', keyword, '--', directory], (err, stdout, stderr) => {
      if (err) {
        if (stderr.length == 0) {
          resolve(null);
        } else {
          reject(stderr);
        }
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
  const {dir, base} = path.parse(pathFromViewDirectory);

  return path.join(dir, base.replace('_', '').split('.')[0]);
}

module.exports = {
  Node,
  traverse,
  printTraversalPath,
  findFilesByGitGrep,
  convertToActiveViewPartialSpecifiedString
};
