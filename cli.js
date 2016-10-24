#!/usr/bin/env node

var fs = require("fs");
var path = require('path');
var chalk = require('chalk');
var Table = require('cli-table');
var async = require('async');
var package = require('./package')
var C = require('./constants');
var updateNotifier = require('update-notifier');

var theGit = require('git-state');
var Spinner = require('cli-spinner').Spinner;
var argv = require('minimist')(process.argv.slice(2))

var spinner = null;
var table = null;
var cwd = null;
var debug = false;
var fileIndex = 0;
var statuses = [];

var showGitOnly = argv.gitonly || argv.g;
var dirs = argv._.length ? argv._ : [process.cwd()]

updateNotifier({
  pkg: package,
  updateCheckInterval: 1000 * 60 * 60 * 24 * C.updateInterval
}).notify();

if (argv.debug) {
  debug = true;
}

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
    '  ' + package.name + ' [path] [options]\n\n' +
    'The path defaults to the current direcotry if not specified.\n\n' +
    'Options:\n' +
    '  --help, -h           show this help\n' +
    '  --version, -v        show version\n' +
    '  --compact, -c        output compact table\n' +
    '  --compact=s, -c=s    output compact table with short headers\n' +
    '                       with headers described in bottom of table\n' +
    '  --compact=so, -c=so  output compact table with short headers\n' +
    '                       and no description of headers\n' +
    '  --gitonly, -g        output only git repos\n' +
    '  --attention, -a      output only dirs which requires attention\n' +
    '                       also includes non git dirs, use -g to omit them\n' +
    '  --simple, -s         make the output more simple for easy grepping'
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
      chalk.cyan(C.headers.directory.long),
      chalk.cyan(C.headers.branch.long),
      chalk.cyan(C.headers.ahead.long),
      chalk.cyan(C.headers.dirty.long),
      chalk.cyan(C.headers.untracked.long),
      chalk.cyan(C.headers.stashes.long)
    ]
  };
  if (argv.compact || argv.c) {
    if( argv.compact == 's' || argv.c == 's' || argv.compact == 'so' || argv.c == 'so'){
      tableOpts.head = [
        chalk.cyan(C.headers.directory.short),
        chalk.cyan(C.headers.branch.short),
        chalk.cyan(C.headers.ahead.short),
        chalk.cyan(C.headers.dirty.short),
        chalk.cyan(C.headers.untracked.short),
        chalk.cyan(C.headers.stashes.short)
      ];
    }
    tableOpts.chars = {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
  };
  table = new Table(tableOpts);
}

function prettyPath(pathString) {
  var p = pathString.split(path.sep);
  return p[p.length - 1];
}

function processDirectory(stat, callback) {
  var pathString = path.join(cwd, stat.file);
  if( stat.stat.isDirectory() ){
    if(debug) console.log(fileIndex, stat.file)
    theGit.isGit(pathString, function(isGit){
      if(isGit){
        theGit.check( pathString, function(e, gitStatus){
          if(e) callback(e);
          gitStatus.git = true;
          if(debug) console.log(stat.file, gitStatus)
          insert(pathString, gitStatus)
          callback(null, true)
        })
      } else {
          var gitStatus = {branch: '-', issues: '-', git: false, untracked: '-', ahead: '-', stashes: '-', dirty: '-'};
          if(debug) console.log(stat.file, gitStatus)
          if( !showGitOnly ) {
            insert(pathString, gitStatus)
          }
          callback(null, false)
      }
    })
  } else {
    if(debug) console.log(stat.file, false)
    callback(null, false)
  }
  fileIndex++;
}

function insert(pathString, status){
  var directoryName = prettyPath( pathString );
  status.directory = directoryName;
  statuses.push(status)
  var methodName = status.dirty === 0
        ? status.ahead === 0
          ? status.untracked === 0
            ? 'grey'
            : 'yellow'
          : 'green'
        : 'red'

  if( (argv.attention || argv.a) && (methodName == 'grey') ){

  } else {
    var method = chalk[methodName];
    table.push([
        directoryName,
        method( status.branch !== undefined && status.branch !== null ? status.branch : '-' ),
        method( status.ahead !== undefined && status.ahead !== null ? status.ahead : '-' ),
        method( status.dirty !== undefined && status.dirty !== null ? status.dirty : '-' ),
        method( status.untracked !== undefined && status.untracked !== null ? status.untracked : '-' ),
        method( status.stashes !== undefined && status.stashes !== null ? status.stashes : '-' )
      ]);
  }
}

function simpleStatus(status){
  //simple comma and newline separated output for machine readability
  var str = [];
  for (var i = 0; i < C.simple.length; i++) {
    str.push(status[C.simple[i]])
  }
  console.log(str.join(','))
}

function simple(){
  for (var i = 0; i < statuses.length; i++) {
    simpleStatus(statuses[i])
  }
}

function finish(){
  spinner.stop();
  process.stdout.clearLine();  // clear current text
  process.stdout.cursorTo(0);  // move cursor to beginning of line
  if (argv.simple || argv.s) {
    simple();
  } else {
    if (!chalk.supportsColor) {
      console.log( chalk.stripColor( table.toString() ) );
    } else {
      console.log( table.toString() );
    }
  }
  if (argv.compact || argv.c) {
    if( argv.compact == 's' || argv.c == 's' || argv.compact == 'so' || argv.c == 'so'){
      var str = [];
      Object.keys(C.headers).map(function(key){
        var header = C.headers[key];
        str.push(chalk.cyan(header.short) + ': ' + header.long)
      })
      if( !(argv.compact == 'so' || argv.c == 'so') ){
        console.log(str.join(', ') + '\n')
      }
    }
  }
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
