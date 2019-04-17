var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var util = require("util");
var server_config = JSON.parse(fs.readFileSync('./server_config.json'));
var common = require('./common');
var config = require('./config');
var url = require("url");

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
/* 登录页面 */
router.get('/', function (req, res, next) {

    try {

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        var kindParam = params.articleKind;
        console.log("=====" + kindParam);

        if (common.descrypt_login(req, res)) {

            res.render('article_upload', {
                "catalog_id": "1",
                "catalog_name": "自采稿库",
                "dept_id": "2",
                "dept_name": "部门稿库",
                "publish_id": "5",
                "publish_name": "方正新浪微博",
                "catalog_type": 0,
                "upload_max_size": config.upload_max_size,
                "article_to_relation":config.personality.article_to_relation,
                "app_title": server_config.app_title,
                "upload_choose_dept": config.upload_choose_dept,
                "kind": kindParam
            });
        } else {
            res.render('login', {app_title: server_config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_upload：" + e);
    }

});

//新建稿跳转界面
router.get('/turnNew', function (req, res, next) {

    try {
        var params = url.parse(req.url, true).query;

        if (common.descrypt_login(req, res)) {
            res.render('article_new', {article_id: params.articleId});
        }
        else {
            res.send({"success": false, "results": article_detail.results});
        }
    } catch (e) {
        console.log("错误：/article_upload/turnNew：" + e);
    }

});

/* 登录页面 */
router.get('/isExist', function (req, res, next) {

    try {
        console.log("upload_isExist_get");

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        console.log(params.md5_param + "pppppppppppppppppppppppppppppppp" + params.format_param);

        var myDate = new Date();
        //var nowDate = myDate.toLocaleDateString().replace(/\-/g,"");
        var nowDate = myDate.Format("yyyy-MM-dd").toString();
        var md5FileName = params.md5_param + ".md5";
        var nowFile = "public/files/" + nowDate;
        //var nowFile = "public/files/20150807";

        if (!fs.existsSync(nowFile)) {
            fs.mkdir(nowFile);
        }

        if (!fs.existsSync(nowFile + "/" + md5FileName)) {
            var json = {
                "fileName": params.fileName,
                "oldFileName": params.oldFileName,
                "isHas": false,
                "nowFile": config.server_img_url + nowFile.substring(6)
            };
            res.send(json);
        } else {
            var json = {
                "fileName": params.fileName,
                "oldFileName": params.oldFileName,
                "isHas": true,
                "nowFile": config.server_img_url + nowFile.substring(6)
            };
            res.send(json);
        }

    } catch (e) {
        console.log("错误：/article_upload/isExist：" + e);
    }

});

/* 登录请求验证*/
router.post('/', function (req, res, next) {

    try {
        console.log("upload_article_post");

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var data = req.body;

        console.log(req.headers.cookie);
        console.log(data);

        if (config.is_demo == 1) {


            if (common.descrypt_login(req, res)) {

                res.send({"success": true, "results": ""});
            }
            else {
                res.send({"success": false, "results": ""});
            }
        }
        else {
            //if(common.descrypt_login_post(req)){

            //var get_url_addr = config.service_url + "/newMobile/syn.do?";
            //var get_url = config.service_url + "/newMobile/syn.do?";
            //if(data.kindParam == "article"){
            //    //json_info.method = "articleSaving";
            //    get_url += "&method=articleSaving";
            //}else if(data.kindParam == "picture"){
            //    get_url += "&method=photoSaving";
            //}else if(data.kindParam == "video"){
            //    get_url += "&method=videoSaving";
            //}
            //get_url += "&user_id=" + common.get_user_id(req);
            ////get_url += "&catalog_type=" + data.catalog_type;
            //get_url += "&catalog_id=" + data.catalog_id;
            //get_url += "&topic=" + data.title;
            //get_url += "&text_content=" + data.content;
            //get_url += "&httpurls=" + data.images;

            common.get_http_request_json(get_url, function (data) {

                res.send(data);
            });

        }
    } catch (e) {
        console.log("错误：/article_upload_post：" + e);
    }

});

function article_relation(params, callback) {

    try {

        if( !(parseInt(params.relation_docid) > 0) ){
            callback({ success: true });
            return ;
        }

        //  docid 参数可能是一个数组
        //  原因为选择多个视频时会将每个视频都作为一个稿件
        var docids = util.isArray(params.docid) ? params.docid : [params.docid];

        (function create_relation(){

            var next = docids.shift();
            var _url = config.service_url + "/newsplan/syn.do";
            _url += "?method=creationConnect";
            _url += "&user_id=" + params.user_id;
            _url += "&docId=" + next;
            _url += "&docLibID=" + params.doclibid;
            _url += "&condoc=" + params.relation_docid;
            _url += "&docLibid=" + params.relation_doclibid;
            _url += "&loToken=" + params.loToken;

            console.log("投稿时和采访任务, 报题关联接口: " + _url);
            common.get_http_request_json(_url, function (data) {
                console.log(data);
                if(data[0].success){
                    if(docids.length > 0){
                        create_relation();
                        return;
                    }
                }
                callback(data[0]);
            });

        })();

    } catch (e) {
        console.info(e);
    }
}


// 上传至服务器
router.post('/upload_to_server', function (req, res, next) {

    try {

        //判断cookie中是否存在userid
        var user_id = common.get_user_id(req);
        if (!user_id) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var data = req.body;
        var json_info = {};
        json_info.method = "upload";
        if (data.kindParam == "article") {
            json_info.article_type = "text";
            json_info.image_url = data.images;
        } else if (data.kindParam == "picture") {
            json_info.article_type = "image";
            json_info.image_url = data.images;
        } else if (data.kindParam == "video") {
            json_info.article_type = "video";
            json_info.video_url = data.images;
        }
        json_info.user_id = user_id;

        json_info.catalog_type = data.catalog_type;
        json_info.catalog_id = data.catalog_id;
        json_info.relation_docid = data.relation_docid;
        json_info.relation_doclibid = data.relation_doclibid;
        json_info.title = data.title;
        json_info.content = data.content;
        json_info.address = data.address;
        json_info.loToken = data.loToken;
        //json_info.image_url = data.images;

        var get_url = config.service_url + "/newMobile/syn.do?";
        get_url += "method=upload";

        console.log("url:" + get_url);
        console.log(JSON.stringify(json_info));

        common.post_http_request(get_url, json_info, function (data) {
            console.log(data);
            if (data.success) {

                data = JSON.parse(data.body);
                if(data.success){
                    // docid: 2_3715 ( 库ID_文档ID )
                    var results = data.results;
                    json_info.docid = results.docID;
                    json_info.doclibid = results.docLibID;

                    article_relation(json_info, function (json) {
                        if(json.success){
                            res.send(data);
                        }else{
                            res.send({success: false, results: {error_info: json.error}});
                        }
                    });
                }else{
                    res.send(data);
                }
            } else {
                res.send(data);
            }
        })

    } catch (e) {
        console.log("错误：/upload_to_server：" + e);
    }

});

//router.post("/upload_file",function(req, res, next){
//
//    try{
//        console.log("upload_file_post");
//
//        //判断cookie中是否存在userid
//        if(!common.get_user_id(req)){
//            res.render('login', { app_title: config.app_title , re_login: 1});
//            return;
//        }
//
//
//        var picfile = req.body.picfile;
//        var fileName = req.body.fileName;
//        var image_index = req.body.image_index;
//        var md5FileName = req.body.md5_param + ".md5";
//        //var base64Data = picfile.replace(/^data:image\/\w+;base64,/, "");
//        var base64Data = picfile.replace(/^data:\w+\/\w+;base64,/, "");
//        var dataBuffer = new Buffer(base64Data, 'base64');
//
//        var myDate = new Date();
//        //var nowDate = myDate.toLocaleDateString().replace(/\-/g,"");
//        var nowDate = myDate.Format("yyyy-MM-dd").toString();
//
//        var nowFile = "public/files/" + nowDate;
//        //var nowFile = "public/files/20150807";
//        var file_Name = nowFile+"/"+fileName;
//
//        fs.writeFile(file_Name, dataBuffer, function(err) {
//            if(err){
//                console.log(err);
//            }else{
//                /////
//                fs.writeFile(nowFile + "/" +md5FileName, "", function(err) {
//                    if(err){
//                        console.log(err);
//                    }else{
//                        console.log("进入创建md5文件！");
//                    }
//                })
//                /////
//                console.log("保存成功！");
//                file_Name = config.server_img_url+file_Name.substring(6);
//                var json = {"url":file_Name, "image_index":image_index};
//                console.log("json="+json);
//                res.send(json);
//
//            }
//        })
//
//    }catch(e){
//        console.log("错误：/upload_file_post：" + e);
//    }
//
//});

router.post("/upload_file", function (req, res, next) {

    try {
        console.log("upload_file_post");

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
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
        var file_Name = nowFile + "/" + fileName;

        if (!fs.existsSync(nowFile)) {
            fs.mkdirSync(nowFile);
            console.log('目录创建成功\n');
         }
        fs.writeFile(file_Name, dataBuffer, function (err) {
            if (err) {
                console.log(err);
            } else {
                /////
                fs.writeFile(nowFile + "/" + md5FileName, "", function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("进入创建md5文件！");
                    }
                });
                /////
                console.log("保存成功！");
                file_Name = config.server_img_url + file_Name.substring(6);
                var json = {"url": file_Name, "image_index": image_index};
                console.log("json=" + JSON.stringify(json));
                res.send(json);

            }
        })

    } catch (e) {
        console.log("错误：/upload_file_post：" + e);
    }

});

router.get('/relation_list', function (req, res, next) {

    try {

        //判断cookie中是否存在userid
        var user_id = common.get_user_id(req);
        if (!user_id) {
            res.render('login', {app_title: config.app_title, re_login: 1}); return;
        }

        var params = url.parse(req.url, true).query;
        var _url = config.service_url + "/newsplan/syn.do";
        _url += "?method=" + params.method;
        _url += "&starttime=" + params.starttime;
        _url += "&endtime=" + params.endtime;
        _url += "&loToken=" + params.loToken;
        _url += "&user_id=" + user_id;

        if (common.descrypt_login(req, res)) {
            common.get_http_request_json(_url, function (data) {
                res.send(data)
            });
        } else {
            res.send({"success": false, "results": article_detail.results});
        }
    } catch (e) {
        console.log("错误：/article_upload/relation_list：" + e);
    }

});

module.exports = router;
