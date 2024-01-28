require('dotenv').config();
const {S3Client, GetObjectCommand} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region:process.env.REGION,
    credentials:{
        accessKeyId:process.env.ACCESS_KEY,
        secretAccessKey:process.env.SEC_KEY
    }
})
async function getObjectURL(key){
    const command = new GetObjectCommand({
        Bucket:process.env.BUCKET,
        Key:key
    });
    const url = await getSignedUrl(s3Client,command,{expiresIn:1*60*60*24});    // only valid for one day
    return url;
}

getObjectURL("Video/example.mp4").then((val)=>{
    console.log(">>>>", val);
}).catch((err)=>{
    console.log(">>>>", err);
})