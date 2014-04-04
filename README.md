# My Little Printer

Allows to print beautifully formatted receipts. Currently allows to print news feeds and weather reports. Optimised for 80mm paper output.

## Status

Project is in early draft state. I am looking for a better way to inport 'plugins', grunt-style.

## Installing

```
npm install
```

Add your forecast.io key and location to `printerfile.json`

## Running

```
node ./do.js
```

This will fetch latest weather and news data and produce an output

## Requirements

forecast.io account
Printer must be installed as default [CUPS](http://www.cups.org/) printer
PhantomJS