const sleep = async (ms) => {
    await Promise((resolve) => setTimeout(resolve, ms))
};

module.exports = sleep;