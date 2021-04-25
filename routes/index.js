const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

const { fetchFilesFromS3, fetchFileFromS3 } = require('../utils/aws');

router.get('/', async (req, res) => {
  const data = await fetchFilesFromS3();

  res.render('list', {
    files: data,
  });
});

router.post('/files', async (req, res) => {
  console.log(req.body);
});

router.post('/content', async (req, res) => {
  const data = await fetchFileFromS3(req.body.fileName);

  res.json({ content: data });
});

module.exports = router;
