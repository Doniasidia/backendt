// client.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, NotFoundException, Patch } from '@nestjs/common';
import { Client } from '@admin/client/client.entity';
import { ClientService } from '@admin/client/clients.service';
import { ClientDTO } from '@admin/client/client.dto';



@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  
  @Get()
  async getAllClients(): Promise<Client[]> {
    return await this.clientService.findAll();
  }
  @Put(':id')
  async updateClient(@Param('id') id: number, @Body() ClientDTO: ClientDTO): Promise<Client> {
    return await this.clientService.updateClient(id, ClientDTO);
  }
  
  @Post()
  async createClient(@Body() body: ClientDTO): Promise<Client> {
    return await this.clientService.createClient(body);
  }
 
  @Patch(':id/deactivate') 
async deactivateClient(@Param('id') id: number): Promise<Client> {
  try {
    return await this.clientService.deactivateClient(id);
  } catch (error) {
    throw new NotFoundException(error.message);
  }
}
@Get(':id')
  async getClientById(@Param('id') id: string): Promise<Client> {
    return await this.clientService.getClientById(+id); 
  }

@Patch(':id/status')
async updateClientStatus(@Param('id') id: number, @Body() body: { status: string }): Promise<Client> {
  try {
    return await this.clientService.updateClientStatus(id, body.status);
  } catch (error) {
    throw new NotFoundException(error.message);
  }
}
}



