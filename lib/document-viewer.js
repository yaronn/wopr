var blessed = require('blessed')
  , contrib = require('blessed-contrib')

function DocumentViewer(document) {
   this.document = document
   this.screen = blessed.screen()
   console.log(JSON.stringify(document, null, 2))
}

DocumentViewer.prototype.renderPage = function(pageId) {
   this.clear()

   var page = this.document.page[pageId]

   var grid = new contrib.grid({rows: 12, cols: 12, screen: this.screen})

   for (var i in page.item) {
      var item = page.item[i]
      var className = Object.keys(item)[1]
      var ctor = contrib[className] || blessed[className]
      var opts = this.readOptions(item[className][0], ctor)
      console.log(JSON.stringify(opts, null, 2))
      grid.set(item.$.row, item.$.col, item.$.rowSpan, item.$.colSpan, ctor, opts)
   }

   this.screen.render()
}

DocumentViewer.prototype.clear = function(node) {
   var i = this.screen.children.length
   while (i--) this.screen.children[i].detach()
}

DocumentViewer.prototype.readOptions = function(node, ctor) {
   
   
   var optionsMethod = ctor.prototype["getOptionsPrototype"]
   var optionsMainProto = optionsMethod==null ? null : optionsMethod()
   
   return this.readOptionsInner(node, optionsMainProto)
}

DocumentViewer.prototype.readOptionsInner = function(node, optionsMainProto) {
   var res = {}
  
   var items = []
   for (var attr in node.$) {
     items.push({name: attr, value: node.$[attr]})
   }
   
   for (var n in node) {
     if (n!='$') items.push( { name: n, value: node[n] } )
   }
   
   for (var i=0; i<items.length; i++) {
      
      var item = items[i]
      
      var proto = optionsMainProto
      var tokens = item.name.split('-')
      
      res[tokens[0]] = res[tokens[0]] || {}
      if (proto!=null) proto=proto[tokens[0]]
      var last = res
      for (var j=1; j<tokens.length; j++) {
         last[tokens[j-1]][tokens[j]] = last[tokens[j-1]][tokens[j]] || {}
         last = last[tokens[j-1]]
         if (proto!=null) proto=proto[tokens[j]]
      }
      
      var val = this.convert(item.value, proto)
      last[tokens[tokens.length-1]] = val
   }
  

   return res
}

DocumentViewer.prototype.convert = function(val, type) {

  var self = this
  
  if (type==null) return val
  
  if (Array.isArray(type)) {
    
    if (Array.isArray(type[0])) {
      var lines = val[0].split("\n")
      var res = []
      for (var i=0; i<lines.length; i++) {
        var s = lines[i].trim()
        if (s.length>0) res.push(self.convertArray(s, type[0][0]))
      }
      return res
    }
    else if (typeof(type[0]=="object")) {
      var res = []
      for (var i=0; i<val[0].m.length; i++) {
        res.push(this.readOptionsInner(val[0].m[i], type[0]))
      }
      return res
    }
    
    return this.convertArray(val, type)
  }
  
  if (typeof(type)=="number") return parseFloat(val)
  
  return val
}

DocumentViewer.prototype.convertArray = function(str, type) {
    var res = str.split(",")
    if (typeof(type[0])=="number") {
      res = res.map(function (x) {
        return parseFloat(x);
      });
    }
    
    return res
}

module.exports = DocumentViewer

