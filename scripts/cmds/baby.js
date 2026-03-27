const axios = require('axios');

const baseApiUrl = async () => {
  return "https://your-baby-apixs.onrender.com";
};

module.exports.config = {
  name: "bby",
  aliases: ["baby"janu"],
  version: "0.0.1",
  author: "S AY EM",
  countDown: 0,
  role: 0,
  description: "update simsim api by Sayem",
  category: "CHARTING",
  guide: {
    en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nmsg [YourMessage] OR\nlist OR\nlist all"
  }
};

module.exports.onStart = async ({
  api,
  event,
  args,
  usersData
}) => {

  const link = `${await baseApiUrl()}`;
  const sayem = args.join(" ").toLowerCase();

  try {

    if (!args[0]) {

      const ran = ["Bolo baby", "hum bby", "Yes' i am here", "type .help baby"];

      const msg = await api.sendMessage(
        ran[Math.floor(Math.random() * ran.length)],
        event.threadID,
        event.messageID
      );

      global.GoatBot.bbyReply ??= {};
      global.GoatBot.bbyReply[msg.messageID] = true;

      return;
    }

    if (args[0] === 'list') {

      if (args[1] === 'all') {

        const data = (await axios.get(`${link}/list-all`)).data;

        const limit = parseInt(args[2]) || 100;

        const teachers = data.teachers?.slice(0, limit) || [];

        const result = await Promise.all(
          teachers.map(async (item) => {

            const uid = item.uid;
            const value = item.teaches;

            const name = await usersData.getName(uid).catch(() => uid);

            return {
              name,
              value
            };

          })
        );

        result.sort((a, b) => b.value - a.value);

        const output = result
          .map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`)
          .join("\n");

        return api.sendMessage(
          `Total Teach = ${data.total_questions || 0}\n👑 | List of Teachers of baby\n${output}`,
          event.threadID,
          event.messageID
        );

      } else {

        const d = (await axios.get(`${link}/list-xs`)).data;

        return api.sendMessage(
          `❇️ | Total Teach = ${d.total_questions || "api off"}\n♻️ | Total Response = ${d.total_answers || "api off"}`,
          event.threadID,
          event.messageID
        );

      }

    }

    if (args[0] === 'msg') {

      const fuk = sayem.replace("msg ", "");

      const d = (await axios.get(`${link}/baby-xs`, {
        params: { ask: fuk }
      })).data;

      return api.sendMessage(`Message ${fuk} = ${d.respond}`, event.threadID, event.messageID);
    }

    if (args[0] === 'teach') {

      const text = sayem.replace("teach ", "");

      if (!text.includes("-"))
        return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);

      const [ask, answers] = text.split(/\s*-\s*/);

      const replyList = answers.split(",");

      let added = 0;
      let replyText = "";

      for (let i = 0; i < replyList.length; i++) {

        const ans = replyList[i].trim();

        await axios.get(`${link}/teach-xs`, {
          params: {
            ask: ask.trim(),
            ans: ans
          }
        });

        added++;
        replyText += `${i + 1}. ${ans}\n`;

      }

      return api.sendMessage(
`📚 | New Teach Added

❓ Question: ${ask}

💬 Replies Added: ${added}

${replyText}`,
        event.threadID,
        event.messageID
      );
    }

    const d = (await axios.get(`${link}/baby-xs`, {
      params: { ask: sayem }
    })).data;

    const msg = await api.sendMessage(d.respond, event.threadID, event.messageID);

    global.GoatBot.bbyReply ??= {};
    global.GoatBot.bbyReply[msg.messageID] = true;

  } catch (e) {

    console.log(e);

    api.sendMessage("Check console for error", event.threadID, event.messageID);

  }
};

module.exports.onChat = async ({
  api,
  event
}) => {

  try {

    const body = event.body ? event.body.toLowerCase() : "";

    const link = `${await baseApiUrl()}`;


    if (
      event.messageReply &&
      global.GoatBot.bbyReply &&
      global.GoatBot.bbyReply[event.messageReply.messageID]
    ) {

      const a = (await axios.get(`${link}/baby-xs`, {
        params: { ask: body }
      })).data;

      const msg = await api.sendMessage(
        a.respond,
        event.threadID,
        event.messageID
      );

      global.GoatBot.bbyReply[msg.messageID] = true;

      return;
    }


    if (
      body.startsWith("baby") ||
      body.startsWith("bby") ||
      body.startsWith("bot") ||
      body.startsWith("jan") ||
      body.startsWith("babu") ||
      body.startsWith("janu")
    ) {

      const arr = body.replace(/^\S+\s*/, "");

      const randomReplies = [
        "জানু😛, ডেকেছো আমাকে?",
        "Yes 😀, I am here",
        "What's up?😍",
        "ডাকলেই কিন্তু চলে আছি-!😒"⎯⃝🌼-চরিত্র যতটা পবিত্র_ব্যক্তিত্ব ততটাই সুন্দর⎯͢♡🖤  ", "♡তোমার মায়ায় পড়ে গেছি!🩷🌺-♡ ", "—বেডী মানুষের মন অনেক বড়১৩২ জিবি র‍্যাম-|♡(🙂🤝🏻.)", "একটা ভাঙা’চুরা 𝐠𝐟 চাই….! 🥺🫶", "যার মনে আমি নাই🍒তার মনে কুত্তায় মুইতা দিক..!!😏🐸🍒", "জামাই ছাড়া👳এতিম মেয়ে গুলা কোথায়🍁তোমরা সারা দাও..!!🤭🥴", "^নক না দিলে আইডি খুলছস ক্যান°!😾ননসেন্স বেডি..!🥲🥀", "-যারে দেহি তারেই ভাল্লাগে..!🙈-মনে হয় রুচি বাড়ছে..!😀😋", "আমার গল্প তোমার নানিই সেরা 🫣", "ভুলে যাও Ex কে নক দাও আমাকে 😌🌚", "-যেহেতু তুমি সিঙ্গেল তাই./🙂মানবতার খাতিরে 𝗜 𝗟𝗼𝘃𝗲 𝗬𝗼𝘂./🙂👀", "অর্ধেক খাট, অর্ধেক কম্বলভাড়া দেওয়া হবে🙂", "__ মন মেজাজ ঠিক নাই I love You🥺🐸", "𝗜 𝗟𝗼𝘃𝗲 𝗬𝗼𝘂 😻🙈Ummmmma😘😘 ৬ তানি করলাম 🐸", "সবাই প্রেমে পড়ে🥰আর মুই স্বপ্নে খাট থেকে পড়ি🤧", "★মন ডা খালি বেডি বেডি করে_//🥺💔★🤪🤪🤪", "(🤰)-এই বেডির সর্বনাশ কে করলো_🙂", "_ক..আমি তোর🫵 কী লাগি!> 🔪 😡", "জামাই ডাকো আইডি ঘুরে আসবো!🥺🫶"];

      if (!arr) {

        const msg = await api.sendMessage(
          randomReplies[Math.floor(Math.random() * randomReplies.length)],
          event.threadID,
          event.messageID
        );

        global.GoatBot.bbyReply ??= {};
        global.GoatBot.bbyReply[msg.messageID] = true;

        return;
      }

      const a = (await axios.get(`${link}/baby-xs`, {
        params: { ask: arr }
      })).data;

      const msg = await api.sendMessage(
        a.respond,
        event.threadID,
        event.messageID
      );

      global.GoatBot.bbyReply ??= {};
      global.GoatBot.bbyReply[msg.messageID] = true;

    }

  } catch (err) {

    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);

  }

};
