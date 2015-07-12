var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , present = require('./presenter')

var port = process.env.PORT || 1337

http.createServer(function (req, res) {
  
  /*
  //log
  var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  
  fs.appendFileSync("./log.txt", new Date() + " - " + req.url + + " - " + ip + "\r\n")
  */
  
  present(req, res)
  return
  
  if (req.method == 'POST') {
      var body = '';
      req.on('data', function (data) {
          body += data;

          // Too much POST data, kill the connection!
          if (body.length > 1e6)
              req.connection.destroy();
      });
      req.on('end', function () {
          present(req, res, body)
      });
  }
  else {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end("this url only supports POST")
      return
  }
    
    
}).listen(port);

console.log('Server running at http://127.0.0.1:'+port+'/');
