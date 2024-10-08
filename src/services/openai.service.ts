import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import {
  ChatCompletionApiResult,
  ChatCompletionMessageParam,
  ChatCompletionResult,
} from 'src/interfaces/azure.interface';
import { AxiosService } from './axios.service';

@Injectable()
export class OpenAIService extends AxiosService {
  readonly gpt4oChatCompletionApi = `/openai/deployments/gpt-4o/chat/completions`;
  constructor(
    private readonly config: ConfigService,
    httpService: HttpService,
  ) {
    super(httpService);
  }

  async createChatCompletion(
    messages: ChatCompletionMessageParam[],
  ): Promise<ChatCompletionResult | { error: string }> {
    const result: AxiosResponse<ChatCompletionApiResult> | void =
      await this.post(
        this.gpt4oChatCompletionApi,
        {
          messages,
          model: 'gpt-4o',
          max_tokens: 800,
          temperature: 0.7,
          top_p: 0.95,
        },
        {
          params: {
            'api-version': this.config.get('OPENAI_API_VERSION'),
          },
        },
      ).catch((error) => {
        console.log({ error });
      });

    if ((result && result.status > 400) || !result)
      return {
        error: 'error',
      };

    const data = result.data;

    if (!data || !data.choices || data.choices.length < 1) {
      return { error: 'Invalid response data' };
    }

    return {
      result: data.choices[0].message.content
        ?.replace(/^Alt text:\s*/, '')
        ?.replace(/Tags:\s*.*$/g, ''),
      altTextCreationId: data.id,
    };
  }
}
