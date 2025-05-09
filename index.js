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

const PRICES = { "1 Week": 55, "2 Weeks": 70, "1 Month": 100, "Lifetime": 550 };

const pendingPayments = {};

function generateOtp() {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
}

function sendReminder(userId, paymentId) {
  bot.api.sendMessage(userId, `⏳ Reminder: We have not received payment for your subscription yet.\nPlease confirm the payment within the next few minutes.`);
  pendingPayments[paymentId].remindersSent++;
}

async function cancelTransaction(userId, paymentId) {
  delete pendingPayments[paymentId];
  await bot.api.sendMessage(userId, `❌ Payment not received within the allowed time. Your transaction has been canceled.`);
}

bot.command("payment_check", async (ctx) => {
  const userId = ctx.from.id;
  const args = ctx.message.text.split(' ').slice(1);
  if (args.length === 0) return ctx.reply("❗ Please provide a valid payment ID.");

  const paymentId = args[0].trim();
  if (pendingPayments[paymentId]) {
    const payment = pendingPayments[paymentId];
    if (payment.remindersSent >= 5) {
      await cancelTransaction(userId, paymentId);
    } else {
      sendReminder(userId, paymentId);
    }
  } else {
    await ctx.reply("❌ Invalid or expired payment ID.");
  }
});

bot.callbackQuery(/payment_(\w+)/, async (ctx) => {
  const method = ctx.match[1];
  let paymentMessage = "";
  
  // Replace with actual payment info later
  const paymentId = generateOtp(); // Generate a unique payment ID for this transaction

  if (method === 'usdt') {
    paymentMessage = `🪙 Send the amount to the following USDT wallet address:\n\n📍 Address: [Your USDT Address Here]`;
  } else if (method === 'binance') {
    paymentMessage = `💳 Send the amount to the Binance ID below:\n\n📍 Binance ID: [Your Binance ID Here]`;
  } else if (method === 'ethereum') {
    paymentMessage = `🪙 Send the amount to the following Ethereum address:\n\n📍 Address: [Your Ethereum Address Here]`;
  }

  pendingPayments[paymentId] = {
    userId: ctx.from.id,
    paymentMethod: method,
    remindersSent: 0,
    paymentReceived: false,
    timeout: setTimeout(() => cancelTransaction(ctx.from.id, paymentId), 5 * 60 * 1000) // 5 minutes timeout
  };

  await ctx.answerCallbackQuery();
  
  await ctx.reply(paymentMessage, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📋 Copy Address/ID", callback_data: "copy_address" }],
        [{ text: "💳 I paid", callback_data: "i_paid_" + paymentId }],
        [{ text: "❌ Cancel", callback_data: "cancel_payment_" + paymentId }]
      ]
    }
  });
});

bot.callbackQuery(/i_paid_(\w+)/, async (ctx) => {
  const paymentId = ctx.match[1];
  if (pendingPayments[paymentId]) {
    pendingPayments[paymentId].paymentReceived = true;
    clearTimeout(pendingPayments[paymentId].timeout); // Cancel the timeout since payment was received
    await ctx.answerCallbackQuery();
    await ctx.reply("✅ Payment confirmed! Your subscription will be activated shortly.");
  }
});

bot.callbackQuery(/cancel_payment_(\w+)/, async (ctx) => {
  const paymentId = ctx.match[1];
  if (pendingPayments[paymentId]) {
    clearTimeout(pendingPayments[paymentId].timeout); // Cancel the timeout
    delete pendingPayments[paymentId]; // Remove from pending payments
    await ctx.answerCallbackQuery();
    await ctx.reply("❌ Payment process canceled.");
  }
});

async function sendRandomMessages() {
  while (true) {
    const service = ["Netflix", "PayPal", "Bank", "Coinbase", "Spotify", "Cvv", "Pin", "Crypto", "Apple Pay", "Amazon", "Microsoft", "Venmo", "Cashapp", "Quadpay", "Bank Of America"][Math.floor(Math.random() * 16)];
    const otp = generateOtp();
    const msg = `🔑 OTP Alert!\n🧩 Service: ${service}\n🔐 OTP: ${otp}`;
    try {
      await bot.api.sendMessage(CHANNEL_ID, msg);
      console.log("✅ Sent:", msg);
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
