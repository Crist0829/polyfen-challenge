import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ProspectsJobTypes } from './prospects-job-types.schema';
import { ProspectsIndustryTypes } from './prospects-industry-types.schema';

export type ProspectsDocument = HydratedDocument<Prospects>;

@Schema()
export class Prospects {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  country: string;

  @Prop({ type: Types.ObjectId, ref: 'ProspectsJobTypes', required: true })
  jobTitle: ProspectsJobTypes;

  @Prop({ required: true, min: 0 })
  yearsOfExperience: number;

  @Prop({ type: Types.ObjectId, ref: 'ProspectsIndustryTypes', required: true })
  industry: ProspectsIndustryTypes;

  @Prop({ required: true, min: 1 })
  companySize: number;

  @Prop({ required: true, min: 1, max: 5 })
  score: number;
}

export const ProspectsSchema = SchemaFactory.createForClass(Prospects);
