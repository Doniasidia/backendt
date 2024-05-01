// client.service.ts

import {  Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@admin/client/client.entity';
import { ClientDTO } from '@admin/client/client.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Status } from '@enums/status';
import { ClientRepository } from "@user/client.repository";


@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  async getClientData(clientId: string) {
    const id = parseInt(clientId); // Assuming clientId is a string
    return await this.clientRepository.findOne({ where: { id } });
  }
  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  async createClient(clientDTO: ClientDTO): Promise<Client> {
    const hashedPassword = await bcrypt.hash(clientDTO.password, 10);
    const newClient = new Client();
    newClient.username = clientDTO.username;
    newClient.email = clientDTO.email;
    newClient.telephone = clientDTO.telephone;
    newClient.password = hashedPassword; 
    newClient.typepack = clientDTO.typepack;
    const savedClient = await this.clientRepository.save(newClient);
    return savedClient;
  }
  async deactivateClient(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    client.status = Status.DEACTIVATED;
    return await this.clientRepository.save(client);
  }
  

  async updateClient(id: number, body: ClientDTO): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  
    if (body.username !== undefined) {
      client.username = body.username;
    }
    if (body.email !== undefined) {
      client.email = body.email;
    }
    if (body.telephone !== undefined) {
      client.telephone = body.telephone;
    }
    if (body.password !== undefined) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      client.password = hashedPassword;
    }
    if (body.typepack !== undefined) {
      client.typepack = body.typepack;
    }
  
    const updatedClient = await this.clientRepository.save(client);
    return updatedClient;
  }
  async getClientById(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return client;
}
async updateClientStatus(id: number, status: string): Promise<Client> {
  const client = await this.clientRepository.findOne({ where: { id } });
  if (!client) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }

  // Validate status
  if (status !== 'activated' && status !== 'deactivated') {
    throw new NotFoundException(`Invalid status: ${status}`);
  }

  client.status = status === 'activated' ? Status.ACTIVATED : Status.DEACTIVATED;
  return await this.clientRepository.save(client);
}
}
  
