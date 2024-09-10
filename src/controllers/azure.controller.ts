import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  AltTextImage,
  AltTextPredictedResult,
  ImageUri,
} from 'src/interfaces/azure.interface';
import { AzureService } from 'src/services/azure.service';
import { CustomVisionTrainingService } from 'src/services/custom-vision-training.service';

@Controller('/v1/predictions')
export class AzureController {
  constructor(
    private readonly azureService: AzureService,
    private readonly customVisionTrainingServive: CustomVisionTrainingService,
  ) {}

  @Post('alt-text')
  @UseInterceptors(FilesInterceptor('images'))
  async generateAltText(
    @UploadedFiles() images: AltTextImage[],
  ): Promise<AltTextPredictedResult[]> {
    const predictions: AltTextPredictedResult[] = await Promise.all(
      images.map(async (image) => {
        const detectedProductsResults =
          await this.azureService.detectProductInImage(image);
        const altTextResult = await this.azureService.generateAltText(
          image,
          detectedProductsResults.predictions,
        );

        const imageUri: ImageUri =
          (await this.customVisionTrainingServive.retrieveImageUriWithPredictionId(
            detectedProductsResults.id,
          )) as ImageUri;
        return {
          altText: altTextResult,
          ...detectedProductsResults,
          imageUri,
        };
      }),
    );

    return predictions;
  }
}
