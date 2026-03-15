module.exports = {
  config: {
    name: "slot",
    version: "3.0",
    author: "S AY EM",
    role: 0,
    shortDescription: "Slot Machine",
    category: "game",
    guide: "-slot <amount>"
  },

  onStart: async function ({ api, event, args, usersData }) {

    const { threadID, messageID, senderID } = event;

    if (!args[0])
      return api.sendMessage("❌ | Enter bet amount.", threadID, messageID);

    const bet = parseBet(args[0]);

    const minBet = 500;
    const maxBet = 300000000;

    if (bet < minBet)
      return api.sendMessage("❌ | Minimum bet is 500.", threadID, messageID);

    if (bet > maxBet)
      return api.sendMessage("❌ | Maximum bet is 300M.", threadID, messageID);

    const userData = await usersData.get(senderID);

    let balance = userData.money || 0;
    let spins = userData.spins || 0;
    let cooldown = userData.slotCooldown || 0;

    const maxSpins = 30;
    const cooldownTime = 30 * 60 * 1000;
    const now = Date.now();

    if (cooldown > now) {
      const left = Math.ceil((cooldown - now) / 60000);
      return api.sendMessage(`⏳ | You used 30 spins.\nCome back after ${left} minutes.`, threadID, messageID);
    }

    if (spins >= maxSpins) {
      await usersData.set(senderID, {
        spins: 0,
        slotCooldown: now + cooldownTime
      });
      return api.sendMessage("⏳ | You reached 30 spins. Wait 30 minutes to play again.", threadID, messageID);
    }

    if (balance < bet)
      return api.sendMessage("❌ | Not enough balance.", threadID, messageID);

    const icons = ["🍒","🍓","🍇","🍎","🍉","❤️","🦆"];

    let slots = [];
    let maxMatch = 0;

    const chance = Math.random();

    if (chance < 0.07) {

      const icon = icons[Math.floor(Math.random()*icons.length)];
      slots = [icon,icon,icon,icon,icon];
      maxMatch = 5;

    }

    else if (chance < 0.25) {

      const icon = icons[Math.floor(Math.random()*icons.length)];
      slots = [
        icon,icon,icon,icon,
        icons[Math.floor(Math.random()*icons.length)]
      ];

      maxMatch = 4;

    }

    else if (chance < 0.55) {

      const icon = icons[Math.floor(Math.random()*icons.length)];

      slots = [
        icon,icon,icon,
        icons[Math.floor(Math.random()*icons.length)],
        icons[Math.floor(Math.random()*icons.length)]
      ];

      maxMatch = 3;

    }

    else {

      for (let i=0;i<5;i++){
        slots.push(icons[Math.floor(Math.random()*icons.length)]);
      }

      const count = {};
      slots.forEach(i => count[i] = (count[i] || 0) + 1);
      maxMatch = Math.max(...Object.values(count));

    }

    let reward = 0;
    let lost = 0;
    let result;
    let amountText;
    let tipText;

    if (maxMatch === 5) {

      reward = bet * 5;
      balance += reward;

      result = "🔥 JACKPOT WIN 🔥";
      amountText = `🟢 WON: $${formatMoney(reward)}`;
      tipText = "Legendary spin! 5 icons matched!";

    }

    else if (maxMatch === 4) {

      reward = bet * 3;
      balance += reward;

      result = "🎉 BIG WIN 🎉";
      amountText = `🟢 WON: $${formatMoney(reward)}`;
      tipText = "Great! 4 icons matched!";

    }

    else if (maxMatch === 3) {

      reward = bet * 2;
      balance += reward;

      result = "✅ WIN";
      amountText = `🟢 WON: $${formatMoney(reward)}`;
      tipText = "Nice spin!";

    }

    else {

      lost = bet;
      balance -= bet;

      result = "❌ LOSE";
      amountText = `🔴 LOST: $${formatMoney(lost)}`;
      tipText = "Better luck next spin!";

    }

    spins++;

    await usersData.set(senderID, {
      money: balance,
      spins: spins,
      slotCooldown: cooldown
    });

    const left = maxSpins - spins;

    const msg = `
╔════════════════════╗
       🎰 SLOT MACHINE
╚════════════════════╝

❰ ${slots.join(" ┃ ")} ❱

━━━━━━━━━━━━━━━━━━
🎯 RESULT: ${result}

${amountText}
💰 BALANCE: $${formatMoney(balance)}

💡 ${tipText}
🎲 Spins: ${spins}/30 | ${left} left
━━━━━━━━━━━━━━━━━━
`;

    api.sendMessage(msg, threadID, messageID);

  }
};

function parseBet(input) {

  input = input.toLowerCase();

  if (input.endsWith("k")) return parseFloat(input) * 1000;
  if (input.endsWith("m")) return parseFloat(input) * 1000000;
  if (input.endsWith("b")) return parseFloat(input) * 1000000000;

  return parseInt(input);

}

function formatMoney(num) {

  if (num >= 1000000000000) return (num / 1000000000000).toFixed(2) + "T";
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + "B";
  if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
  if (num >= 1000) return (num / 1000).toFixed(2) + "K";

  return num;

}
