/**
 * Created by shangfanfan on 2016/6/12 0012.
 */
var util = require("util");
var service_http = require('./service_http');
var config = require("./config");

// 默认的 server 对象
var _defaultServer = {
    url: "",
    name: null,
    method: "GET",
    dataType: "json",
    demoFilePath: "",
    success: function (data, callback) {
        callback(data);
    },
    error: function (e, callback) {
        console.info(e);
        callback({success: false, results: {error_info: "接口调用失败"}});
    },
    send: function (param) {
        var me = this;
        if (config.is_demo && me.demoFilePath) {
            return new Promise(function (resolve, reject) {
                fs.readFile(me.demoFilePath, function (e, data) {
                    if(e) { me.error(e, reject); }
                    else { me.success(JSON.parse(data), resolve) }
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                service_http.request({
                    url: me.url,
                    data: param,
                    dataType: me.dataType,
                    method: me.method,
                    success: function (data) {
                        me.success(data, resolve);
                    },
                    error: function (e) {
                        me.error(e, reject);
                    }
                });
            });
        }
    }
};

var createServiceFactory = function () {

    // 存放服务的集合
    var services = {};

    var add = function (serv) {
        if(!serv.name){ throw new Error("name attribute is null!"); }
        serv.__proto__ = _defaultServer;
        services[serv.name] = serv;
    };

    // 添加一个服务
    var register = function (service) {
        if(util.isArray(service)){
            for(var i in service){ add(service[i]); }
        } else {
            add(service);
        }
    };

    var remove = function (name) {
        services[name] = null;
    };

    var find = function (name) {
        var service = services[name];
        return service;
    };

    var fetch = function (name, param, callback) {
        var service = find(name);
        if(!service) throw new Error("service: " + name + " not found!");
        service.send(param).then(callback, callback);
    };

    return {
        register: register,
        remove: remove,
        fetch: fetch,
        find: find
    }
};

exports.createServiceFactory = createServiceFactory;

