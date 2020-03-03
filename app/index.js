const AWS = require("aws-sdk");

exports.email = async function (event, context) {
    const {
        name,
        email,
        message
    } = event;
    // Load the AWS SDK for Node.js
    var AWS = require('aws-sdk');
    // Set region
    AWS.config.update({ region: 'us-east-1' });

    // Create publish parameters
    var params = {
        Message: `New Message from ${name} <${email}>: 
            "${message}"`, /* required */
        TopicArn: 'arn:aws:sns:us-east-1:514188170070:Contact-Us'
    };

    console.log(params.Message);
    // Create promise and SNS service object
    const response = await new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    console.log(response);
    if (!response.error) {
        return {
            statusCode: 200,
            body: { status: 'OK', messageId: response.MessageId },
        }
    }

};