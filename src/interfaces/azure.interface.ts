export interface AltTextPredictionReq {
  name: string;
}

export type AltTextImage = Express.Multer.File;

export interface AltTextPredictedResult {
  tagPredictionResultId: string;
  created: Date;
  predictions: string[];
  altText: ChatCompletionResult | { error: string };
  imageUri: ImageUri;
}

export interface ChatCompletionResult {
  result: string;
  altTextCreationId: string;
}

export enum Role {
  User = 'user',
  System = 'system',
  Assistant = 'assistant',
}

export type ChatCompletionImage = {
  type: 'image_url';
  image_url: {
    url: string;
  };
};

export type ChatCompletionText = { type: 'text'; text: string };

export type ChatCompletionMessageParam = {
  role: Role;
  content: string | (ChatCompletionImage | ChatCompletionText)[];
};

export type ChatCompletionApiResult = {
  choices: {
    finish_reason: string;
    index: number;
    message: { content: string; role: Role };
  }[];
  created: number;
  id: string;
  model: string;
  object: string;
  system_fingerprint: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens;
  };
};

export type ImageUri = {
  resizedImageUri: string;
  thumbnailUri: string;
  originalImageUri: string;
};
