const readlineSync = require("readline-sync");
const OpenAI = require("openai");
const { prompt } = require("./prompt");
const { shaunBot } = require("./ascii");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let userInput;

const history = [{ role: "system", content: prompt }];

const saveMessage = (message) => history.push(message);

(async () => {
  console.log(shaunBot);
  const chatResponse = await openai.chat.completions.create({
    messages: history,
    model: "gpt-3.5-turbo",
  });

  saveMessage(chatResponse.choices[0].message);
  do {
    const latestResponse = history[history.length - 1].content;

    userInput = readlineSync.question(
      `\n (shaun++): ${latestResponse} (Type exit to quit) \n\n (${process.env.USER}): `
    );

    const userMessage = { role: "user", content: userInput };
    saveMessage(userMessage);
    if (userInput !== "exit") {
      const chatResponse = await openai.chat.completions.create({
        messages: history,
        model: "gpt-3.5-turbo",
      });

      saveMessage(chatResponse.choices[0].message);
    }
  } while (userInput !== "exit");

  console.log("Conversation ended");
})();
