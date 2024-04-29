//Abonnements.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbonnementsService } from './abonnements.service';
import { Abonnement } from './abonnements.entity';
import { AbonnementsController } from './abonnements.controller';
import { Plan } from '@client/plans/plans.entity';
import { PlansModule } from '@client/plans/plans.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Abonnement,Plan]), 
    PlansModule// IncludeRepository in TypeOrmModule's forFeature()
  ],
  providers: [AbonnementsService],
  controllers: [AbonnementsController],
})
export class AbonnementsModule {}