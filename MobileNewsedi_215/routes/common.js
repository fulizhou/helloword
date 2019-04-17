/**
 * Created by zhouzhiyang on 15/5/1.
 */

var rand_key = "Founder_key";
var crypto = require('crypto');
var url = require('url');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
var fs = require('fs');
var config = require('./config');
var main = require('./main');

///*获取客户端IP*/
//exports.get_client_ip = function get_client_ip(req){
//
//    try{
//        return req.headers['x-forwarded-for'] ||
//            req.connection.remoteAddress ||
//            req.socket.remoteAddress ||
//            req.connection.socket.remoteAddress;
//    }catch (e){
//        return "127.0.0.1";
//    }
//};

/*获取客户端IP*/
exports.get_client_ip = function get_client_ip(req){

    return "127.0.0.1";
};

/*对JSON对象进行AES解密，返回解密后的对象*/
exports.decrypt_obj = function decrypt_obj(crypt_key) {

    try{
        var cry_hex = new Buffer(crypt_key, 'hex');
        var decipher = crypto.createDecipher('aes-256-cbc',rand_key);
        var cry_text = decipher.update(cry_hex,'hex','utf8');
        cry_text += decipher.final('utf8');
        var cry_obj = JSON.parse(cry_text);
        return cry_obj;
    }
    catch(e)
    {
       return null;
    }

};
/*对JSON对象进行AES加密，返回加密后的对象*/
exports.encrypt_obj = function encrypt_obj( cry_obj){

    try{
        var cipher = crypto.createCipher('aes-256-cbc',rand_key);
        var cry_string = JSON.stringify(cry_obj);
        var cry_text = cipher.update(cry_string,'utf8','hex');
        cry_text += cipher.final('hex');
        console.log("ase len:" + cry_text.length);
        return cry_text;
    }
    catch(e){
        return null;
    }
};

/*对登录操作进行加密*/
exports.encrypt_login = function encrypt_login (req, uid) {

    var ip = exports.get_client_ip(req);
    var cry_obj = {"uid":uid, "ip":ip};
    return exports.encrypt_obj(cry_obj);
};
/*对GET请求进行登录验证*/
exports.descrypt_login = function descrypt_login (req, res) {

    try{

        var params = exports.parseCookie(req.headers.cookie);
        var crypt_key = params.user_key;
        var cry_obj = exports.decrypt_obj(crypt_key);
        if(cry_obj == null)
            return false;
        var ip = exports.get_client_ip(req);
        console.log("登录IP:" + ip + ' 请求IP:' + cry_obj.ip)
        if(cry_obj.ip == ip){

            return true;
        }
        else
            return false;
    }
    catch(e){
        console.log(e.message);
        return false;
    }
};

/*对GET请求进行登录验证*/
exports.get_user_id = function get_user_id(req) {

    try{
        var params = exports.parseCookie(req.headers.cookie);
        var crypt_key = params.user_key;
        var cry_obj = exports.decrypt_obj(crypt_key);
        if(cry_obj == null)
            return 0;
        else
            return cry_obj.uid;
    }
    catch(e){
        console.log(e.message);
        return 0;
    }
};

/*对POST请求进行登录验证*/
exports.descrypt_login_post = function encrypt_login_post (req) {

    try{
        var params = exports.parseCookie(req.headers.cookie);
        var crypt_key = params.user_key;
        var cry_obj = exports.decrypt_obj(crypt_key);
        if(cry_obj == null)
            return false;
        var ip = exports.get_client_ip(req);
        console.log("登录IP:" + ip + ' 请求IP:' + cry_obj.ip)
        if(cry_obj.ip == ip)
            return true;
        else
            return false;
    }
    catch(e){
        return false;
    }
};

//GET请求封装
exports.get_http_request_binary = function(urlstring, callback, encoding) {

    encoding = encoding || "binary";
    callback = callback || function() {};
    var urlData = url.parse(urlstring);

    console.log(urlData);
    var options = {
        hostname: urlData.hostname,
        port: urlData.port,
        path: urlData.path,
        method: 'GET'
    };

    var req = http.request(options, function (res) {

        var body = "";
        var type = res.headers["content-type"];
        res.setEncoding(encoding);
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function() {

            var data = {
                success:true,
                body: body
            };
            callback(data);

        });

    });

    req.on('error', function (e) {

        var data = {
            success:false,
            error_info: e.message
        };
        console.log(e.message);
        callback(data);
    });

    req.end();
};

exports.post_http_request = function(urlstring, post_data, callback) {

    callback = callback || function() {};
    var urlData = url.parse(urlstring);
    var content = require('querystring').stringify(post_data);
    var host_name = "";
    if(urlData.host.indexOf(":") > 0 )
    {
        host_name = urlData.host.substring(0, urlData.host.indexOf(":"));
    }else{
        host_name = urlData.host;
    }
    var options = {
        //hostname: urlData.host,
        //hostname: urlData.host.substring(0, urlData.host.indexOf(":")),
        hostname: host_name,
        port: urlData.port,
        path: urlData.path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Content-Length": content.length
        }
    };

    var req = http.request(options, function (res) {

        var body = "";
        var type = res.headers["content-type"];
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function() {

            var data = {
                success:true,
                body: body
            };
            callback(data);

        });
    });

    req.on('error', function (e) {

        var data = {
            success:false,
            error_info: e.message
        };
        callback(data);
    });

    req.write(content);
    req.end();
};

