// client.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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

  async findOneByEmailOrTelephone(emailOrTelephone: string): Promise<Client | undefined> {
    // Check if the Client entity has a telephone property
    const hasTelephoneProperty = Object.prototype.hasOwnProperty.call(Client, 'telephone');

    // Construct the query based on whether the Client entity has a telephone property
    const whereClause = hasTelephoneProperty
      ? { email: emailOrTelephone }
      : { where: [{ email: emailOrTelephone }] };

    return this.clientRepository.findOne(whereClause);
  }
}
