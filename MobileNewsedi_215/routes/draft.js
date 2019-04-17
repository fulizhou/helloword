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
router.get('/draft', function (req, res, next) {
    try {
        res.render('draft/draft', {article_list_count: config.article_list_count});
    } catch (e) {
        console.log("draft [ERROR]：" + e);
    }
});

// 新建报稿
router.get('/new_draft', function (req, res, next) {
    try {
        res.render('draft/new_draft', {});
    } catch (e) {
        console.log("draft [ERROR]：" + e);
    }
});

// 报稿详情
router.get('/draft_detail', function (req, res, next) {
    try {
        res.render('draft/draft_detail', {});
    } catch (e) {
        console.log("draft [ERROR]：" + e);
    }
});


module.exports = router;