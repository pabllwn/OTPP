import express from 'express';
import { Bot, webhookCallback } from 'grammy';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const bot = new Bot("8027706435:AAGyrnAum58yj34CjdbmXanQ2AW5RR95wgc");

const CHANNEL_ID = "@LAZARUS_OTP";
const ADMIN_USERNAME = "@CKRACKING_MOROCCO";
const VALID_KEYS = ["TRIYAL-1234", "DEMLO-9999"];
let userSubscriptions = {};  // تم إزالة الأنواع TypeScript هنا
let userKeys = {};  // تم إزالة الأنواع TypeScript هنا
let keyExpirations = {};  // تم إزالة الأنواع TypeScript هنا

const services = ["Netflix", "PayPal", "Bank", "Coinbase", "Spotify", "Cvv", "Pin", "Crypto", "Apple Pay", "Amazon", "Microsoft", "Venmo", "Cashapp", "Quadpay", "Bank Of America"];
const names = ["John", "Alice", "Mark", "Sophia", "Leo", "Emma", "Ahmed", "Salim", "Farid", "Magnan", "Lina", "Adam", "Orion", "Yara", "Amine", "Ahmed", "Jerry", "Salma", "William", "George", "Periz", "Nouh", "John", "Thomas", "Eric", "Mike"];

const PRICES = { "1 Week": 55, "2 Weeks": 70, "1 Month": 100, "Lifetime": 550 };

function generateOtp() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

function maskName(name) {
  return '*'.repeat(name.length);
}

function generateKey(prefix, duration) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomPart = Array.from({ length: 14 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const key = `${prefix}-${randomPart}`;
  const expiresAt = duration === 'lifetime' ? null : Date.now() + parseDuration(duration);
  VALID_KEYS.push(key);
  keyExpirations[key] = expiresAt;
  return key;
}

function parseDuration(duration) {
  if (duration.endsWith('minutes')) return parseInt(duration) * 60 * 1000;
  if (duration.endsWith('hours')) return parseInt(duration) * 60 * 60 * 1000;
  if (duration.endsWith('days')) return parseInt(duration) * 24 * 60 * 60 * 1000;
  if (duration.endsWith('month')) return 30 * 24 * 60 * 60 * 1000;
  if (duration.endsWith('year')) return 365 * 24 * 60 * 60 * 1000;
  return 0;
}

const startMessage = `🚀 Welcome to Our Otp Bot 🚀

🔐 ➜ /redeem | Redeem your subscription
⏱ ➜ /plan | Check your subscription

📝 Custom Commands
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

🔰 Purchase LAZARUS OTP 🔰
⌨️ /recall for re-calling
❓ Use ? in number to spoof random number`;

bot.command("start", async (ctx) => {
  await ctx.reply(startMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📢 Channel", url: "https://t.me/LAZARUS_OTP" }],
        [{ text: "🛒 Purchase", callback_data: "purchase" }]
      ]
    }
  });
});

bot.callbackQuery("purchase", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("🛒 Purchase your plan", {
    reply_markup: {
      inline_keyboard: Object.keys(PRICES).map(label => [{
        text: `💵 ${label} : $${PRICES[label]}`,
        callback_data: `sub_${label.replace(/\s+/g, "_")}`
      }])
    }
  });
});

bot.command("genkey", async (ctx) => {
  const isAdmin = ctx.from.username === ADMIN_USERNAME.replace('@', '');
  if (!isAdmin) return ctx.reply("❌ You are not authorized to generate keys.");

  const args = ctx.message.text.split(' ').slice(1);
  if (args.length !== 1) return ctx.reply("❗ Usage: /genkey [duration], e.g., /genkey 1month");

  const key = generateKey("LAZARUS", args[0]);
  await ctx.reply(`Your LAZARUS OTP 4.0 is now active!\n🟢\nThe key 🛠️:\n\`\`\`\n/redeem ${key}\n\`\`\`\n🔗 https://t.me/lazzaruss_bot\n\nTHANKS FOR USING : LAZARUS OTP 4.0 - Enjoy your LAZARUS OTP 4.0 🔥`, {
    parse_mode: "Markdown"
  });
});

