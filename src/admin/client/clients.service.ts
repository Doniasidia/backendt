// client.service.ts

import {  Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@admin/client/client.entity';
import { ClientDTO } from '@admin/client/client.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Status } from '@enums/status';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  async createClient(body: ClientDTO): Promise<Client> {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newClient = new Client();
    newClient.username = body.nomEtablissement;
    newClient.email = body.email;
    newClient.telephone = body.telephone;
    newClient.password = hashedPassword; 
    newClient.typepack = body.typepack;
    const savedClient = await this.clientRepository.save(newClient);
    return savedClient;
  }
  async deleteClient(id: number): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  
    client.status = Status.DEACTIVATED;
    await this.clientRepository.save(client);
  }

  async updateClient(id: number, body: ClientDTO): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  
    if (body.nomEtablissement !== undefined) {
      client.username = body.nomEtablissement;
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
  
}