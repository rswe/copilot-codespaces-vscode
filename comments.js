// Create web server
// 1. load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// 2. create web server
var server = http.createServer(function(req, res){
    var parsedUrl = url.parse(req.url, true);
    var pathname = parsedUrl.pathname;
    // 3. process request
    if (pathname == '/'){
        // index.html
        fs.readFile('index.html', 'utf8', function(err, data){
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else if (pathname == '/comments'){
        // get, post
        if (req.method == 'GET'){
            // get
            fs.readFile('comments.json', 'utf8', function(err, data){
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(data);
            });
        } else if (req.method == 'POST'){
            // post
            var body = '';
            req.on('data', function(data){
                body += data;
            });
            req.on('end', function(){
                var post = qs.parse(body);
                fs.readFile('comments.json', 'utf8', function(err, data){
                    var comments = JSON.parse(data);
                    comments.push(post);
                    fs.writeFile('comments.json', JSON.stringify(comments), function(err){
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(comments));
                    });
                });
            });
        }
    } else {
        // 404
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('404 Not Found');
    }
});
// 4. start web server
server.listen(3000, function(){
    console.log('Server is running...');
});


