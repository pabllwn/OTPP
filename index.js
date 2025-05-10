import express from 'express';
import { Bot, webhookCallback } from 'grammy';
import bodyParser from 'body-parser';

const app = express();
const bot = new Bot("8027706435:AAGyrnAum58yj34CjdbmXanQ2AW5RR95wgc");

const CHANNEL_ID = "@LAZARUS_OTP2";
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
  LTC: "0x0caaf01430e30c73b01129f0b9c17be46abdc3f4",
  USDT: "0x0caaf01430e30c73b01129f0b9c17be46abdc3f4"
};

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
        [{ text: "📢 Channel", url: "https://t.me/LAZARUS_OTP2" }],
        [{ text: "🛒 Purchase", callback_data: "purchase" }]
      ]
    }
  });
});

bot.callbackQuery("purchase", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("💵 Choose your subscription:\n\nFor payment via Binance, please contact: " + ADMIN_USERNAME, {
    reply_markup: {
      inline_keyboard: Object.keys(PRICES).map(label => [
        { text: `💵 ${label} : $${PRICES[label]}`, callback_data: `sub_${label.replace(/\s+/g, "_")}` }
      ])
    }
  });
});

bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data.startsWith("sub_")) {
    const label = data.slice(4).replace(/_/g, " ");
    const amount = PRICES[label];
    await ctx.editMessageText(`✅ ${label} Subscription\n💵 Amount: $${amount}\n\nSelect your payment method:`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "₿ BTC", callback_data: `pay_BTC_${amount}` }],
          [{ text: "Ł LTC", callback_data: `pay_LTC_${amount}` }],
          [{ text: "₮ USDT", callback_data: `pay_USDT_${amount}` }]
        ]
      }
    });
  }

  if (data.startsWith("pay_")) {
    const [_, crypto, amount] = data.split("_");
    const address = cryptoAddresses[crypto];

    await ctx.editMessageText(
      `💳 PAYMENT DETAILS\n━━━━━━━━━━━━━━━━━━━\n` +
      `🪙 Crypto: ${crypto === "BTC" ? "Bitcoin" : crypto === "LTC" ? "Litecoin" : "Tether (USDT)"}\n` +
      `💵 Amount (USD): $${amount}\n` +
      `🏦 Wallet Address: \`${address}\`\n` +
      `📤 You Send: ${crypto}\n` +
      `💱 Rate: 1 USD = [CURRENT ${crypto} RATE]\n\n`, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📋 Copy Address", callback_data: `copy_${crypto}` }],
            [{ text: "✅ I Paid", callback_data: `paid_${crypto}` }],
            [{ text: "❌ Cancel", callback_data: "cancel_payment" }]
          ]
        }
      }
    );
  }

  if (data.startsWith("copy_")) {
    await ctx.answerCallbackQuery({ text: "📋 Address copied!", show_alert: true });
  }

  if (data.startsWith("paid_")) {
    await ctx.reply(`⚠️ We haven't received the payment yet.\nPlease contact support: ${ADMIN_USERNAME}`);
  }

  if (data === "cancel_payment") {
    await ctx.editMessageText("❌ Payment process cancelled.");
  }
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

bot.command("call", async (ctx) => {
  const userId = ctx.from.id;
  if (!userSubscriptions[userId]) {
    ctx.reply(`
Lazarus OTP Bot v4.0

🚀 Limited Access: Only few spots remaining!

⚠ No Active Subscription Detected!

🔑 To activate the bot, type /purchase Or contact @CKRACKING_MOROCCO.
    `);
    return;
  }
  // Handle call command here
});

bot.command("cvv", async (ctx) => {
  const userId = ctx.from.id;
  if (!userSubscriptions[userId]) {
    ctx.reply(`
Lazarus OTP Bot v4.0

🚀 Limited Access: Only few spots remaining!

⚠ No Active Subscription Detected!

🔑 To activate the bot, type /purchase Or contact @CKRACKING_MOROCCO.
    `);
    return;
  }
  // Handle cvv command here
});

// Continue the same for other commands...

async function sendRandomMessages() {
  while (true) {
    const service = services[Math.floor(Math.random() * services.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    const otp = generateOtp();
    const maskedUsername = name[0] + name.slice(1).replace(/./g, "*"); // Masking username
    const msg = `📲 LAZARUS - 𝙊𝙏𝙋 𝘽𝙊𝙏 v4.0\n\n┏ 📱 New successful call finished!\n┣ 🔐 Service: ${service}\n┣ 🔢 OTP: ${otp}\n┗ 👤 Captured By: ${maskedUsername}\n\n© BOT : @lazzaruss_bot | CHANNEL : @LAZARUS_OTP2`;

    try {
      await bot.api.sendMessage(CHANNEL_ID, msg);
      console.log("✔️ Sent:", msg);
    } catch (e) {
      console.error("❌ Error sending message:", e.message);
    }
    await new Promise(r => setTimeout(r, Math.floor(Math.random() * 800000) + 400000));
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
