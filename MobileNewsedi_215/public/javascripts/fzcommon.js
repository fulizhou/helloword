/**
 * Created by zhouzhiyang on 15/5/29.
 */

//获取页面当前滚动条位置
function getScroll()
{
    var t, l, w, h;

    if (document.documentElement &&
        document.documentElement.scrollTop)
    {
        t = document.documentElement.scrollTop;
        l = document.documentElement.scrollLeft;
        w = document.documentElement.scrollWidth;
        h = document.documentElement.scrollHeight;
    } else if (document.body)
    {
        t = document.body.scrollTop;
        l = document.body.scrollLeft;
        w = document.body.scrollWidth;
        h = document.body.scrollHeight;
    }
    return { scrollTop: t, scrollLeft: l, scrollWidth: w, scrollHeight: h };
};

function localStorageSetItem(name, json_obj){

    if(window.localStorage){
        var user = window.localStorage.getItem('login_name');
        var key_name = user+ '_' + name;
        window.localStorage.setItem(key_name, json_obj);
    }
};

function localStorageGetItem(name){

    if(window.localStorage){
        var user = window.localStorage.getItem('login_name');
        var key_name = user+ '_' + name;
        return window.localStorage.getItem(key_name);
    }
    else
        return null;
};

function localStorageRemoveItem(name){

    if(window.localStorage){
        var user = window.localStorage.getItem('login_name');
        var key_name = user+ '_' + name;
        return window.localStorage.removeItem(key_name);
    }
    else
        return null;
};

function removeHistoryPage(){

    localStorageRemoveItem('history_json');
};

function saveHistoryPage(data){

    localStorageSetItem('history_json', data);
};

function getHistoryPage(){

    return localStorageGetItem('history_json');
}

//稿源中心
function removeSourceHistoryPage(){

    localStorageRemoveItem('source_history_json');
};

function saveSourceHistoryPage(data){

    localStorageSetItem('source_history_json', data);
};

function savePasshandHistoryPage(data){

    localStorageSetItem('passhand_history_json', data);
};

function saveExtpubHistoryPage(data){

    localStorageSetItem('extpub_history_json', data);
};

function getSourceHistoryPage(){

    return localStorageGetItem('source_history_json');
}

function getPasshandHistoryPage(){

    return localStorageGetItem('passhand_history_json');
}

function getExtpubHistoryPage(){

    return localStorageGetItem('extpub_history_json');
}

//部门
function removeDeptHistoryPage(){

    localStorageRemoveItem('dept_history_json');
};

function removeNoticeHistoryPage(){

    localStorageRemoveItem('notice_history_json');
};

function removeMessageHistoryPage(){

    localStorageRemoveItem('message_history_json');
};

function removePasshandHistoryPage(){

    localStorageRemoveItem('passhand_history_json');
};

function removeExtpubHistoryPage(){

    localStorageRemoveItem('extpub_history_json');
};
function saveDeptHistoryPage(data){

    localStorageSetItem('dept_history_json', data);
};
function saveNoticeHistoryPage(data){

    localStorageSetItem('notice_history_json', data);
};
function saveMessageHistoryPage(data){

    localStorageSetItem('message_history_json', data);
};

function getDeptHistoryPage(){

    return localStorageGetItem('dept_history_json');
}

//新华社
function removeXhsHistoryPage(){

    localStorageRemoveItem('xhs_history_json');
};

function saveXhsHistoryPage(data){

    localStorageSetItem('xhs_history_json', data);
};

function getXhsHistoryPage(){

    return localStorageGetItem('xhs_history_json');
}

//新华社
function removeXhsHistoryPage(){

    localStorageRemoveItem('xhs_history_json');
};

function saveXhsHistoryPage(data){

    localStorageSetItem('xhs_history_json', data);
};

function getXhsHistoryPage(){

    return localStorageGetItem('xhs_history_json');
}
//网站
function removeSiteHistoryPage(){

    localStorageRemoveItem('site_history_json');
};

//翔宇V5
function removeXYV5HistoryPage(){

    localStorageRemoveItem('xyv5_history_json');
};
function saveXYV5HistoryPage(data){

    localStorageSetItem('xyv5_history_json', data);
};
function saveSiteHistoryPage(data){

    localStorageSetItem('site_history_json', data);
};

function getSiteHistoryPage(){

    return localStorageGetItem('site_history_json');
}
//APP
function removeAppHistoryPage(){

    localStorageRemoveItem('app_history_json');
};

function saveAppHistoryPage(data){

    localStorageSetItem('app_history_json', data);
};

function getAppHistoryPage(){

    return localStorageGetItem('app_history_json');
}
//微博
function removeWeiboHistoryPage(){

    localStorageRemoveItem('weibo_history_json');
};

function saveWeiboHistoryPage(data){

    localStorageSetItem('weibo_history_json', data);
};

function getWeiboHistoryPage(){

    return localStorageGetItem('weibo_history_json');
}