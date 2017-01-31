#!/usr/bin/env node

var fs = require("fs");
var path = require('path');
var chalk = require('chalk');
var Table = require('cli-table');
var _async = require('async');
var pkg = require('./package')
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
var compact = null;

var showGitOnly = argv.gitonly || argv.g;
var dirs = argv._.length ? argv._ : [process.cwd()]

updateNotifier({
  pkg: pkg,
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

if (argv.compact) {
  compact = argv.compact;
}
else if (argv.c) {
  compact = argv.c;
}
else {
  compact = false;
}

function version () {
  console.log(pkg.version)
  process.exit()
}

function hasAskedForCompact () {
  return compact && compact === 's';
}

function hasAskedForVeryCompact () {
  return compact && compact === 'so';
}

function help () {
  console.log(
    pkg.name + ' ' + pkg.version + '\n' +
    pkg.description + '\n\n' +
    'Usage:\n' +
    '  ' + pkg.name + ' [path] [options]\n\n' +
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

function getTableHeader(type, color) {
  if(!color) {
    color = 'cyan';
  }
  return [
    chalk[color](C.headers.directory[type]),
    chalk[color](C.headers.branch[type]),
    chalk[color](C.headers.ahead[type]),
    chalk[color](C.headers.dirty[type]),
    chalk[color](C.headers.untracked[type]),
    chalk[color](C.headers.stashes[type])
  ]
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
    head: getTableHeader('long')
  };
  if ( compact ) {
    if( hasAskedForCompact() || hasAskedForVeryCompact() ){
      tableOpts.head = getTableHeader('short');
    }
    tableOpts.chars = {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
  }
  table = new Table(tableOpts);
}

function prettyPath(pathString) {
  var p = pathString.split(path.sep);
  return p[p.length - 1];
}

function processDirectory(stat, callback) {
  fileIndex++;
  var pathString = path.join(cwd, stat.file);
  if( stat.stat.isDirectory() ){
    if(debug) console.log(fileIndex, stat.file)
    theGit.isGit(pathString, function(isGit){
      if(isGit){
        theGit.check( pathString, function(e, gitStatus){
          if(e) return callback(e);
          gitStatus.git = true;
          if(debug) console.log(stat.file, gitStatus)
          insert(pathString, gitStatus)
          return callback(null, true)
        })
      } else {
          var gitStatus = {branch: '-', issues: '-', git: false, untracked: '-', ahead: '-', stashes: '-', dirty: '-'};
          if(debug) console.log(stat.file, gitStatus)
          if( !showGitOnly ) {
            insert(pathString, gitStatus)
          }
          return callback(null, false)
      }
    })
  } else {
    if(debug) console.log(stat.file, false)
    return callback(null, false)
  }
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

  if( !( (argv.attention || argv.a) && (methodName === 'grey') )){
    table.push([
        directoryName,
        checkAndGetEmptyString(status, 'branch', methodName),
        checkAndGetEmptyString(status, 'ahead', methodName),
        checkAndGetEmptyString(status, 'dirty', methodName),
        checkAndGetEmptyString(status, 'untracked', methodName),
        checkAndGetEmptyString(status, 'stashes', methodName)
      ]);
  }
}

function checkAndGetEmptyString(status, key, methodName){
  return chalk[methodName](status[key] !== undefined && status[key] !== null ? status[key] : '-');
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
  if ( compact ){
    var str = [];
    Object.keys(C.headers).map(function(key){
      var header = C.headers[key];
      str.push(chalk.cyan(header.short) + ': ' + header.long)
    })
    if( !hasAskedForVeryCompact() ){
      console.log(str.join(', ') + '\n')
    }

  }
}

init();
console.log( chalk.green( cwd ) )

// processDirectory(cwd)

fs.readdir(cwd, function (err, files) {
  if(err){
    throw err;
  }
  _async.map(files, function (file, statCallback) {
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
    _async.filter(statuses, processDirectory, function () {
      finish();
    })
  })
});
