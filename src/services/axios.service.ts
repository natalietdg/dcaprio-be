import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, lastValueFrom } from 'rxjs';
import { ApiBody } from 'src/interfaces/api.interface';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  get(url: string): Observable<AxiosResponse> {
    return this.httpService.get(url);
  }

  post<T>(
    url: string,
    body: T | ApiBody,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return lastValueFrom(this.httpService.post(url, body, config));
  }

  put<T>(
    url: string,
    body: T | ApiBody,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {

    return lastValueFrom(this.httpService.put(url, body, config));
  }
}
