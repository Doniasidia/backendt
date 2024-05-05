//plans.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansController } from '@client/plans/plans.controller';
import { PlansService } from '@client/plans/plans.service';
import { Plan } from '@client/plans/plans.entity';
import { Client } from '@admin/client/client.entity';
import { jwtConstants } from '@auth/constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Plan,Client]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '100000s' },
  }),
],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}