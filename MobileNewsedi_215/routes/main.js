var express = require('express');
var router = express.Router();
var http = require('http');
var url = require('url');
var config = require('./config');
var common = require('./common');
var fs = require('fs');
var crypto = require('crypto');
var service_factory_report = require("./service_factory_report");


router.use('/home', require('./home'));
router.use('/more', require('./more'));
router.use('/catalog', require('./catalog'));
router.use('/upload', require('./article_upload'));
router.use('/article_upload', require('./article_upload'));
router.use('/message', require('./message'));
//router.use('/user_list', require('./user_list'));
router.use('/sendAudit', require('./sendAudit'));
router.use('/dept_article_list', require('./dept_article'));
router.use('/xhs_article_list', require('./xhs_article'));
router.use('/source_article', require('./source_article'));
router.use('/paper_article_list', require('./paper_article'));
router.use('/site_article_list', require('./site_article'));
router.use('/app_article_list', require('./app_article'));
router.use('/weibo_article_list', require('./weibo_article'));

router.use('/article_detail', require('./article_detail'));
/**2016-4-6 sunj add**/
router.use('/article_edit',require('./article_edit'));
/**2016-4-22 sunj add**/
router.use('/dd_login',require('./ddtalk'));
/**2016-8-4 sunj add**/
router.use('/third_login',require('./third_login'));

//router.use('/news_planning', require('./news_planning'));
router.use('/draft', require('./draft'));
router.use('/clue', require('./clue'));
router.use('/interview_task', require('./interview_task'));
router.use('/topic', require('./topic'));

router.use('/newsedit', require("./newsedit"));
router.use('/message_article_list', require("./message_article"));
router.use('/message', require("./message"));
router.use('/notice_article_list', require("./notice_article"));
router.use('/notice', require("./notice"));
router.use('/passhand_article_list', require("./passhand_article"));
router.use('/extpub_article', require("./extpub_article"));
router.use('/xyv5_article', require("./xyv5_article"));
router.use('/mugeda', require("./mugeda"));
/*test页面*/
//router.get('/test',function(req,res,next){
//    res.render("test",{});
//});

/* 登录页面 */
router.get('/', function(req, res, next) {

    res.render('login', { app_title: config.app_title , re_login: 0});
});
router.get('/login', function(req, res, next) {

    res.render('login', { app_title: config.app_title , re_login: 0});
});
/**added by gongyq 
 *从手机app端登陆移动采编 
 **/
router.get('/app_home', function(req, res, next) {
	var params = url.parse(req.url, true).query;
    res.render('app_home', { app_title: config.app_title , re_login: 0 ,type:params.type,user_name:params.user_name,module_perm:params.module_perm,loToken:params.loToken,user_key:params.user_key});
});

router.get('/nearby', function(req, res, next) {

    res.render('nearby', { app_title: config.app_title , re_login: 0});
});
router.get('/newstask', function(req, res, next) {

    res.render('newstask', { app_title: config.app_title , re_login: 0});
});
router.get('/loginThree', function(req, res, next) {

    res.render('login', { app_title: config.app_title , re_login: 2});
});

router.get('/WXAutoLogin', function(req, res, next) {

    var params = url.parse(req.url, true).query;
    var code = params.code;
    res.render('jump',{code: code});

});

