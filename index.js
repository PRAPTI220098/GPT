const { Telegraf } = require('telegraf');
const instaloader = require('instaloader');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
const TOKEN = '6690645199:AAE61K6_mxQvoGnvpCCo_Dc2q3iD2piF2n4';
const bot = new Telegraf(TOKEN);
const L = new instaloader.Instaloader();

// Set a custom name for your bot
const BOT_NAME = "Insta Acc Info Bot";

bot.start((ctx) => {
    const buttons = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '👨‍💻 Developer', url: 'https://t.me/S4NCHIT' },
                { text: '📣 Channel', url: 'https://t.me/+Q5RcaQe268lmYmI9' }],
            ],
        },
    };

    ctx.reply(
        `🎉 Welcome to ${BOT_NAME} 🎉\n\n` +
        `👋 Hi ${ctx.message.from.first_name}!\n\n` +
        `😊 I am here to provide you with Instagram profile information.\n\n` +
        `🔍 Just send me an Instagram username or profile URL, and I will fetch the details for you.\n\n` +
        `📝 You can also use /start command at any time to see this message again.\n\n` +
        `🤖 Let me know how I can assist you! Have a great day! 😃`,
        buttons
    );
});

function extractUsernameFromUrl(url) {
    // Extract the username from the profile URL using regex
    const pattern = /https:\/\/instagram\.com\/([^?]+)/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}

bot.on('text', (ctx) => {
    const text = ctx.message.text.trim().replace(/^@/, ''); // Remove "@" symbol if present

    // Check if --login option provided
    if (text.startsWith("/start --login")) {
        L.interactive_login("your_instagram_username"); // Replace "your_instagram_username" with your Instagram username
    }

    // Send "Wait a second..." message
    ctx.reply("⏰ Wait A Second...");

    // Check if the input is a profile URL
    const username = extractUsernameFromUrl(text) || text;

    instaloader.Profile.fromUsername(L.context, username)
        .then((profile) => {
            // Get the Instagram account details
            const accountName = profile.full_name;
            const username = profile.username;
            const userId = profile.userid;
            const followers = profile.followers;
            const following = profile.followees;
            const numPosts = profile.mediacount;
            const profileUrl = `https://www.instagram.com/${username}/`;
            const isPrivate = profile.is_private;

            const response = (
                `📋 »»»𝐀𝐜𝐜𝐨𝐮𝐧𝐭 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧««« 📋\n\n` +
                `🤴🏻 Name: ${accountName}\n\n` +
                `🚨 Username: @${username}\n\n` +
                `🆔 User ID: ${userId}\n\n` +
                `👥 Followers: ${followers}\n\n` +
                `👥 Following: ${following}\n\n` +
                `📷 Number of Posts: ${numPosts}\n\n` +
                `🔒 Account Type: ${isPrivate ? 'Private' : 'Public'}\n\n` +
                `🔗 Profile URL: ${profileUrl}\n\n` +
                `👨🏻‍💻 Developer: @S4NCHIT`
            );

            ctx.reply(response);
        })
        .catch((error) => {
            if (error instanceof instaloader.exceptions.ProfileNotExistsException) {
                ctx.reply("🧐 Instagram Account Not Found.");
            } else {
                console.error("❌ Error Occurred: ", error);
                ctx.reply("❌ Error Occurred While Fetching Instagram Profile Details.");
            }
        });
});

bot.launch();
