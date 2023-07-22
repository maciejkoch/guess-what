import { onRequest, Request } from 'firebase-functions/v2/https';
import { ChatCompletionRequestMessage } from 'openai';
import { systemTask } from './openai-config';
import { v4 as uuidv4 } from 'uuid';
import { createCache } from './in-memory-cache';
import { createOpenAIConnection } from './openai';

const cache = createCache<ChatCompletionRequestMessage[]>();
const openaiConnection = createOpenAIConnection(process.env.OPENAI_API_KEY);

export const guess = onRequest(
  { secrets: ['OPENAI_API_KEY'], cors: true, enforceAppCheck: true },
  async (request, response) => {
    const { id, answer } = extractQuery(request);

    const context = cache.get(id) || [createSystemTask(systemTask)];
    const contextWithAnswer = answer
      ? [...context, createAnswer(answer)]
      : context;

    const question = await openaiConnection.execute(contextWithAnswer);
    const contextWithQuestion = cache.set(
      id,
      question ? [...contextWithAnswer, question] : contextWithAnswer
    );

    response.send({
      question: question?.content,
      context: contextWithQuestion,
      id,
    });
  }
);

function extractQuery(request: Request) {
  const { id = uuidv4(), answer } = request.query;
  return { id: id as string, answer: answer as string };
}

function createAnswer(answer: string): ChatCompletionRequestMessage {
  return {
    role: 'user',
    content: answer,
  };
}

function createSystemTask(task: string): ChatCompletionRequestMessage {
  return {
    role: 'system',
    content: task,
  };
}
