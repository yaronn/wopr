var blessed = require('blessed')
  , contrib = require('blessed-contrib')

function DocumentViewer(document) {
   this.document = document
   this.screen = blessed.screen()
}

DocumentViewer.prototype.renderPage = function(pageId) {
   this.clear()

   var page = this.document.page[pageId]

   var grid = new contrib.grid({rows: 12, cols: 12, screen: this.screen})   

   for (var i in page.item) {
      var item = page.item[i]      
      var className = Object.keys(item)[1]      
      var opts = this.getOptions(item[className][0].$)
      grid.set(item.$.row, item.$.col, item.$.rowSpan, item.$.colSpan, blessed[className], opts)
   }

   this.screen.render()
}

DocumentViewer.prototype.clear = function(node) {
   var i = this.screen.children.length
   while (i--) this.screen.children[i].detach()
}

DocumentViewer.prototype.getOptions = function(node) {
   
   var res = {}

   for (var attr in node) {

      var tokens = attr.split('-')            
      res[tokens[0]] = {}
      var last = res
      for (var i=1; i<tokens.length; i++) {         
         last[tokens[i-1]][tokens[i]] = {}
         last = last[tokens[i-1]]
      }
      last[tokens[tokens.length-1]] = node[attr]           
   }

   return res
}

module.exports = DocumentViewer
