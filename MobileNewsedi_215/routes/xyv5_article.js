var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var common = require('./common');
var config = require('./config');
var url = require("url");

/* 翔宇V5网站稿件列表页面 */
router.get('/', function(req, res, next) {

    try{
        console.log('xyv5_article_list');
        var params = url.parse(req.url, true).query;
        var arr = params.code;
        var code = "";
        var name = "";
        var terminalType = params.terminalType;
        if(arr.indexOf("??")>-1){
            var re = new RegExp("\\?\\?","g");
            arr = arr.replace(re,"&");
            var arrs = arr.split("&");
            code = arrs[0];
            name = arrs[1].replace("name=","");
        }else{
            code = params.code;
            name = params.name;
        }

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
        }
        else{
            if(common.descrypt_login(req, res)){
                res.render('xyv5_article_list', {"terminalType":terminalType,"article_list_count":config.article_list_count, "name":name, "code":code});
            }
            else{
                res.render('login', { app_title: config.app_title,re_login:1});
            }
        }
    }catch (e){
        console.log("错误：/xyv5_article_list：" + e);
    }
});


module.exports = router;
