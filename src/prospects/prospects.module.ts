import { Module } from '@nestjs/common';
import { ProspectsController } from './prospects.controller';
import { ProspectsService } from './prospects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProspectsJobTypes, ProspectsJobTypesSchema } from './schemas/prospects-job-types.schema';
import { ProspectsIndustryTypes, ProspectsIndustryTypesSchema } from './schemas/prospects-industry-types.schema';
import { Prospects, ProspectsSchema } from './schemas/prospects.schema';

@Module({
  imports : [
    MongooseModule.forFeature([
      { name: ProspectsJobTypes.name, schema: ProspectsJobTypesSchema },
      { name: ProspectsIndustryTypes.name, schema: ProspectsIndustryTypesSchema },
      { name: Prospects.name, schema: ProspectsSchema },
    ])
  ],
  controllers: [ProspectsController],
  providers: [ProspectsService]
})
export class ProspectsModule {}
