import { PredictionAPIClient } from '@azure/cognitiveservices-customvision-prediction';
import { DetectImageResponse } from '@azure/cognitiveservices-customvision-prediction/esm/models';
import { ApiKeyCredentials } from '@azure/ms-rest-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  AltTextImage,
  ChatCompletionMessageParam,
  Role,
} from 'src/interfaces/azure.interface';
import { OpenAIService } from './openai.service';

@Injectable()
export class AzureService {
  private readonly customVisionPredictor: PredictionAPIClient;

  constructor(
    private config: ConfigService,
    private readonly openAIService: OpenAIService,
  ) {
    const customVisionCredentials = new ApiKeyCredentials({
      inHeader: {
        'Prediction-key': this.config.get('CUSTOM_VISION_PREDICTION_KEY'),
      },
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
            text: `Write a clear alt text related to hearing healthcare, hearing aids, hearing devices, hearing instruments, and hearing diagnosis. Avoid uncertain language such as 'appears to be,' 'seems,' etc. Focus on the main points without excessive detail. The tags to include are: ${predictions.join(', ')}.`,
          },
        ],
      },
    ];

    const result = await this.openAIService.createChatCompletion(messages);

    return result;
  }
}
