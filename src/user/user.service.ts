import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { UserRepository } from '@user/user.repository'; 
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService {
  private userRepository: Repository<User>;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.userRepository = this.dataSource.getRepository(User);
  }

  async findOneByEmail(emailOrTelephone: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: [{ email: emailOrTelephone }, { telephone: emailOrTelephone }] });
  }
  async getUserById(userId: string) {
    const id = parseInt(userId); // Assuming clientId is a string
    return await this.userRepository.findOne({ where: { id } });
  }
  
}
