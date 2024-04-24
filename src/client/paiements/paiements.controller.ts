//paiements.controller
import { Controller, Get, Post, Delete, Param, Body, NotFoundException, Patch } from '@nestjs/common';
import { PaiementsService } from '@client/paiements/paiements.service';
import { PaiementDTO} from '@client/paiements/paiements.dto'; 
import { Paiement } from '@client/paiements/paiements.entity';

@Controller('paiements')
export class PaiementsController {
  constructor(private readonly paiementsService: PaiementsService) {}

  @Get()
  async getAllPaiements(): Promise<Paiement[]> {
    return await this.paiementsService.findAll(); // Using the 'findAll' method from the service
  }

  
  @Post()
  async createPaiement(@Body() PaiementDTO: PaiementDTO): Promise<Paiement> {
    return await this.paiementsService.createPaiement(PaiementDTO);
  }

  @Patch(':id')
  async updatePaiement(@Param('id') id: number, @Body() PaiementDTO: PaiementDTO): Promise<Paiement> {
   try{
    return await this.paiementsService.updatePaiement(id, PaiementDTO);
   }catch (error){
    throw new NotFoundException(error.message);
   }
  }
  @Patch(':id/deactivate') 
  async deactivatePaiement(@Param('id') id: number): Promise<Paiement> {
    try {
      return await this.paiementsService.deactivatePaiement(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  @Get(':id')
    async getPaiementById(@Param('id') id: string): Promise<Paiement> {
      return await this.paiementsService.getPaiementById(+id); 
    }
  
  @Patch(':id/status')
  async updatePaiementStatus(@Param('id') id: number, @Body() body: { status: string }): Promise<Paiement> {
    try {
      return await this.paiementsService.updatePaiementStatus(id, body.status);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  

}
