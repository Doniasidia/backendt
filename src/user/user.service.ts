import { Injectable } from '@nestjs/common';
import { User } from './user';
import { UserRepository } from './user.repository'; 

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneByEmailByEmailOrTelephone(email: string): Promise<User | undefined> {
    return this.userRepository.findOneByEmailOrTelephone(email);
  }

  
}
