const { CronJob } =require('cron');
const  MessageDb=require("../models/ChatHistory")
const OldChat=require("../models/SaveOldChatHistory")
const {Op}=require("sequelize")
const job = new CronJob(
	'* * * * * 6', // cronTime
	function(){
        storeANDdeletOldMessage()
    } ,// onTick
	null, // onComplete
	true, // start
    // false,
	'America/Los_Angeles' // timeZone
);
// job.start() is optional here because of the fourth parameter set to true.


async function storeANDdeletOldMessage(){
    try {
        let today=new Date()
        let fivedaysAgo=new Date(today - 5* 24 * 60 * 60 * 1000)

        const oldChathistory=await MessageDb.findAll({
        where:{
            createdAt:{
                [Op.lt]:fivedaysAgo
            }
        }


        })
console.log(oldChathistory)
// console.log(oldChat)
if(oldChathistory){
            oldChathistory.map(async(record)=>{

                await OldChat.create(
                    {
                        id:record.id,
                        text: record.message,
                        attachment: record.attachment,
                        attachmentType: record.attachmentType,
                        createdAt: record.createdAt,
                        updatedAt: record.updatedAt,
                        userId: record.userId,
                        groupId: record.groupId

                    }
                
                )
                
                await record.destroy()

                
            })
}
        
    } catch (error) {
        console.log("error")
    }
}





module.exports ={
    job
}