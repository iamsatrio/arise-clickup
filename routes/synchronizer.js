const express = require('express');
const router = express.Router();
const synchronizer = require('../services/synchronizer');

router.post('/checkIn', async function (req, res, _next) {
    try {
        res.json(await synchronizer.checkIn(req.body.payload, req.query.type));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

router.post('/checkOut', async function (req, res, _next) {
    try {
        res.json(await synchronizer.checkOut(req.body.payload, req.query.type));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

router.post('/leaveRequest', async function (req, res, _next) {
    try {
        res.json(await synchronizer.leaveRequest(req.body.payload, req.query.type));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

router.post('/leaveApproval', async function (req, res, _next) {
    try {
        res.json(await synchronizer.leaveApproval(req.body.payload, req.query.type));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

module.exports = router;
