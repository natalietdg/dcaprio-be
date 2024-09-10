import { PredictionAPIClient } from '@azure/cognitiveservices-customvision-prediction';
import { DetectImageResponse } from '@azure/cognitiveservices-customvision-prediction/esm/models';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AzureOpenAI } from 'openai';
import {
  AltTextImage,
  ChatCompletionMessageParam,
  Role,
} from 'src/interfaces/azure.interface';
import { OpenAIService } from './openai.service';

@Injectable()
export class AzureService {
  private readonly customVisionPredictor: PredictionAPIClient;
  private readonly openAIPredictor: AzureOpenAI;

  constructor(
    private config: ConfigService,
    private readonly openAIService: OpenAIService,
  ) {
    const customVisionCredentials = new ApiKeyCredentials({
      inHeader: {
        'Prediction-key': this.config.get('CUSTOM_VISION_PREDICTION_KEY'),
      },
    });

    this.openAIPredictor = new AzureOpenAI({
      endpoint: this.config.get('OPENAI_API'),
      apiKey: this.config.get('OPENAI_KEY'),
      apiVersion: this.config.get('OPENAI_API_VERSION'),
      deployment: this.config.get('OPENAI_DEPLOYMENT_NAME'),
    });

    this.customVisionPredictor = new PredictionAPIClient(
      customVisionCredentials,
      this.config.get('CUSTOM_VISION_PREDICTION_API'),
    );
  }

  async detectProductInImage(image: AltTextImage) {
    const result: DetectImageResponse =
      (await this.customVisionPredictor.detectImage(
        this.config.get('CUSTOM_VISION_PROJECT_ID'),
        this.config.get('CUSTOM_VISION_PREDICTION_VERSION'),
        image.buffer,
      )) as DetectImageResponse;

    const predictedTags = [];

    result.predictions.map((prediction) => {
      if (prediction.probability > 0.8) {
        predictedTags.push(prediction.tagName);
      }
    });

    return {
      id: result.id,
      created: result.created,
      predictions: predictedTags,
    };
  }

  async generateAltText(image: AltTextImage, predictions: string[]) {
    const imageBase64String = image.buffer.toString('base64');

    const messages: ChatCompletionMessageParam[] = [
      {
        role: Role.System,
        content: 'You are an AI assistant that helps people write alt texts.',
      },
      {
        role: Role.User,
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${image.mimetype};base64,${imageBase64String}`,
            },
          },
          {
            type: 'text',
            text: `Please write an alt text for this. The domain is hearing healthcare, hearing aids, hearing devices, hearing instruments, hearing diagnosis. Remove uncertain language such as "appears to be", "looks like", "seems", and etc. from the alt text. It does not need to be too descriptive, just highlight the main points. The tags are ${predictions.join(', ')}`,
          },
        ],
      },
    ];

    const result = await this.openAIService.createChatCompletion(messages);

    return result;
  }
}
