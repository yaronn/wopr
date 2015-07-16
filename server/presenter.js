

var parse = require('xml2js').parseString
  , url = require('url')
  , Viewer = require('../lib/document-viewer.js')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')


function present(req, res, body) {
  
  blessed.Screen.global = null
  blessed.Program.global = null

  var query = url.parse(req.url, true).query
  var page = query.p || 0
  
  
  if (!body | body=="") {
       return contrib.serverError("You must upload the document to present as the POST body")
  }
  
    
  parse(body, function (err, doc) {

    //console.log(doc)
    
    if (err) {
       console.log(err)
       return contrib.serverError(req, res, err)
    }
    
    if (page>=doc.document.page.length) {
       return contrib.serverError(req, res, '\r\n\r\nPresentation has ended ('+doc.document.page.length+' pages). Press CTRL+C to exit.\r\n\r\n')
    }
    
    req.connection.on('close',function(){
      console.log("cleanup")
      screen = null
    });
    
  
    var screen = contrib.createScreen(req, res)
    if (screen==null) return
    
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



/*

var blessed = require('blessed')
  , contrib = require('blessed-contrib')

function present(req, res, body) {

  blessed.Screen.global = null
  blessed.Program.global = null


    //require('./bar').handle(req, res)
    //return
    
    var screen = contrib.createScreen(req, res)
    
    
    var gauge = contrib.gauge({label: 'Progress', stroke: 'green', fill: 'white', percent: 50})
    
   
    screen.append(gauge)
  
    gauge.setPercent(25)
    
    screen.render()

setTimeout(function() {
      res.write('\r\n\r\n')
      //restore cursor
      res.end('\033[?25h')
    }, 0)

}

*/

module.exports = present
