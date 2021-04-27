const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const {
  fetchFilesFromS3,
  fetchFileFromS3,
  createMessage,
  sendMessagesToQueue,
} = require('../utils/aws');

router.get('/', async (req, res) => {
  const data = await fetchFilesFromS3();

  res.render('list', {
    files: data,
  });
});

router.post('/files', async (req, res) => {
  try {
    let files = Object.values(req.body);
    const messages = files.map(createMessage)
    await sendMessagesToQueue(messages)
    res.status(200);
  } catch (error) {
    console.log(error);
  }
  
});

router.post('/content', async (req, res) => {
  const data = await fetchFileFromS3(req.body.fileName);

  res.json({ content: data });
});

module.exports = router;
