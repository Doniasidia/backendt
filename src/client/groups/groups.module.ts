//groupes.module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from '@client/groups/groups.service'; 
import { Group } from '@client/groups/groups.entity';
import { GroupsController } from '@client/groups/groups.controller';
import { Plan } from '@client/plans/plans.entity';
import { PlansModule } from '@client/plans/plans.module';
import { jwtConstants } from '@auth/constants';
import { JwtModule } from '@nestjs/jwt';
import { Client } from '@admin/client/client.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Group,Plan,Client]), 
    PlansModule, JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '100000s' },
    }),
  ],
  
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}