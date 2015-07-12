
/*
var parse = require('xml2js').parseString
  , url = require('url')
  , Viewer = require('../lib/document-viewer.js')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')

function present(req, res, body) {
  
  var query = url.parse(req.url, true).query
  var page = query.page || 0
  
  
  //console.log(body)
  
  if (!body | body=="") {
      
       res.writeHead(500, {'Content-Type': 'text/plain'});
       res.end("You must upload the document to present as the POST body")
       return
    
  }
    
    
  parse(body, function (err, doc) {

    //console.log(doc)
    
    if (err) {
       console.log(err)
       res.writeHead(500, {'Content-Type': 'text/plain'});
       res.end(err)
       return
    }
    
    if (page>=doc.document.page.length) {
       res.writeHead(500, {'Content-Type': 'text/plain'});
       res.end("this presentation has only " + doc.page.length + " pages")
       return
    }
    
    req.connection.on('close',function(){
      console.log("cleanup")
      screen = null
    });
    
  
    var screen = contrib.createScreen(req, res)
    
    viewer = new Viewer(doc.document, screen)
    viewer.renderPage(page)
    
    setTimeout(function() {
      res.write('\r\n\r\n')
      //restore cursor
      res.end('\033[?25h')
    }, 0)
    
  })
}

module.exports = present


*/

var blessed = require('blessed')
  , contrib = require('blessed-contrib')



function present(req, res, body) {

  blessed.Screen.global = null
  blessed.Program.global = null


    //require('./bar').handle(req, res)
    //return
    
    var screen = contrib.createScreen(req, res)
    
    
   /* var bar = contrib.bar(
    { label: ''
    , barWidth: 6
    , barSpacing: 8
    , xOffset: 2
    , maxHeight: 4 + 15
    , height: screen.rows - 5
    , width: screen.cols - 5
    , data: {titles: ['a', 'b'], data: [5, 2]}
    , screen: screen})
*/
    //var bar = blessed.box({content: '123', contents: '456'})
    
    
    var bar = contrib.gauge({label: 'Progress', stroke: 'green', fill: 'white', percent: 50})
    
   
    screen.append(bar)
  
     //bar.setPercent(25)
    //bar.setContent('789')
    //bar.setData({titles: ['a', 'b'], data: [4, 2]})
    screen.render()
    
}

module.exports = present
