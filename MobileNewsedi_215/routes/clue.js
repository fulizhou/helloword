/**
 * Created by shangfanfan on 2016/3/17
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var url = require("url");
var common = require('./common');
var config = require('./config');
var service_factory_report = require("./service_factory_report");
router.get('/*', function (req, res, next) {
    try {
        //判断cookie中是否存在userid
        if(common.get_user_id(req)){
            next();
        } else {
            res.render('login', { app_title: config.app_title , re_login: 1});
        }
    } catch (e) {
        console.log("draft [ERROR]：" + e);
    }
});


// 报稿
router.get('/clue', function (req, res, next) {
    try {
        res.render('clue/clue_draft', {article_list_count: config.article_list_count});
    } catch (e) {
        console.log("draft [ERROR]：" + e);
    }
});

// 新建报稿
router.get('/new_clue', function (req, res, next) {

    try {
        res.render('clue/new_clue', {});
    } catch (e) {
        console.log("clue [ERROR]：" + e);
    }
});

/*获取通讯录*/
router.get('/getUserMailList', function (req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

        if(config.is_demo == 1){
            var catalog_info = JSON.parse(fs.readFileSync('./service/getUserMailList.json'));
            console.log(catalog_info);
        }
        else{
            if(common.descrypt_login(req, res)){

                var get_url = config.service_url + "/newMobile/syn.do?method=getUserMailList&loToken=" + params.loToken;
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

// 报稿详情
router.get('/clue_detail', function (req, res, next) {
    try {
        res.render('clue/clue_detail', {});
    } catch (e) {
        console.log("clue [ERROR]：" + e);
    }
});


module.exports = router;