router.post('/AutoLogin', function(req, res, next) {

    try{
        /*var params = url.parse(req.url, true).query;
        var code = params.code;
        var loToken = params.loToken;*/

        var code = req.body.code;
        var loToken = req.body.loToken;
        console.log("loToken=" + loToken);
        //code="8645888c5941a5f29ac304b9d29b110f";
        console.log("code="+code);

        var get_userInfo_by_token_url = config.service_url + "/newMobile/syn.do?method=getUserInfoByToken&loToken=" + loToken;
        console.log("调用通过token验证方式登录接口：" + get_userInfo_by_token_url);
        common.get_http_request_json(get_userInfo_by_token_url, function(tokenLoginData) {
            if(tokenLoginData.success){
                var password = "";
                var user_key = common.encrypt_login(req, tokenLoginData.results.user_id, password);

                var modulePerm = {}, module_param = tokenLoginData.results.modulePerm;

                // 这部分是为了兼容旧的权限判断
                if(typeof module_param === "string"){
                    console.info("Interface use old module param!");
                    module_param = $.map(module_param.split("|"), function (v) {
                        return {name: "", value: v};
                    });
                }

                module_param.forEach(function (v) { modulePerm[v.value] = v; });

                tokenLoginData.results.modulePerm = JSON.stringify(modulePerm);

                res.render('home', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: user_key,user_name: tokenLoginData.results.user_name,module_perm: tokenLoginData.results.modulePerm,loToken:tokenLoginData.results.loToken,is_error:0,loginToHome:1,error_info:""});
            }
            else{
                //res.render('message_info', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: "",user_name: tokenLoginData.results.user_name,modulePerm: tokenLoginData.results.modulePerm,loToken:"",is_error:1,error_info:tokenLoginData.results.error_info});
                var secrect = "";
                var corpID = "";
                var access_token = "";
                var get_corpid_url = config.service_url + "/newMobile/syn.do?method=getCorpid";
                console.log("调用获取corpID与secrect接口：" + get_corpid_url);

                common.get_http_request_3des_json(get_corpid_url, function (data) {

                    if(data.success){
                        secrect = data.results.secrect;
                        corpID = data.results.corpID;
                        var get_access_token_url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=" + corpID + "&corpsecret=" + secrect;
                        console.log("调用获取access_token接口：" + get_access_token_url);
                        common.get_http_request(get_access_token_url, function (tokenData) {

                            if(tokenData.errcode == 0){
                                console.log("access_token=" + tokenData.access_token);
                                var get_user_info_url = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=" + tokenData.access_token + "&code=" + code;

                                console.log("调用获取user_info接口：" + get_user_info_url);
                                common.get_http_request(get_user_info_url, function (userData) {

                                    if(!userData.errcode){

                                        if(typeof (userData.UserId) != "undefined"){
                                            console.log("userData=" + userData);
                                            console.log("userData.UserId=" + userData.UserId);
                                            var user_code = encrypt(userData.UserId);
                                            //var user_code = encrypt("tgy");
                                            // 开始验证自动登录，调用自动登录验证接口
                                            var get_url = config.service_url + "/newMobile/syn.do?method=loginOnWX&loginname=" + user_code;
                                            console.log("调用登录接口：" + get_url);
                                            common.get_http_request_json(get_url, function(loginData) {

                                                if(loginData.success){
                                                    var password = "";
                                                    var user_key = common.encrypt_login(req, loginData.results.user_id, password);

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

                                                    res.render('home', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: user_key,user_name: loginData.results.user_name,module_perm: loginData.results.modulePerm,loToken:loginData.results.loToken,is_error:0,loginToHome:1,error_info:""});
                                                }
                                                else{
                                                    res.render('login', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: "",user_name: loginData.results.user_name,modulePerm: loginData.results.modulePerm,loToken:"",is_error:1,error_info:loginData.results.error_info});
                                                }

                                            });
                                        }else{
                                            res.render('message_info', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: "",user_name: "",module_perm: "",loToken:"",is_error:1,error_info:"获取用户信息失败,请重新从微信登录！"});
                                        }

                                    }else{
                                        res.render('message_info', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: "",user_name: "",module_perm: "",loToken:"",is_error:1,error_info: "微信user_info接口调用失败: " + userData.errmsg});
                                    }

                                });
                            }else{
                                res.render('message_info', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: "",user_name: "",module_perm: "",loToken:"",is_error:1,error_info: "微信access_token接口调用失败: " + tokenData.errmsg});
                            }
                        });

                    }else{
                        res.render('message_info', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: "",user_name: "",module_perm: "",loToken:"",is_error:1,error_info: data.results.error_info});
                    }
                });

            }

        });

    }catch (e){
        console.log(e);
    }

});
router.get('/getmessagevalidate',function(req, res, next) {
    try{
        res.send({"message_validate":config.message_validate});
    }catch(e){
        console.log("错误：/login/getmessagevalidate：" + e);
    }

});
router.get('/getuploaddeptpermission',function(req, res, next) {
    //判断cookie中是否存在userid
    try{
        res.send({"upload_choose_dept":config.upload_choose_dept});
    }catch(e){
        console.log("错误：/login/getuploaddeptpermission：" + e);
    }

});
//router.get('/WXAutoLogin', function(req, res, next) {
//
//    var params = url.parse(req.url, true).query;
//    var code = params.code;
//    console.log("code="+code);
//    var secrect = "";
//    var corpID = "";
//    var access_token = "";
//    var get_corpid_url = config.service_url + "/newMobile/syn.do?method=getCorpid";
//    console.log("调用获取corpID与secrect接口：" + get_corpid_url);
//
//    common.get_http_request_3des_json(get_corpid_url, function (data) {
//        secrect = data.results.secrect;
//        corpID = data.results.corpID;
//        var get_access_token_url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=" + corpID + "&corpsecret=" + secrect;
//        console.log("调用获取access_token接口：" + get_access_token_url);
//
//        common.get_http_request(get_access_token_url, function (tokenData) {
//            console.log("access_token=" + tokenData.access_token);
//            var get_user_info_url = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=" + tokenData.access_token + "&code=" + code;
//            console.log("调用获取user_info接口：" + get_user_info_url);
//
//            common.get_http_request(get_user_info_url, function (userData) {
//                console.log("userData=" + userData);
//                console.log("userData.UserId=" + userData.UserId);
//                var user_code = encrypt(userData.UserId);
//                // 开始验证自动登录，调用自动登录验证接口
//                var get_url = config.service_url + "/newMobile/syn.do?method=loginOnWX&loginname=" + user_code;
//                console.log("调用登录接口：" + get_url);
//                common.get_http_request_json(get_url, function(loginData) {
//
//                    if(loginData.success){
//                        var password = "";
//                        var user_key = common.encrypt_login(req, loginData.results.user_id, password);
//                        res.render('home', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: user_key,user_name: loginData.results.user_name,module_perm: loginData.results.modulePerm,loToken:loginData.results.loToken,is_error:0,error_info:""});
//                    }
//                    else{
//                        res.render('message_info', { app_title: config.app_title , re_login: 0, login_type: "WXLogin",user_key: "",user_name: loginData.results.user_name,modulePerm: loginData.results.modulePerm,loToken:"",is_error:1,error_info:"微信登录失败！"});
//                    }
//                });
//
//            });
//        });
//    });
//
//});

