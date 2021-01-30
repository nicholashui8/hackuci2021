const express = require('express');
const { Storage } = require('@google-cloud/storage');
const admin = require("firebase-admin");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const credentials = require('./visionKey.json')
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const serviceAccount = require("./storageCred.json");
require('dotenv').config()

const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(fileUpload({ createParentPath: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(5000, () => console.log("Listening on 5000 :)"));


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://login-11a43.appspot.com"
});

let bucket = admin.storage().bucket();

const user = {
    email: "",
}
// bucket.getFiles({ prefix: 'user99@gmail.com/item1/' })
//     .then(data => console.log(data))
//     .catch(err => console.log(err))

const uploadFile = async (audioFilePath, imageFilePath) => {
    let audioFileName = audioFilePath
    let imageFileName = imageFilePath.substring(10);

    let currentNumberOfItems = await getCurrentNumberOfItems()

    currentNumberOfItems += 1

    //upload audio file to storage
    await bucket.upload(audioFilePath, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        destination: `${user.email}/item${currentNumberOfItems}/` + audioFileName,
        //destination: 'test@gmail.com/item2/audioFileName'
        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
    });
    //upload image to storage
    await bucket.upload(imageFilePath, {
        // Support for HTTP requests made with `Accept-Encoding: gzip`
        gzip: true,
        destination: `${user.email}/item${currentNumberOfItems}/` + imageFileName,

        metadata: {
            // Enable long-lived HTTP caching headers
            // Use only if the contents of the file will never change
            // (If the contents will change, use cacheControl: 'no-cache')
            cacheControl: 'public, max-age=31536000',
        },
    });
    console.log("uploaded audio and image file")
}

const getCurrentNumberOfItems = async () => {
    let data = await bucket.getFiles({ prefix: `${user.email}/` })
    return data[0].length / 2
}

// const getCurrentNumberOfItems = async () => {
//     let data = await bucket.getFiles({ prefix: "testing2@gmail.com" })
//     console.log(data[0].length)
// }


const client = new textToSpeech.TextToSpeechClient({ credentials });

app.post('/confirmLogin', (req, res) => {
    user.email = req.body.email;
    console.log(user.email + " has logged in");
    res.end();
});


app.get('/getNumOfFolders', async (req, res) => {
    let data = await bucket.getFiles({ prefix: `${user.email}/` })
    numberOfFiles = data[0].length / 2
    res.send({
        numberOfFiles: numberOfFiles,
    })
});


app.post('/api', async (req, res) => {
    console.log("post request recieved");
    console.log(req.files)
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.image;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //call google vision api
            let data = await imageToText(avatar.name);

            let text = data[0].description;
            console.log(text);

            await textToVoice(text);
            //sending data back to frontend

            console.log("upload audio start");
            uploadFile("output.mp3", "./uploads/" + avatar.name);
            console.log("upload audio end");
            res.send({
                status: true,
                message: 'File is uploaded',
                data: data[0],
            });
        }
    } catch (err) {
        console.log("Error Happened")
        res.status(500).send(err);
    }
});

//google vision AI
async function imageToText(file) {
    // Imports the Google Cloud client library
    const vision = require('@google-cloud/vision');
    // Creates a client
    const client = new vision.ImageAnnotatorClient({ credentials });

    const fileName = './uploads/' + file;

    // Performs text detection on the local file
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;
    console.log('Text:');
    //detections.forEach(text => console.log(text));
    return detections
}


async function textToVoice(text) {

    console.log("text to voice function called")

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    const file = await writeFile('output.mp3', response.audioContent, 'binary');
    console.log(file)
    console.log('Audio content written to file: output.mp3');
}
