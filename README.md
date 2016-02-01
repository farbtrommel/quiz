# Audio Quiz App

This audio quiz app are created in association with http://stadtnatur.naturkundemuseum-berlin.de.

# Building

## Requirements

Make sure following packages are installed

* nodejs,
* npm

and run this commandos:

```
$> npm install ionic@beta -g
$> npm install cordova -g
$> npm install tsd -g
```

Clone Project to preferred project folder and install all dependencies:

```
$> git clone <git:url> <folder>
$> cd <folder>
$> npm install
```

## Assets preparation before build

Make sure you have `convert` in your system path. 
If ImageMagic isn't installed use this [link](http://www.imagemagick.org/script/binary-releases.php).

```
$> cd <folder>
$> node hook/before_build/010_download_images.js <folder>
```

The script retrieve all need information from `app/quiz/data.ts`.

## Run local web server

```
$> ionic serve
```

# License
The MIT License (MIT)
Copyright (c) 2016 simon@farbtrommel.de

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.