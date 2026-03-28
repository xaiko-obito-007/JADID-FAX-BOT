module.exports = {
 config: {
	 name: "bal",
	 version: "1.0",
	 author: "Jadid",
	 countDown: 5,
	 role: 0,
	 shortDescription: "no prefix",
	 longDescription: "no prefix",
	 category: "no prefix",
 },

 onStart: async function(){}, 
 onChat: async function({ event, message, getLang }) {
 if (event.body && event.body.toLowerCase() === "bal") {
 return message.reply({
 body: "     「𝐑 𝐀 𝐉」",
 attachment: await global.utils.getStreamFromURL("https://drive.google.com/file/d/1WQEB4cGdzfqsybAreCw-8Lk6V0OJRXGW/view?usp=drivesdk")
 });
 }
 }
}
