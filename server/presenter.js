var parse = require('xml2js').parseString
  , url = require('url')
  , Viewer = require('../lib/document-viewer.js')
  , blessed = require('blessed')
  , contrib = require('blessed-contrib')


function present(req, res, body, cba) {
  
  blessed.Screen.global = null
  blessed.Program.global = null

  var u = url.parse(req.url, true)
  
  var page = 0
  if (u.pathname && u.pathname.length>1) page=parseInt(u.pathname.substr(1)) || 0
  var auto = u.query["auto"]==='' || u.query["auto/"]==='' //second can happen in zsh when quoting the string
  var msg = auto?'next slide will appear within a few seconds':undefined
  
  if (!body || body=="") {
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
      var err = viewer.renderPage(page, msg)
      if (err!==null) {
        clean(screen)
        return cba(err)
      }
      
      //note the setTimeout is necessary even if delay is 0
      setTimeout(function() {
        //restore cursor
        res.end('\033[?25h')
        clean(screen)
        return cba()
      }, auto?5000:0)
      
    }
    
    catch (e) {
      return cba(e)
    }
    
    
  })
}

function clean(screen) {
  screen.program.destroy()
  screen.destroy()
}

module.exports = present

