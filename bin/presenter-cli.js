#! /usr/bin/env node

var file = process.argv[2]
if (file=="-h" | file=="--help") {
  showHelp()
  process.exit()
}

var fs = require('fs')
  , parse = require('xml2js').parseString
  , Viewer = require('../lib/document-viewer.js')
  , blessed = require('blessed')
  , screen = blessed.screen()

var page = -1
var viewer = null

if (!file) throw "please specify the presentation to render: \r\n\r\n $> doc-viewer doc.xml \r\n\r\n "

var xml = fs.readFileSync(file)
  
parse(xml, function (err, doc) {
  if (err) throw err
  
  if (!doc || !doc.document) throw "invalid document was provided"
    
  
  viewer = new Viewer(doc.document, screen)
  next()
  
  screen.key(['space', 'return'], function(ch, key) {
      next()
  });
  
  screen.key(['backspace'], function(ch, key) {
      prev()
  });
  
  screen.key(['q', 'escape'], function(ch, key) {
      process.exit()
  });

});

function prev() {
  if (page==0) return
  page--
  show()
  
}

function next() {
  if (page>=viewer.document.page.length-1) process.exit()
  page++
  show()
}

function show() {
  var err = viewer.renderPage(page)
  if (err!==null) console.log(err)
}

function showHelp() {
  console.log("\r\nusage: $> wopr [file.xml] \r\n\r\nuse spacebar / return to go forward in the presentation, backspace to go back, and ESC or q or CTRL+C to exit.\r\n\r\nhttps://github.com/yaronn/wopr\r\n\r\n")
}