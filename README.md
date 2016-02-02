# Audio Quiz App

This audio quiz app are created in association with http://stadtnatur.naturkundemuseum-berlin.de.

## Building

### Requirements

Requires programs are:

* nodejs
* npm
* ImageMagic

There are further dependencies. Please make sure there are also installed.

```
$> npm install ionic@beta -g
$> npm install cordova -g
$> npm install tsd -g
$> npm install imagemin-cli -g //for optimizing assets before building the app
```

Clone project to a preferred folder and install dependencies.

```
$> git clone git@github.com:farbtrommel/quiz.git <folder>
$> cd <folder>
$> npm install
```

### Assets preparation before ionic serve

Make sure you have `convert` in your system path for the script. 
If you haven't ImageMagic installed visited this [site](http://www.imagemagick.org/script/binary-releases.php).
This script download all mp3 files and images. The images will cropped and resized.
The scripts runs sequentially thought the data set. Therefore, could take couple minutes at the first run.

```
$> cd <folder>
$> node hook/before_build/010_download_images.js <folder>
```

The script retrieve all need information from `app/quiz/data.ts`.

### Run android

Initialise Cordova.

```
$> cordova platform add android 
```

Build a debug apk file.

```
$> cordova build android 
```

Run a debug version.

```
$> cordova run android --device //if device is connect
```



### Run local web server

```
$> ionic serve
```

# License
The MIT License (MIT)
Copyright (c) 2016 Simon Koennecke <simon@farbtrommel.de>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.