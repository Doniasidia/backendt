//groupes.controller
import { Controller, Get, Post, Delete, Param, Body, NotFoundException, Patch, Request, UseGuards } from '@nestjs/common';
import { GroupsService } from '@client/groups/groups.service';
import { GroupDTO } from '@client/groups/groups.dto';
import { Group } from '@client/groups/groups.entity';
import { AuthGuard } from '@auth/auth.guard';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getAllGroups(@Request() req): Promise<Group[]> {
    // Get the user ID from the request object (assuming it's stored in the user property)
    const clientId = req.user.sub;
    return await this.groupsService.findGroupsByClientId(clientId);
  }

  
  @UseGuards(AuthGuard)
  @Post()
  async createGroup(@Body() groupDTO: GroupDTO, @Request() req): Promise<Group> {
    // Get the user ID from the request object (assuming it's stored in the user property)
    const clientId = req.user.sub;
    return await this.groupsService.createGroup(groupDTO, clientId);
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
  
@Patch(':id/selected-slots')
async updateSelectedSlots(@Param('id') id: number, @Body() selectedSlots: string[]): Promise<Group> {
  try {
    return await this.groupsService.updateSelectedSlots(id, selectedSlots);
  } catch (error) {
    throw new NotFoundException(error.message);
  }
}

}