/* 登录请求验证*/
router.post("/login", function(req, res, next){

    try{
        //接收前台POST过来的base64
        var data = req.body;
        var userCodeBase64 = data.username;
        var passwordBase64 = data.password;
        //var b = new Buffer(password);
       // var passwordBase64 = b.toString('base64');
       /* var a = new Buffer(user_code);
        var userCodeBase64 = a.toString('base64');*/
        console.log(data);
        if(config.is_demo == 1){
            console.log("demo----");
            var data = JSON.parse(fs.readFileSync('./service/login.json'));
            if(data.success){
                var user_key = common.encrypt_login(req, data.results.user_id, passwordBase64);
                res.send({"success":data.success, "user_key":user_key, "results":data.results});
            }
            else{
                res.send(data);
            }
        }
        else{
            // 开始验证登录，调用登录验证接口  172.19.33.140
            var get_url = config.service_url + "/newMobile/syn.do?method=login&loginname=" + userCodeBase64 + "&password=" + passwordBase64 +"&terminalType=browser";
            console.log("调用登录接口：" + get_url);
            common.get_http_request_json(get_url, function(data) {
               console.log(data);
            //console.log('sunj encrypt:'+encrypt('sunj'));
                if(data.success){

                    var user_key = common.encrypt_login(req, data.results.user_id, passwordBase64);
                    res.send({"success":data.success, "user_key":user_key, "results":data.results, "user_name":data.results.user_name});

                }
                else{
                    res.send(data);
                }

            });
        }
    }catch(e){
        console.log("错误：/main/login：" + e);
    }
});

/**
 * added by gongyq
 * 从手机端登陆，直接带参数usercode跟password过来
 * 这里用以区分表单方式提交
 */
