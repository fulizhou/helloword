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
router.get('/interview_task', function (req, res, next) {
    try {
        res.render('interview_task/interview_task_draft', {article_list_count: config.article_list_count});
    } catch (e) {
        console.log("draft [ERROR]：" + e);
    }
});

// 新建报稿
router.get('/new_interview_task', function (req, res, next) {
    try {
        res.render('interview_task/interview_task', {});
    } catch (e) {
        console.log("interview_task [ERROR]：" + e);
    }
});

// 报稿详情
router.get('/interview_task_detail', function (req, res, next) {
    try {
        res.render('interview_task/interview_task_detail', {});
    } catch (e) {
        console.log("interview_task [ERROR]：" + e);
    }
});


module.exports = router;