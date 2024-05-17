// subscriber.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Subscriber } from '@client/subscribers/subscribers.entity';

@Injectable()
export class SubscriberRepository {
  private subscriberRepository: Repository<Subscriber>;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.subscriberRepository = this.dataSource.getRepository(Subscriber);
  }

  async findOneByEmail(email: string): Promise<Subscriber | undefined> {
    return this.subscriberRepository.findOne({ where: { email } });
  }

  async save(subscriber: Subscriber): Promise<Subscriber | undefined> {
    return this.subscriberRepository.save(subscriber);
  }

}
