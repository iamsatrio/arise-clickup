const express = require('express');
const router = express.Router();
const notification = require('../services/notifications');

router.post('/deployment', async function (req, res, _next) {
    try {
        res.json(await notification.gChatDeployment(req.query));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

module.exports = router;
