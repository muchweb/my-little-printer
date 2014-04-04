# My Little Printer

Allows to print beautifully formatted receipts, generated locally, on any [CUPS](http://www.cups.org/) printer with lite 'plug-in' system.

Comes with 'plug-ins' that allow to print a weather report and news feed. Optimized for 80mm paper output (640 pixel width, can be changed). Tested on [Citizen CT-S2000](http://www.citizen-systems.com/product.aspx?id=101)

## Status

Project is in early draft state. I am looking for a better way to import 'plug-ins', i. e. Grunt-style, where each 'plug-in' is separated to node module.

## Installing

```
npm install
```

Add your [forecast.io API](https://developer.forecast.io/) key and desired location to `printerfile.json`

## Running

```
node ./do.js
```

This will fetch latest weather and news data and produce an output

## Requirements

 - [forecast.io API](https://developer.forecast.io/) account
 - Printer must be installed as default [CUPS](http://www.cups.org/) printer
 - [PhantomJS](http://phantomjs.org/)

# Credits

 - Weather icons: [Climacons](http://adamwhitcroft.com/climacons/)
 - Inspired by [Hello, Printer](http://exciting.io/2012/04/12/hello-printer/) ([Printer](https://github.com/exciting-io/printer) project).
