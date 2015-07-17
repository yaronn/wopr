

var parse = require('xml2js').parseString
  , url = require('url')
  , Viewer = require('../lib/document-viewer.js')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')


function present(req, res, body, delay, cba) {
  
  blessed.Screen.global = null
  blessed.Program.global = null

  var u = url.parse(req.url, true)
  var page = 0
  if (u.pathname && u.pathname.length>1) page=parseInt(u.pathname.substr(1))
  
  if (!body | body=="") {
       return cba("You must upload the document to present as the POST body")
  }
  
    
  parse(body, function (err, doc) {
    try {
      
      if (err) {
         return cba("Document xml is not valid: " + err)
      }
    
      if (!doc || !doc.document) return cba("document not valid or has no pages")
      if (!doc.document.page || doc.document.page.length==0) return cba("document must have at least one page")
      
      if (page>=doc.document.page.length) {
         return cba('\r\n\r\nPresentation has ended (total '+doc.document.page.length+' pages). Press CTRL+C to exit.\r\n\r\n')
      }
      
      req.connection.on('close',function(){
        screen = null
      });
      
      var screen = contrib.createScreen(req, res)
      if (screen==null) return
      
      viewer = new Viewer(doc.document, screen)
      var err = viewer.renderPage(page)
      if (err!==null) return cba(err)
      
      //note the setTimeout is necessary even if delay is 0
      setTimeout(function() {
        //res.write('\r\n\r\n\r\n\r\nPress Return to continue\r\n\r\n')
        //restore cursor
        res.end('\033[?25h')
        return cba()
      }, delay)
      
    }
    
    catch (e) {
      return cba(e)
    }
    
    
  })
}

module.exports = present

