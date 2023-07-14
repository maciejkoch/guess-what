const task = `Zadawaj proste pytania aby odgadnąć jakim zwierzęciem jestem. Możliwie odpowiedzi to tak, nie, nie wiem. Pytaj tak długo aż odgadniesz.`;
export const queryConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 1,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};
export const systemMessage = {
  role: 'system',
  content: task,
};
