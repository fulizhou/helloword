/**
 * 浏览器端通用的 JS
 * Created by shangfanfan on 2016/3/22 0022.
 */
// 需要 BASE64.decoder 方法
// 地图经纬度转换
function load_script(xyUrl, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = xyUrl;
    // 借鉴了jQuery的script跨域方法
    script.onload = script.onreadystatechange = function() {
        if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
            callback && callback();
            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            if (head && script.parentNode) {
                head.removeChild(script);
            }
        }
    };
    // Use insertBefore instead of appendChild to circumvent an IE6 bug.
    head.insertBefore(script, head.firstChild);
}
function translate(x, y, callback) {
    var callbackName = 'cbk_' + Math.round(Math.random() * 10000); // 随机函数名
    var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=0&to=4&x=" + x + "&y=" + y
        + "&callback=" + callbackName;
    // 动态创建script标签
    load_script(xyUrl);
    window[callbackName] = function(result) {
        delete window[callbackName]; // 调用完需要删除改函数
        var x = $.map(BASE64.decoder(result.x), function(v){ return String.fromCharCode(v)}).join("");
        var y = $.map(BASE64.decoder(result.y), function(v){ return String.fromCharCode(v)}).join("");
        callback && callback(x, y);
    }
}

//返回
function back(){
    history.go(-1);
}

// 刷新
function refresh(){
    location.reload();
}

function getErrorMsg (error){
    var msg = "";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            msg = "定位失败,用户拒绝请求地理定位";
            break;
        case error.POSITION_UNAVAILABLE:
            msg = "定位失败,位置信息是不可用";
            break;
        case error.TIMEOUT:
            msg = "定位失败,请求获取用户位置超时";
            break;
        case error.UNKNOWN_ERROR:
            msg = "定位失败,定位系统失效";
            break;
    }
    return msg;
}

function getPosition (position, success, error){

    //baidu
    var url = "http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location="+latlon+"&output=json&pois=0";
    var latlon = position.coords.latitude+','+position.coords.longitude;
    $.ajax({
        type: "GET",
        dataType: "jsonp",
        url: url,
        success: function (json) {
            if(json.status==0){
                success(json.result.formatted_address);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            error(latlon+"地址位置获取失败");
        }
    });
}

// 获取地理位置
function getLocation(argument){
    argument = $.extend({
        showPosition:function(x, y){
            getPosition({ x: x, y: y }, argument.success, argument.error);
        },
        before: $.noop,
        success: $.noop,
        error : $.noop,
        option : {}
    }, argument);

    var showError = function (error){
        argument.error(getErrorMsg(error));
    };

    var successCallback = function (position) {
        // 将google地图中的经纬度转化为百度地图的经纬度
        translate(position.coords.longitude, position.coords.latitude, function (x, y) {
            argument.showPosition(x, y);
        });
    };
    if (navigator.geolocation){
        argument.before();
        try {
            navigator.geolocation.getCurrentPosition(successCallback, showError);
        } catch (e) {
            argument.error(null,"浏览器不支持地理定位");
        }
    }else{
        argument.error(null,"浏览器不支持地理定位");
    }
}

// 弹出错误提示
function fn_show_tips(tip, callback) {
    var $doc = $('<div></div>', {"class": "am-alert am-alert-warning auto-fixed"});
    $("<div></div>", {text: tip, style: "padding:0%"}).appendTo($doc);
    if(tip){ $("body").prepend($doc); }
    if($(document).scrollTop() > ($("header").height() || 50)){ $doc.addClass("fixed"); }
    setTimeout(function () { $doc.remove(); callback && callback(); }, 3000);
}

// 弹出错误提示
function fn_show_tips_fast(tip, callback) {
    var $doc = $('<div></div>', {"class": "am-alert am-alert-warning auto-fixed"});
    $("<div></div>", {text: tip, style: "padding:0%"}).appendTo($doc);
    if(tip){ $("body").prepend($doc); }
    if($(document).scrollTop() > ($("header").height() || 50)){ $doc.addClass("fixed"); }
    setTimeout(function () { $doc.remove(); callback && callback(); }, 1000);
}

$(function () {
    var $document = $(document);
    var header_height = $("header").height() || 50;
    $document.scroll( function (e) {
        if($document.scrollTop() > header_height){
            $(".auto-fixed").addClass("fixed");
        }else{
            $(".auto-fixed").removeClass("fixed");
        }
    });
});

if ($ && $.AMUI) {
    // 发送 ajax 请求时自动显示加载效果
    $(document).unbind("ajaxSend.amui").bind("ajaxSend.amui", function (evt, request, settings) {
        // 因 jsonp 类型无法触发 ajaxComplete 事件
        if(request) {
            $.AMUI.progress.start();
            $.AMUI.progress.set(0.6);
        }
    }).unbind("ajaxComplete.amui").bind("ajaxComplete.amui", function (event, res, xhr) {
        $.AMUI.progress.done();
    });
}
if($){
    // 返回错误消息的统一处理事件
    $(document).unbind("ajaxSuccess.amui").bind("ajaxSuccess.amui", function (evt, request, settings) {
        var data = request.responseJSON;
        if(data.success === false && data.results && data.results.error_info && data.results.error_info.indexOf("版面内有图片更新")<0){
            fn_show_tips(data.results.error_info, function () {
                if (data.getToken === false) { location.href = "/loginThree"; }
            });
        }
    });

    // ajax 全局设置, 不缓存 ajax 结果
    $.ajaxSetup({ cache: false });
}

// 重写 history.go, history.back 方法
(function (window) {
    // 忽略 iframe
    if(window.top !== window){ return; }

    // history 记录的记录器
    var historyRecordStorage = (function () {
        var HISTORY_RECORD = "historyRecord";
        return function (localStorage) {
            this.get = function () {
                var historyQueue = localStorage.getItem(HISTORY_RECORD);
                return historyQueue ? JSON.parse(historyQueue) : [];
            };
            this.set = function () {
                localStorage.setItem(HISTORY_RECORD, JSON.stringify(historyRecord));
            };
        };
    })();

    var _go = window.history.go;
    var _back = window.history.back;

    var local_url = {
        pathname: window.location.pathname,
        search: window.location.search
    };

    var storage = new historyRecordStorage(window.localStorage);
    var historyRecord = storage.get();

    // 解决刷新时重复记录的问题
    var before_url = historyRecord[historyRecord.length - 1];
    if(before_url && before_url.pathname == local_url.pathname){
        historyRecord.pop();
    }
    historyRecord.push(local_url);

    storage.set(historyRecord);

    var $go = function (i, src) {
        if(i < 0){
            historyRecord = historyRecord.slice(0, i);
            storage.set(historyRecord);
            if(historyRecord.length > -i){
                var url = historyRecord[historyRecord.length - 1];
                window.location.href = url.pathname + url.search;
                return ;
            }
        }
        // 调用原有的方法
        return src && src();
    };

    // 重写 go 方法
    window.history.go = function (i) {
        var args = arguments;
        return $go(i, function () {
            return _go.apply(window.history, args);
        });
    };

    // 重写 back 方法
    window.history.back = function () {
        var args = arguments;
        return $go(-1, function () {
            return _back.apply(window.history, args);
        });
    };

})(window);

//
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
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};
