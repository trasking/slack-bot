'use strict'

const https = require('https');
const uri = require('url');
const aws = require('aws-sdk');

module.exports.publishSNS = (message, topic, callback) => {
  const sns = new aws.SNS();
  let params = {
    Message: JSON.stringify(message),
    TopicArn: topic
  };
  sns.publish(params, callback);
};
