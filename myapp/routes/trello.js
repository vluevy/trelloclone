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
	
			conn.query(sql, function(err, result){
				if(err) { console.log("err : " + err); }

				var rows = result ? result : {};
				res.render("trello/list", {dataCount:dataCount});
			});
	
		});

		conn.release();
	});
});

module.exports = router;
