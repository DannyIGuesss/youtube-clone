import express from 'express';
import {uploadProcessedVideo,
    downloadRawVideo,
    deleteRawVideo,
    deleteProcessedVideo,
    convertVideo,
    setupDirectories} from "./storage"

setupDirectories()

const app = express()
app.use(express.json())

app.post("/process-video", async (req,res) => {
    //get the bucket and fileName from the Cloud Pub/Sub message
    let data;
    try{
        const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
        data= JSON.parse(message);
        if(!data.name) {
            throw new Error('Invalid message payload received')
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send('Bad Request: missing filename.')
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    //download the raw video from cloud storage
    await downloadRawVideo(inputFileName);

    try {
        await convertVideo(inputFileName, outputFileName);
    }catch(err){
        await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
        ]);
        console.log(err);
        return res.status(500).send('Internal Server Error: video processing failed.')
    }

    //upload the processed video to cloud storage
    await uploadProcessedVideo(outputFileName);

    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
        ]);
    return res.status(200).send('Processing finished sucessfully');
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Video processing service listening at http://Localhost:${port}`)
})