router.get("/login_app", function(req, res, next){

    try{
    	var params = url.parse(req.url, true).query;
    	
        var user_code = params.username.replace(/^\s+|\s+$/g, "");
        var password = params.password.replace(/^\s+|\s+$/g, "");
        var b = new Buffer(password);
        var passwordBase64 = b.toString('base64');
        console.log(data);
        if(config.is_demo == 1){
            console.log("demo----");
            var data = JSON.parse(fs.readFileSync('./service/login.json'));
            if(data.success){
                var user_key = common.encrypt_login(req, data.results.user_id, password);
                res.send({"success":data.success, "user_key":user_key, "results":data.results});
            }
            else{
                res.send(data);
            }
        }
        else{
            // 开始验证登录，调用登录验证接口  172.19.33.140
            var get_url = config.service_url + "/newMobile/syn.do?method=login&loginname=" + user_code + "&password=" + passwordBase64;
            console.log("调用登录接口：" + get_url);
            common.get_http_request_json(get_url, function(data) {

                if(data.success){

                    var user_key = common.encrypt_login(req, data.results.user_id, password);
                    res.send({"success":data.success, "user_key":user_key, "results":data.results, "user_name":data.results.user_name});

                }
                else{
                    res.send(data);
                }

            });
        }
    }catch(e){
        console.log("错误：/main/login：" + e);
    }
});

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

function decrypt(param) {
    var key = new Buffer('founder12345founder12345');
    var iv = new Buffer('25687923');
    var alg = 'des-ede3-cbc';
    var autoPad = true;



    var decipher = crypto.createDecipheriv(alg, key, iv);
    decipher.setAutoPadding(autoPad);
    var txt = decipher.update(param, 'hex', 'utf8');
    txt += decipher.final('utf8');
    console.log(txt);
    return txt;
}

//查看报纸日期存入缓存 configure
router.get('/configure', function(req, res, next) {

    try{
        var params = url.parse(req.url, true).query;
        var user_id = common.get_user_id(req);
        var get_url = config.service_url + "/newMobile/syn.do?method=configure&user_id=" + user_id + "&loToken=" + params.loToken;
        //var get_url = config.service_url + "/newMobile/syn.do?method=configure&user_id=" + user_id + "&loToken=" + params.loToken + "2";
        console.log("获取报纸查看日期接口：" + get_url);
        if(common.descrypt_login(req, res)){

            common.get_http_request_json(get_url, function (data) {
                res.send(data);
            });
        }
        else{
            res.render('login', { app_title: config.app_title, re_login: 1});
        }
    }catch(e){
        console.log("错误：/main/configure：" + e);
    }

});

//获取图片信息
router.get('/newMobile/getImage.do', function(req, res, next) {

    var get_url = config.service_url + req.url;
    console.log(get_url);
    if(config.is_demo == 1){
        var img_data = fs.readFileSync('./public/images/default.png');
        res.writeHead(200, {"Content-Type":"image"});
        res.write(img_data, "binary");
        res.end();
        return;
    }
    else{

        var get_url = config.service_url + req.url;

        console.log("获取自采稿图片文件接口：" + get_url);
        common.get_http_request_binary(get_url, function(data) {
            if(data.success){

                res.writeHead(200, {"Content-Type":"image"});
                res.write(data.body, "binary");
                res.end();
            }
            else{
                var img_data = fs.readFileSync('./public/images/default.png');
                res.writeHead(200, {"Content-Type": data.contentType});
                res.write(img_data, "binary");
                res.end();
            }
        });
    }
});

//获取多媒体信息
router.get('/newMobile/getMedia.do', function(req, res, next) {

    var get_url = config.service_url + req.url;
    console.log(get_url);
    if(config.is_demo == 1){
        var img_data = fs.readFileSync('./public/images/default.png');
        res.writeHead(200, {"Content-Type":"image"});
        res.write(img_data, "binary");
        res.end();
        return;
    }
    else{

        var get_url = config.service_url + req.url;
        console.log("获取自采稿多媒体文件接口：" + get_url);
        common.get_http_request_binary(get_url, function(data) {
            if(data.success){

                res.writeHead(200, {"Content-Type":"image"});
                res.write(data.body, "binary");
                res.end();
            }
            else{
                var img_data = fs.readFileSync('./public/images/default.png');
                res.writeHead(200, {"Content-Type": data.contentType});
                res.write(img_data, "binary");
                res.end();
            }
        });
    }
});
//获取图片信息
router.get('/get_image', function(req, res, next) {
    var img_data = fs.readFileSync('./public/images/' + req.query.image_name);
    res.writeHead(200, {"Content-Type":"image"});
    res.write(img_data, "binary");
    res.end();
});

