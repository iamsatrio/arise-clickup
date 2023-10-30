const axios = require('axios');
const moment = require('moment');

const config = require('../config');
const asyncFilter = require('../utils/filterAsync');
const mongo = require('./mongo');


const applicant_cf_id = "f4de2801-4b94-4c68-9370-64062e2532fb"
const check_in_time_cf_id = "c24a19ff-26c2-4378-a509-a571be202c72"
const check_out_time_cf_id = "65fc19f5-6e46-4bf1-98b5-4b642b4bb3cb"
const days_off_cf_id = "9406aada-d74f-406d-b0b5-4e72bb66c94a"


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
                "value": {
                    "add": [applicant]
                }
            }
        });

        //Set assignee
        await axios({
            method: "PUT",
            url: `https://api.clickup.com/api/v2/task/${task.id}`,
            data: {
                "assignees": {
                    "add": [applicant]
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

async function checkOut(payload, type) {
    try {
        let task = payload;
        let check_out_time = task.date_closed ? task.date_closed : false;

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

async function leaveRequest(payload, type) {
    try {
        let task = payload;
        let applicant = task.creator.id ? task.creator.id : false;
        let due_date = moment.unix(task.due_date) || false;
        let start_date = moment.unix(task.start_date) || false;
        let duration = parseInt(moment.duration(due_date.diff(start_date)).asDays());

        // Set assignee
        await axios({
            method: "PUT",
            url: `https://api.clickup.com/api/v2/task/${task.id}`,
            data: {
                "assignees": {
                    "add": [8710559]
                }
            }
        });

        // Set applicant
        // console.log(applicant)
        // await axios({
        //     method: "POST",
        //     url: `https://api.clickup.com/api/v2/task/${task.id}/field/${applicant_cf_id}`,
        //     data: {
        //         "value": {
        //             "add": [applicant]
        //         }
        //     }
        // });

        // Set days off
        await axios({
            method: "POST",
            url: `https://api.clickup.com/api/v2/task/${task.id}/field/${days_off_cf_id}`,
            data: {
                "value": duration+1
            }
        });

        return 'OK'
    } catch (error) {
        console.log("====== Start Err ClickUp =====")
        console.log(error)
        console.log("====== End Err ClickUp =====")
    }
}

async function addComment(payload, type) {
    try {
        let task = payload;
        let status = task.status
        let applicant = await asyncFilter(task.custom_fields, async (i) => {
            return i.id == applicant_cf_id;
        });

        console.log(status)
        console.log(applicant[0].value)

        // Add comment
        if(status.status == 'approved'){
            console.log('approved')
            await axios({
                method: "POST",
                url: `https://api.clickup.com/api/v2/task/${task.id}/comment`,
                data: {
                    "comment_text": `${applicant[0].value[0].name}, your leave request is Approved`,
                    "assignee": applicant[0].value[0].id,
                    "notify_all": true
                }
            });
        }else if(status.status == 'rejected'){
            console.log('rejected')
            await axios({
                method: "POST",
                url: `https://api.clickup.com/api/v2/task/${task.id}/comment`,
                data: {
                    "comment_text": `${applicant[0].value[0].name}, your leave request is Rejected`,
                    "assignee": applicant[0].value[0].id,
                    "notify_all": true
                }
            });
        }

        return 'OK'
    } catch (error) {
        console.log("====== Start Err ClickUp =====")
        console.log(error)
        console.log("====== End Err ClickUp =====")
    }
}



module.exports = {
    checkIn,
    checkOut,
    leaveRequest,
    addComment
}
