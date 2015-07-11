
var fs = require('fs')
  , xml = fs.readFileSync('./rich.xml')
  , parse = require('xml2js').parseString
  , Viewer = require('../lib/document-viewer.js')

parse(xml, function (err, doc) {
  console.log(err)
  var viewer = new Viewer(doc.document)
  viewer.renderPage(0)

  //setTimeout(function() {viewer.renderPage(1)}, 1000)
  //setTimeout(function() {viewer.renderPage(0)}, 0)
  

});
