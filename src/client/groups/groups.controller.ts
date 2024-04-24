//groupes.controller
import { Controller, Get, Post, Delete, Param, Body, NotFoundException, Patch } from '@nestjs/common';
import { GroupsService } from '@client/groups/groups.service';
import { GroupDTO } from '@client/groups/groups.dto';
import { Group } from '@client/groups/groups.entity';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  async getAllGroups(): Promise<Group[]> {
    return await this.groupsService.findAll(); // Using the 'findAll' method from the service
  }

  
  @Post()
  async createGroup(@Body() GroupDTO: GroupDTO): Promise<Group> {
    return await this.groupsService.createGroup(GroupDTO);
  }

  @Patch(':id')
  async updateGroup(@Param('id') id: number, @Body() GroupDTO: GroupDTO): Promise<Group> {
   try{
    return await this.groupsService.updateGroup(id, GroupDTO);
   }catch (error){
    throw new NotFoundException(error.message);
   }
  }
  @Patch(':id/deactivate') 
  async deactivateGroup(@Param('id') id: number): Promise<Group> {
    try {
      return await this.groupsService.deactivateGroup(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get(':id')
    async getGroupById(@Param('id') id: string): Promise<Group> {
      return await this.groupsService.getGroupById(+id); 
    }
  
  @Patch(':id/status')
  async updateGroupStatus(@Param('id') id: number, @Body() body: { status: string }): Promise<Group> {
    try {
      return await this.groupsService.updateGroupStatus(id, body.status);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  

}
