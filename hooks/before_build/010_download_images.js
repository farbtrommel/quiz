#!/usr/bin/env node
var Q = require('q');
var fs = require('fs');
var path = require('path');
var http = require('http');
var request = require('request');
var easyimg = require('easyimage');
var exec = require('child_process').exec;
var rootdir = process.argv[2];

/**
 * Downloaded, crop and resize Image.
 * @param src URL to fetch image
 * @param dest Path to source image file on disk
 * @param mindest  Path to write to crop and resized image file
 * @param crop Crop settings
 * @returns Promise
 */
function processThumb(src, dest, mindest, crop) {
    var deferred = Q.defer();
    checkIfResourceExists(mindest).then(function() {
        //console.log("Thumbnail already exists (" + src + ").");
        deferred.reject("Thumbnail already exists.");
    }, function(err) {
        checkIfResourceExists(src).then(function() {
            //console.log("Source already downloaded: " + dest + ".");
            resizeImage(src, dest, mindest, crop).then(function () {
                //console.log("Cropped Image: " + dest + ".");
                deferred.resolve();
            }, function () {
                //console.log("Couldn't cropped image: " + dest + ".");
                deferred.reject("Couldn't cropped image.");
            });
        }, function() {
            download(src, dest).then(function () {
                //console.log("Source downloaded: " + src + ".");
                resizeImage(src, dest, mindest, crop).then(function () {
                    //console.log("Cropped Image: " + dest + ".");
                    deferred.resolve();
                }, function () {
                    //console.log("Couldn't cropped image: " + dest + ".");
                    deferred.reject("Couldn't cropped image.");
                });
            }, function (error) {
                //console.log("Source couldn't downloaded: " + src + ".");
                deferred.reject("Source couldn't downloaded.");
            });
        });
    });
    return deferred.promise;
}

/**
 * File or Folder exists?
 * @param path
 * @returns Promise
 */
function checkIfResourceExists(path) {
    var deferred = Q.defer();
    fs.access(path, fs.F_OK, function(err) {
        if (!err) {
            deferred.resolve();
        } else {
            deferred.reject(err);
        }
    });

    return deferred.promise;
}

/**
 * Download uri and move to filename.
 * @param uri
 * @param filename
 * @returns Promise
 */
function download(uri, filename){
    var deferred = Q.defer();
    try {
        request(uri).pipe(fs.createWriteStream(filename))
            .on('close', function() {
                deferred.resolve();
            });
    } catch (e) {
        deferred.reject(e);
    }

    return deferred.promise;
}

/**
 * Resize and Crop Image by provided position from @crop
 * @param src URL to fetch image
 * @param dest Path to source image file on disk
 * @param mindest  Path to write to crop and resized image file
 * @param crop Crop settings
 * @returns Promise
 */
function resizeImage(src, dest, mindest, crop) {
    var deferred = Q.defer();

    crop.width = crop.width || 500;
    crop.height = crop.height || 500;
    crop.x = crop.x || 0;
    crop.y = crop.y || 0;
    //convert origin-4.jpg -repage -gravity NorthWest -resize 300x300 -crop 1342x2013+0+333 +repage thumbnail-4.jpg
    var cmd = "convert " + dest + " " +
        //"-gravity NorthWest " +
        "-crop " + parseInt(crop.width) + "x" + parseInt(crop.height) + "+" + parseInt(crop.x) + "+"+ parseInt(crop.y) +
        " +repage " +
        "-resize 300x300! " +
        mindest;
    easyimg.exec(cmd).then(function() {
        deferred.resolve();
    }, function(err){
        deferred.reject({err, src: src, dest: dest, mindest: mindest, crop: crop});
    });

    return deferred.promise;
}

/**
 * Is the folder not created yet created
 * @param path Full path to create directory.
 * @return Promise
 */
function isOrCreateDir(path) {
    var deferred = Q.defer();
    fs.mkdir(path,function(e){
        if(!e || (e && e.code === 'EEXIST')){
            deferred.resolve();
        } else {
            deferred.reject("Failed to create directory: " + path);
        }
    });

    return deferred.promise;
}

/**
 * Create asset folder in static folder of the web app and temp folder.
 * @return Promise
 */
function createAllDirectories(obj) {
    var deferred = Q.defer();
    isOrCreateDir(rootdir + "/www/assets/").then(function(){
        isOrCreateDir(rootdir + "/www/assets/quiz").then(function(){
            isOrCreateDir(rootdir + "/tmp").then(function() {
                isOrCreateDir(rootdir + "/tmp/quiz").then(function() {
                    var ary = [];
                    //Loop over the data set
                    for(var s=0; s < obj.length; s++) {
                        //create for each category own folder
                        ary.push(isOrCreateDir(rootdir + "/www/assets/quiz/" + obj[s].id));
                        ary.push(isOrCreateDir(rootdir + "/tmp/quiz/" + obj[s].id));
                    }
                    Q.all(ary).then(function() {
                        deferred.resolve();
                    }, function(err) {
                        deferred.reject("Failed to create all quiz assets directory.");
                    });
                }, function(err) {
                    deferred.reject("Failed to create directory 'tmp/quiz'.");
                });
            }, function(err) {
                deferred.reject("Failed to create directory 'tmp'.");
            });
        }, function(err) {
            deferred.reject("Failed to create directory 'www/assets/quiz'.");
        });
    }, function(err) {
        deferred.reject("Failed to create directory 'www/assets'.");
    });
    return deferred.promise;
}
/**
 * Read file and return a Object.
 * @param path Source file
 * @return Promise
 */
