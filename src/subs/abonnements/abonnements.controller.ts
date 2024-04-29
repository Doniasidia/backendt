//abonnements.controller
import { Controller, Get, Post, Delete, Param, Body, NotFoundException, Patch } from '@nestjs/common';
import { AbonnementsService } from './abonnements.service';
import { AbonnementDTO } from './abonnements.dto';
import { Abonnement } from './abonnements.entity';

@Controller('abonnements')
export class AbonnementsController {
  constructor(private readonly abonnementsService: AbonnementsService) {}

  @Get()
  async getAllAbonnements(): Promise<Abonnement[]> {
    return await this.abonnementsService.findAll(); // Using the 'findAll' method from the service
  }

  
  @Post()
  async createAbonnement(@Body() AbonnementDTO: AbonnementDTO): Promise<Abonnement> {
    return await this.abonnementsService.createAbonnement(AbonnementDTO);
  }

  @Patch(':id')
  async updateAbonnement(@Param('id') id: number, @Body() AbonnementDTO: AbonnementDTO): Promise<Abonnement> {
   try{
    return await this.abonnementsService.updateAbonnement(id, AbonnementDTO);
   }catch (error){
    throw new NotFoundException(error.message);
   }
  }
  @Patch(':id/deactivate') 
  async deactivateAbonnement(@Param('id') id: number): Promise<Abonnement> {
    try {
      return await this.abonnementsService.deactivateAbonnement(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get(':id')
    async getAbonnementById(@Param('id') id: string): Promise<Abonnement> {
      return await this.abonnementsService.getAbonnementById(+id); 
    }
  
  @Patch(':id/status')
  async updateAbonnementStatus(@Param('id') id: number, @Body() body: { status: string }): Promise<Abonnement> {
    try {
      return await this.abonnementsService.updateAbonnementStatus(id, body.status);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  

}
