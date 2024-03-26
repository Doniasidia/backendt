import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '@user/user.entity';

@Injectable()
export class UserRepository {
  private userRepository: Repository<User>;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async findOneByEmailOrTelephone(emailOrTelephone: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: [{ email: emailOrTelephone }, { telephone: emailOrTelephone }] });
  }

 

  
}
