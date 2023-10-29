const axios = require('axios');
const { IncomingWebhook } = require('@slack/webhook');
const config = require('../config/config')

const slackNotify = async (channel, data) => {
    let icon = (data.status.status == 'complete') ? 'tada' : 'bell';
    let text = `:${icon}: <${data.url}|*#${data.id}*> status changed to \`${data.status.status.toUpperCase()}\` \n>- Subject: ${data.name} \n>- Status: ${data.status.status.toUpperCase()} \n>- Date: ${moment().format('YYYY-DD-MM')} \n>- ClickUp: ${data.url}`
    let message = {
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": text
                }
            }
        ]
    }
    let webhook_slack;
    if (channel == 'migration') {
        webhook_slack = new IncomingWebhook(config.webhook.slack_migration);
    }
    // lainnya di set as defect
    else if (channel == 'defect') {
        webhook_slack = new IncomingWebhook(config.webhook.slack_defect);
    }
    if (webhook_slack == '') return false;
    return webhook_slack.send(message);
};

const gChatNotify = async (channel, data) => {
    let text = `:${icon}: <${data.url}|*#${data.id}*> status changed to \`${data.status.status.toUpperCase()}\` \n>- Subject: ${data.name} \n>- Status: ${data.status.status.toUpperCase()} \n>- Date: ${moment().format('YYYY-DD-MM')} \n>- ClickUp: ${data.url}`
    let webhook_gchat;
    if (channel == 'gchat_deployment') {
        webhook_gchat = config.webhook.gchat_deployment;
    }
    if (webhook_gchat == '') return false;
    return axios({
        method: "POST",
        url: webhook_gchat,
        data: {
            text: text
        }
    });
};

module.exports = {
    slackNotify,
    gChatNotify
};
