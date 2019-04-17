/**
 * Created by sunj on 2016/4/6.
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var common = require('./common');
var config = require('./config');
var url = require("url");
var server_config = JSON.parse(fs.readFileSync('./server_config.json'));

var auth = function (req, res) {
    //判断cookie中是否存在userid
    if (!common.get_user_id(req)) {
        res.render('login', {app_title: config.app_title, re_login: 1});
        return;
    }

};


router.get('/', function (req, res, next) {
    console.log("修改稿件：" + req.url);
    auth(req, res);
    var params = url.parse(req.url, true).query;

    res.render('article_edit', {
        article_id: params.article_id,
        article_libid: params.article_libid,
        position: params.position,
        lib_type: params.lib_type,
        operation: params.operation
    });

});

router.post('/save', function (req, res, next) {
    try {
        console.log("修改稿件：" + req.url);
        auth(req, res);
        var params = req.body;
        var save_url = server_config.service_url + '/newMobile/syn.do?method=update';
        var userId = common.get_user_id(req);
        params.user_id = userId
        //var data = {};
        common.post_http_request(save_url, params, function (res_data) {
            res.send(res_data);
        })
    } catch (e) {
        console.log("修改稿件出错：" + e);
        res.send({success: 'false', msg: '服务器出错'})
    }

});

router.get('/edit_info', function (req, res, next) {
    try {
        console.log('article_detail/edit_info');
        console.log(req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_edit_info', {
                article_id: params.article_id,
                article_libid: params.article_libid,
                position: params.position,
                lib_type: params.lib_type
            })
        }
        else {
            res.render('login', {app_title: server_config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/edit_info：" + e);
    }

});


router.post('/save_edit_info', function (req, res, next) {
    try {
        console.log("修改稿件：" + req.url);

        //判断cookie中是否存在userid
        var userId = common.get_user_id(req);
        if (!userId) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = req.body;
        params.user_id = userId;
        var save_url = server_config.service_url + '/newMobile/syn.do?method=updateTopic';

        common.post_http_request(save_url, params, function (res_data) {
            res.send(res_data);
        })
    } catch (e) {
        console.log("修改稿件出错：" + e);
        res.send({success: 'false', msg: '服务器出错'});
    }

});

module.exports = router;