bot.command("redeem", (ctx) => {
  const userId = ctx.from.id;
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length === 0) return ctx.reply("🔑 Please send a key like this: /redeem YOUR_KEY");

  const key = args[0].trim();
  const expiration = keyExpirations[key];
  if (VALID_KEYS.includes(key) && (!expiration || expiration > Date.now())) {
    userSubscriptions[userId] = true;
    userKeys[userId] = key;
    ctx.reply("✅ Key accepted! Subscription activated.");
  } else {
    ctx.reply(`❌ Invalid or expired key.\nPlease contact ${ADMIN_USERNAME} to purchase a valid one.`);
  }
});

bot.command("plan", (ctx) => {
  ctx.reply(`LAZARUS-O-T-P CALL ☎️ 🌐 With a very good prices:

💵 1 Day : $20
💵 2 Days : $30
💵 1 Week : $55
💵 2 Weeks : $70
💵 1 Month : $100
💵 3 Months : $250
💵 Lifetime : $550

DM ${ADMIN_USERNAME} to get your key 🗝
🤖 BOT: @lazzaruss_bot
✉️ Support: ${ADMIN_USERNAME}`);
});

bot.command("call", async (ctx) => {
  const userId = ctx.from.id;
  if (!userSubscriptions[userId]) {
    return ctx.reply(`Lazarus OTP Bot v4.0\n\n🚀 Limited Access: Only few spots remaining!\n\n⚠️ No Active Subscription Detected!\n\n🔐 To activate the bot, type /purchase.`);
  }

  const args = ctx.message.text.split(' ');
  const callIndex = args.indexOf('/call');
  const fromIndex = args.indexOf('from');
  if (callIndex === -1 || fromIndex === -1 || fromIndex <= callIndex + 1) {
    return ctx.reply("❗ Usage: /call [target] from [number]");
  }

  const to = args[callIndex + 1];
  const from = args[fromIndex + 1];

  await ctx.reply(`📞 CALLING ${to} FROM ${from}...`);
  await ctx.reply(`☎️ CALL STATUS: Call has been answered.`);
  await ctx.reply(`🤖 HUMAN DETECTED`);

  const otp = generateOtp();

  setTimeout(async () => {
    await ctx.reply(`✅ OTP : ${otp}\n📞 CALL STATUS: Call Successful ✅\n\n🛸 Powered by Lazarus-OTP`);
    const service = services[Math.floor(Math.random() * services.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const msg = `🔐 OTP Alert!\n🥷 Captured By ${maskName(name)}\n🛠 Service: ${service}\n🔢 OTP: ${otp}`;
    await bot.api.sendMessage(CHANNEL_ID, msg);
  }, 20000);

  setTimeout(() => {
    const audioPath = path.resolve(__dirname, "Lazarus-OTP.mp3");
    if (fs.existsSync(audioPath)) {
      ctx.replyWithAudio({ source: fs.readFileSync(audioPath), filename: 'Lazarus-OTP.mp3' });
    } else {
      ctx.reply("⚠️ Audio file not found.");
    }
  }, 60000);
});

async function sendRandomMessages() {
  while (true) {
    const service = services[Math.floor(Math.random() * services.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const otp = generateOtp();
    const maskedName = maskName(name);
    const msg = `🔐 OTP Alert!\n🥷 Captured By ${maskedName}\n🛠 Service: ${service}\n🔢 OTP: ${otp}`;
    try {
      await bot.api.sendMessage(CHANNEL_ID, msg);
      console.log("✔️ Sent:", msg);
    } catch (e) {
      console.error("❌ Error sending message:", e.message);
    }
    await new Promise(r => setTimeout(r, Math.floor(Math.random() * 1000000) + 900000));
  }
}

app.use(bodyParser.json());
app.use(webhookCallback(bot, "express"));

app.get("/", (req, res) => {
  res.send("Bot is running...");
});

app.listen(3000, async () => {
  console.log("Bot server running on port 3000");
  await bot.api.setWebhook("https://otpp-lkgy.onrender.com");
  sendRandomMessages();
});
