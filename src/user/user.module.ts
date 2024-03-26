import { Module } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { Repository } from 'typeorm';
import { UserRepository } from '@user/user.repository';
import { User } from '@user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    imports: [
    TypeOrmModule.forFeature([User]),
    
],
  providers: [UserService,Repository,UserRepository],
  exports: [UserService],
})
export class UserModule {}
