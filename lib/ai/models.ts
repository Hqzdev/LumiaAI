export const DEFAULT_CHAT_MODEL: string = 'chat-model';

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'Luren V2 Max',
    name: 'Luren V2 Max',
    description: 'Strongest model.',
  },
  {
    id: 'Luren V2',
    name: 'Luren V2',
    description: 'Universal Ai assistant who can do everything.',
  },
  {
    id: 'Luren V1 Pro',
    name: 'Luren V1 Pro',
    description: 'Oldest model, but have big strong.',
  },
];
