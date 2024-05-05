// admin.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Admin } from '@entity/admin.entity';
@Injectable()
export class AdminRepository {
  private adminRepository: Repository<Admin>;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.adminRepository = this.dataSource.getRepository(Admin);
  }

  async findOneByEmail(email: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne({ where: { email } });
  }

  
}
