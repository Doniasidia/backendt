//plans.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansController } from '@client/plans/plans.controller';
import { PlansService } from '@client/plans/plans.service';
import { Plan } from '@client/plans/plans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}