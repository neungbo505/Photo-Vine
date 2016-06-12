var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '1234'
})
var multer = require('multer');
var md5 = require('md5');
var fs = require('fs');

/* POST. */
router.post('/', function(req, res, next) {
	var image_path = md5(new Date()+'vine');
	var upload = multer({dest:'public/berries/'}).single('file');

	upload(req, res, function(err) {
		if (!err) {
			var text = req.body.name;
			
			pool.getConnection(function(err, conn) {
		  	if (err)
		  		console.error(err);
			  	conn.query('use photo');
			  	var x = Math.random()*1000+100;
			  	var y = Math.random()*1500+100;
			  	var size = 300+Math.random()*50;

			  	conn.query('insert into vine(x, y, isRoot, size, parent, url, text) values(?, ?, ?, ?, 0, ?, ?)', [x, y, true, size, image_path, text], function(err, result, field) {
		  		if (err)
		  			console.error(err);
		  		conn.release();
				fs.rename('public/berries/'+req.file.filename, 'public/berries/'+image_path);
		  		res.redirect('/simple');
		  	});
		  })
		} else {
			console.error(err);
		}
	})
 
});

router.post('/berry', function(req, res, next) {
	
	var image_path = md5(new Date()+'vine');
	var upload = multer({dest:'public/berries/'}).single('file');

	upload(req, res, function(err) {
		var no = req.body.no;

		if (!err) {
			pool.getConnection(function(err, conn) {
		  	if (err)
		  		console.error(err);
			  	conn.query('use photo');
			  	conn.query('select x, y, size from vine where number=?', [no], function(err, result, field){

		  		var rsize = result[0].size;
		  		var rx = result[0].x;
			  	var ry = result[0].y; 	

			  	var size = 100+Math.random()*50;  	
			  	var ransize = 10 + Math.random()*10;
			  	var theta = Math.random()*6.28;

				var R = rsize/2;
				var r = size/2;	

			  	var d = R + r - ransize;  
			  	var x = (rx+R)+d*Math.cos(theta)-r;
			  	var y = (ry+R)+d*Math.sin(theta)-r;
				  	
			  	conn.query('insert into vine(x, y, isRoot, size, parent, url) values(?, ?, ?, ?, ?, ?)', [x, y, false, size, no,image_path], function(err, result, field) {
			  		if (err)
			  			console.error(err);
			  		conn.release();
					fs.rename('public/berries/'+req.file.filename, 'public/berries/'+image_path);
			  		res.redirect('/simple');
			  	});
		  	});
		  	
		  })
		} else {
			console.error(err);
		}
	})
 
});

module.exports = router;
