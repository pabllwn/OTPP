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
let userSubscriptions = {};
let userKeys = {};
let keyExpirations = {};

const services = ["Netflix", "PayPal", "Bank", "Coinbase", "Spotify", "Cvv", "Pin", "Crypto", "Apple Pay", "Amazon", "Microsoft", "Venmo", "Cashapp", "Quadpay", "Bank Of America"];
const names = ["John", "Alice", "Mark", "Sophia", "Leo", "Emma", "Ahmed", "Salim", "Farid", "Magnan", "Lina", "Adam", "Orion", "Yara", "Amine", "Ahmed", "Jerry", "Salma", "William", "George", "Periz", "Nouh", "John", "Thomas", "Eric", "Mike"];

const PRICES = { "1 Week": 55, "2 Weeks": 70, "1 Month": 100, "Lifetime": 550 };

// تحديد معرف المستخدم الخاص بك (أنت)
const ADMIN_ID = 1602421561;  // استبدل هذا بمعرف المستخدم الخاص بك

function generateOtp() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

function maskName(name) {
  return '*'.repeat(name.length);
}

function generateKey(prefix, duration) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomPart = Array.from({ length: 27 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const key = `${prefix}-OTP-${randomPart}`;
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

🔐 ➔ /redeem | Redeem your subscription
⏱ ➔ /plan | Check your subscription

📝 Custom Commands
𞷾 ➔ /createscript | Create custom scripts
🔏 ➔ /script [scriptid] | View script
😗 ➔ /customcall | Call with script

📝 Calling Modules
📞 ➔ /call | Capture PayPal, CoinBase...
🏦 ➔ /bank | Capture OTP Bank
💳 ➔ /cvv | Capture CVV
🔢 ➔ /pin | Capture PIN
🍏 ➔ /applepay | Capture OTP Credit Card
🔵 ➔ /coinbase | Capture 2FA Code
💸 ➔ /crypto | Capture Crypto Code
📦 ➔ /amazon | Approval Authentication
💻 ➔ /microsoft | Capture Microsoft Code
🅿️ ➔ /paypal | Capture Paypal Code
🏦 ➔ /venmo | Capture Venmo Code
💵 ➔ /cashapp | Capture Cashapp Code
💳 ➔ /quadpay | Capture quadpay Code
📿 ➔ /carrier | Capture carrier Code
📧 ➔ /email | grab Email code
🕖 ➔ /remind | remind victim

SET CUSTOM VOICE
😗 ➔ /customvoice | Modify the TTS
❗️ ➔ EXAMPLE: /customvoice number spoof service name sid language

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
  await ctx.reply("💳 Purchase your plan", {
    reply_markup: {
      inline_keyboard: Object.keys(PRICES).map(label => [{
        text: `💰 ${label} : $${PRICES[label]}`,
        callback_data: `sub_${label.replace(/\s+/g, "_")}`
      }])
    }
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

    let message = "✅ Key accepted! Subscription activated.";
    if (expiration) {
      const timeLeft = expiration - Date.now();
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      message += `\n\n⏱ Subscription valid for: ${days}d ${hours}h ${minutes}m`;
    } else {
      message += `\n\n⏱ Subscription valid: Lifetime`;
    }

    ctx.reply(message);
  } else {
    ctx.reply("❌ Invalid or expired key.\nPlease contact the admin to purchase a valid one.");
  }
});

bot.command("plan", (ctx) => {
  ctx.reply(`LAZARUS-O-T-P CALL ☎️ 🌐 With great prices:\n\n💰 1 Day : $20\n💰 2 Days : $30\n💰 1 Week : $55\n💰 2 Weeks : $70\n💰 1 Month : $100\n💰 3 Months : $250\n💰 Lifetime : $550\n\nDM @CKRACKING_MOROCCO to get your key 🔑\n📩 Support: @CKRACKING_MOROCCO`);
});

bot.command("purchase", async (ctx) => {
  const userId = ctx.from.id;
  if (!userSubscriptions[userId]) {
    await ctx.reply("💳 Please choose your plan below:", {
      reply_markup: {
        inline_keyboard: Object.keys(PRICES).map(label => [{
          text: `💰 ${label} : $${PRICES[label]}`,
          callback_data: `sub_${label.replace(/\s+/g, "_")}`
        }])
      }
    });
  }
});

// الرد على أي أمر آخر غير /redeem و /purchase و /email إذا لم يكن لديه اشتراك
bot.on('message', async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;

  // إذا كان المستخدم هو المشرف (أنت)
  if (userId === ADMIN_ID) {
    // تنفيذ أوامر خاصة للمشرف مثل /send_paypal أو /genkey
    if (text.startsWith('/send_paypal')) {
      const otp = generateOtp();
      await bot.api.sendMessage(CHANNEL_ID, `🔐 OTP Alert!\n🥷 Captured By ${maskName(ctx.from.username)}\n🛠 Service: PayPal\n🔢 OTP: ${otp}`);
    }

    if (text.startsWith('/genkey')) {
      const [_, prefix, duration] = text.split(' ');
      if (!prefix || !duration) {
        return ctx.reply("❌ Usage: /genkey <prefix> <duration>");
      }

      const key = generateKey(prefix, duration);
      return ctx.reply(`✅ Generated Key: ${key}`);
    }

    return;
  }

  // إذا لم يكن هناك اشتراك للمستخدم
  if (text !== "/redeem" && text !== "/purchase" && text !== "/email" && !userSubscriptions[userId]) {
    ctx.reply(`Lazarus OTP Bot v4.0\n\n🚀 Limited Access: Only few spots remaining!\n\n⚠ No Active Subscription Detected!\n\n🔑 To activate the bot, type /purchase Or contact ${ADMIN_USERNAME}.`);
  } else {
    // يمكن إضافة معالجات أخرى هنا إذا أردت
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
