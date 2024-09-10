import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AzureController } from 'src/controllers/azure.controller';
import { AzureService } from 'src/services/azure.service';
import { CustomVisionTrainingModule } from './custom-vision-training.module';
import { OpenAIModule } from './openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomVisionTrainingModule,
    OpenAIModule,
  ],
  controllers: [AzureController],
  providers: [AzureService],
})
export class AzureModule {}
