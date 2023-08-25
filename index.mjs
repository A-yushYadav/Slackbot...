import Slack from '@slack/bolt';
import dotenv from 'dotenv';
import axios from 'axios';
import express from 'express';

dotenv.config();

const app = new Slack.App({
    signingSecret:process.env.SLACK_SIGNING_SECRET,
    token:process.env.SLACK_BOT_TOKEN,
});


console.log("heya");
const blocks = [
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "You can search for :"
        }
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Weather"
                },
                "style": "primary",
                "value": "click_me_123"
            },
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Jokes"
                },
                "style": "primary",
                "value": "click_me_123"
            },
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Time"
                },
                 "style": "primary",
                 "value": "time_button", // Add an action ID
                 "action_id": "time_button" // Add an action ID
            }
        ]
    }
]

// Listen for the button click event
app.action('time_button', async ({ ack, body, context }) => {
    console.log('Time button clicked'); // Add this log
    await ack(); // Acknowledge the action request

    // Make a request to the WorldTime API to get the current time
    try {
        const response = await axios.get('http://worldtimeapi.org/api/ip');
        const currentTime = response.data.datetime;
        console.log('Current time:', currentTime); // Add this log
       
        // Send a new message with the current time
        await app.client.chat.postMessage({
            token: context.botToken,
            channel: body.channel.id,
            text: `The current time is: ${currentTime}`,
        });
    } catch (error) {
        console.error('Error fetching time:', error);
    }
});

await app.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_CHANNEL,
    text:"Hello how can I help you ? ",
    blocks,

});
