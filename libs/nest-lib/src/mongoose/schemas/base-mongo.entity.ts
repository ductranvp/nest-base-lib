import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoAbstract } from '@devhub/nest-lib/common/abstracts/base-mongo.abstract';

@Schema({ timestamps: true })
export class BaseMongoEntity implements BaseMongoAbstract {
  @Prop()
  _id: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const BaseMongoSchema = SchemaFactory.createForClass(BaseMongoEntity);
