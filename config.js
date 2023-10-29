require('dotenv').config()
const env = process.env;

const config = {
    debug: env.DEBUG || false,
    env: env.NODE_ENV,
    port: env.PORT,
    listPerPage: env.LIST_PER_PAGE || 10,
    clickupToken: env.CLICKUP_TOKEN,
    webhook: {
        gchatDeployment: env.GCHAT_WEBHOOK_DEPLOYMENT || 'https://chat.googleapis.com/v1/spaces/AAAAzwy2gvw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=d1dyFIhKkcLDHwNGBMyiuW_VzLiUGKK1ZSC4C-9tKlo%3D',
        gchatVarian: env.GCHAT_WEBHOOK_VARIAN || 'https://chat.googleapis.com/v1/spaces/AAAAqznONUc/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=urPZ-jeGVbzBjRqbqTRwVb1PwCf3EhZVVoMfGuPyMoE%3D',
        gchatSnbn: env.GCHAT_WEBHOOK_VARIAN || 'https://chat.googleapis.com/v1/spaces/AAAAjN-pv8A/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=vZmlo7xUQnfteE6UA_ieNOxB5rbFEL8XZ-H-CbOL9IU%3D',
        gchatJasa: env.GCHAT_WEBHOOK_VARIAN || 'https://chat.googleapis.com/v1/spaces/AAAANiTAokI/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=INizPF3L-0DXTPsqf-X7OcZapdiIDjbJZQPrI8RT6AE%3D',
    },
    mongo_user: env.MONGO_USER,
    mongo_pass: env.MONGO_PASS,
    mongo_server: env.MONGO_SERVER,
    mongo_args: env.MONGO_ARGS,
};

module.exports = config;