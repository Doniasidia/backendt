// client.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@admin/client/client.entity';
import { ClientDTO } from '@admin/client/client.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Status } from '@enums/status';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private authService: AuthService,
  ) { }
  async getClientData(clientId: string) {
    const id = parseInt(clientId); // Assuming clientId is a string
    return await this.clientRepository.findOne({ where: { id } });
  }
  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  async createClient(clientDTO: ClientDTO): Promise<Client> {
    const newClient = new Client();
    newClient.username = clientDTO.username;
    newClient.email = clientDTO.email;
    newClient.telephone = clientDTO.telephone;
    newClient.typepack = clientDTO.typepack;
    newClient.addressLine = clientDTO.addressLine;
    newClient.description = clientDTO.description;

    const savedClient = await this.clientRepository.save(newClient);

    // generate email token
    const token = await this.authService.createEmailToken(savedClient.email, true);
    // send email
    const sent = await this.authService.sendVerifyEmail(savedClient.email, token, true);

    if (sent) {
      return savedClient;
    } else {
      throw new Error(`Email not sent ${savedClient.id}`);
    }
  }

  async addPasswordForClient(email: string, body: { password: string }): Promise<Client> {
    try {
      // Find the subscriber
      const client = await this.clientRepository.findOne({ where: { email } });

      // If subscriber not found, throw an error
      if (!client) {
        throw new NotFoundException(`Client with email ${email} not found`);
      }

      // If subscriber's email is not verified, throw an error
      if (!client.is_verified) {
        throw new Error(`Your email is not verified. Please verify your email before adding a password.`);
      }

      // If a password is provided, hash it and add it to the subscriber
      if (body.password !== undefined) {
        client.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10));
      }

      // Save and Return the updated subscriber
      return await this.clientRepository.save(client);
    } catch (error) {
      // Handle errors and return a friendly message
      throw new Error(`Failed to add password: ${error.message}`);
    }
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

    if (body.typepack !== undefined) {
      client.typepack = body.typepack;
    }
    if (body.addressLine !== undefined) {
      client.addressLine = body.addressLine;
    }
    if (body.description !== undefined) {
      client.description = body.description;
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

