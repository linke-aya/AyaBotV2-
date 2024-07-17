const axios = require("axios");

let lastQuery = ""; // متغير عالمي للاحتفاظ بآخر استعلام

module.exports = {
  name: "gpt",
  version: "1.0.0",
  usageCount: 0,
  info: "bard",
  type: "gpt",
  creator: 'لنك',
  usages: "[question]",
  run: async (api, event) => {
    const { threadID, messageID } = event;
    const args = event.body.split(" ").slice(1); // تقسيم الرسالة للحصول على الاستعلام

    if (!args[0]) {
      api.sendMessage("يرجى تقديم سؤال للبحث عنه", threadID, messageID);
      return;
    }

    const query = args.join(" ");

    if (query === lastQuery) {
      api.sendMessage("🕰️ | تم تحديث الإجابة على السؤال السابق", threadID, messageID);
      return;
    } else {
      lastQuery = query;
    }

    api.sendMessage("جارٍ قراءة سؤالك...", threadID, messageID);

    try {
      const response = await axios.get(`https://hazeyy-api-blackbox.kyrinwu.repl.co/ask?q=${encodeURIComponent(query)}`);

      if (response.status === 200 && response.data && response.data.message) {
        const answer = response.data.message;
        const formattedAnswer = formatFont(answer); // تطبيق تنسيق الخط
        api.sendMessage(formattedAnswer, threadID, messageID);
      } else {
        api.sendMessage("عذرًا، لم يتم العثور على إجابات ذات صلة", threadID, messageID);
      }
    } catch (error) {
      console.error(error);
      api.sendMessage("😿 حدث خطأ غير متوقع أثناء البحث عن الإجابة.", threadID, messageID);
    }
  }
};

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿",
    g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅",
    m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑",
    y: "𝗒", z: "𝗓", A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣",
    E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩",
    K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯",
    Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵",
    W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    formattedText += fontMapping[char] || char; // استخدام قيمة الخط إذا كانت موجودة، أو استخدام الحرف الأصلي
  }
  return formattedText;
}