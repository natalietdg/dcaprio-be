import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AltTextImage } from 'src/interfaces/azure.interface';
import { AxiosService } from './axios.service';

const features = ['denseCaptions', 'caption', 'objects', 'tags', 'people'];

@Injectable()
export class ComputerVisionService extends AxiosService {
  constructor(
    private readonly config: ConfigService,
    httpService: HttpService,
  ) {
    super(httpService);
  }
  readonly denseCaptionApi = `/imageanalysis:analyze?features=${features.join(',')}&api-version=${this.config.get('COMPUTER_VISION_VERSION')}`;

  async analyzeImage(image: AltTextImage) {
    const result: any = await this.post(this.denseCaptionApi, image.buffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });

    return result;
  }
}
