![](https://raw.githubusercontent.com/muchweb/my-little-printer/master/logo.png)

Print beautifully formatted receipts, generated locally, to any [CUPS](http://www.cups.org/) printer with lite 'plug-in' system.

Does *not* require arduino or any other additional hardware. My printer (I am using on [Citizen CT-S2000](http://www.citizen-systems.com/product.aspx?id=101)) is connected via USB.

Comes with 'plug-in's that allow to print a weather report and news feed. Optimized for 80mm paper output (640 pixel width, can be changed). 

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

## How does it work

1. Download data from RSS feeds
2. Parse feeds using [feedparser](https://github.com/danmactough/node-feedparser)
3. Generate HTML using handlebars
4. Generate image from HTML
5. [lp](http://www.cups.org/documentation.php/options.html)

## Requirements

 - [forecast.io API](https://developer.forecast.io/) account
 - Printer must be installed as default [CUPS](http://www.cups.org/) printer
 - [PhantomJS](http://phantomjs.org/)

# Credits

 - Weather icons: [Climacons](http://adamwhitcroft.com/climacons/)
 - Inspired by [Hello, Printer](http://exciting.io/2012/04/12/hello-printer/) ([Printer](https://github.com/exciting-io/printer) project).
