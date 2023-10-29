const express = require('express');
const router = express.Router();
const renamer = require('../services/renamer');

router.post('/bulk_name_ranking', async function (req, res, _next) {
    try {
        res.json(await renamer.bulkRenameWithRanking(req.body.task_ids));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

router.post('/name_ranking', async function (req, res, _next) {
    try {
        res.json(await renamer.renameWithRanking(req.query.task_id, req.query.task_name, req.query.ranking));
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ 'message': err.message });
    }
});

module.exports = router;
