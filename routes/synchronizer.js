const express = require('express');
const router = express.Router();
const synchronizer = require('../services/synchronizer');

router.post('/task_date', async function (req, res, _next) {
    try {
        res.json(await synchronizer.dateSync(req.body.payload, req.query.type));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

router.post('/ideation', async function (req, res, _next) {
    try {
        res.json(await synchronizer.relationSync(req.body.payload));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

router.post('/counter_feedback_staging', async function (req, res, _next) {
    try {
        res.json(await synchronizer.counterFeedbackStaging(req.body.payload, req.query.type));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

router.post('/counter_feedback_prod', async function (req, res, _next) {
    try {
        res.json(await synchronizer.counterFeedbackProd(req.body.payload, req.query.type));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

router.post('/subtask_sync', async function (req, res, _next) {
    try {
        res.json(await synchronizer.subtaskSync(req.body.payload, req.query.type));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

module.exports = router;
