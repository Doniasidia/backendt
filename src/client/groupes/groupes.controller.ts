//groupes.controller
import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, Patch } from '@nestjs/common';
import { GroupesService } from '@client/groupes/groupes.service';
import { GroupeDTO} from '@client/groupes/groupes.dto'; 
import { Groupe } from '@client/groupes/groupes.entity';

@Controller('groupes')
export class GroupesController {
  constructor(private readonly groupesService: GroupesService) {}

  @Get()
  async getAllGroupes(): Promise<Groupe[]> {
    return await this.groupesService.findAll(); // Using the 'findAll' method from the service
  }

  
  @Post()
  async createGroupe(@Body() GroupeDTO: GroupeDTO): Promise<Groupe> {
    return await this.groupesService.createGroupe(GroupeDTO);
  }

  @Put(':id')
  async updateGroupe(@Param('id') id: number, @Body() GroupeDTO: GroupeDTO): Promise<Groupe> {
    return await this.groupesService.updateGroupe(id, GroupeDTO);
  }
  @Patch(':id/deactivate') 
  async deactivateGroupe(@Param('id') id: number): Promise<Groupe> {
    try {
      return await this.groupesService.deactivateGroupe(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get(':id')
    async getGroupeById(@Param('id') id: string): Promise<Groupe> {
      return await this.groupesService.getGroupeById(+id); 
    }
  
  @Patch(':id/status')
  async updateGroupeStatus(@Param('id') id: number, @Body() body: { status: string }): Promise<Groupe> {
    try {
      return await this.groupesService.updateGroupeStatus(id, body.status);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  

}
