"use strict";
var spawn = require('child_process').spawn;
module.exports = function (inputFiles, outputFile, callback) {
    var commandInputStrings = inputFiles.join(' ');
    var args = [
        'qpdf',
        '--empty',
        '--pages',
        commandInputStrings,
        '--',
        outputFile
    ];
    
    executeCommand(args, callback);
}

function executeCommand(args, callback) {
    var child;

    var output = args[args.length - 1];

    console.log(args.join(' '));
    child = spawn('/bin/sh', ['-c', args.join(' ') + ' | cat']);

    // call the callback with null error when the process exits successfully
    if (callback) {
        child.on('exit', function () {
            callback(null, output);
        });
    }

    var outputStream = child.stdout;

    child.once('error', function (err) {
        handleError(err, child, outputStream, callback);
    });
    child.stderr.once('data', function (err) {
        handleError(new Error(err || ''), child, outputStream, callback);
    });

    // return stdout stream so we can pipe
    return outputStream;
}

function handleError(err, child, outputStream, callback) {
    if (child) {
        child.removeAllListeners('exit');
        child.kill();
    } else if (typeof child === 'function') {
        callback = child;
    }

    // call the callback if there is one
    if (callback) {
        callback(err);
    }

    // set a default output stream if not present
    if (typeof outputStream === 'function') {
        callback = outputStream;
        outputStream = new stream.Readable();
    } else if (typeof outputStream === 'undefined') {
        outputStream = new stream.Readable();
    }

    // if not, or there are listeners for errors, emit the error event
    if (!callback || outputStream.listeners('error').length > 0) {
        outputStream.emit('error', err);
    }
}
