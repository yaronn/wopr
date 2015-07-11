#! /usr/bin/env node

var fs = require('fs')
  , parse = require('xml2js').parseString
  , Viewer = require('../lib/document-viewer.js')
  , blessed = require('blessed')
  , screen = blessed.screen()

var page = -1
var viewer = null

var file = process.argv[2]
if (!file) throw "please specify the presentation to render: \r\n\r\n $> doc-viewer doc.xml \r\n\r\n "

var xml = fs.readFileSync(file)
  
parse(xml, function (err, doc) {
  if (err) throw err
  
  viewer = new Viewer(doc.document, screen)
  next()
  
  screen.key(['space', 'return'], function(ch, key) {
      next()
  });

});


function next() {
  page++
  if (page>=viewer.document.page.length) process.exit()
  viewer.renderPage(page)
}