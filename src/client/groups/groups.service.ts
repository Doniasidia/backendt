//groupes.service
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupDTO} from '@client/groups/groups.dto'; 
import { Group } from '@client/groups/groups.entity';
import { Status } from '@enums/status';
import { Plan } from '@client/plans/plans.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  async findAll(): Promise<Group[]> {
    return await this.groupRepository.find();
  }

  async createGroup(groupDTO: GroupDTO): Promise<Group> {
    try{
    const plan = await this.planRepository.findOne({ where: { id: groupDTO.planId } });
    const newGroup = new Group();
    newGroup.name = groupDTO.name;
    newGroup.planId = plan?.id; 
    const savedGroup = await this.groupRepository.save(newGroup);
        
    return savedGroup;
} catch (error) {
    // Handle any errors that occur during the process
    console.error('Error creating subscriber:', error);
    throw error; // Optionally, you can throw the error to be handled by the caller
}
}
  
  

   
   
  async deactivateGroup(id: number): Promise<Group> {
    const group= await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    
    group.status = Status.DEACTIVATED;
    return await this.groupRepository.save(group);
  }
  


  
   
  async getGroupById(id: number): Promise<Group> {
    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
    return group;
}
async updateGroupStatus(id: number, status: string): Promise<Group> {
  const Group = await this.groupRepository.findOne({ where: { id } });
  if (!Group) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }

  // Validate status
  if (status !== 'activated' && status !== 'deactivated') {
    throw new NotFoundException(`Invalid status: ${status}`);
  }

  Group.status = status === 'activated' ? Status.ACTIVATED : Status.DEACTIVATED;
  return await this.groupRepository.save(Group);
}

async updateGroup(id: number, body: GroupDTO): Promise<Group> {
  const group= await this.groupRepository.findOne({ where: { id } });
  if (!group) {
    throw new NotFoundException(`Client with ID ${id} not found`);
  }

  if (body.name !== undefined) {
    group.name = body.name;
  }
 
 
 
 


  const updatedGroup = await this.groupRepository.save(group);
  return updatedGroup;
}
}
