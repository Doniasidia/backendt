// client.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, NotFoundException, Patch } from '@nestjs/common';
import { Client } from './client.entity';
import { ClientService } from './clients.service';
import { ClientDTO } from './client.dto';



@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  
  @Get()
  async getAllClients(): Promise<Client[]> {
    return await this.clientService.findAll();
  }
  
  @Post()
  async createClient(@Body() body: ClientDTO): Promise<Client> {
    return await this.clientService.createClient(body);
  }
 
  @Delete(':id')
  async deleteClient(@Param('id') id: number): Promise<void> {
    try {
      await this.clientService.deleteClient(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  
  @Patch(':id') 
async updateClient(@Param('id') id: number, @Body() body: ClientDTO): Promise<Client> {
  try {
    return await this.clientService.updateClient(id, body);
  } catch (error) {
    throw new NotFoundException(error.message);
  }

}
} 