import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProspectsIndustryTypesDocument = HydratedDocument<ProspectsIndustryTypes>;

@Schema()
export class ProspectsIndustryTypes {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1, max: 5 })
  score: number;
}

export const ProspectsIndustryTypesSchema = SchemaFactory.createForClass(ProspectsIndustryTypes);
