var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var util = require("util");
var server_config = JSON.parse(fs.readFileSync('./server_config.json'));
var common = require('./common');
var config = require('./config');
var url = require("url");

router.get('/', function (req, res, next) {
    try {
            res.render('user_list');
    } catch (e) {
        console.log("错误：/message：" + e);
    }

});
module.exports = router;
