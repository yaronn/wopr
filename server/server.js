
var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , present = require('./presenter')
  , contrib = require('blessed-contrib')

var port = process.env.PORT || 1337

http.createServer(function (req, res) {
  
  if (req.method == 'POST') {
      var body = '';
      req.on('data', function (data) {
          body += data;

          // Too much POST data, kill the connection!
          if (body.length > 1e6)
              req.connection.destroy();
      });
      req.on('end', function () {
          present(req, res, body, 0, function(err) {
            if (err) return contrib.serverError(req, res, err)
          })
      });
  }
  else {
      if (req.headers["user-agent"].indexOf('curl')!=-1) {
        
        var content = fs.readFileSync(__dirname+'/../test/sample.xml')
        present(req, res, content, 3000, function(err) {
          if (err) return contrib.serverError(req, res, err)
        })
        
        //else return contrib.serverError(req, res, "this url only supports POST")
      }
      else {
        res.writeHead(301, {'Location': 'https://github.com/yaronn/wopr'});
        res.end()
        return
      }
  }
    
    
}).listen(port);

console.log('Server running at http://127.0.0.1:'+port+'/');
