![](https://raw.githubusercontent.com/muchweb/my-little-printer/master/logo.png)

Print beautifully formatted receipts, generated locally, to any [CUPS](http://www.cups.org/) printer with lite 'plug-in' system.

Does *not* require arduino or any other additional hardware. My printer (I am using on [Citizen CT-S2000](http://www.citizen-systems.com/product.aspx?id=101)) is connected via USB.

Comes with 'plug-in's that allow to print a weather report and news feed. Optimized for 80mm paper output (640 pixel width, can be changed). 

## Status

Project is in early draft state.

*Icons in `forecast` are currently broken* 

## TODO

 - [ ] To separate 'plug-ins' in node packages
 - [ ] Compatability with `printer` project
 - [x] Each section should render seperately
 - [x] To migrate from `Promise` to `Q` module

## Installation

Clone project and install all dependencies

```
git clone https://github.com/muchweb/my-little-printer.git
cd my-little-printer
npm install
```

Add your [forecast.io API](https://developer.forecast.io/) key and desired location to `printerfile.json`
**or**
Remove forecast entry from `printerile.json` if you don't have a key.

```
node ./do.js
```

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

 - Your printer must be installed as default [CUPS](http://www.cups.org/) printer
 - [PhantomJS](http://phantomjs.org/)
 - [GraphicsMagick](http://www.graphicsmagick.org/) (on Debian could be easily installed by running `apt-get install graphicsmagick`)

## Support

 - [forecast.io API](https://developer.forecast.io/) account

# Credits

 - Weather icons: [Climacons](http://adamwhitcroft.com/climacons/)
 - Inspired by [Hello, Printer](http://exciting.io/2012/04/12/hello-printer/) ([Printer](https://github.com/exciting-io/printer) project).
