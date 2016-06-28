var fs = require("fs");
var path = require('path');
var chalk = require('chalk');
var Table = require('cli-table');
var async = require('async');
var git = require('simple-git');

var table = new Table({
    head: ['Directory', 'Current Branch/NA']
});

//either passed from CLI or take the current directory
var cwd = process.argv[2] || process.cwd();

console.log( chalk.green( cwd ) )

process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
});

fs.readdir(cwd, function (err, files) {
    async.map(files, function (file, callback) {
      fs.stat(path.join(cwd, file), function (err, stat) {
        if(err) return callback(err);
        callback( null, {
          file: file,
          stat: stat
        })
      })
    }, function(err, results){
      if(err) throw new Error(err);
      async.filter(results, function (stat, callback) {
        if( stat.stat.isDirectory() ){
          callback(null, true)
        } else {
          callback(null, false)
        }
      }, function (err, res) {
        async.filter(res, function (stat, callback) {
          fs.access(path.join(cwd, stat.file, '.git'), fs.F_OK, function(e) {
            if( e ){
              callback(null, false)
            } else {
              callback(null, true)
            }
          })
        }, function (err, res) {
          if( err ){ }
          async.map(res, function (stat, callback) {
            try{
              var gitRepo = new git(path.join(cwd, stat.file))
              gitRepo.revparse( ['--abbrev-ref', 'HEAD'], function (e, status) {
                stat.status = status;
                callback(null, stat);
              })
            } catch(e){
              stat.status = '-'
              callback(null, stat)
            }
          }, function (err, repoStats) {
            async.map(repoStats, function (status, callback) {
              table.push([status.file, status.status.trim()])
              callback(null, status)
            }, function (err, res) {
              console.log( table.toString() )
            })
          });
        })
      })
    });
  });
