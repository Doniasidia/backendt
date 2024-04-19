//groupes.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupesService } from '@client/groupes/groupes.service'; 
import { Groupe } from '@client/groupes/groupes.entity';
import { GroupesController } from '@client/groupes/groupes.controller';
import { Plan } from '@client/plans/plans.entity';
import { PlansModule } from '@client/plans/plans.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Groupe,Plan]), 
    PlansModule// Include GroupeRepository in TypeOrmModule's forFeature()
  ],
  providers: [GroupesService],
  controllers: [GroupesController],
})
export class GroupesModule {}