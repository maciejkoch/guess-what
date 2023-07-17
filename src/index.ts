import { onRequest } from 'firebase-functions/v2/https';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { queryConfig, systemMessage } from './query-config';
import { last } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const cache: Record<string, Array<ChatCompletionRequestMessage>> = {};

export const guess = onRequest(
  { secrets: ['OPENAI_API_KEY'], cors: true },
  async (request, response) => {
    const { id = uuidv4(), answer } = request.query;
    const parsedId = id as string;
    const parsedAnswer = answer as string;

    const context = cache[parsedId] || [systemMessage];
    const userAnswer: ChatCompletionRequestMessage = {
      role: 'user',
      content: parsedAnswer,
    };
    const messages = answer ? [...context, userAnswer] : context;

    const chatResponse = await openai.createChatCompletion({
      ...queryConfig,
      messages,
    });

    const question = chatResponse.data.choices[0].message;
    cache[parsedId] = question ? [...messages, question] : messages;

    const lastQuestion = last(cache[parsedId])?.content;

    response.send({
      question: lastQuestion,
      context: cache[parsedId],
      id,
    });
  }
);
