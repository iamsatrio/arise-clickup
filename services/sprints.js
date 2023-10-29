const config = require('../config');
const axios = require('axios');
const moment = require('moment')

const daily = async (type, message) => {
    switch (type) {
        case "varian":
            url = config.webhook.gchatVarian
            break;
        case "snbn":
            url = config.webhook.gchatSnbn
            break;
        case "jasa":
            url = config.webhook.gchatJasa
            break;
        default:
            url = false
            break;
    }
    if (!url) return 'NOT OK'

    let text = `${encodeURI(message)} ${moment().format('DD-MM-YYYY')} @all`
    axios({
        method: "POST",
        url: url,
        data: {
            text: text
        }
    });

    return 'OK'
};

module.exports = {
    daily
}
