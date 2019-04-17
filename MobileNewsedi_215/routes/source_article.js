var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var common = require('./common');
var config = require('./config');
var url = require("url");

/* 自采稿库列表页面 */
router.get('/', function(req, res, next) {

    try{
        console.log('source_article');
        var params = url.parse(req.url, true).query;

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
        }
        else{
            if(common.descrypt_login(req, res)){
                res.render('source_article_list', {"article_list_count":config.article_list_count,"terminalType":params.terminalType});
            }
            else{
                res.render('login', { app_title: config.app_title,re_login:1});
            }
        }
    }catch (e){
        console.log("错误：/source_article：" + e);
    }
});
router.get('/list', function(req, res, next) {
    try{
        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
        }
        else{
            var params = url.parse(req.url, true).query;
            if(config.is_demo == 1){
                var data = JSON.parse(fs.readFileSync('./service/dept_article_list.json'));
                res.send(data);
            }
            else{
                if(common.descrypt_login(req, res)){
                    var get_url = config.service_url + "/newMobile/syn.do?method=getSourceCatalog";
                    get_url += "&user_id=" + common.get_user_id(req);
                    get_url += "&catalog_id=" + params.catalog_id;
                    get_url += "&begin=" + params.begin;
                    get_url += "&count=" + params.count;
                    console.log("调用获取自采稿稿件接口：" + get_url);
                    common.get_http_request_json(get_url, function(data) {
                        res.send(data);
                    });
                }
                else{
                    res.render('login', { app_title: config.app_title, re_login: 1});
                }
            }
        }
    }catch(e){
        console.log("错误：/source_article/list：" + e);
    }

});

module.exports = router;
