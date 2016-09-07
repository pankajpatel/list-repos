#!/usr/bin/env node

var fs = require("fs");
var path = require('path');
var chalk = require('chalk');
var Table = require('cli-table');
var async = require('async');

var theGit = require('git-state');
var Spinner = require('cli-spinner').Spinner;

var spinner = null;
var table = null;
var cwd = null;

var debug = false;

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
});

function init() {
  //either passed from CLI or take the current directory
  cwd = process.argv[2] || process.cwd();

  //Spinners
  spinner = new Spinner('%s');
  spinner.setSpinnerString(18);
  spinner.start();
  
  //Console Tables
  table = new Table({
    head: [chalk.cyan('Directory'), chalk.cyan('Current Branch/NA')]
  });
}

function prettyPath(pathString) {
  var p = pathString.split('/');
  return p[p.length - 1];
}
var fileIndex = 0;
function processDirectory(stat, callback) {
  var pathString = path.join(cwd, stat.file);
  if( stat.stat.isDirectory() ){
    theGit.isGit(pathString, function(isGit){
      if(isGit){
        theGit.check( pathString, function(e, gitStatus){
          if(e) callback(e);
          insert(pathString, gitStatus)
          callback(null, true)
          if(debug) console.log(fileIndex++, stat.file)
          if(debug) console.log(gitStatus)
        })
      } else {
          var gitStatus = {branch: '-', issues: false};
          insert(pathString, gitStatus)
          callback(null, false)
          if(debug) console.log(fileIndex++, stat.file)
          if(debug) console.log(gitStatus)
      }
    })
  } else {
    if(debug) console.log(fileIndex++, stat.file)
    if(debug) console.log(false)
    callback(null, false)
  }
}

function insert(pathString, status){
  table.push([prettyPath(pathString), status.issues ? chalk.red(status.branch) : chalk.green(status.branch)]);
}

function finish(){
  spinner.stop();
  console.log( table.toString() );
}

init();
console.log( chalk.green( cwd ) )

// processDirectory(cwd)

fs.readdir(cwd, function (err, files) {
  async.map(files, function (file, statCallback) {
    fs.stat(path.join(cwd, file), function (err, stat) {
      if(err) return statCallback(err);
      statCallback( null, {
        file: file,
        stat: stat
      })
    })
  }, function(err, statuses){
    if(err) throw new Error(err);
    if(debug) console.log(statuses.length);
    async.filter(statuses, processDirectory, function () {
      finish();
    })
  })
});