exports.parseCookie = function(str) {
    //var obj = {}  , pairs = str.split(/[;,] */);
    var obj = {}  , pairs = (str || "").split(/[;,] */);
    for (var i = 0, len = pairs.length; i < len; ++i) {
        var pair = pairs[i]
            , eqlIndex = pair.indexOf('=')
            , key = pair.substr(0, eqlIndex).trim().toLowerCase()
            , val = pair.substr(++eqlIndex, pair.length).trim();

        // quoted values
        if ('"' == val[0]) val = val.slice(1, -1);

        // only assign once
        if (typeof obj[key] === 'undefined') {
            val = val.replace(/\+/g, ' ');
            try {
                obj[key] = decodeURIComponent(val);
            } catch (err) {
                if (err instanceof URIError) {
                    obj[key] = val;
                } else {
                    throw err;
                }
            }
        }
    }
    return obj;
};

////GET请求JSON封装
//exports.get_http_request_json = function(urlstring, callback, encoding) {
//
//    encoding = encoding || "utf-8";
//    callback = callback || function() {};
//    var urlData = url.parse(urlstring);
//    var options = {
//        hostname: urlData.hostname,
//        port: urlData.port,
//        path: urlData.path,
//        method: 'GET',
//        headers: {
//            "Content-Type": 'application/json'
//        }
//    };
//
//    var req = http.request(options, function (res) {
//
//        var body = "";
//        var type = res.headers["content-type"];
//        res.setEncoding(encoding);
//        res.on('data', function (chunk) {
//            body += chunk;
//        });
//        res.on('end', function() {
//
//            if(body == ""){
//                var error_info = {error_info: '接口返回数据为空'};
//                var data = {success:false, results:error_info};
//                console.log('接口异常返回数据：' + data.results.error_info);
//                callback(data);
//            }
//            else{
//                var jsonData = eval('(' + body + ')');
//                console.log('接口返回数据：' + body);
//                callback(jsonData);
//            }
//        });
//    });
//
//    req.on('error', function (e) {
//
//        var error_info = {error_info: e.message};
//        var data = {success:false, results:error_info};
//        console.log('接口异常返回数据：' + data.results.error_info);
//        callback(data);
//    });
//
//    req.end();
//};

//GET请求JSON封装
exports.get_http_request_json = function(urlstring, callback, encoding) {

    try{
        encoding = encoding || "utf-8";
        callback = callback || function() {};
        var urlData = url.parse(urlstring);
        var options = {
            hostname: urlData.hostname,
            port: urlData.port,
            path: urlData.path,
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        };

        var req = http.request(options, function (res) {

            var body = "";
            var type = res.headers["content-type"];
            res.setEncoding(encoding);
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function() {
                var data = null;
                if(body == ""){
                    console.log('接口异常返回数据：返回数据为空');
                    data = {success:false, results:{error_info: '接口返回数据为空'}};
                } else {
                    console.log('接口返回数据：' + body);
                    try {
                        data = JSON.parse(body);
                    } catch (e) {
                        data = {success:false, results:{error_info: '接口返回数据解析失败'}};
                        console.info(e);
                    }
                }
                callback(data);
            });
        });

        req.on('error', function (e) {
            var data = {success:false, results:{error_info: e.message}};
            console.log('接口异常返回数据：' + data.results.error_info);
            callback(data);
        });

        req.end();
    } catch (e){
        console.log(e);
    }

};

//GET请求JSON封装
exports.get_http_request_3des_json = function(urlstring, callback, encoding) {

    try{
        encoding = encoding || "utf-8";
        callback = callback || function() {};
        var urlData = url.parse(urlstring);
        var options = {
            hostname: urlData.hostname,
            port: urlData.port,
            path: urlData.path,
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        };

        var req = http.request(options, function (res) {

            var body = "";
            var type = res.headers["content-type"];
            res.setEncoding(encoding);
            res.on('data', function (chunk) {
                console.log(chunk + "chunk");
                //var b = new Buffer(chunk, 'base64')
                //var chunk = b.toString();
                var chunked = decrypt(chunk);
                body += chunked;
            });
            res.on('end', function() {
                var data = null;
                if(body == ""){
                    console.log('接口异常返回数据：返回数据为空');
                    data = {success:false, results:{error_info: '接口返回数据为空'}};
                } else {
                    console.log('接口返回数据：' + body);
                    try {
                        data = JSON.parse(body);
                    } catch (e) {
                        data = {success:false, results:{error_info: '接口返回数据解析失败'}}
                    }
                }
                callback(data);
            });
        });

        req.on('error', function (e) {
            var data = {success:false, results:{error_info: e.message}};
            console.log('接口异常返回数据：' + data.results.error_info);
            callback(data);
        });

        req.end();
    } catch (e){
        console.log(e);
    }

};

