//Paiements.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PaiementsService } from '@client/paiements/paiements.service'; 
import { Paiement } from '@client/paiements/paiements.entity';
import { PaiementsController } from '@client/paiements/paiements.controller';
import { Plan } from '@client/plans/plans.entity';
import { PlansModule } from '@client/plans/plans.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Paiement,Plan]), 
    PlansModule// IncludeRepository in TypeOrmModule's forFeature()
  ],
  providers: [PaiementsService],
  controllers: [PaiementsController],
})
export class PaiementsModule {}