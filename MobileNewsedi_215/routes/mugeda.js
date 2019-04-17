var express = require('express');
var router = express.Router();
var http = require('http');
var url = require("url");
var crypto = require('crypto');
var buffer = require("buffer");
var config = require('./config');

router.get('/', function (req, res, next) {

    try {
        var params = url.parse(req.url, true).query;
            /*
            参数：
            "sign": 签名秘钥 ,
            "id":唯一id标识,
            "thumbUrl":作品缩略图地址,
            "title":作品名称,
            "authName":作者名称，
            "remark":备注信息，
            "publish_url": 作品地址 ,
            "timestamp":时间戳*/

        var sign = params.sign;
        var id = params.id;
        var thumbUrl = params.thumbUrl;
        var title = params.title;
        var authName = params.authName;
        var remark = params.remark;
        var publish_url = params.publish_url;
        var timestamp = params.timestamp;
        var curtimestamp = new Date().getTime();
        console.log(curtimestamp);
        var vailetime = 1000*60*30;
        if((curtimestamp - timestamp) > vailetime){
            res.send({"status":false,"message":"很遗憾，已过期！"});
            return;
        }
        var data = config.appkey + config.appsecret + timestamp;
        var Buffer = buffer.Buffer;
        var buf = new Buffer(data);
        var str = buf.toString("binary");
        var encryptstr =  crypto.createHash("md5WithRSAEncryption").update(str).digest("hex");
        console.log(encryptstr);
        if(encryptstr == sign){
            res.send({"status":true,"message":"恭喜！"});
        }else{
            res.send({"status":false,"message":"很遗憾，秘钥不正确！"});
        }

    } catch (e) {
        console.log("错误：/mugeda：" + e);
    }

});

module.exports = router;
