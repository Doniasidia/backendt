import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from '@src/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.healthcheck();
  }

}