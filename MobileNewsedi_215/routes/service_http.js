/**
 * Created by shangfanfan on 2016/4/8 0008.
 */
var url = require('url');
var http = require('http');
var https = require('https');
var querystring = require('querystring');

// 数据类型解析器
var dataTypeParser = {
    json: function (data) {
        return data ? JSON.parse(data) : {};
    }
};

// 请求类型
var requestType = {
    "GET": function (param) {
        var urlData = url.parse(param.url);
        var queryData = querystring.stringify(param.data);

        var option = {
            hostname: urlData.hostname,
            port: urlData.port,
            path: urlData.path,
            method: param.method,
            headers: {}
        };

        if(param.headers) option.headers = param.headers;

        // 原有的 url 中是否有参数
        if (urlData.search) {
            option.path = option.path + "&" + queryData;
        } else {
            option.path = option.path + "?" + queryData;
        }

        return {
            option: option,
            requestBody: ""
        }
    },
    "POST": function (param) {
        var urlData = url.parse(param.url);
        var queryData = querystring.stringify(param.data);

        var option = {
            hostname: urlData.hostname,
            port: urlData.port,
            path: urlData.path,
            method: param.method,
            headers: {}
        };

        if(param.headers){ option.headers = param.headers; }

        option.headers['Content-Length'] = queryData.length;
        if(!option.headers['Content-Type']) {
            option.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        return {
            option: option,
            requestBody: queryData
        }
    }
};

/*
 {
 url : "",
 data : {},
 method : "GET",
 dataType : "json",
 encoding : "utf-8",
 success : func...,
 error : func...
 }
 */
// 发送Http请求的方法
var request = function (param) {

    param.encoding = param.encoding || "utf-8";
    param.method = param.method ? param.method.toUpperCase() : "GET";

    var requestParam = requestType[param.method](param);

    try {
        var req = http.request(requestParam.option, function (res) {
            var body = "";
            res.setEncoding(param.encoding);

            res.on('data', function (chunk) {
                body += chunk;
            });

            res.on('end', function () {
                var parser = dataTypeParser[param.dataType.toLowerCase()];
                if (parser) {
                    try {
                        body = parser(body);
                    } catch (e) {
                        param.error(e);
                        return;
                    }
                }
                param.success(body);
            });
        });

        req.on('error', function (e) {
            param.error(e);
        });

        // 向请求体中写入数据
        req.write(requestParam.requestBody);

        req.end();
    } catch (e) {
        console.log(e);
        param.error(e);
    }
};

exports.request = request;