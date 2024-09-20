import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosService } from 'src/services/axios.service';
import { CustomVisionTrainingService } from 'src/services/custom-vision-training.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('CUSTOM_VISION_TRAINING_API'),
        timeout: 5000,
        headers: {
          'Training-Key': configService.get('CUSTOM_VISION_TRAINING_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CustomVisionTrainingService, AxiosService],
  exports: [CustomVisionTrainingService],
})
export class CustomVisionTrainingModule {}
