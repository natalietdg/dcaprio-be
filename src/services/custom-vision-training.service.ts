import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosService } from './axios.service';

@Injectable()
export class CustomVisionTrainingService extends AxiosService {
  readonly predictionQueryApi = `/customvision/${this.config.get('CUSTOM_VISION_TRAINING_API_VERSION')}/Training/projects/${this.config.get('CUSTOM_VISION_PROJECT_ID')}/predictions/query`;
  constructor(
    private readonly config: ConfigService,
    httpService: HttpService,
  ) {
    super(httpService);
  }

  async retrieveLastImage() {
    const retrievedImage: any = await this.post(
      this.predictionQueryApi,
      {
        orderBy: 'newest',
        maxCount: 1,
        iterationId: this.config.get('CUSTOM_VISION_ITERATION_ID'),
        tags: [],
      },
      {
        headers: {
          'Training-Key': this.config.get('CUSTOM_VISION_TRAINING_KEY'),
        },
      },
    );

    return retrievedImage;
  }

  async retrieveImageUriWithPredictionId(predictionId: string) {
    const results: any = await this.post(
      this.predictionQueryApi,
      {
        orderBy: 'newest',
        maxCount: 10,
        iterationId: this.config.get('CUSTOM_VISION_ITERATION_ID'),
        tags: [],
      },
      {
        headers: {
          'Training-Key': this.config.get('CUSTOM_VISION_TRAINING_KEY'),
        },
      },
    );

    if (results.status > 400)
      return {
        // change this
        error: 'Error',
      };

    const image = results.data.results.filter(
      (result) => result.id === predictionId,
    );

    console.log({ image });
    return {
      resizedImageUri: image[0].resizedImageUri,
      thumbnailUri: image[0].thumbnailUri,
      originalImageUri: image[0].originalImageUri,
    };
  }

  async resolveContinuation(reqBody: any, continuation: string) {
    const continuationResults: any = await this.post(
      this.predictionQueryApi,
      {
        ...reqBody,
        continuation,
      },
      {
        headers: {
          'Training-Key': this.config.get('CUSTOM_VISION_TRAINING_KEY'),
        },
      },
    );

    return continuationResults;
  }
}
