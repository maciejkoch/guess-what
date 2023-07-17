const task = `Twoim zadaniem jest odgadnięcie jakim zwierzęciem jest user. User odpowiada: tak, nie, nie wiem.`;
export const queryConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 0.5,
  max_tokens: 100,
  top_p: 0.5,
  frequency_penalty: 0,
  presence_penalty: 0,
};
export const systemMessage = {
  role: 'system',
  content: task,
};