////GET请求封装
//exports.get_http_request = function(urlstring, callback, encoding) {
//
//    try{
//
//        https.get(urlstring, function(res) {
//            var body = "";
//            var type = res.headers["content-type"];
//            res.setEncoding(encoding);
//            res.on('data', function (chunk) {
//
//                body += chunk;
//            });
//            res.on('end', function() {
//
//                if(body == ""){
//                    var error_info = {error_info: '接口返回数据为空'};
//                    console.log(results.error_info+"---");
//                    var data = {success:false, results:error_info};
//                    console.log('接口异常返回数据：' + data.results.error_info);
//                    callback(data);
//                }
//                else{
//                    var jsonData = eval('(' + body + ')');
//                    console.log('接口返回数据：' + body);
//                    callback(jsonData);
//                }
//            });
//        });
//
//        req.on('error', function (e) {
//
//            var error_info = {error_info: e.message};
//            var data = {success:false, results:error_info};
//            console.log('接口异常返回数据：' + data.results.error_info);
//            callback(data);
//        });
//    }catch(e){
//        console.log(e);
//    }
//
//};

//GET请求封装
exports.get_http_request = function(urlstring, callback, encoding) {

    try{

        var req = https.get(urlstring, function(res) {
            var body = "";
            var type = res.headers["content-type"];
            res.setEncoding(encoding);
            res.on('data', function (chunk) {

                body += chunk;
            });
            res.on('end', function() {
                var data = null;
                if(body == ""){
                    console.log('接口异常返回数据：返回数据为空');
                    data = {success:false, results:{error_info: '接口返回数据为空'}};
                } else {
                    console.log('接口返回数据：' + body);
                    try {
                        data = JSON.parse(body);
                    } catch (e) {
                        data = {success:false, results:{error_info: '接口返回数据解析失败'}}
                    }
                }
                callback(data);
            });
        });

        req.on('error', function (e) {

            var error_info = {error_info: e.message};
            var data = {success:false, results:error_info};
            callback(data);
        });

        req.end();

    } catch (e){
        console.log(e);
    }

};


//GET请求封装
exports.get_http_request1 = function(urlstring, callback, encoding) {

    try{

        encoding = encoding || "utf-8";
        callback = callback || function() {};
        var urlData = url.parse(urlstring);
        var options = {
            hostname: urlData.hostname,
            port: urlData.port,
            path: urlData.path,
            method: 'GET',
            headers: {
                "Content-Type": 'text/json'
            }
        };

        var req = http.request(options, function(res) {
            var body = "";
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('BODY: ' + chunk);
                body += chunk;
            });
            res.on('end', function() {
                var data = null;
                if(body == ""){
                    console.log('接口异常返回数据：返回数据为空');
                    data = {success:false, results:{error_info: '接口返回数据为空'}};
                } else {
                    console.log('接口返回数据：' + body);
                    try {
                        data = JSON.parse(body);
                    } catch (e) {
                        data = {success:false, results:{error_info: '接口返回数据解析失败'}}
                    }
                }
                callback(data);
            });
        });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            var error_info = {error_info: e.message};
            var data = {success:false, results:error_info};
            console.log('接口异常返回数据：' + data.results.error_info);
            callback(data);
        });
        req.end();
    }catch(e){
        console.log(e);
    }

};

function encrypt(param){
    var key = new Buffer('founder12345founder12345');
    var iv = new Buffer('25687923');
    var alg = 'des-ede3-cbc';
    var autoPad = true;

    var cipher = crypto.createCipheriv(alg, key, iv);
    cipher.setAutoPadding(autoPad);
    var ciph = cipher.update(param, 'utf8', 'hex');
    ciph += cipher.final('hex');
    console.log(ciph + "=qqqqqqqqqqqqq");
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

//普通的get请求
exports.get_http_request_normal = function(urlstring,callback, encoding){
    try {
        encoding = encoding || 'utf-8';
        callback = callback || function() {};
        var urlData = url.parse(urlstring);
        var options = {
            hostname: urlData.hostname,
            port: urlData.port,
            path: urlData.path,
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        };
        var req = http.request(options, function(res) {
            var body = 0;
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            //res.setEncoding(encoding);
            res.on('data', function (chunk) {
                body += chunk.length;
                callback(chunk);
            });
            res.on('end', function() {
                console.log('total_size: ' + Math.round(body/1024)+'k');
                //if(body == ""){
                //    var error_info = {error_info: '接口返回数据为空'};
                //    var data = {success:false, results:error_info};
                //    console.log('接口异常返回数据：' + data.results.error_info);
                //    callback(data);
                //}
                //else{
                    var jsonData = {success:true,result:'end'};
                    console.log('接口返回数据：' + JSON.stringify(jsonData));
                    callback(jsonData);
                //}
            });
        });
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            var error_info = {error_info: e.message};
            var data = {success:false, results:error_info};
            console.log('接口异常返回数据：' + data.results.error_info);
            callback(data);
        });
        req.end();
    }catch (e){
        console.log(e.message);
    }
};