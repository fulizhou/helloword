var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var common = require('./common');
var config = require('./config');
var url = require("url");

//跳转到稿件详情页面
router.get('/', function (req, res, next) {

    try {

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        var user_id = common.get_user_id(req);
        if (common.descrypt_login(req, res)) {
            if (params.lib_type == "paper_layout") {
                res.render('paper_layout_detail', {
                    article_id: params.articleId,
                    position: params.position,
                    lib_type: params.lib_type,
                    column_name: params.column_name,
                    page_id: params.page_id,
                    article_libid: params.article_libid,
                    paper_date: params.paper_date,
                    paper_paper_id: params.paper_paper_id
                });
            } else if (params.lib_type == "paper_layout_opinion") {
                res.render('paper_layout_opinion', {
                    article_id: params.articleId,
                    position: params.position,
                    lib_type: params.lib_type,
                    column_name: params.column_name,
                    page_id: params.page_id
                });
            } else if (params.lib_type == "paper") {
                res.render('paper_article_detail', {
                    article_id: params.article_id,
                    position: params.position,
                    lib_type: params.lib_type,
                    cat_name: params.cat_name,
                    cat_child_name: params.cat_child_name,
                    article_libid: params.article_libid,
                    catalog_id: params.catalog_id,
                    paper_id: params.paper_id
                });
            } else if (params.lib_type == "site") {
                res.render('site_article_detail', {
                    article_id: params.article_id,
                    position: params.position,
                    lib_type: params.lib_type,
                    cat_name: params.cat_name,
                    cat_child_name: params.cat_child_name,
                    article_libid: params.article_libid,
                    column_id: params.column_id,
                    code: params.code
                });
            } else if (params.lib_type == "xyv5") {
                res.render('xyv5_article_detail', {
                    article_id: params.article_id,
                    lib_type: params.lib_type,
                    cat_name: params.cat_name,
                    cat_child_name: params.cat_child_name,
                    article_libid: params.article_libid,
                });
             } else if (params.lib_type == "app") {
                res.render('app_article_detail', {
                    article_id: params.article_id,
                    position: params.position,
                    lib_type: params.lib_type,
                    cat_name: params.cat_name,
                    cat_child_name: params.cat_child_name,
                    article_libid: params.article_libid,
                    column_id: params.column_id,
                    code: params.code
                });
            } else {
                res.render('article_detail', {
                    article_id: params.article_id,
                    position: params.position,
                    lib_type: params.lib_type,
                    cat_name: params.cat_name,
                    article_libid: params.article_libid,
                    article_to_relation:config.personality.article_to_relation,
                    user_id:user_id,
                    transfer_catalogID: params.catalog_id,
                    terminalType:params.terminalType
                    //各种参数
                });
            }
        } else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail：" + e);
    }

});
router.get('/getapptype',function(req, res, next) {
    try{
        res.send({"app_type":config.app_type});
    }catch(e){
        console.log("错误：/article_detail/getapptype：" + e);
    }

});
//获取稿件详情信息
router.get('/detail', function (req, res, next) {

    try {
        console.log("获取稿件详细内容：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_detail.json'));
            if (common.descrypt_login(req, res)) {
                //发送各种类型的响应
                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                //渲染视图模板
                res.render('login', {app_title: config.app_title, re_login: 1});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                if (params.lib_type == 'source') {
                    get_url += "method=articleSource";
                } else if (params.lib_type == 'dept') {
                    get_url += "method=deptArticleSource";
                }
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&article_id=" + params.article_id;
                get_url += "&loToken=" + params.loToken;
                console.log("调用获取自采稿稿件详情接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {
                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }
        }

    } catch (e) {
        console.log("错误：/article_detail/detail：" + e);
    }

});

//获取版面详情信息
router.get('/layout', function (req, res, next) {

    try {
        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {
            var article_detail = JSON.parse(fs.readFileSync('./service/layout_detail.json'));
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }
        } else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=pageDetail";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&page_id=" + params.page_id;
                get_url += "&loToken=" + params.loToken;
                console.log("调用获取纸媒稿件详情接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {
                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }
        }
    } catch (e) {
        console.log("错误：/article_detail/layout：" + e);
    }

});
//获取音频列表
router.get('/voice', function (req, res, next) {

    try {
        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {
            var article_detail = JSON.parse(fs.readFileSync('./service/voice_detail.json'));
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }
        } else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=getVoiceComment";

                get_url += "&article_id=" + params.article_id;
                get_url += "&loToken=" + params.loToken;
                console.log("调用获取纸媒稿件详情接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {
                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }
        }
    } catch (e) {
        console.log("错误：/article_detail/voice：" + e);
    }

});

