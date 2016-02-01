#!/usr/bin/env node

// Add Platform Class
// v1.0
// Automatically adds the platform class to the body tag
// after the `prepare` command. By placing the platform CSS classes
// directly in the HTML built for the platform, it speeds up
// rendering the correct layout/style for the specific platform
// instead of waiting for the JS to figure out the correct classes.


var fs = require('fs');
var path = require('path');
var http = require('http');
var request = require('request');
var easyimg = require('easyimage');
var exec = require('child_process').exec;

var rootdir = process.argv[2];

function downloadFile(src, dest, mindest, crop) {
    fs.access(dest, fs.F_OK, function(err) {
        if (!err) {
            //console.log("Use existing: " + src);
            resizeImage(src, dest, mindest, crop);
        } else {
            //console.log("Download: " + src);
            download(src, dest, function(){
               console.log('done: ' + src);
               resizeImage(src, dest, mindest, crop);
            });
        }
    });
}

var download = function(uri, filename, callback){
    try {
        request(uri).pipe(fs.createWriteStream(filename))
            .on('close', callback);
    } catch (e) {
        console.log('error' + uri);
    }

    //request.head(uri, function(err, res, body){
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);
    //});
};

function resizeImage(src, dest, mindest, crop) {
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
    easyimg.exec(cmd)

    /*easyimg.rescrop({
        src:dest, dst:mindest,
        width:300, height:300,
        gravity: "NorthWest",
        cropwidth:crop.width, cropheight:crop.height,
        x:crop.x * -1, y:crop.y * -1
    })*/.then(
        function(image) {
            //console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
        },
        function (err) {
            console.log(cmd);
            console.log(err);
        }
    );

}

if (rootdir) {
    var parseArrayExp = /.*return\s*(\[.*\])\s*;.*/;

    fs.mkdir(rootdir + "/www/assets/",function(e){
        if(!e || (e && e.code === 'EEXIST')){
            fs.mkdir(rootdir + "/www/assets/quiz", function(e){});
        }
    });

    //Read Quiz Data
    fs.readFile(rootdir + '/app/quiz/data.ts', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        //bit dirty...
        var d = data.substr(data.indexOf('['), data.lastIndexOf(']') - data.indexOf('[') + 1);
        var obj = JSON.parse(d);

        //Loop over the data set
        for(var s=0; s < obj.length; s++) {
            //create for each category own folder
            fs.mkdir(rootdir + "/www/assets/quiz/" + obj[s].id, function(e){});
            for(var i=0; i < obj[s].GamesSet.length; i++) {
                var src = obj[s].GamesSet[i].Image.Src;
                src = src.replace("https", "http");
                var crop = {
                    'width': 500,
                    'height': 500,
                    'x': 0,
                    'y': 0
                };
                if (obj[s].GamesSet[i].Image.Crop && obj[s].GamesSet[i].Image.Crop != "") {
                    crop = JSON.parse(obj[s].GamesSet[i].Image.Crop);
                }

                var dest = rootdir + "/www/assets/quiz/" + obj[s].id + "/origin-" + obj[s].GamesSet[i].id + ".jpg";
                var destMin = rootdir + "/www/assets/quiz/" + obj[s].id + "/thumbnail-" + obj[s].GamesSet[i].id + ".jpg";
                downloadFile(src, dest, destMin, crop);

            }
        }


    });
}
