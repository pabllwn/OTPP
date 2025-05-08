import { Bot } from "grammy";

// أنشئ البوت
const bot = new Bot("8027706435:AAHjWx1KlikP46Ri1NGCTr-cWmZwXzZSoIg");

// تعريفات الاشتراك المؤقت
const VALID_KEYS = [];
const userSubscriptions = {}; // { key: { userId, expires } }
const CHANNEL_ID = "@LAZARUS_OTP"; // قناة التنبيهات

// توليد OTP عشوائي
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// أمر الاشتراك (redeem)
bot.command("redeem", async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) return ctx.reply("❗ Usage: /redeem [your_key]");

  const key = args[1];
  if (!VALID_KEYS.includes(key)) return ctx.reply("❌ Invalid or used key.");

  userSubscriptions[key].userId = ctx.from.id;
  const expires = userSubscriptions[key].expires;
  const remainingMinutes = Math.round((expires - Date.now()) / 60000); // حساب المدة المتبقية بالminutes
  VALID_KEYS.splice(VALID_KEYS.indexOf(key), 1);

  ctx.reply(`✅ Subscription activated successfully!\n⏱️ Duration: ${remainingMinutes} minutes\nYou now have access.`);
});

// أمر توليد كود اشتراك مؤقت للمالك فقط
bot.command("genkey", async (ctx) => {
  const ownerId = 1602421561; // عدله لـ ID الخاص بك
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

// أمر الشراء
bot.command("purchase", async (ctx) => {
  await ctx.reply("To get access, please contact the admin or use a redeem key.");
});

// أمر الاتصال /call
bot.command("call", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);
  if (args.length < 2) return ctx.reply("❗ Usage: /call [toNumber] [fromNumber]");

  const userId = ctx.from.id;
  const hasValidKey = Object.values(userSubscriptions).some(sub => sub.userId === userId && sub.expires > Date.now());
  if (!hasValidKey) {
    return ctx.reply(`Lazarus OTP Bot v2.0\n\n🚀 Limited Access: Only few spots remaining!\n\n⚠️ No Active Subscription Detected!\n\n🔐 To activate the bot, type /purchase.`);
  }

  const [to, from] = args;

  await ctx.reply(`📞 Calling ${to} from ${from}`);
  setTimeout(() => ctx.reply("✅ Call has been answered."), 3000);
  setTimeout(() => ctx.reply("🧠 Human detected"), 5000);
  setTimeout(() => ctx.reply("⌛ Sending OTP..."), 7000);

  const otp = generateOtp();
  setTimeout(() => {
    ctx.reply(`🔐 OTP : ${otp}`);
    ctx.reply(`📞 CALL STATUS: Call Successful ✅\n\n🥷 Captured By ****\n🛠 Service: PayPal\n🔢 OTP: ${otp}\n\n🛸 Powered by Lazarus-OTP`);

    bot.api.sendMessage(CHANNEL_ID, `🔐 OTP Alert!\n🥷 Captured By ****\n🛠 Service: PayPal\n🔢 OTP: ${otp}\n📞 CALL STATUS: Call Successful ✅\n\n🛸 Powered by Lazarus-OTP`);
  }, 20000);

  setTimeout(() => {
    ctx.replyWithAudio({ source: Buffer.from([]), filename: "Lazarus-OTP.mp3" });
  }, 50000 + Math.random() * 70000);
});

// تشغيل البوت
bot.start();
