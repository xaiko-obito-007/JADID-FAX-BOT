const axios = require("axios");

const API = "https://sayem-baby-apixs.up.railway.app";

const autoTeachGroups = new Set();

module.exports = {
  config: {
    name: "simsimi",
    version: "1.1",
    author: "S AY EM",
    role: 0,
    shortDescription: "Reply AutoTeach (same user allowed)",
    category: "chat",
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const sub = args[0];

    if (sub === "on") {
      autoTeachGroups.add(threadID);
      return api.sendMessage("💁 AutoTeach ON (reply system)", threadID, messageID);
    }

    if (sub === "off") {
      autoTeachGroups.delete(threadID);
      return api.sendMessage("🙅 AutoTeach OFF", threadID, messageID);
    }

    if (sub === "teach") {
      const text = args.slice(1).join(" ");

      if (!text.includes("=")) {
        return api.sendMessage("⚠ Use: simsimi teach hi = hello", threadID, messageID);
      }

      const [ask, ans] = text.split("=").map(x => x.trim());

      if (!ask || !ans) {
        return api.sendMessage("⚠ Invalid format!", threadID, messageID);
      }

      try {
        await axios.get(`${API}/teach-sayem`, {
          params: {
            ask,
            ans,
            uid: senderID
          }
        });

        return api.sendMessage("✅ Teach saved", threadID, messageID);
      } catch (e) {
        return api.sendMessage("❌ API error!", threadID, messageID);
      }
    }
  },

  onChat: async function ({ event }) {
    const { threadID, senderID, body, messageReply } = event;

    if (!body) return;

    if (!autoTeachGroups.has(threadID)) return;

    if (!messageReply || !messageReply.body) return;

    const ask = messageReply.body;
    const ans = body;

    if (body.startsWith(".")) return;

    if (ans.length < 2) return;

    try {
      await axios.get(`${API}/teach-sayem`, {
        params: {
          ask,
          ans,
          uid: senderID
        }
      });
    } catch (e) {}
  }
};
