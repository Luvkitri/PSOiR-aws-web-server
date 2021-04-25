const AWS = require('aws-sdk');

// AWS
AWS.config.update({
  region: 'us-east-1',
});

AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log('Access key:', AWS.config.credentials.accessKeyId);
  }
});

const fetchFilesFromS3 = async () => {
  // Create S3 service object
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
  });

  // Create the parameters for calling listObjects
  const bucketParams = {
    Bucket: process.env.BUCKET_NAME,
  };

  let data = await s3.listObjectsV2(bucketParams).promise();

  return data.Contents;
};

const sendToQueue = async (files) => {
  // Create SQS service object
  const sqs = new AWS.SQS({
    apiVersion: '2012-11-05',
  });

  // Divide multiple files into batches
  let batches = [];
  let batch = [];
  let count = 0;

  files.forEach((file) => {
    batch.push(file);
    count++;

    if (count == 10) {
      batches.push(batch);
      batch = [];
      count = 0;
    }
  });

  // Send batches to queue
  batches.forEach((batch) => {
    const sqsParams = {
      Entries: batch,
      QueueURL: process.env.SQS_URL,
    };

    sqs.sendMessageBatch(sqsParams, (err, data) => {
      if (err) {
        console.error('Error', err);
      }
      console.log(`Msg send succesfully: ${data}`);
    });
  });
};

const fetchFileFromS3 = async (fileName) => {
  // Create S3 service object
  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
  });

  // Create the parameters for calling listObjects
  const bucketParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
  };

  try {
    const data = await s3.getObject(bucketParams).promise();
    return data.Body.toString('utf-8');
  } catch (error) {
    return 'Failed to retrive object';
  }
};

module.exports = {
  fetchFilesFromS3: fetchFilesFromS3,
  fetchFileFromS3: fetchFileFromS3,
};
