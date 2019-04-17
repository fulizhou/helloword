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

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        console.log('notice_article');
        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            res.render('notice_article_list', {"article_list_count":config.article_list_count,"terminalType":params.terminalType})
        }
        else{
            //res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/notice_layouts：" + e);
    }

});

router.get('/list', function(req, res, next) {

    try{
        console.log(req.url);

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        var article_list = JSON.parse(fs.readFileSync('./service/notice_article_list.json'));
        console.log(article_list);
        if(common.descrypt_login(req, res)){

            res.send({"success":article_list.success, "has_more":article_list.has_more,"results": article_list.results});
        }
        else{
            res.send({"success":false,"results": article_list.results});
        }

    }catch(e){
        console.log("错误：/notice_layouts/list：" + e);
    }

});

module.exports = router;
