import { onRequest, Request } from 'firebase-functions/v2/https';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { requestConfig, systemMessage } from './request-config';
import { v4 as uuidv4 } from 'uuid';

const cache = createCache<ChatCompletionRequestMessage[]>();
const openaiConnection = createOpenAIConnection();

export const guess = onRequest(
  { secrets: ['OPENAI_API_KEY'], cors: true, enforceAppCheck: true },
  async (request, response) => {
    const { id, answer } = extractQuery(request);

    const context = cache.get(id) || [systemMessage];
    const messages = answer ? [...context, answer] : context;

    const question = await openaiConnection.execute(messages);
    const updatedContext = cache.set(
      id,
      question ? [...messages, question] : messages
    );

    response.send({
      question: question?.content,
      context: updatedContext,
      id,
    });
  }
);

function extractQuery(request: Request) {
  const { id = uuidv4(), answer } = request.query;
  return { id: id as string, answer: createAnswer(answer as string) };
}

function createCache<T>() {
  const cache: Record<string, T> = {};

  return {
    get: (id: string) => cache[id],
    set: (id: string, value: T) => {
      cache[id] = value;
      return cache[id];
    },
  };
}

function createAnswer(
  answer?: string
): ChatCompletionRequestMessage | undefined {
  if (!answer) return undefined;
  return {
    role: 'user',
    content: answer,
  };
}

function createOpenAIConnection() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const execute = async (request: ChatCompletionRequestMessage[]) => {
    const response = await openai.createChatCompletion({
      ...requestConfig,
      messages: request,
    });
    return response.data?.choices?.[0]?.message;
  };

  return {
    execute,
  };
}
