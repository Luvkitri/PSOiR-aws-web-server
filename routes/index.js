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
  const files = await fetchFilesFromS3();

  res.render('list', {
    files: files,
  });
});

router.post('/files', async (req, res) => {
  try {
    let files = req.body.selectedInputs;
    const messages = files.map(createMessage);
    const results = await sendMessagesToQueue(messages);

    res.json({
      numOfMessagesSent: results.length,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/content', async (req, res) => {
  const data = await fetchFileFromS3(req.body.fileName);

  res.json({ content: data });
});

module.exports = router;
