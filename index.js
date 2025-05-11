import express from 'express';
import { Bot, webhookCallback } from 'grammy';
import bodyParser from 'body-parser';

const app = express();
const bot = new Bot("8027706435:AAGyrnAum58yj34CjdbmXanQ2AW5RR95wgc");

const CHANNEL_ID = "@LAZARUS_OTP2";
const ADMIN_USERNAME = "@CKRACKING_MOROCCO";
const ADMIN_ID = 6170890211; // Replace with your Telegram numeric user ID
const VALID_KEYS = ["TRIYAL-1234", "DEMLO-9999"];
const userSubscriptions = {};
const services = ["Netflix", "PayPal", "Bank", "Coinbase", "Spotify", "Cvv", "Pin", "Crypto", "Apple Pay", "Amazon", "Microsoft", "Venmo", "Cashapp", "Quadpay", "Bank Of America"];
const names = ["John", "Alice", "Mark", "Sophia", "Leo", "Emma", "Ahmed", "Salim", "Farid", "Magnan", "Lina", "Adam", "Orion", "Yara", "Amine", "Ahmed", "Jerry", "Salma", "William", "George", "Periz", "Nouh", "John", "Thomas", "Eric", "Mike"];

const PRICES = { "1 Week": 55, "2 Weeks": 70, "1 Month": 100, "Lifetime": 550 };

const cryptoAddresses = { BTC: "0x0caaf01430e30c73b01129f0b9c17be46abdc3f4", LTC: "0x0caaf01430e30c73b01129f0b9c17be46abdc3f4", USDT: "0x0caaf01430e30c73b01129f0b9c17be46abdc3f4" };

function generateOtp() { return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join(''); }

const startMessage = `🚀 Welcome to Our Otp Bot 🚀

🔐 ➜ /redeem | Redeem your subscription 
⏱ ➜ /plan | Check your subscription

📝  Custom Commands  
🧾 ➜ /createscript | Create custom scripts 
🔏 ➜ /script [scriptid] | View script 
🗣 ➜ /customcall | Call with script

📝 Calling Modules 📞 
➜ /call | Capture PayPal, CoinBase...
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

SET CUSTOM VOICE 🗣 ➜ /customvoice | Modify the TTS ❗️ ➜ EXAMPLE: /customvoice number spoof service name sid language

🔰  Purchase LAZARUS OTP  🔰 
💎 Extras ⌨️ /recall for re-calling 
❓ Use ? in number to spoof random number`;

bot.command("start", async (ctx) => {
  await ctx.reply(startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 Channel", url: "https://t.me/LAZARUS_OTP2" }],
        [{ text: "🛒 Purchase", callback_data: "purchase" }]
      ]
    }
  });
});

bot.command("call", async (ctx) => {
  if (ctx.from.id !== ADMIN_ID) {
    return ctx.reply("❌ Lazarus OTP Bot v4.0

🚀 Limited Access: Only few spots remaining!

⚠ No Active Subscription Detected!

🔑 To activate the bot, type /purchase Or contact @CKRACKING_MOROCCO.");
  }

  const args = ctx.message.text.split(" ").slice(1);
  if (args.length < 5) {
    return ctx.reply("❗️ Usage: /call number spoof sid service otp\nExample: /call 729292737 83037266 Venmo Kim 6");
  }

  const [number, spoof, sid, serviceRaw, nameRaw, otp] = args;
  const service = serviceRaw.charAt(0).toUpperCase() + serviceRaw.slice(1).toLowerCase();
  const name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1).toLowerCase();
  const maskedName = name[0] + name.slice(1).replace(/./g, '*');

  const msg = `📲 LAZARUS - 𝙊𝙏𝙋 𝘽𝙊𝙏 v4.0

┏ 📱 New successful call finished!
┣ 🔐 Service: ${service}
┣ 🔢 OTP: ${otp}
┗ 👤 Captured By: ${maskedName}

© BOT : @lazzaruss_bot | CHANNEL : @LAZARUS_OTP2`;

  try {
    await bot.api.sendMessage(CHANNEL_ID, msg);
    ctx.reply("✅ Message sent to channel.");
  } catch (e) {
    ctx.reply("❌ Failed to send message to channel.");
    console.error(e);
  }
});

app.use(bodyParser.json());
app.use(webhookCallback(bot, "express"));

app.get("/", (req, res) => {
  res.send("Bot is running...");
});

app.listen(3000, async () => {
  console.log("Bot server running on port 3000");
  await bot.api.setWebhook("https://otpp-lkgy.onrender.com");
});
