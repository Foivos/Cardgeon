var fs = require("fs");
var http = require("http");
var path = require('path');

var mime = {
html: 'text/html',
txt: 'text/plain',
css: 'text/css',
gif: 'image/gif',
jpg: 'image/jpeg',
png: 'image/png',
svg: 'image/svg+xml',
js: 'application/javascript',
json: 'text/plain',
};

var folders = {
html: 'src/html',
txt: 'res/plain',
css: 'src/css',
png: 'res',
js: 'src/js',
json: 'res',
};


http.createServer(function (req, res) {
	var reqpath = req.url.toString().split('?')[0];
	if (req.method !== 'GET') {
	res.statusCode = 501;
	res.setHeader('Content-Type', 'text/plain');
	return res.end('Method not implemented');
	}
	reqpath = reqpath.replace(/\/$/, '/index.html');
	console.log("Received request for " + reqpath);
	/*type = path.extname(reqpath).slice(1);
	if(!folders[type]) {
		return;
	}
	var Folders = folders[type];
	if(!Array.isArray(Folders)) Folders = [Folders];
	for(var i=0; i<Folders.length; i++) {
		var dir = path.join(__dirname, '');
		var file = path.join(dir, reqpath);
		if (file.indexOf(dir + path.sep) !== 0) {
			res.statusCode = 403;
			res.setHeader('Content-Type', 'text/plain');
			return res.end('Forbidden');
		}
		var type = mime[type] || 'text/plain';
		var s = fs.createReadStream(file);
		s.on('open', function () {
			res.setHeader('Content-Type', type);
			s.pipe(res);
		});
		s.on('error', function () {
			res.setHeader('Content-Type', 'text/plain');
			res.statusCode = 404;
			res.end('Not found');
		});
	}*/

	var file = path.join(__dirname, reqpath);
	if (file.indexOf(__dirname + path.sep) !== 0) {
		res.statusCode = 403;
		res.setHeader('Content-Type', 'text/plain');
		return res.end('Forbidden');
	}
	var type = mime[type] || 'text/plain';
	var s = fs.createReadStream(file);
	s.on('open', function () {
		res.setHeader('Content-Type', type);
		s.pipe(res);
	});
	s.on('error', function () {
		res.setHeader('Content-Type', 'text/plain');
		res.statusCode = 404;
		res.end('Not found');
	});

}).listen(3001);


