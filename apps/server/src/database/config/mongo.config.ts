import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongoConfig: { uri: string; options?: MongooseModuleOptions } = {
  uri: process.env.MONGO_URI,
};
