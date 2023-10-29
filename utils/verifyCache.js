const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 15 });

const verifyCache = (req, res, next) => {
    try {
        const { id } = req.params;
        if (cache.has(id)) {
            return res.status(200).json(cache.get(id));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = verifyCache;