// 稿件状态
router.get('/articleStatus', function (req, res, next) {

    try {
        //判断cookie中是否存在userid
        var user_id = common.get_user_id(req);
        if (!user_id) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (common.descrypt_login(req, res)) {
            var get_url = config.service_url + "/newMobile/syn.do?";
            get_url += "method=articleStatus";
            get_url += "&user_id=" + user_id;
            get_url += "&article_id=" + params.article_id;
            get_url += "&article_libid=" + params.article_libid;
            get_url += "&flowNode=" + params.flowNode;
            get_url += "&loToken=" + params.loToken;

            console.log("调用获取稿件状态接口：" + get_url);
            /**
             输出参数：json格式
             1.{"results":{"status":"NOEXIST"},"success":true}
             2. {"results":{"status":"ISLOCKED"},"success":true}
             3. {"results":{"status":"STATECHANGE"},"success":true}
             4. {"results":{"status":"NORMAL"},"success":true}
             status状态位说明：
             NOEXIST文档状态已经改变，或者已经不存在！
             ISLOCKED文档正在被别人处理，您现在不能进行操作！
             STATECHANGE文档状态已经改变，或者已经不存在！
             NORMAL正常
             */
            common.get_http_request_json(get_url, function (data) {
                res.send(data);
            });
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/articleStatus：" + e);
    }
});

// 稿件解锁
router.get('/unlock', function (req, res, next) {

    try {
        //判断cookie中是否存在userid
        var user_id = common.get_user_id(req);
        if (!user_id) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (common.descrypt_login(req, res)) {
            var get_url = config.service_url + "/newMobile/syn.do?";
            get_url += "method=unlock";
            get_url += "&user_id=" + user_id;
            get_url += "&article_id=" + params.article_id;
            get_url += "&article_libid=" + params.article_libid;
            get_url += "&loToken=" + params.loToken;

            console.log("调用稿件解锁接口：" + get_url);

            common.get_http_request_json(get_url, function (data) {
                res.send(data);
            });
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/unlock：" + e);
    }
});
//跳转到稿件签发页面
router.get('/sign', function (req, res, next) {

    try {
        console.log('article_detail/sign');

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (common.descrypt_login(req, res)) {
            res.render('article_sign', {
                article_id: params.article_id,
                article_libid: params.article_libid,
                article_type: params.article_type,
                sign_type: params.sign_type,
                has_img: params.has_img
            });
            //if(params.sign_mode == "paper"){
            //    res.render('paper_article_sign', {sign_mode:params.sign_mode});
            //}else if(params.sign_mode == "site"){
            //    res.render('site_article_sign', {sign_mode:params.sign_mode});
            //}else if(params.sign_mode == "weibo"){
            //    res.render('weibo_article_sign', {sign_mode:params.sign_mode});
            //}
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/sign：" + e);
    }

});

//跳转到稿件签发页面
router.get('/sign_paper', function (req, res, next) {

    try {
        console.log('article_detail/sign_paper');

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (common.descrypt_login(req, res)) {
            res.render('paper_choosed_column_article_sign', {
                article_id: params.article_id,
                article_libid: params.article_libid,
                catalog_id: params.catalog_id,
                article_type: params.article_type,
                paper_id: params.paper_id,
                fx_paperdate: params.fx_paperdate
            });
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/sign_paper：" + e);
    }

});

//跳转到稿件签发页面
router.get('/logDetail', function (req, res, next) {

    try {
        console.log('article_detail/logDetail');
        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_log_detail', {
                article_id: params.article_id,
                cat_name: params.cat_name,
                cat_child_name: params.cat_child_name,
                article_libid: params.article_libid
            });
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/logDetail：" + e);
    }
});

//跳转到稿件调栏页面
router.get('/adjust', function (req, res) {
    try {
        console.log('article_detail/adjust');
        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }
        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_adjust', {article_id: params.article_id, article_libid: params.article_libid});
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }


    } catch (e) {
        console.log("错误：/article_detail/unsign：" + e);
    }

});//跳转到稿件调栏页面


