#!/usr/bin/env node

var fs = require("fs");
var path = require('path');
var chalk = require('chalk');
var Table = require('cli-table');
var async = require('async');
var package = require('./package')

var theGit = require('git-state');
var Spinner = require('cli-spinner').Spinner;

var argv = require('minimist')(process.argv.slice(2))
var dirs = argv._.length ? argv._ : [process.cwd()]

var spinner = null;
var table = null;
var cwd = null;

var debug = false;

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
});


if (argv.version || argv.v) {
  version()
  process.exit()
}

if (argv.help || argv.h) {
  help()
  process.exit()
}


function version () {
  console.log(package.version)
  process.exit()
}

function help () {
  console.log(
    package.name + ' ' + package.version + '\n' +
    package.description + '\n\n' +
    'Usage:\n' +
    '  ' + package.name + ' [paths] [options]\n\n' +
    'The paths defaults to the current direcotry if not specified.\n\n' +
    'Options:\n' +
    '  --help, -h     show this help\n' +
    '  --version, -v  show version\n' +
    '  --compact, -c  output compact table\n' +
    '  --gitonly, -g  output only git repos\n' +
    '  --simple       make the output more simple for easy grepping'
  )
  process.exit()
}

function init() {
  //either passed from CLI or take the current directory
  cwd = dirs[0]

  //Spinners
  spinner = new Spinner('%s');
  spinner.setSpinnerString(18);
  spinner.start();
  
  //Console Tables
  var tableOpts = {};
  tableOpts = {
    head: [
      chalk.cyan('Directory'), 
      chalk.cyan('Current Branch/NA'), 
      chalk.cyan('Ahead'), 
      chalk.cyan('Dirty'), 
      chalk.cyan('Untracked'), 
      chalk.cyan('Stashes')
    ]
  };
  if (argv.compact || argv.c) {
    tableOpts.chars = {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
  };
  table = new Table(tableOpts);
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
          if( !(argv.gitonly || argv.g) ) {
            insert(pathString, gitStatus)
          }
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
  var method = status.dirty === 0
        ? status.ahead === 0
          ? status.untracked === 0
            ? chalk.grey
            : chalk.yellow
          : chalk.green
        : chalk.red
  table.push([
      prettyPath(pathString), 
      method( status.branch !== undefined && status.branch !== null ? status.branch : '-' ),
      method( status.ahead !== undefined && status.ahead !== null ? status.ahead : '-' ),
      method( status.dirty !== undefined && status.dirty !== null ? status.dirty : '-' ),
      method( status.untracked !== undefined && status.untracked !== null ? status.untracked : '-' ),
      method( status.stashes !== undefined && status.stashes !== null ? status.stashes : '-' )
    ]);
}

function finish(){
  spinner.stop();
  process.stdout.clearLine();  // clear current text
  process.stdout.cursorTo(0);  // move cursor to beginning of line
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
