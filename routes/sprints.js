const express = require('express');
const router = express.Router();
const synchronizer = require('../services/synchronizer');
const sprints = require('../services/sprints')

router.get('/daily', async function (req, res, _next) {
    try {
        res.json(await sprints.daily(req.query.type, req.query.message));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});



module.exports = router;