//跳转到稿件调栏页面
router.get('/site_adjust', function (req, res) {
    try {
        console.log('article_detail/site_adjust');
        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }
        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('site_article_adjust', {article_id: params.article_id, article_libid: params.article_libid, column_id: params.column_id, code: params.code});
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }


    } catch (e) {
        console.log("错误：/article_detail/unsign：" + e);
    }

});

router.get('/adjustArticle', function (req, res) {

    try {
        console.log('article_detail/adjust');

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (common.descrypt_login(req, res)) {
            var get_url = config.service_url + "/newMobile/syn.do?";
            get_url += "method=adjustArticle";
            get_url += "&user_id=" + common.get_user_id(req);
            get_url += "&DocIDs=" + params.article_id;
            get_url += "&DocLibID=" + params.article_libid;
            get_url += "&paperID=" + params.paper_id;
            get_url += "&columnID=" + params.column_id;
            get_url += "&columnName=" + encodeURIComponent(params.column_name);
            get_url += "&layoutID=" + params.layout_id;
            get_url += "&layoutName=" + encodeURIComponent(params.layout_name);
            get_url += "&operateType=" + params.state;
            get_url += "&layoutDate=" + params.sign_date;
            get_url += "&sendMake=" + params.is_send_make;
            get_url += "&photoColor=" + params.make_color;
            get_url += "&photoFormat=" + params.make_formate;
            get_url += "&message=" + encodeURIComponent(params.note);
            get_url += "&loToken=" + params.loToken;

            console.log("调用纸媒稿件调栏操作接口：" + get_url);

            common.get_http_request_json(get_url, function (data) {
                res.send(data);
            });
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }


    } catch (e) {
        console.log("错误：/article_detail/unsign：" + e);
    }

});

//跳转到稿件撤签页面
router.get('/unsign', function (req, res, next) {

    try {
        console.log('article_detail/unsign');

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_unsign', {article_id: params.article_id, article_libid: params.article_libid});
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/unsign：" + e);
    }

});

//稿件撤签操作
router.get('/unsign_opt', function (req, res, next) {
    try {
        console.log("稿件撤签操作：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {
                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {

                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=articleCancelSign";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&article_id=" + params.article_id;
                get_url += "&article_libid=" + params.article_libid;
                get_url += "&loToken=" + params.loToken;
                get_url += "&note=" + encodeURIComponent(params.note);
                console.log("调用稿件撤签操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }
    } catch (e) {
        console.log("错误：/article_detail/unsign_opt：" + e);
    }

});

//跳转到稿件签发页面
router.get('/sign_mode', function (req, res, next) {

    try {
        console.log('article_detail/sign');
        console.log(req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            //res.render('article_sign', {article_id:params.article_id});
            if (params.sign_mode == "PCOL") {
                res.render('paper_article_sign', {
                    article_id: params.article_id,
                    sign_mode: params.sign_mode,
                    article_libid: params.article_libid,
                    article_type: params.article_type,
                    has_img: params.has_img
                });
            }  else if (params.sign_mode == "WCOL") {
                res.render('weibo_article_sign', {
                    article_id: params.article_id,
                    sign_mode: params.sign_mode,
                    article_libid: params.article_libid
                });
            } else if (params.sign_mode == "MCOL") {
                res.render('app_article_sign', {
                    article_id: params.article_id,
                    sign_mode: params.sign_mode,
                    article_libid: params.article_libid
                });
            }else{// if (params.sign_mode == "COL")  网站及第三方子系统均用这个site_article_sign页面
                res.render('site_article_sign', {
                    article_id: params.article_id,
                    sign_mode: params.sign_mode,
                    article_libid: params.article_libid
                });
            }
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }
    } catch (e) {
        console.log("错误：/article_detail/sign_mode：" + e);
    }

});

//跳转到稿件纸媒签发页面
router.get('/sign_paper', function (req, res, next) {

    try {
        console.log('article_detail/sign');
        console.log(req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_sign', {article_id: params.article_id, article_type: params.article_type})
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/sign_paper：" + e);
    }

});

router.get('/remove', function (req, res, next) {
    try {
        console.log('article_detail/remove');
        console.log(req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }
        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_remove', {
                article_id: params.article_id,
                article_libid: params.article_libid,
                fvid: params.fvid,
                fvname: params.fvname
            });
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/remove：" + e);
    }

});
//跳转到稿件审核页面
router.get('/auditing', function (req, res, next) {
    try {
        console.log('article_detail/auditing');
        console.log(req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }
        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_auditing', {
                article_id: params.article_id,
                article_libid: params.article_libid,
                fvid: params.fvid,
                fvname: params.fvname
            });
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/auditing：" + e);
    }

});
//跳转到送审页面 var href = "/article_detail/logDetail?" + "article_id=" + "13712" +"&"+ "article_libid=" + "2"+ "&cat_name=" + cat_name+ "&cat_child_name=" + cat_child_name;
router.get('/sendAudit', function (req, res, next) {
    console.log('/article_detail/sendAudit----');
    try {
        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }
        var params = url.parse(req.url, true).query;
        console.log(params);
        if (common.descrypt_login(req, res)) {
            res.render('sendAudit', { article_id: params.article_id,
                                        article_libid: params.article_libid,
                                        user_id: common.get_user_id(req),
                                        transfer_catalogID: params.catalog_id,
                                        isDeleteOriDoc:params.isDeleteOriDoc
                                        });
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }
    } catch (e) {
        console.log("错误：/article_detail/sendAudit：" + e);
    }
});
//---------------------

