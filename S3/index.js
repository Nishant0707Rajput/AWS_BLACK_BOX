require('dotenv').config();
const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SEC_KEY
    }
})

async function getObjectURL(key) {
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: key
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 1 * 60 * 60 * 24 });    // only valid for one day
    return url;
}

async function putObject(filename,contentType) {
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET,
        Key: `uploads/user-uploads/${filename}`,
        ContentType:contentType
    });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 1 * 60 * 60 * 24 });    // only valid for one day
    return url;
}

async function listObjects() {
    const command = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        Key:'/'
    });
    const result = await s3Client.send(command);
    console.log(result);
}

async function deleteObjects(key) {
    const command = new DeleteObjectCommand({
        Bucket: process.env.BUCKET,
        Key:key
    });
    const result = await s3Client.send(command);
    return result;
}


// getObjectURL("node.jpg").then((val) => {
//     console.log(">>>>", val);
// }).catch((err) => {
//     console.log(">>>>", err);
// })


// putObject(`image-${Date.now()}.jpeg`,"image/jpeg").then((val)=>{
//     console.log(">>>>>>>",val);
// }).catch(err=>{
//     console.log(">>>>>>>",err);
// });


// listObjects().then(val=>{
//     console.log(val);
// }).catch((err)=>{
//     console.log(err);
// })


// deleteObjects('node.jpg').then((val)=>{
//     console.log(val);
// }).catch((err)=>{
//     console.log(err);
// })