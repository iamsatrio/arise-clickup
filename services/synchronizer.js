const axios = require('axios');
const moment = require('moment');

const config = require('../config');
const asyncFilter = require('../utils/filterAsync');
const mongo = require('./mongo');

const check_in_time_cf_id = "c24a19ff-26c2-4378-a509-a571be202c72"
const check_out_time_cf_id = "65fc19f5-6e46-4bf1-98b5-4b642b4bb3cb"
const working_hours_cf_id = "cebe6d88-8c4d-41fe-a54f-52cda444c861"
const working_time_in_hour_cf_id = "b2dab324-b0d0-4713-abb6-3d8fb3cf2378"
const working_time_in_minute_cf_id = "584eae23-af1d-4093-abb7-1880d06072b0"
const applicant_cf_id = "f4de2801-4b94-4c68-9370-64062e2532fb"
const leave_list_id = "901600057177"
const requested_days_off_cf_id = "9406aada-d74f-406d-b0b5-4e72bb66c94a"
const approved_days_off_cf_id = "7d16a59e-7b55-4ab0-b74e-b419d502cc7f"
const pto_left_cf_id = "88a13479-c474-438f-903b-9de183dab5b7"

axios.defaults.headers.common['Authorization'] = config.clickupToken;
axios.defaults.headers.post['Content-Type'] = 'application/json';


function convertMillisecondsToHumanReadableTime(ms) {

    let seconds = Math.floor(ms/1000);
  
    let minutes = Math.floor(seconds/60);
  
    let hours = Math.floor(minutes/60);
  
    seconds = seconds % 60;
  
    minutes = minutes % 60;
  
    hours = hours < 10 ? "0" + hours : hours;
  
    minutes = minutes < 10 ? "0" + minutes : minutes;
  
    seconds = seconds < 10 ? "0" + seconds : seconds;
  
    return `${hours}:${minutes}:${seconds}`;
}  

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
                "name":`Check In - ${task.creator.username}`,
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
        let duration_seconds = parseInt(moment.duration(moment.unix(task.date_closed).diff(moment.unix(task.date_created))).asSeconds());
        let working_hours = convertMillisecondsToHumanReadableTime(duration_seconds);
        let working_time_in_hour = parseInt(duration_seconds/3600000);
        let working_time_in_minute = parseInt(duration_seconds/60000);

        console.log(`duration seconds : ${duration_seconds}`)
        console.log(`duration jam : ${working_time_in_hour}`)
        console.log(`duration menit : ${working_time_in_minute}`)
        console.log(`konversi : ${working_hours}`)

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

        await axios({
            method: "POST",
            url: `https://api.clickup.com/api/v2/task/${task.id}/field/${working_hours_cf_id}`,
            data: {
                "value": working_hours
            }
        });

        await axios({
            method: "POST",
            url: `https://api.clickup.com/api/v2/task/${task.id}/field/${working_time_in_hour_cf_id}`,
            data: {
                "value": working_time_in_hour
            }
        });

        await axios({
            method: "POST",
            url: `https://api.clickup.com/api/v2/task/${task.id}/field/${working_time_in_minute_cf_id}`,
            data: {
                "value": working_time_in_minute
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
        let due_date = moment.unix(task.due_date) || false;
        let start_date = moment.unix(task.start_date) || false;
        let duration = parseInt(moment.duration(due_date.diff(start_date)).asDays());
        let creator = task.creator.id ? task.creator.id : false;
        let applicant = await asyncFilter(task.custom_fields, async (i) => {
            return i.id == applicant_cf_id;
        });
        console.log(applicant[0].value[0].username)
        console.log(applicant[0].value[0].id)
        
        // Set assignee & change task title
        await axios({
            method: "PUT",
            url: `https://api.clickup.com/api/v2/task/${task.id}`,
            data: {
                "name":`Leave Request - ${applicant[0].value[0].username}`,
                "assignees": {
                    "add": [`${applicant[0].value[0].id}`]
                }
            }
        });

        // Set applicant = creator
        // console.log(creator)
        // await axios({
        //     method: "POST",
        //     url: `https://api.clickup.com/api/v2/task/${task.id}/field/${applicant_cf_id}`,
        //     data: {
        //         "value": {
        //             "add": [creator]
        //         }
        //     }
        // });

        // Set Requested Days Off
        // console.log(duration)
        await axios({
            method: "POST",
            url: `https://api.clickup.com/api/v2/task/${task.id}/field/${requested_days_off_cf_id}`,
            data: {
                "value": (duration/1000)+1
            }
        });

        //Set PTO Left
        let approved_leave = await axios({
            method: "GET",
            url: `https://api.clickup.com/api/v2/list/${leave_list_id}/task?statuses[]=approved&assignees[]=${applicant[0].value[0].id}`,
        });
        approved_leave = approved_leave.data.tasks
        
        console.log(approved_leave)
        console.log("=================")
        
        let pointer = 0
        let pto_left = 12
        while(approved_leave[pointer]){
            let approved_days_off = await asyncFilter(approved_leave[pointer].custom_fields, async (i) => {
                return i.id == approved_days_off_cf_id;
            });

            pto_left = pto_left - parseInt(approved_days_off[0].value)
            console.log("=================")
            console.log(pto_left)
            pointer = pointer + 1
        }

        await axios({
            method: "POST",
            url: `https://api.clickup.com/api/v2/task/${task.id}/field/${pto_left_cf_id}`,
            data: {
                "value": pto_left
            }
        });
        
        return 'OK'
    } catch (error) {
        console.log("====== Start Err ClickUp =====")
        console.log(error)
        console.log("====== End Err ClickUp =====")
    }
}

async function leaveApproval(payload, type) {
    try {
        let task = payload;

        let status = task.status ? task.status : false
        let requested_day_off = await asyncFilter(task.custom_fields, async (i) => {
            return i.id == requested_days_off_cf_id;
        });

        let applicant = await asyncFilter(task.custom_fields, async (i) => {
            return i.id == applicant_cf_id;
        });

        let approved_days_off = task.status ? task.status : false

        console.log(status)
        console.log(applicant[0].value)
        console.log(requested_day_off[0].value)

        if(status.status == 'approved'){
        //Approved Condition
            //Add Comment
            console.log('approved')
            await axios({
                method: "POST",
                url: `https://api.clickup.com/api/v2/task/${task.id}/comment`,
                data: {
                    "comment_text": `${applicant[0].value[0].username}, your leave request is Approved`,
                    "assignee": applicant[0].value[0].id,
                    "notify_all": true
                }
            });
            //Set Approved Day Off
            await axios({
                method: "POST",
                url: `https://api.clickup.com/api/v2/task/${task.id}/field/${approved_days_off_cf_id}`,
                data: {
                    "value": requested_day_off[0].value
                }
            });
        }else if(status.status == 'rejected'){
            //Rejected Condition
            console.log('rejected')
            await axios({
                method: "POST",
                url: `https://api.clickup.com/api/v2/task/${task.id}/comment`,
                data: {
                    "comment_text": `${applicant[0].value[0].username}, your leave request is Rejected`,
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
    leaveApproval
}
