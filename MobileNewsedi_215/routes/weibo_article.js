var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var common = require('./common');
var url = require("url");
var config = require('./config');

Date.prototype.Format = function(fmt)
{
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

/* 部门稿库列表页面 */
router.get('/', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        console.log('weibo_article');
        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            //res.render('weibo_article_list', {"article_list_count":config.article_list_count});
            res.render('weibo_number_catalog', {"article_list_count":config.article_list_count,"terminalType":params.terminalType});
        }
        else{
            res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/weibo_article：" + e);
    }

});

router.get('/list', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        console.log('weibo_article');
        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            //res.render('weibo_article_list', {"article_list_count":config.article_list_count});
            res.render('weibo_article_list', {"article_list_count":config.article_list_count});
        }
        else{
            res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/weibo_article：" + e);
    }

});

router.get('/unSignWeibo', function(req, res, next) {

    try{
        console.log("删除微博操作：" + req.url);

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){

            var get_url = config.service_url + "/newMobile/syn.do?";
            get_url += "method=unSignWeibo";
            get_url += "&user_id=" + common.get_user_id(req);
            get_url += "&doc_id=" + params.doc_id;
            get_url += "&loToken=" + params.loToken;
            console.log("调用删除微博操作接口：" + get_url);
            common.get_http_request_json(get_url, function(data) {

                res.send(data);
            });
        }
        else{
            res.render('login', { app_title: config.app_title, re_login: 1});
        }

    }catch(e){
        console.log("错误：/article_detail/unsign_opt：" + e);
    }

});

router.get('/publish', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        console.log('weibo_article');
        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            //res.render('weibo_article_list', {"article_list_count":config.article_list_count});
            res.render('weibo_publish', {"article_list_count":config.article_list_count,"group_id":params.group_id,"doc_id":params.doc_id});
        }
        else{
            res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/weibo_article：" + e);
    }

});

/* 登录页面 */
router.get('/isExist', function(req, res, next) {

    try{
        console.log("upload_isExist_get");

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

        console.log(params.md5_param+"pppppppppppppppppppppppppppppppp"+params.format_param);

        var myDate = new Date();
        //var nowDate = myDate.toLocaleDateString().replace(/\-/g,"");
        var nowDate = myDate.Format("yyyy-MM-dd").toString();
        var md5FileName = params.md5_param + ".md5";
        var nowFile = "public/files/" + nowDate;
        //var nowFile = "public/files/20150807";

        if(!fs.existsSync(nowFile)){
            fs.mkdir(nowFile);
        }

        if(!fs.existsSync(nowFile+"/"+md5FileName)){
            var json = {"fileName":params.fileName, "isHas":false};
            res.send(json);
        }else{
            var json = {"fileName":params.fileName, "oldFileName":params.oldFileName,"isHas":true,"nowFile":config.server_img_url+nowFile.substring(6)};
            res.send(json);
        }

    }catch(e){
        console.log("错误：/article_upload/isExist：" + e);
    }

});

///* 登录请求验证*/
//router.post('/', function(req, res, next){
//
//    try{
//        console.log("upload_article_post");
//
//        //判断cookie中是否存在userid
//        if(!common.get_user_id(req)){
//            res.render('login', { app_title: config.app_title , re_login: 1});
//            return;
//        }
//
//        var data = req.body;
//
//        console.log(req.headers.cookie);
//        console.log(data);
//
//        if(config.is_demo == 1){
//
//
//            if(common.descrypt_login(req, res)){
//
//                res.send({"success":true,"results": ""});
//            }
//            else{
//                res.send({"success":false,"results": ""});
//            }
//        }
//        else{
//
//            common.get_http_request_json(get_url, function(data) {
//                res.send(data);
//            });
//
//        }
//    }catch(e){
//        console.log("错误：/article_upload_post：" + e);
//    }
//
//});

router.post('/upload_to_server', function(req, res, next){

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }
        var data = req.body;
        var json_info = {};
        json_info.method = "weibopublish";
        json_info.user_id = common.get_user_id(req);
        json_info.group_id = data.group_id;
        json_info.doc_id = data.doc_id;
        json_info.image_url = data.images;
        json_info.content = data.content;
        json_info.weibo_type = data.weibo_type;
        json_info.is_publish = data.is_publish;
        json_info.pub_time = data.pub_time;
        json_info.loToken =data.loToken;

        var get_url = config.service_url + "/newMobile/syn.do?";
        get_url += "method=weibopublish";

        console.log("调用发布、保存微博操作接口：" + get_url);
        console.log(JSON.stringify(json_info));
        common.post_http_request(get_url,json_info,function(data){
            if(data.success){
                res.send(data.body);
            } else {
                res.send(data);
            }
            console.log(data);
        })

    }catch(e){
        console.log("错误：/upload_to_server：" + e);
    }

})

router.post("/upload_file",function(req, res, next){

    try{
        console.log("upload_file_post");

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }


        var picfile = req.body.picfile;
        var fileName = req.body.fileName;
        var image_index = req.body.image_index;
        var md5FileName = req.body.md5_param + ".md5";
        //var base64Data = picfile.replace(/^data:image\/\w+;base64,/, "");
        var base64Data = picfile.replace(/^data:[^;]*;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');

        var myDate = new Date();
        //var nowDate = myDate.toLocaleDateString().replace(/\-/g,"");
        var nowDate = myDate.Format("yyyy-MM-dd").toString();

        var nowFile = "public/files/" + nowDate;
        //var nowFile = "public/files/20150807";
        var file_Name = nowFile+"/"+fileName;

        fs.writeFile(file_Name, dataBuffer, function(err) {
            if(err){
                console.log(err);
            }else{
                /////
                fs.writeFile(nowFile + "/" +md5FileName, "", function(err) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("进入创建md5文件！");
                    }
                })
                /////
                console.log("保存成功！");
                file_Name = config.server_img_url+file_Name.substring(6);
                var json = {"url":file_Name, "image_index":image_index};
                console.log("json="+json);
                res.send(json);

            }
        })

    }catch(e){
        console.log("错误：/upload_file_post：" + e);
    }

});

router.get('/listTree', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            res.render('weibo_catalog_tree', {});
        }
        else{
            res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/weibo_article_list/listTree：" + e);
    }

});

router.get('/turnList', function(req, res, next) {

    try{

        //判断cookie中是否存在userid
        if(!common.get_user_id(req)){
            res.render('login', { app_title: config.app_title , re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if(common.descrypt_login(req, res)){
            res.render('weibo_article_list', {});
        }
        else{
            res.render('login', { app_title: config.app_title,re_login:1});
        }

    }catch(e){
        console.log("错误：/weibo_article_list/turnList：" + e);
    }

});

module.exports = router;
