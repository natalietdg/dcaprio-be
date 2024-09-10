import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosService } from 'src/services/axios.service';
import { OpenAIService } from 'src/services/openai.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('OPENAI_API'),
        timeout: 50000,
        headers: {
          'api-key': configService.get('OPENAI_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [OpenAIService, AxiosService],
  exports: [OpenAIService],
})
export class OpenAIModule {}
