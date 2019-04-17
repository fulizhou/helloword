/**
 * Created by sunj on 2016/8/4.
 * 第三方登录
 */
var https = require("https");
var url = require('url');
var querystring = require('querystring');
var config = require('./config');
var common = require('./common');
var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next) {
    var params = url.parse(req.url, true).query;
    var get_url = config.service_url + "/newMobile/syn.do?method=loginOnWX&loginname=" + params.user_code;
    console.log("调用登录接口：" + get_url);
    common.get_http_request_json(get_url, function (loginData) {

        if (loginData.success) {
            var password = "";
            var user_key = common.encrypt_login(req, loginData.results.user_id, password);
            console.log("user_key-->" + user_key)

            var modulePerm = {}, module_param = loginData.results.modulePerm;

            // 这部分是为了兼容旧的权限判断
            if (typeof module_param === "string") {
                console.info("Interface use old module param!");
                module_param = $.map(module_param.split("|"), function (v) {
                    return {name: "", value: v};
                });
            }

            module_param.forEach(function (v) {
                modulePerm[v.value] = v;
            });

            loginData.results.modulePerm = JSON.stringify(modulePerm);

            //res.cookie('user_key', user_key, {maxAge:7*24*60*60*1000, httpOnly:true, path:'/', secure:true});
            res.render('home', {
                app_title: config.app_title,
                re_login: 0,
                login_type: "ddLogin",
                user_key: user_key,
                user_name: loginData.results.user_name,
                module_perm: loginData.results.modulePerm,
                loToken: loginData.results.loToken,
                is_error: 0,
                loginToHome: 1,
                error_info: ""
            });
        }
        else {
            //res.render('message_info', { app_title: config.app_title , re_login: 0, login_type: "ddLogin",user_key: "",user_name: loginData.results.user_name,modulePerm: loginData.results.modulePerm,loToken:"",is_error:1,error_info:loginData.results.error_info});
            res.render('login', {app_title: config.app_title, re_login: 4});
        }

    })

})
module.exports = router;