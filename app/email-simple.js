// Simple Email Function - No External Dependencies
// Uses only built-in AWS SDK v3 that comes with Lambda

const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

// Initialize SNS client
const snsClient = new SNSClient({ region: 'us-east-1' });

exports.handler = async (event, context) => {
    // Handle CORS preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Max-Age': '86400'
            },
            body: ''
        };
    }
    
    try {
        // Parse the event body if it's a string
        let body = event;
        if (typeof event.body === 'string') {
            body = JSON.parse(event.body);
        }
        
        const { name, email, message } = body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    error: 'Missing required fields: name, email, message' 
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                }
            };
        }
        
        // Create SNS publish parameters
        const params = {
            Message: `New Contact Form Submission from ${name} <${email}>: ${message}`,
            TopicArn: 'arn:aws:sns:us-east-1:514188170070:Contact-Us'
        };
        
        // Publish to SNS
        const command = new PublishCommand(params);
        const response = await snsClient.send(command);
        
        console.log('SNS Message published successfully:', response.MessageId);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                status: 'OK', 
                messageId: response.MessageId,
                response: 'success'
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        };
        
    } catch (error) {
        console.error('Email submission error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            }
        };
    }
};
