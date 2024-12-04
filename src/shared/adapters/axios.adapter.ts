import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import { HttpAdapter } from "../interfaces/http-adapter.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosAdapter implements HttpAdapter {

  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await lastValueFrom(
        this.httpService.get<T>(url),
      );
      return data;
    } catch (error) {
      throw new Error('Unexpected error - Check for logs');
      
    }
  }

}