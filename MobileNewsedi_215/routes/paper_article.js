var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var common = require('./common');
var url = require("url");
var config = require('./config');

router.get('/', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        console.log('paper_article');
        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            res.render('paper_main_tree', {"article_list_count":config.article_list_count,"terminalType":params.terminalType});
        }
        else{
            res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/paper_article：" + e);
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
        var article_list = JSON.parse(fs.readFileSync('./service/paper_article_list.json'));
        console.log(article_list);
        if(common.descrypt_login(req, res)){

            res.send({"success":article_list.success, "has_more":article_list.has_more,"results": article_list.results});
        }
        else{
            res.send({"success":false,"results": article_list.results});
        }

    }catch(e){
        console.log("错误：/paper_article/list：" + e);
    }

});


router.get('/layout', function(req, res, next) {

    try{
        console.log(req.url);

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

/////////////////////////////////////////////////////////////////////
        if(config.is_demo == 1){
            var article_list = JSON.parse(fs.readFileSync('./service/paper_layout_list.json'));
            console.log(article_list);
            if(common.descrypt_login(req, res)){

                res.send({"success":article_list.success, "has_more":article_list.has_more,"results": article_list.results});
            }
            else{
                res.send({"success":false,"results": article_list.results});
            }
        }else{
            var get_url = config.service_url + "/newMobile/syn.do?";
            get_url += "method=getPaperLayout";
            get_url += "&user_id=" + common.get_user_id(req);
            get_url += "&paper_id=" + params.paper_id;
            get_url += "&column_date=" + params.column_date;
            get_url += "&begin=" + params.begin;
            get_url += "&count=" + params.count;
            get_url += "&loToken=" + params.loToken;
            console.log("调用获取纸媒稿件列表接口：" + get_url);
            common.get_http_request_json(get_url, function(data) {
                res.send(data);
            });
        }

    }catch(e){
        console.log("错误：/paper_article/layout：" + e);
    }

});

router.get('/paperList', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        console.log('paperList');
        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            res.render('paper_layout_list', {"article_list_count":config.article_list_count, "paper_paper_id":params.paper_paper_id, "catalog_name":params.catalog_name, "paperMinDate":params.paperMinDate});
        }
        else{
            res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/paper_article/paperList：" + e);
    }
});

router.get('/columnList', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        console.log('columnList');
        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            res.render('paper_column_list', {"article_list_count":config.article_list_count, "column_paper_id":params.column_paper_id, "catalog_id":params.catalog_id,"catalog_name":params.catalog_name,"paper_name":params.paper_name,"paperMinDate":params.paperMinDate});
        }
        else{
            res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/paper_article/columnList：" + e);
    }

});

router.get('/childTree', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        console.log('childTree');
        var params = url.parse(req.url, true).query;
        console.log(params.paper_name);
        if(common.descrypt_login(req, res)){
            res.render('paper_child_tree', {"article_list_count":config.article_list_count, "column_paper_id":params.column_paper_id, "paper_name":params.paper_name, "column_id":params.column_id});
        }
        else{
            res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/paper_article/childTree：" + e);
    }

});

module.exports = router;
