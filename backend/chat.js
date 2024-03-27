import OpenAI from 'openai'
import {config} from 'dotenv'
config()
// const configuration = new Configuration({
//     organization: process.env.ORG_ID,
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);
const openai = new OpenAI({
    apiKey: process.env.CHAT_GPT_API,
})

const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
        {role: "user",content: "Hello world"},
    ]
})

console.log(completion.choices[0].message)