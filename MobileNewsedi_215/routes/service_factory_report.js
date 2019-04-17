/**
 * Created by shangfanfan on 2016/6/12 0012.
 */

var config = require('./config');
var service_factory = require("./service_factory");


var BASE_URL = config.service_url + "/newsplan/syn.do?";

var factory = service_factory.createServiceFactory();

exports = module.exports = factory;

factory.register(
    [
        {
            name: "uploadLocation",
            url: BASE_URL + "method=uploadLocation"
        },
        {
            name: "getNewsPlanFolders",
            url: BASE_URL + "method=getNewsPlanFolders"
        },
        {
            name: "createClue",
            method: "POST",
            url: BASE_URL + "method=createClue"
        },
        {
            name: "updateClue",
            method: "POST",
            url: BASE_URL + "method=updateClue"
        },
        {
            name: "clueView",
            url: BASE_URL + "method=clueView"
        },
        {
            name: "deleteClue",
            url: BASE_URL + "method=deleteClue"
        },
        {
            name: "uploadImgFile",
            method: "POST",
            url: BASE_URL + "method=uploadImgFile"
        },
        {
            name: "uploadVideoFile",
            method: "POST",
            url: BASE_URL + "method=uploadVideoFile"
        },
        {
            name: "currentClue",
            url: BASE_URL + "method=currentClue"
        },
        {
            name: "createTask",
            method: "POST",
            url: BASE_URL + "method=createTask"
        },
        {
            name: "viewTask",
            url: BASE_URL + "method=viewTask"
        },
        {
            name: "updateTask",
            method: "POST",
            url: BASE_URL + "method=updateTask"
        },
        {
            name: "getMyTask",
            url: BASE_URL + "method=getMyTask"
        },
        {
            name: "getRealtedDoc",
            url: BASE_URL + "method=getRealtedDoc"
        },
        {
            name: "viewArticle",
            url: BASE_URL + "method=viewArticle"
        },
        {
            name: "getTaskPersons",
            url: BASE_URL + "method=getTaskPersons"
        },
        {
            name: "createTopic",
            method: "POST",
            url: BASE_URL + "method=createTopic"
        },
        {
            name: "deleteArticle",
            url: BASE_URL + "method=deleteArticle"
        },
        {
            name: "updateTopic",
            method: "POST",
            url: BASE_URL + "method=updateTopic"
        },
        {
            name: "viewTopic",
            url: BASE_URL + "method=viewTopic"
        },
        {
            name: "getNewsPlanDocuments",
            url: BASE_URL + "method=getNewsPlanDocuments"
        },
        {
            name: "getQuality",
            url: BASE_URL + "method=getQuality"
        },
        {
            name: "getSource",
            url: BASE_URL + "method=getSource"
        },
        {
            name: "getStatus",
            url: BASE_URL + "method=getStatus"
        },
        {
            name: "saveMyLeaveMessage",
            method: "POST",
            url: config.service_url + "/newMobile/syn.do?" + "method=saveMyLeaveMessage"
        },
        {
            name: "createBaoti",
            method: "POST",
            url: BASE_URL + "method=createBaoti"
        },
        {
            name: "viewBaoti",
            url: BASE_URL + "method=viewBaoti"
        },
        {
            name: "getRemarks",
            url: BASE_URL + "method=getRemarks"
        },
        {
            name: "updateBaoti",
            method: "POST",
            url: BASE_URL + "method=updateBaoti"
        },
        {
            name: "commitBaoti",
            url: BASE_URL + "method=commitBaoti"
        },
        {
            name: "getUserBaoti",
            url: BASE_URL + "method=getUserBaoti"
        },
        {
            name: "getUserTask",
            url: BASE_URL + "method=getUserTask"
        },
        {
            name: "getConnect",
            url: BASE_URL + "method=getConnect"
        },
        {
            name: "creationConnect",
            url: BASE_URL + "method=creationConnect"
        },
        {
            name: "updateConnect",
            url: BASE_URL + "method=updateConnect"
        },
        {
            name: "adoptConnect",
            url: BASE_URL + "method=adoptConnect"
        },
        {
            name: "getFlowRecords",
            url: BASE_URL + "method=getFlowRecords"
        },
        {
            name: "getNoticeCatalog",
            url: BASE_URL + "method=getNoticeCatalog"
        },
        {
            name: "noticeCatalog",
            url: BASE_URL + "method=noticeCatalog"
        },
        {
            name: "messageCatalog",
            url: BASE_URL + "method=messageCatalog"
        }
    ]
);