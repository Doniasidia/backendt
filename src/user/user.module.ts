import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { UserRepository } from './user.repository';
import { User } from './user';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    imports: [
    TypeOrmModule.forFeature([User]),
    
],
  providers: [UserService,Repository,UserRepository],
  exports: [UserService],
})
export class UserModule {}
