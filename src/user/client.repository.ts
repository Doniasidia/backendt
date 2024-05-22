// client.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Client } from '@admin/client/client.entity';

@Injectable()
export class ClientRepository {
  private clientRepository: Repository<Client>;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.clientRepository = this.dataSource.getRepository(Client);
  }

  async findOneByEmail(email: string): Promise<Client | undefined> {
    return this.clientRepository.findOne({ where: { email } });
  }

  async save(client: Client): Promise<Client> {
    return this.clientRepository.save(client);
  }

  async update(client: Client): Promise<UpdateResult> {
    return this.clientRepository.update(client.id, client);
  }
}