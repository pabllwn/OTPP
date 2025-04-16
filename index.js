const express = require('express');
const { Bot, webhookCallback } = require('grammy');
const bodyParser = require('body-parser');

const app = express();
const bot = new Bot("8027706435:AAEzWtCBhIZPSo66BsC2CALd9X9F5LUVLWo");

const CHANNEL_ID = "@LAZARUS_OTP";
const ADMIN_USERNAME = "@CKRACKING_MOROCCO";
const VALID_KEYS = ["TRIYAL-1234", "DEMLO-9999"];
const services = [
  "Netflix", "PayPal", "Bank", "Coinbase", "Spotify", "Cvv", "Pin", "Crypto",
  "Apple Pay", "Amazon", "Microsoft", "Venmo", "Cashapp", "Quadpay", "Bank Of America"
];
const names = [
  "John", "Alice", "Mark", "Sophia", "Leo", "Emma", "Ahmed", "Amine",
  "Ahmed", "Jerry", "Salma", "William", "George", "Periz", "Nouh", "John", "Thomas", "Eric", "Mike"
];
const userSubscriptions = {};

function generateOtp() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

const startMessage = `
🚀 Welcome to Our Otp Bot 🚀

🔐 ➜ /redeem | Redeem your subscription
⏱ ➜ /plan | Check your subscription

📝  Custom Commands  📝
🧾 ➜ /createscript | Create custom scripts
🔏 ➜ /script [scriptid] | View script
🗣 ➜ /customcall | Call with script

📝 Calling Modules
📞 ➜ /call | Capture PayPal, CoinBase...
🏦 ➜ /bank | Capture OTP Bank
💳 ➜ /cvv | Capture CVV
🔢 ➜ /pin | Capture PIN
🍏 ➜ /applepay | Capture OTP Credit Card
🔵 ➜ /coinbase | Capture 2FA Code
💸 ➜ /crypto | Capture Crypto Code
📦 ➜ /amazon | Approval Authentication
💻 ➜ /microsoft | Capture Microsoft Code
🅿️ ➜ /paypal | Capture Paypal Code
🏦 ➜ /venmo | Capture Venmo Code
💵 ➜ /cashapp | Capture Cashapp Code
💳 ➜ /quadpay | Capture quadpay Code
📟 ➜ /carrier | Capture carrier Code
📧 ➜ /email | grab Email code
🕖 ➜ /remind | remind victim

SET CUSTOM VOICE
🗣 ➜ /customvoice | Modify the TTS
❗️ ➜ EXAMPLE: /customvoice number spoof service name sid language

🔰  Purchase LAZARUS OTP  🔰
💎 Extras
⌨️ /recall for re-calling
❓ Use ? in number to spoof random number
`;

bot.command("start", async (ctx) => {
  await ctx.reply(startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 Channel", url: "https://t.me/LAZARUS_OTP" }],
        [{ text: "🛒 Purchase", url: `https://t.me/${ADMIN_USERNAME.replace('@', '')}` }]
      ]
    }
  });
});

bot.command("plan", (ctx) => {
  ctx.reply(`
LAZARUS-O-T-P CALL ☎️ 🌐
With a very good prices:

💵 1 Day : $20
💵 2 Days : $30
💵 1 Week : $55
💵 2 Weeks : $70
💵 1 Month : $100
💵 3 Months : $250
💵 Lifetime : $550

DM ${ADMIN_USERNAME} to get your key 🗝
🤖 BOT: @lazzaruss_bot
✉️ Support: ${ADMIN_USERNAME}
  `);
});

bot.command("redeem", (ctx) => {
  const userId = ctx.from.id;
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length === 0) {
    ctx.reply("🔑 Please send a key like this: `/redeem YOUR_KEY`", { parse_mode: "Markdown" });
    return;
  }

  const key = args[0].trim();
  if (VALID_KEYS.includes(key)) {
    userSubscriptions[userId] = true;
    ctx.reply("✅ Key accepted! Subscription activated.");
  } else {
    ctx.reply(`❌ Invalid key.\nPlease contact ${ADMIN_USERNAME} to purchase a valid one.`);
  }
});

// إرسال رسائل عشوائية للقناة
async function sendRandomMessages() {
  while (true) {
    const service = services[Math.floor(Math.random() * services.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const otp = generateOtp();
    const msg = `🔐 OTP Alert!\n👤 Name: ${name}\n🛠 Service: ${service}\n🔢 OTP: ${otp}`;
    try {
      await bot.api.sendMessage(CHANNEL_ID, msg);
      console.log("✔️ Sent:", msg);
    } catch (e) {
      console.error("❌ Error sending message:", e.message);
    }
    await new Promise(r => setTimeout(r, Math.floor(Math.random() * 600000) + 300000)); // بين 5 و 15 دقيقة
  }
}

// إعداد Webhook لـ Render
app.use(bodyParser.json());
app.use(webhookCallback(bot, "express"));

app.get("/", (req, res) => {
  res.send("Bot is running...");
});

// تشغيل الخادم وبدء المهام
app.listen(3000, async () => {
  console.log("Bot server running on port 3000");
  await bot.api.setWebhook("https://bot-2-splv.onrender.com"); // غيّر الرابط لو عندك دومين ثاني
  sendRandomMessages();
});
