/**
 * Created by shangfanfan on 2016/3/17
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var url = require("url");
var common = require('./common');
var config = require('./config');

// ���Ų߻�
router.get('/news_planning', function (req, res, next) {
    try {
        res.render('news_planning/news_planning', {article_list_count: config.article_list_count});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// ����
router.get('/clue/clue', function (req, res, next) {
    try {
        res.render('news_planning/clue/clue', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// �½�����
router.get('/clue/new_clue', function (req, res, next) {
    try {
        res.render('news_planning/clue/new_clue', {upload_max_size: config.upload_max_size});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// ��������
router.get('/clue/clue_detail', function (req, res, next) {
    try {
        res.render('news_planning/clue/clue_detail', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// ����ɷ�����
router.get('/clue/assign_task', function (req, res, next) {
    try {
        res.render('news_planning/clue/assign_task', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// תΪѡ��
router.get('/clue/transfer_topic', function (req, res, next) {
    try {
        res.render('news_planning/clue/transfer_topic', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// �ɷ�����
router.get('/interview_task/interview_task', function (req, res, next) {
    try {
        res.render('news_planning/interview_task/interview_task', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// �ɷ���������
router.get('/interview_task/interview_task_detail', function (req, res, next) {
    try {
        res.render('news_planning/interview_task/interview_task_detail', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// �½��ɷ�����
router.get('/interview_task/new_interview_task', function (req, res, next) {
    try {
        res.render('news_planning/interview_task/new_interview_task', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// �齨�����Ŷ�
router.get('/interview_task/build_team', function (req, res, next) {
    try {
        res.render('news_planning/interview_task/build_team', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// ͳ������
router.get('/interview_task/statistical_task', function (req, res, next) {
    try {
        res.render('news_planning/interview_task/statistical_task', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// �鿴�켣
router.get('/interview_task/view_track', function (req, res, next) {
    try {
        res.render('news_planning/interview_task/view_track', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// �½�ѡ��
router.get('/topic/new_topic', function (req, res, next) {
    try {
        res.render('news_planning/topic/new_topic', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// ѡ������
router.get('/topic/topic_details', function (req, res, next) {
    try {
        res.render('news_planning/topic/topic_details', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});

// ѡ������
router.get('/topic/build_team', function (req, res, next) {
    try {
        res.render('news_planning/topic/build_team', {});
    } catch (e) {
        console.log("news_planning [ERROR]��" + e);
    }
});


module.exports = router;