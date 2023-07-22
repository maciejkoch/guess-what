import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { requestConfig } from './openai-config';

export function createOpenAIConnection(apiKey?: string) {
  const configuration = new Configuration({
    apiKey,
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
