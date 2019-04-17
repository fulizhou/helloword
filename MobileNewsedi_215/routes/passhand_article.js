var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var common = require('./common');
var config = require('./config');
var url = require("url");

/* 经手稿件列表页面 */
router.get('/', function(req, res, next) {

    try{
        console.log('passhand_article_list');
        var params = url.parse(req.url, true).query;

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
        }
        else{
            if(common.descrypt_login(req, res)){
                res.render('passhand_article_list', {"article_list_count":config.article_list_count,"terminalType":params.terminalType});
            }
            else{
                res.render('login', { app_title: config.app_title,re_login:1});
            }
        }
    }catch (e){
        console.log("错误：/passhand_article_list：" + e);
    }
});


module.exports = router;
