import * as functions from 'firebase-functions';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const task = `Zadawaj proste pytania aby odgadnąć jakim zwierzęciem jestem. Możliwie odpowiedzi to tak, nie, nie wiem. Pytaj tak długo aż odgadniesz.`;
const properties = {
  model: 'gpt-3.5-turbo',
  temperature: 1,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

export const guess = functions
  .runWith({ secrets: ['OPENAI_API_KEY'] })
  .https.onRequest(async (request, response) => {
    const data = await openai.createChatCompletion({
      ...properties,
      messages: [
        {
          role: 'system',
          content: task,
        },
      ],
    });

    response.send(data.data);
  });
