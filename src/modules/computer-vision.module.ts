import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosService } from 'src/services/axios.service';
import { ComputerVisionService } from 'src/services/computer-vision.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('COMPUTER_VISION_API'),
        timeout: 5000,
        headers: {
          'Ocp-Apim-Subscription-Key': configService.get('COMPUTER_VISION_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ComputerVisionService, AxiosService],
  exports: [ComputerVisionService],
})
export class ComputerVisionModule {}