function readFileToObj(path) {
    var deferred = Q.defer();
    var parseArrayExp = /.*return\s*(\[.*\])\s*;.*/;
    //Read Data
    fs.readFile(rootdir + '/app/quiz/data.ts', 'utf8', function (err,data) {
        if (err) {
            deferred.reject(err);
        }
        //bit dirty...
        var d = data.substr(data.indexOf('['), data.lastIndexOf(']') - data.indexOf('[') + 1);
        var obj = JSON.parse(d);

        deferred.resolve(obj);
    });

    return deferred.promise;
}

/**
 * Pre process for the image download
 * @param game Game Set configuration
 * @param gameEntry Game entry is bird with all information Name, Image, Audio etc
 * @return Promise
 */
function downloadImage(game, gameEntry) {
    var deferred = Q.defer();
    var src = gameEntry.Image.Src;
    //dirty hack but suitable for the situation
    src = src.replace("https", "http");
    var crop = {
        'width': 500,
        'height': 500,
        'x': 0,
        'y': 0
    };
    if (gameEntry.Image.Crop && gameEntry.Image.Crop != "") {
        crop = JSON.parse(gameEntry.Image.Crop);
    }

    var dest = rootdir + "/tmp/quiz/" + game.id + "/origin-" + gameEntry.id + ".jpg";
    var destMin = rootdir + "/www/assets/quiz/" + game.id + "/thumbnail-" + gameEntry.id + ".jpg";

    processThumb(src, dest, destMin, crop).then(function () {
        deferred.resolve("Thumbnail created successfully");
    }, function (error) {
        deferred.reject(error);
    });

    return deferred.promise;
}

/**
 * Pre process: Download audio file, when is not already there.
 * @param game Game Set configuration
 * @param gameEntry Game entry is bird with all information Name, Image, Audio etc
 * @return Promise
 */
function downloadAudio(game, gameEntry) {
    var deferred = Q.defer();
    var dest = rootdir + "/www/assets/quiz/" + game.id + "/audio-" + gameEntry.id + ".mp3";
    checkIfResourceExists(dest).then(function() {
        deferred.reject("mp3 already there.");
    }, function(error) {
        download(gameEntry.Audio.Src, dest).then(function () {
            deferred.resolve("mp3 downloaded.");
        }, function (error) {
            deferred.reject(error);
        });

    });
    return deferred.promise;
}
/**
 * Download audio and image assets for one game.
 * @param game Game set
 * @param i Number of GameEntry
 * @param deferred Promise Object of type Q.defer() get called when the data set is finished.
 */
function downloadAssets(game, i, deferred) {
    if (game.GamesSet.length == 0) {
        deferred.resolve();
        return;
    }
    //TODO: cancel redundant code
    downloadAudio(game, game.GamesSet[i]).then(function(msg){
        console.log(game.GamesSet[i].Name + ": " + msg);
        downloadImage(game, game.GamesSet[i]).then(function(msg){
            downloadAssetsHandle(game, i, msg, deferred);
        }, function(msg){
            downloadAssetsHandle(game, i, msg, deferred);
        });
    }, function(msg){
        console.log(game.GamesSet[i].Name + ": " + msg);
        downloadImage(game, game.GamesSet[i]).then(function(msg){
            downloadAssetsHandle(game, i, msg, deferred);
        }, function(msg){
            downloadAssetsHandle(game, i, msg, deferred);
        });
    });
}
function downloadAssetsHandle(game, i, msg, deferred) {
    console.log(game.GamesSet[i].Name + ": " + msg);
    if (++i < game.GamesSet.length) {
        downloadAssets(game, i, deferred);
    } else {
        deferred.resolve();
    }
}
/**
 * Loop through all games sets
 * @param games All Games in Array
 * @param i control variable
 */
function loopThroughGames(games, i) {
    console.log("========== Download assets " + games[i].Name + " ==========");
    var p = Q.defer();
    downloadAssets(games[i], 0, p);
    p.promise.fin(function(){
        if (++i < games.length) {
            loopThroughGames(games, i);
        } else {
            console.log("");
            console.log("========================================== ");
            console.log("==========  All tasks are done. ========== ");
            console.log("========================================== ");
        }
    });
}

// only run if rootdir is as parameter given.
if (rootdir) {
    //Read Quiz Data
    readFileToObj(rootdir + '/app/quiz/data.ts').then(function (obj) {
        createAllDirectories(obj).then(function () {
            loopThroughGames(obj, 0);
        }, function (error) {
            return console.log(err);
        });
    }, function (error) {
        return console.log(err);
    });
}
