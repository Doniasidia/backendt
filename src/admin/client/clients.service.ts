import {  Injectable, NotFoundException } from '@nestjs/common';
import { Client } from './client.entity';
import { ClientDTO } from './client.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
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
    const newClient = new Client();
    newClient.nomEtablissement = body.nomEtablissement;
    newClient.email = body.email;
    newClient.telephone = body.telephone;
    newClient.password = body.password; // Consider hashing password before saving
    newClient.typepack = body.typepack;
    const savedClient = await this.clientRepository.save(newClient);
    return savedClient;
  }
  async deleteClient(id: number): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    await this.clientRepository.remove(client);
  }

  async updateClient(id: number, body: ClientDTO): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } }); // Add an empty relations option
    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    client.nomEtablissement = body.nomEtablissement;
    client.email = body.email;
    client.telephone = body.telephone;
    client.password = body.password; // Consider hashing password before saving
    client.typepack = body.typepack;
    const updatedClient = await this.clientRepository.save(client);
    return updatedClient;
  }
  
}