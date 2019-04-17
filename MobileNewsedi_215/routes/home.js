var express = require('express');
var router = express.Router();
var common = require('./common');
var url = require("url");
var http = require('http');
var config = require('./config');
var fs = require('fs');

//首页
router.get('/', function(req, res, next) {

        try{

                if (!common.get_user_id(req)) {
                        res.render('login', {app_title: config.app_title, re_login: 1});
                }
                else {
                        if (common.descrypt_login(req, res)) {
                                var params = url.parse(req.url, true).query;
                                var userId = common.get_user_id(req);
                                var loginToHome = params.loginToHome;
                                res.render('home', {
                                        app_title: config.app_title,
                                        user_name: params.user_name,
                                        userId: userId,
                                        login_type: "login",
                                        is_error:0,
                                        module_perm: "",
                                        loToken:"",
                                        error_info:"",
                                        user_key:"",
                                        loginToHome:loginToHome
                                });
                        }
                        else {
                                res.render('login', {app_title: config.app_title, re_login: 1});
                        }
                }

        }catch(e){
                console.log("错误：/home：" + e);
        }

});

module.exports = router;
