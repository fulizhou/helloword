var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var common = require('./common');
var config = require('./config');
var url = require("url");

/* 获取部门稿库分类接口 */
router.get('/dept_catalogs', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        var catalog_info = JSON.parse(fs.readFileSync('./service/dept_catalogs.json'));
        if(common.descrypt_login(req, res)){

            res.send({"success":catalog_info.success,"results": catalog_info.results});
        }
        else{
            res.send({"success":false,"results": catalog_info.results});
        }

    }catch(e){
        console.log("错误：/dept_catalogs：" + e);
    }

});

/* 获取自采稿库分类接口 */
router.get('/source_catalogs', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

        if(config.is_demo == 1){
            var catalog_info = JSON.parse(fs.readFileSync('./service/source_catalogs.json'));
            console.log(catalog_info);
            if(common.descrypt_login(req, res)){

                res.send({"success":catalog_info.success,"results": catalog_info.results});
            }
            else{
                res.send({"success":false,"results": catalog_info.results});
            }
        }
        else{
            if(common.descrypt_login(req, res)){

                var get_url = config.service_url + "/newMobile/syn.do?method=sourceCatalog&perm=" + params.perm + "&user_id=" + common.get_user_id(req) + "&loToken=" + params.loToken;
                console.log("调用获取自采稿分类接口：" + get_url);
                common.get_http_request_json(get_url, function(data) {
                    res.send(data);
                });
            }
            else{
                res.render('login', { app_title: config.app_title, re_login: 1});
            }

        }

    }catch(e){
        console.log("错误：/source_catalogs：" + e);
    }

});
/* 获取APP稿库分类接口 */
router.get('/app_catalogs', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        console.log(req.url);
        var params = url.parse(req.url, true).query;
        var catalog_info = JSON.parse(fs.readFileSync('./service/app_catalogs.json'));
        console.log(catalog_info);
        if(common.descrypt_login(req, res)){

            res.send({"success":catalog_info.success,"results": catalog_info.results});
        }
        else{
            res.send({"success":false,"results": catalog_info.results});
        }

    }catch(e){
        console.log("错误：/app_catalogs：" + e);
    }

});

/* 获取微博微信稿库分类接口 */
router.get('/weibo_catalogs', function(req, res, next) {

    try{
        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        console.log(req.url);
        var params = url.parse(req.url, true).query;
        var catalog_info = JSON.parse(fs.readFileSync('./service/weibo_catalogs.json'));
        console.log(catalog_info);
        if(common.descrypt_login(req, res)){

            res.send({"success":catalog_info.success,"results": catalog_info.results});
        }
        else{
            res.send({"success":false,"results": catalog_info.results});
        }

    }catch(e){
        console.log("错误：/weibo_catalogs：" + e);
    }

});
/* 获取网站稿库分类接口 */
router.get('/site_catalogs', function(req, res, next) {

    try{
        console.log(req.url);

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        var catalog_info = JSON.parse(fs.readFileSync('./service/site_catalogs.json'));
        console.log(catalog_info);
        if(common.descrypt_login(req, res)){

            res.send({"success":catalog_info.success,"results": catalog_info.results});
        }
        else{
            res.send({"success":false,"results": catalog_info.results});
        }

    }catch(e){
        console.log("错误：/site_catalogs：" + e);
    }

});

/* 获取发布通道接口 */
router.get('/publish_catalogs', function(req, res, next) {

    try{
        console.log(req.url);

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        var catalog_info = JSON.parse(fs.readFileSync('./service/publish_catalogs.json'));
        console.log(catalog_info);
        if(common.descrypt_login(req, res)){

            res.send({"success":catalog_info.success,"results": catalog_info.results});
        }
        else{
            res.send({"success":false,"results": catalog_info.results});
        }

    }catch(e){
        console.log("错误：/publish_catalogs：" + e);
    }

});

//获取纸媒签发栏目列表信息
router.get('/paper_columns', function(req, res, next) {

    try{
        console.log(req.url);

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        var catalog_info = JSON.parse(fs.readFileSync('./service/sign_columnlist.json'));
        console.log(catalog_info);
        if(common.descrypt_login(req, res)){

            res.send({"success":catalog_info.success,"results": catalog_info.results});
        }
        else{
            res.send({"success":false,"results": catalog_info.results});
        }

    }catch(e){
        console.log("错误：/paper_columns：" + e);
    }

});

//获取签发栏目下的版面列表
router.get('/sign_layouts', function(req, res, next) {

    try{
        console.log(req.url);

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        var catalog_info = JSON.parse(fs.readFileSync('./service/sign_layoutlist.json'));
        console.log(catalog_info);
        if(common.descrypt_login(req, res)){

            res.send({"success":catalog_info.success,"results": catalog_info.results});
        }
        else{
            res.send({"success":false,"results": catalog_info.results});
        }

    }catch(e){
        console.log("错误：/sign_layouts：" + e);
    }

});
module.exports = router;
