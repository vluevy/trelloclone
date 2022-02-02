var express = require('express');
var router = express.Router();
var reqIp = require("request-ip");

var maria = require("mysql");
var pool = maria.createPool({
	connectionLimit:20,
	host:'127.0.0.1',
	user:"root",
	port:3307,
	password:"java$!",
	database:"trelloclone"
});

router.get('/', function(req, res, next) {
	res.redirect("/trello/list");
});

router.get('/list', function(req, res, next) {
    
    var sql;

    sql = "SELECT IFNULL(COUNT(*), 0) AS cnt FROM list";

	pool.getConnection(function(err, conn){
		conn.query(sql, function(err, result){
			if(err) { console.log("err : " + err); }
			
			dataCount = result[0].cnt;

			sql = "select listnum, listname from list";

			conn.query(sql, function(err, result){
				if(err) { console.log("err : " + err); }

				var lists = result ? result : {};
				sql = "select num, listnum, cardname from card";

				conn.query(sql,function(err,result){
					if(err) { console.log("err : " + err); }
					var cards = result?result:{};
					res.render("trello/list", {lists:lists,cards:cards,dataCount:dataCount});
				});

			});
			
		});

		conn.release();
	});
});


router.post('/addlist', function(req,res,next){
	var data = [req.body.listname];

	pool.getConnection(function(err,conn){
		var sql;
		sql = "INSERT INTO list(listname) VALUES(?)";
		conn.query(sql,data,function(err,result){
			if(err){console.log("err : "+err);}
			res.redirect("/trello/list");
		});
		conn.release();
	});
});

router.post('/addcard', function(req,res,next){
	var data = [req.body.listnum, req.body.cardname];

	pool.getConnection(function(err,conn){
		var sql;
		sql = "INSERT INTO card(listnum, cardname) VALUES(?,?)";
		conn.query(sql,data,function(err,result){
			if(err){console.log("err : "+err);}
			res.redirect("/trello/list");
		});
		conn.release();
	});
});

module.exports = router;
