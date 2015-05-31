
var fs = require('fs')
  , xml = fs.readFileSync('./doc.xml')
  , parse = require('xml2js').parseString
  , Viewer = require('../lib/document-viewer.js')

parse(xml, function (err, doc) {
  var viewer = new Viewer(doc.document)
  viewer.renderPage(0)

  setTimeout(function() {viewer.renderPage(1)}, 1000)
  setTimeout(function() {viewer.renderPage(0)}, 2000)
  

});
