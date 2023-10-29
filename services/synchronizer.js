const axios = require('axios');
const moment = require('moment');

const config = require('../config');
const asyncFilter = require('../utils/filterAsync');
const mongo = require('./mongo');


const applicant_cf_id = "f4de2801-4b94-4c68-9370-64062e2532fb"
const check_in_time_cf_id = "c24a19ff-26c2-4378-a509-a571be202c72"
const check_out_time_cf_id = "65fc19f5-6e46-4bf1-98b5-4b642b4bb3cb"

axios.defaults.headers.common['Authorization'] = config.clickupToken;
axios.defaults.headers.post['Content-Type'] = 'application/json';

async function checkIn(payload, type) {
    try {
        let task = payload;
        let check_in_time = task.date_created ? task.date_created : false;
        let applicant = task.creator.id ? task.creator.id : false;
        
        // Set check in time
        console.log(check_in_time);    
        await axios({
            method: "POST",
            url: `https://api.clickup.com/api/v2/task/${task.id}/field/${check_in_time_cf_id}`,
            data: {
                "value": check_in_time,
                "value_options": {
                    "time": true
                    }
            }
        });
        
        // Set applicant
        console.log(applicant);
        await axios({
            method: "POST",
            url: `https://api.clickup.com/api/v2/task/${task.id}/field/${applicant_cf_id}`,
            data: {
                "value": applicant
            }
        });

        return 'OK'
    } catch (error) {
        console.log("====== Start Err ClickUp =====")
        console.log(error)
        console.log("====== End Err ClickUp =====")
    }
}

async function checkOut(payload, type) {
    try {
        let task = payload;
        let check_in_time = task.date_created ? task.date_created : false;
        let check_out_time = task.date_closed ? task.date_closed : false;
        let working_hours = parseInt(moment.duration(check_out_time.diff(check_in_time)).asDays());

        await axios({
            method: "POST",
            url: `https://api.clickup.com/api/v2/task/${task.id}/field/${check_out_time_cf_id}`,
            data: {
                "value": check_out_time,
                "value_options": {
                    "time": true
                    }
            }
        });

        return 'OK'
    } catch (error) {
        console.log("====== Start Err ClickUp =====")
        console.log(error)
        console.log("====== End Err ClickUp =====")
    }
}



module.exports = {
    checkIn,
    checkOut
}