/* 调用全媒体生产接口，封装成统一的接口 */
router.get('/get', function(req, res, next) {

    try{
        console.log("main_get");

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        if(params.q.indexOf('lib_type=paper_bak', 0) >= 0){
            var data = JSON.parse(fs.readFileSync('./service/article_detail.json'));
            console.log(data);
            res.send(data);
        }else if(params.q.indexOf('lib_type=weibo', 0) >= 0){
            var data = JSON.parse(fs.readFileSync('./service/article_detail.json'));
            console.log(data);
            res.send(data);
        }else if(params.q.indexOf('lib_type=dept', 0) >= 0){
            var data = JSON.parse(fs.readFileSync('./service/article_detail.json'));
            console.log(data);
            res.send(data);
        }else if(params.q.indexOf('lib_type=xhs', 0) >= 0){
            var data = JSON.parse(fs.readFileSync('./service/article_detail.json'));
            console.log(data);
            res.send(data);
        }else{
            if(config.is_demo == 1){

                if(params.q.indexOf('method=sourceCatalog', 0) >= 0){
                    var data = JSON.parse(fs.readFileSync('./service/source_catalogs.json'));
                    console.log(data);
                    res.send(data);
                }
                else if(params.q.indexOf('method=articleDetail', 0) >= 0){
                    var data = JSON.parse(fs.readFileSync('./service/article_detail_bak.json'));
                    console.log(data);
                    res.send(data);
                }
                else if(params.q.indexOf('method=getSourceCatalog', 0) >= 0){
                    var data = JSON.parse(fs.readFileSync('./service/dept_article_list.json'));
                    console.log(data);
                    res.send(data);
                }
            }
            else{
                try{

                    if(common.descrypt_login(req, res)){

                        if(params.m == ""){
                            //params.m = "newMobile/syn.do?";
                            params.m = "newMobile/syn.do";
                        }
                        var user_id = "&user_id=" + common.get_user_id(req);
                        var get_url = config.service_url + '/' + params.m + '?' + params.q + user_id;
                        console.log("调用主函数接口:" + get_url);
                        common.get_http_request_json(get_url, function(data) {

                            res.send(data);
                        });
                    }else{
                        res.render('login', { app_title: config.app_title,re_login:1});
                    }

                }catch (e){

                }
            }
        }

    }catch(e){
        console.log("错误：/main/get：" + e);
    }

});

/****获取视频****/
//router.get('/getMedia.*',function(req,res,next){
//    //var params = req.url.split('?')[1];
//    //var get_url = config.service_url +'/newMobile/getMedia.do?'+ params;
//    //console.log("请求URL:"+get_url);
//    //res.writeHead(206,{'Content-Type':'video/mpeg4','Cache-Control':'max-age=2592000'})
//    //common.get_http_request_normal(get_url,function(data){
//    //    if(data.success){
//    //        console.log(JSON.stringify(data));
//    //        res.end();
//    //    }else{
//    //        res.write(data)
//    //    }
//    //
//    //})
//    var rs = fs.createReadStream('./public/files/2016-03-18/test.mp4');
//    var buffers = []
//    rs.on('data',function(chunk){
//       buffers.push(chunk);
//    }).on('end',function(){
//        //res.writeHead(200,{'Content-Type':'video/mpeg4'})
//        var buffer = Buffer.concat(buffers);
//        res.end(buffer);
//    });
//
//});
router.get('/zoomImg',function(req,res,next){
    try {
        console.log("main_get");

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        res.render('paper_article_layout_zoomImg.html',{img:params.img+'&docID='+params.docID+'&docLibID='+params.docLibID});

    }catch (e){

    }
});

router.all("/fatch", function (req, res) {
    var userId = common.get_user_id(req);
    if(!userId){
        res.json({success: false, results: {error_info: "用户还没有登录,请先登录"}});
        return;
    }

    var params = req.method === "GET" ? url.parse(req.url, true).query : req.body;
    params.user_id = userId;
    params.loginID = userId;

    var service = service_factory_report.find(params.method);

    if(!service){
        res.json({success: false, results: {error_info: "找不到该接口: " + params.method}});
        return;
    }

    console.info("接口 url: " + service.url);
    console.info("接口 param: " + JSON.stringify(params));

    var promise = service.send(params);
    promise.then(function(data){
        console.info("接口返回数据:");
        console.info(data);
        res.json(data);
    }).catch(function (e) {
        console.info("调用接口出错:");
        console.info(e);
        if(e instanceof Error){
            res.json({success: false, results: {error_info: "接口调用失败"}});
            return;
        }
        res.json(e);
    })

});

module.exports = router;
