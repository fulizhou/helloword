var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var common = require('./common');
var url = require("url");
var config = require('./config');
/* 部门稿库列表页面 */
router.get('/', function(req, res, next) {

    try{
        console.log('app_article');
        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            res.render('app_article_list', {"article_list_count":config.article_list_count})
        }
        else{
            res.render('login', { app_title: config.app_title, re_login: 1});
        }
    }catch(e){
        console.log("错误：/app_article：" + e);
    }

});

router.get('/list', function(req, res, next) {

    try{
        var params = url.parse(req.url, true).query;
        var article_list = JSON.parse(fs.readFileSync('./service/app_article_list.json'));
        if(common.descrypt_login(req, res)){

            res.send({"success":article_list.success, "has_more":article_list.has_more,"results": article_list.results});
        }
        else{
            res.send({"success":false,"results": article_list.results});
        }
    }catch(e){
        console.log("错误：/app_article/list：" + e);
    }

});

module.exports = router;
