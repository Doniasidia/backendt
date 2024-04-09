//groupes.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupesService } from '@client/groupes/groupes.service'; 
import { Groupe } from '@client/groupes/groupes.entity';
import { GroupesController } from '@client/groupes/groupes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Groupe])],
  controllers: [GroupesController],
  providers: [GroupesService],
})
export class GroupesModule {}