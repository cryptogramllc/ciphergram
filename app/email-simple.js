// Professional Email Function using AWS SES
// Uses only built-in AWS SDK v3 that comes with Lambda

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Initialize SES client
const sesClient = new SESClient({ region: 'us-east-1' });

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
        
        // Create professional email content
        const emailParams = {
            Source: 'info@ciphergram.io', // From address (must be verified in SES)
            Destination: {
                ToAddresses: ['info@ciphergram.io'] // To address
            },
            Message: {
                Subject: {
                    Data: `New Contact Form Submission - ${name}`,
                    Charset: 'UTF-8'
                },
                Body: {
                    Html: {
                        Data: `
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <meta charset="UTF-8">
                                <title>New Contact Form Submission</title>
                                <style>
                                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                    .header { background: #000; color: white; padding: 20px; text-align: center; }
                                    .content { padding: 20px; background: #f9f9f9; }
                                    .field { margin: 15px 0; }
                                    .label { font-weight: bold; color: #000; }
                                    .value { margin-left: 10px; }
                                    .footer { margin-top: 30px; padding: 20px; text-align: center; color: #666; font-size: 12px; }
                                </style>
                            </head>
                            <body>
                                <div class="header">
                                    <h1>📧 New Contact Form Submission</h1>
                                </div>
                                <div class="content">
                                    <h2>Hello Team,</h2>
                                    <p>You have received a new contact form submission from your website.</p>
                                    
                                    <div class="field">
                                        <span class="label">Name:</span>
                                        <span class="value">${name}</span>
                                    </div>
                                    <div class="field">
                                        <span class="label">Email:</span>
                                        <span class="value"><a href="mailto:${email}">${email}</a></span>
                                    </div>
                                    <div class="field">
                                        <span class="label">Message:</span>
                                        <div class="value" style="margin-left: 10px; margin-top: 10px; padding: 15px; background: white; border-left: 4px solid #000;">
                                            ${message.replace(/\n/g, '<br>')}
                                        </div>
                                    </div>
                                    
                                    <p style="margin-top: 30px;">
                                        <strong>Next Steps:</strong><br>
                                        • Review the inquiry<br>
                                        • Respond within 24 hours<br>
                                        • Add to your CRM if applicable
                                    </p>
                                </div>
                                <div class="footer">
                                    <p>This email was sent automatically by your Ciphergram contact form system.</p>
                                    <p>© 2024 Ciphergram. All rights reserved.</p>
                                </div>
                            </body>
                            </html>
                        `,
                        Charset: 'UTF-8'
                    },
                    Text: {
                        Data: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message: ${message}

---
This email was sent automatically by your Ciphergram contact form system.
                        `,
                        Charset: 'UTF-8'
                    }
                }
            }
        };
        
        // Send email via SES
        const command = new SendEmailCommand(emailParams);
        const response = await sesClient.send(command);
        
        console.log('Email sent successfully via SES:', response.MessageId);
        
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
