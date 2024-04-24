//groupes.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from '@client/groups/groups.service'; 
import { Group } from '@client/groups/groups.entity';
import { GroupsController } from '@client/groups/groups.controller';
import { Plan } from '@client/plans/plans.entity';
import { PlansModule } from '@client/plans/plans.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Group,Plan]), 
    PlansModule// Include GroupeRepository in TypeOrmModule's forFeature()
  ],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}