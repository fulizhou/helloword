/**
 * Created by shangfanfan on 2016/4/20 0020.
 */

/**
 * 该路由用于 将采编系统 静态资源 的请求从内网转发至 采编系统
 */
var express = require('express');
var http = require('http');
var url = require('url');
var config = require('./config');

var router = express.Router();

var serverUrlData = url.parse(config.service_url);
var handler = function (req, res) {
    try { // 获取请求的全路径
        var urlData = url.parse(req.originalUrl);
        urlData.path=urlData.path.replace(/^\/newsedit/ ,serverUrlData.path);
        // 修改 hostname 和 port 为采编系统
        var options = {
            hostname: serverUrlData.hostname,
            port: serverUrlData.port,
            path: urlData.path,
            headers: req.headers,
            method: req.method
        };

        var proxyRequest = http.request(options, function (proxyResponse) {
            res.set(proxyResponse.headers);
            res.statusCode = proxyResponse.statusCode;

            proxyResponse.pipe(res);

            proxyResponse.on('end', function () {
                console.log('Proxy: ' + req.method + " " + urlData.path + " success");
            });
        }).on('error', function (err) {
            console.info("错误：/newsedit(转发)：转发请求到采编系统出错");
            console.info(err);
            res.statusCode = 500;
        });

        if (/POST|PUT/i.test(req.method)) {
            req.pipe(proxyRequest);
        } else {
            proxyRequest.end();
        }
    } catch (e) {
        console.log("错误：/newsedit(转发)：" + e);
    }
};

// 对视频资源转发
router.all("/newMobile/getMedia.do", handler);
router.all("/newMobile/getMedia.mp4", handler);
// 对图文混排的图片转发
router.all("/newMobile/getImage.do", handler);
// 对缩略图转发
router.all("/e5workspace/binary.do", handler);
// 对大样图转发
router.all("/newMobile/getLayoutImg.do", handler);
// 对普通图片转发
router.all("/newsedit/photoinfo/binary_middle.do", handler);
// 对附件的转发
router.all("/newsedit/editor/GetAttachment.do", handler);
//对微博头像图片的转发
router.all("/newsedit/weixin/getHeaderImg.do", handler);
//对附件转发
router.all("/newMobile/getAtt.do", handler);
module.exports = router;