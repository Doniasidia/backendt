// client.controller.ts

import { Controller, Get, Post, Delete, Param, Body, UseGuards, NotFoundException, Patch, Request } from '@nestjs/common';
import { Client } from '@admin/client/client.entity';
import { ClientService } from '@admin/client/clients.service';
import { ClientDTO } from '@admin/client/client.dto';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Get('data')
  getClientData(@Request() req) {
    // Assuming the client's ID is stored in the JWT payload
    const clientId = req.user.id;
    return this.clientService.getClientData(clientId);
  }

  @Get()
  async getAllClients(): Promise<Client[]> {
    try {
      return await this.clientService.findAll();
    } catch (error) {
      throw new NotFoundException("Unable to fetch clients.");
    }
  }

  @Patch(':id')
  async updateClient(@Param('id') id: number, @Body() clientDTO: ClientDTO): Promise<Client> {
    try {
      return await this.clientService.updateClient(id, clientDTO);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  async createClient(@Body() body: ClientDTO): Promise<Client> {
    try {
      return await this.clientService.createClient(body);
    } catch (error) {
      throw new NotFoundException("Unable to create client.");
    }
  }

  @Patch(':email/add-password')
  async addPasswordForSubscriber(@Param('email') email: string, @Body() body: { password: string }): Promise<Client> {
    return await this.clientService.addPasswordForClient(email, body);
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
    try {
      return await this.clientService.getClientById(+id);
    } catch (error) {
      throw new NotFoundException(error.message || "Client not found.");
    }
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
