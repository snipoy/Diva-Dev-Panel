const axios = require('axios');

const sendDiscordWebhook = async (data) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('Discord webhook URL not configured');
    return;
  }

  try {
    await axios.post(webhookUrl, {
      ...data,
      username: 'Diva Status Dashboard',
      avatar_url: 'https://your-logo-url.png' // TODO: Add your logo URL
    });
  } catch (error) {
    console.error('Failed to send Discord webhook:', error.message);
  }
};

const testWebhook = async () => {
  await sendDiscordWebhook({
    content: '🔔 Test webhook from Diva Status Dashboard',
    embeds: [{
      title: 'Webhook Test',
      description: 'This is a test message to verify webhook functionality.',
      color: 0x00ff00,
      timestamp: new Date().toISOString()
    }]
  });
};

module.exports = {
  sendDiscordWebhook,
  testWebhook
}; 