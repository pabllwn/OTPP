import express from 'express';
import { Bot, webhookCallback } from 'grammy';
import bodyParser from 'body-parser';

const app = express();
const bot = new Bot("8027706435:AAHjWx1KlikP46Ri1NGCTr-cWmZwXzZSoIg");

const CHANNEL_ID = "@LAZARUS_OTP";
const ADMIN_USERNAME = "@CKRACKING_MOROCCO";
const VALID_KEYS = ["TRIYAL-1234", "DEMLO-9999"];
const userSubscriptions = {};
const services = ["Netflix", "PayPal", "Bank", "Coinbase", "Spotify", "Cvv", "Pin", "Crypto", "Apple Pay", "Amazon", "Microsoft", "Venmo", "Cashapp", "Quadpay", "Bank Of America"];
const names = ["John", "Alice", "Mark", "Sophia", "Leo", "Emma", "Ahmed", "Salim", "Farid", "Magnan", "Lina", "Adam", "Orion", "Yara", "Amine", "Ahmed", "Jerry", "Salma", "William", "George", "Periz", "Nouh", "John", "Thomas", "Eric", "Mike"];

const PRICES = {
  "1 Week": 55,
  "2 Weeks": 70,
  "1 Month": 100,
  "Lifetime": 550
};

const cryptoAddresses = {
  BTC: "0x0caaf01430e30c73b01129f0b9c17be46abdc3f4",
  LTC: "LSeoTPFsy3jhc42xmpquT3Du8TE15Kgq6v",
  USDT: "TDrUjRERAdFkFgsXku8HwGg3LJDoynXygr"
};

// دالة لتوليد OTP عشوائي
function generateOtp() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

// دالة لتحويل الاسم إلى نجوم
function maskName(name) {
  return '*'.repeat(name.length);
}

// أمر /start
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

// رسالة الترحيب
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

// أمر /redeem
bot.command("redeem", async (ctx) => {
  const userId = ctx.from.id;
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length === 0) {
    return ctx.reply("🔑 Please send a key like this: /redeem YOUR_KEY", { parse_mode: "Markdown" });
  }

  const key = args[0].trim();
  if (VALID_KEYS.includes(key)) {
    userSubscriptions[userId] = { active: true, expiry: new Date().getTime() + 60 * 60 * 1000 }; // Example: 1 hour expiry
    ctx.reply("✅ Key accepted! Subscription activated.");
  } else {
    ctx.reply(`❌ Invalid key.\nPlease contact ${ADMIN_USERNAME} to purchase a valid one.`);
  }
});

// أمر /purchase
bot.command("purchase", async (ctx) => {
  const userId = ctx.from.id;

  if (!userSubscriptions[userId] || !userSubscriptions[userId].active || new Date(userSubscriptions[userId].expiry) < new Date()) {
    return ctx.reply("⚠️ No Active Subscription Detected!\n\nTo activate the bot, please /redeem your code.");
  }

  await ctx.reply("To get access, please contact the admin or use a redeem key.");
});

// أمر /genkey للمالك
bot.command("genkey", async (ctx) => {
  const ownerId = 1602421561; // ID الخاص بك
  if (ctx.from.id !== ownerId) return ctx.reply("❌ You are not authorized.");

  const args = ctx.message.text.split(" ").slice(1);
  const durationInMinutes = parseInt(args[0]);
  if (isNaN(durationInMinutes)) return ctx.reply("⏱️ Usage: /genkey [minutes]");

  const key = `LAZARUS-OTP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  VALID_KEYS.push(key);
  const expiry = Date.now() + durationInMinutes * 60000;
  userSubscriptions[key] = { expires: expiry };

  await ctx.reply(
    `Your LAZARUS OTP 4.0 is now active!\n🟢\nThe key 🛠️: /redeem ${key}\nThe link 🤖: https://t.me/lazzaruss_bot\n\nTHANKS FOR USING : LAZARUS OTP 4.0 - Enjoy your LAZARUS OTP 4.0 🔥`
  );
});

// أمر /call
bot.command("call", async (ctx) => {
  const userId = ctx.from.id;

  if (!userSubscriptions[userId] || !userSubscriptions[userId].active || new Date(userSubscriptions[userId].expiry) < new Date()) {
    return ctx.reply("Lazarus OTP Bot v2.0\n\n🚀 Limited Access: Only few spots remaining!\n\n⚠️ No Active Subscription Detected!\n\n🔐 To activate the bot, type /purchase.");
  }

  const args = ctx.message.text.split(' ').slice(1);
  if (args.length < 2) return ctx.reply("❗ Usage: /call [toNumber] [fromNumber]");

  const [to, from] = args;

  await ctx.reply("📞 Calling " + to + " from " + from);
  setTimeout(() => ctx.reply("✅ Call has been answered."), 3000);
  setTimeout(() => ctx.reply("🧠 Human detected"), 5000);
  setTimeout(() => ctx.reply("⌛ Sending OTP..."), 7000);

  const otp = generateOtp();
  setTimeout(() => {
    ctx.reply(`🔐 OTP : ${otp}`);
    ctx.reply(`📞 CALL STATUS: Call Successful ✅\n\n🥷 Captured By ****\n🛠 Service: ${services[Math.floor(Math.random() * services.length)]}\n🔢 OTP: ${otp}\n\n🛸 Powered by Lazarus-OTP`);
    bot.api.sendMessage(CHANNEL_ID, `🔐 OTP Alert!\n🥷 Captured By ****\n🛠 Service: ${services[Math.floor(Math.random() * services.length)]}\n🔢 OTP: ${otp}\n📞 CALL STATUS: Call Successful ✅\n\n🛸 Powered by Lazarus-OTP`);
  }, 20000);

  setTimeout(() => {
    ctx.replyWithAudio({ source: Buffer.from([]), filename: "Lazarus-OTP.mp3" });
  }, 50000 + Math.random() * 70000);
});

// تشغيل البوت
app.use(bodyParser.json());
app.use(webhookCallback(bot, "express"));

app.get("/", (req, res) => {
  res.send("Bot is running...");
});

app.listen(3000, async () => {
  console.log("Bot server running on port 3000");
  await bot.api.setWebhook("https://otpp-lkgy.onrender.com");
});
