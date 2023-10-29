const config = require('../config');
const asyncFilter = require('../utils/filterAsync');
const axios = require('axios');

axios.defaults.headers.common['Authorization'] = config.clickupToken;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const rank_field_id = "501b9b8f-37a9-4e50-bb99-c9b519b28dcd"

async function bulkRenameWithRanking(task_ids) {
    try {
        for (const task_id of task_ids) {
            let task = await axios({
                method: "GET",
                url: `https://api.clickup.com/api/v2/task/${task_id}`
            });
            task = task.data;
            let custom_fields = task.custom_fields;
            let filtered_custom_fields = await asyncFilter(custom_fields, async (i) => {
                return i.id == rank_field_id;
            });

            let ranking = filtered_custom_fields[0].value;
            let new_name = task.name;
            let regex = /[0-9][0-9][0-9]/g;
            if (task.name.substring(0, 3).match(regex)) {
                new_name = task.name.substring(6);
            }
            new_name = `${ranking} - ${new_name}`;

            await axios({
                method: "PUT",
                url: `https://api.clickup.com/api/v2/task/${task.id}`,
                data: {
                    "name": new_name
                }
            });

            return 'OK'
        }
    } catch (error) {
        console.log("====== Start Err ClickUp =====")
        console.log(error)
        console.log("====== End Err ClickUp =====")        
    }
    
}

async function renameWithRanking(task_id, task_name, ranking) {
    let new_name = decodeURI(task_name)
    let regex = /[0-9][0-9][0-9]/g;
    if (new_name.substring(0, 3).match(regex)) {
        new_name = new_name.substring(6)
    }
    try {
        await axios({
            method: "PUT",
            url: `https://api.clickup.com/api/v2/task/${task_id}`,
            data: {
                "name": `${ranking} - ${new_name}`
            }
        })    
    } catch (error) {
        console.log("====== Start Err ClickUp =====")
        console.log(error)
        console.log("====== End Err ClickUp =====")
    }
    return 'OK'
}

module.exports = {
    renameWithRanking,
    bulkRenameWithRanking
}