//跳转到稿件选用页面
router.get('/choose', function (req, res, next) {
    try {
        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }
        var params = url.parse(req.url, true).query;
        if (common.descrypt_login(req, res)) {
            res.render('article_choose', {article_id: params.article_id, article_libid: params.article_libid})
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }
    } catch (e) {
        console.log("错误：/article_detail/choose：" + e);
    }

});

//跳转到稿件选用页面
router.get('/get', function (req, res, next) {

    try {
        console.log('article_detail/get');
        console.log(req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_get', {article_id: params.article_id, article_libid: params.article_libid})
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/get：" + e);
    }

});

//跳转到稿件选用页面
router.get('/publish_sign', function (req, res, next) {

    try {
        console.log('article_detail/publish_sign');
        console.log(req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_publish_sign', {article_id: params.article_id})
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/publish_sign：" + e);
    }

});
//跳转到稿件传递页面
router.get('/transfer', function (req, res, next) {

    try {
        console.log('article_detail/transfer');
        console.log(req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;
        console.log(params);

        if (common.descrypt_login(req, res)) {
            res.render('article_transfer', {article_id: params.article_id, article_libid: params.article_libid})
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/transfer：" + e);
    }

});

router.get('/remove_opt', function (req, res, next) {

    try {
        console.log("自采稿稿件操移动作：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {
            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=articleRemove";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&article_id=" + params.article_id;
                get_url += "&transfer_catalogID=" + params.catalog_id;
                get_url += "&article_libid=" + params.article_libid;
                get_url += "&loToken=" + params.loToken;
                console.log("调用稿件移动操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }

    } catch (e) {
        console.log("错误：/article_detail/remove_opt：" + e);
    }

});

//稿件审核操作
router.get('/auditing_opt', function (req, res, next) {

    try {
        console.log("自采稿稿件审核操作：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {
            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=articleAuditing";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&article_id=" + params.article_id;
                get_url += "&transfer_catalogID=" + params.catalog_id;
                get_url += "&article_libid=" + params.article_libid;
                //get_url += "&note=" + params.note;
                //var b = new Buffer(params.note);
                //var bs64Note = b.toString('base64');
                get_url += "&note=" + params.note;
                get_url += "&passType=" + params.pass_type;
                get_url += "&loToken=" + params.loToken;
                console.log("调用稿件审核操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }

    } catch (e) {
        console.log("错误：/article_detail/auditing_opt：" + e);
    }

});

//大样意见操作
router.get('/opinion', function (req, res, next) {

    try {
        console.log("大样意见操作：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=notePage";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&page_id=" + params.article_id;
                //var b = new Buffer(params.opinion);
                //var bs64Note = b.toString('base64');
                var note = encodeURIComponent(params.opinion);
                get_url += "&note=" + note;
                get_url += "&loToken=" + params.loToken;
                console.log("调用大样意见操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }

    } catch (e) {
        console.log("错误：/article_detail/opinion：" + e);
    }

});

//大样操作签发
router.get('/sign_page', function (req, res, next) {

    try {
        console.log("大样签发操作：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=signPage";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&page_id=" + params.page_id;
                get_url += "&isSign=" + params.isSign;
                get_url += "&loToken=" + params.loToken;
                console.log("调用大样签发操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }
        }

    } catch (e) {
        console.log("错误：/article_detail/opinion：" + e);
    }

});

//大样撤签操作
router.get('/unsign_page', function (req, res, next) {

    try {
        console.log("大样撤签操作：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {
                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=unsignPage";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&page_id=" + params.page_id;
                get_url += "&loToken=" + params.loToken;
                console.log("调用大样撤签操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }

    } catch (e) {
        console.log("错误：/article_detail/unsign_page：" + e);
    }

});

//纸媒稿件签发操作
router.get('/paper_sign_opt', function (req, res, next) {

    try {
        console.log("纸媒稿件签发操作：" + req.url);


        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=signPaper";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&article_id=" + params.article_id;
                get_url += "&article_libid=" + params.article_libid;
                get_url += "&column_id=" + params.column_id;
                get_url += "&layout_id=" + params.layout_id;
                get_url += "&status=" + params.state;
                get_url += "&send_make=" + params.is_send_make;
                get_url += "&color=" + params.make_color;
                get_url += "&make_format=" + params.make_formate;
                get_url += "&column_date=" + params.sign_date;
                //get_url += "&note=" + params.note;
                //get_url = encodeURIComponent(get_url);
                get_url += "&note=" + encodeURIComponent(params.note);
                get_url += "&loToken=" + params.loToken;
                console.log("调用纸媒稿件签发操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {
                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }

    } catch (e) {
        console.log("错误：/article_detail/paper_sign_opt：" + e);
    }

});

//网站稿件签发操作
router.get('/site_sign_opt', function (req, res, next) {

    try {
        console.log("网站稿件签发操作：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=siteSign";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&article_id=" + params.article_id;
                get_url += "&column_id=" + params.column_id;
                console.log("调用网站稿件签发接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }

    } catch (e) {
        console.log("错误：/article_detail/site_sign_opt：" + e);
    }
});

//微博稿件签发操作
router.get('/weibo_sign_opt', function (req, res, next) {

    try {
        console.log("微博稿件签发操作：" + req.url);
        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=weiboSign";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&article_id=" + params.article_id;
                get_url += "&column_id=" + params.column_id;
                console.log("微博稿件签发操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }
    } catch (e) {
        console.log("错误：/article_detail/weibo_sign_opt：" + e);
    }

});

////稿件签发操作
//router.get('/sign_opt', function(req, res, next) {
//
//    var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
//    if(common.descrypt_login(req, res)){
//
//        res.send({"success":article_detail.success,"results": article_detail.results});
//    }
//    else{
//        res.send({"success":false,"results": article_detail.results});
//    }
//});

//稿件选用操作
router.get('/choose_opt', function (req, res, next) {

    try {
        console.log('article_detail/choose_opt');
        console.log(req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (params.catalog_id <= 0) {
            res.send({success: false, results: {error_info: "没有选择部门, 请先选择部门"}});
            return;
        }

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=articleChoose";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&dept_catalog_id=" + params.catalog_id;
                get_url += "&article_id=" + params.article_id;
                get_url += "&article_libid=" + params.article_libid;
                get_url += "&loToken=" + params.loToken;
                get_url += "&type=" + params.type;
                console.log("调用稿件选用操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }

    } catch (e) {
        console.log("错误：/article_detail/choose_opt：" + e);
    }

});

//稿件传递操作
router.get('/transfer_opt', function (req, res, next) {

    try {
        console.log('article_detail/transfer_opt');
        console.log(req.url);
        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=articleTransfer";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&transfer_catalogID=" + params.catalog_id;
                get_url += "&transfer_userID=" + params.user_id;
                get_url += "&article_id=" + params.article_id;
                get_url += "&article_libid=" + params.article_libid;
                get_url += "&loToken=" + params.loToken;
                get_url += "&option=" + params.option;
                console.log("调用稿件选用操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }
    } catch (e) {
        console.log("错误：/article_detail/transfer_opt：" + e);
    }
});

//稿件传递操作
router.get('/get_opt', function (req, res, next) {

    try {
        console.log('article_detail/get_opt');
        console.log(req.url);
        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=articleGet";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&dept_catalog_id=" + params.catalog_id;
                get_url += "&article_id=" + params.article_id;
                get_url += "&article_libid=" + params.article_libid;
                get_url += "&loToken=" + params.loToken;
                console.log("调用取稿操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }
    } catch (e) {
        console.log("错误：/article_detail/get_opt：" + e);
    }
});

//网站发布操作
router.get('/publish', function (req, res, next) {

    try {
        console.log("网站发布操作：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {

                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=signSite";
                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&article_id=" + params.article_id;
                get_url += "&article_libid=" + params.article_libid;
                get_url += "&column_id=" + params.column_id;
                get_url += "&code=" + params.code;
                get_url += "&loToken=" + params.loToken;
                console.log("调用稿件撤签操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });

            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }

    } catch (e) {
        console.log("错误：/article_detail/publish：" + e);
    }
});

//网站发布操作
router.get('/unPublish', function (req, res, next) {

    try {
        console.log("网站取消发布操作：" + req.url);

        //判断cookie中是否存在userid
        var userId = common.get_user_id(req);
        if (!userId) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }

        var params = url.parse(req.url, true).query;

        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_operate.json'));
            console.log(article_detail);
            if (common.descrypt_login(req, res)) {

                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                res.send({"success": false, "results": article_detail.results});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {

                var get_url = config.service_url + "/newMobile/syn.do?";
                get_url += "method=unSignSite";
                get_url += "&user_id=" + userId;
                get_url += "&article_id=" + params.article_id;
                get_url += "&article_libid=" + params.article_libid;
                get_url += "&loToken=" + params.loToken;
                console.log("调用网站取消发布操作接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {

                    res.send(data);
                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }

        }
    } catch (e) {
        console.log("错误：/article_detail/unPublish：" + e);
    }
});

//网站发布操作
router.get('/get_relation', function (req, res, next) {

    try {
        console.log("获取稿件关联操作：" + req.url);

        //判断cookie中是否存在userid
        var userId = common.get_user_id(req);
        if (!userId) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }
        var params = url.parse(req.url, true).query;

        if (common.descrypt_login(req, res)) {

            var get_url = config.service_url + "/newsplan/syn.do?";
            get_url += "method=getConnect";
            get_url += "&user_id=" + userId;
            get_url += "&docId=" + params.docId;
            get_url += "&loToken=" + params.loToken;
            console.log("调用获取稿件关联接口：" + get_url);
            common.get_http_request_json(get_url, function (data) {

                res.send(data);
            });
        }
        else {
            res.render('login', {app_title: config.app_title, re_login: 1});
        }

    } catch (e) {
        console.log("错误：/article_detail/get_relation：" + e);
    }
});

//获取修改痕迹
router.get('/article_modifity', function (req, res, next) {

    try {
        console.log("获取修改痕迹：" + req.url);

        //判断cookie中是否存在userid
        if (!common.get_user_id(req)) {
            res.render('login', {app_title: config.app_title, re_login: 1});
            return;
        }


        var params = url.parse(req.url, true).query;
        if (config.is_demo == 1) {

            var article_detail = JSON.parse(fs.readFileSync('./service/article_detail.json'));
            if (common.descrypt_login(req, res)) {
                //发送各种类型的响应
                res.send({"success": article_detail.success, "results": article_detail.results});
            }
            else {
                //渲染视图模板
                res.render('login', {app_title: config.app_title, re_login: 1});
            }
        }
        else {
            if (common.descrypt_login(req, res)) {
               var get_url = config.service_url + "/newMobile/syn.do?";
                    get_url += "method=articleTrace";

                get_url += "&user_id=" + common.get_user_id(req);
                get_url += "&article_id=" + params.article_id;
                get_url += "&article_libid=" + params.article_libid;
                get_url += "&loToken=" + params.loToken;
                console.log("调用获取稿件修改痕迹接口：" + get_url);
                common.get_http_request_json(get_url, function (data) {
                    if(data.success){
                        var con = data.results.trace;
                        con = con.replace(/<founder:jquery-directory>/,"../assets/js/jquery.min.js");
                        con = con.replace(/<founder:bootstrap-js-directory>/,"../assets/js/bootstrap.min.js");
                        con = con.replace(/<founder:img-return-directory>/,"../images/navbar/return.png");
                        con = con.replace(/<founder:amazeui-css-directory>/,"../assets/css/amazeui.min.css");
                        con = con.replace(/<founder:app-css-directory>/,"../assets/css/app.css");

                        console.log(con);
                        res.send(con);

                    }

                });
            }
            else {
                res.render('login', {app_title: config.app_title, re_login: 1});
            }
        }

    } catch (e) {
        console.log("错误：/article_detail/article_modifity：" + e);
    }

});

module.exports = router;
