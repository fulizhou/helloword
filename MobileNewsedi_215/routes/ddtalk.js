/**
 * Created by sunj on 2016/4/22.
 */
/**此处用到ECMAScript6新特性**/
var co = require('co');
const OAPI_HOST = 'https://oapi.dingtalk.com';
var https = require("https");
var url = require('url');
var querystring = require('querystring');
var crypto = require('crypto');

var config = require('./config');
var dd_corpid = config.dd_corpid;
var dd_secret = config.dd_secret;
var dd_agentid = config.dd_agentid
var common = require('./common');
var express = require('express');
var router = express.Router();
var accessToken = "";

router.get('/',function(req,res,next){
    var nonceStr = 'abcdefg';
    var timeStamp = new Date().getTime();
    var signedUrl = decodeURIComponent("http://"+req.headers.host+req.originalUrl);
    console.log("signedUrl-->"+signedUrl)
        co(function *(){
            accessToken = (yield invoke('/gettoken', {corpid: dd_corpid, corpsecret:dd_secret }))['access_token'];
            console.log("accessToken-->"+accessToken);
            //module.exports = accessToken;
            var ticket = (yield invoke('/get_jsapi_ticket', {type: 'jsapi', access_token: accessToken}))['ticket'];
            console.log("ticket-->"+ticket);
            var signature = sign({
                nonceStr: nonceStr,
                timeStamp: timeStamp,
                url: signedUrl,
                ticket: ticket
            });
            var config = {
                signature:signature,
                nonceStr:nonceStr,
                timeStamp:timeStamp,
                corpId:dd_corpid,
                agentId:dd_agentid
            };
            console.log("config-->"+JSON.stringify(config));
            res.render('dd_login',{title:"钉钉自动登录",config:JSON.stringify(config)})
        }).catch(function(err){
            console.log("错误：/dd_login:" + err);
        });
})

router.get('/auto_login',function(req,res,next){
    //accessToken = '5cb5f4a6981a36729a889cdc80bdae18';
    var params = url.parse(req.url, true).query;
    var path = '/user/getuserinfo';
    console.log("免登陆code-->"+params.code);
    console.log("access_token-->"+accessToken);
    co(function *(){
        var user_info = (yield invoke(path,{access_token:accessToken,code:params.code}));
        console.log(JSON.stringify("user_info-->"+JSON.stringify(user_info)));
        //var user_info = {userid:"jiangzz"};

        var userInfo = encrypt(user_info.userid);
        var get_url = config.service_url + "/newMobile/syn.do?method=loginOnWX&loginname=" + userInfo ;
        console.log("调用登录接口：" + get_url);
        common.get_http_request_json(get_url, function(loginData) {

            if(loginData.success){
                var password = "";
                var user_key = common.encrypt_login(req, loginData.results.user_id, password);
                console.log("user_key-->"+user_key)

                var modulePerm = {}, module_param = loginData.results.modulePerm;

                // 这部分是为了兼容旧的权限判断
                if(typeof module_param === "string"){
                    console.info("Interface use old module param!");
                    module_param = $.map(module_param.split("|"), function (v) {
                        return {name: "", value: v};
                    });
                }

                module_param.forEach(function (v) { modulePerm[v.value] = v; });

                loginData.results.modulePerm = JSON.stringify(modulePerm);

                //res.cookie('user_key', user_key, {maxAge:7*24*60*60*1000, httpOnly:true, path:'/', secure:true});
                res.render('home', { app_title: config.app_title , re_login: 0, login_type: "ddLogin",user_key: user_key,user_name: loginData.results.user_name,module_perm: loginData.results.modulePerm,loToken:loginData.results.loToken,is_error:0,loginToHome:1,error_info:""});
            }
            else{
                //res.render('message_info', { app_title: config.app_title , re_login: 0, login_type: "ddLogin",user_key: "",user_name: loginData.results.user_name,modulePerm: loginData.results.modulePerm,loToken:"",is_error:1,error_info:loginData.results.error_info});
                res.render('login', { app_title: config.app_title , re_login: 4});
            }

        });
    }).catch (function(err){
        console.log("错误：/dd_login/auto_login:" + err);
        console.log("错误：/dd_login/auto_login:" + JSON.stringify(err));
        //res.render('message_info', { app_title: config.app_title , re_login: 0, login_type: "ddLogin",user_key: "",user_name: "",modulePerm: '',loToken:"",is_error:1,error_info:err});
        res.render('login', { app_title: config.app_title , re_login: 4});
    });

})



function invoke(path, params) {
    return function(cb) {
        https.get(OAPI_HOST + path + '?' + querystring.stringify(params), function(res) {
            if (res.statusCode === 200) {
                var body = '';
                res.on('data', function (data) {
                    body += data;
                }).on('end', function () {
                    var result = JSON.parse(body);
                    if (result && 0 === result.errcode) {
                        cb(null, result);
                    }
                    else {
                        cb(result);
                    }
                });
            }
            else {
                cb(new Error(response.statusCode));
            }
        }).on('error', function(e) {
            cb(e);
        });
    }
}


function sign(params) {
    var origUrl = params.url;
    var origUrlObj =  url.parse(origUrl);
    delete origUrlObj['hash'];
    var newUrl = url.format(origUrlObj);
    var plain = 'jsapi_ticket=' + params.ticket +
        '&noncestr=' + params.nonceStr +
        '&timestamp=' + params.timeStamp +
        '&url=' + newUrl;

    console.log(plain);
    var sha1 = crypto.createHash('sha1');
    sha1.update(plain, 'utf8');
    var signature = sha1.digest('hex');
    console.log('signature: ' + signature);
    return signature;
}

function encrypt(param){
    var key = new Buffer('founder12345founder12345');
    var iv = new Buffer('25687923');
    var alg = 'des-ede3-cbc';
    var autoPad = true;

    var cipher = crypto.createCipheriv(alg, key, iv);
    cipher.setAutoPadding(autoPad);
    var ciph = cipher.update(param, 'utf8', 'hex');
    ciph += cipher.final('hex');
    return ciph;
}


//module.exports = function(){
//    return schedule().then(function(data){
//        console.log("���ؽ��--->"+JSON.stringify(data))
//        return data;
//    });
//}

module.exports = router;