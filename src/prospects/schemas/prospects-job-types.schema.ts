import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProspectsJobTypesDocument = HydratedDocument<ProspectsJobTypes>;

@Schema()
export class ProspectsJobTypes {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 1, max: 5 })
  score: number;
}

export const ProspectsJobTypesSchema = SchemaFactory.createForClass(ProspectsJobTypes);
