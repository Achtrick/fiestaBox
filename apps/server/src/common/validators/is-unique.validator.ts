import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly moduleRef: ModuleRef) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [modelName, field] = args.constraints as [string, string];

    // ask Nest for the Mongoose Model<any> that was registered under this name
    const model = this.moduleRef.get<Model<any>>(getModelToken(modelName), {
      strict: false, // allow lookup even if not in this module’s providers
    });

    if (!model) {
      // you might choose to throw or return false here
      return false;
    }

    const existing = await model.findOne({ [field]: value }).exec();
    return !existing;
  }

  defaultMessage(args: ValidationArguments) {
    const [, field] = args.constraints as [string, string];
    return `${field} "$value" already exists.`;
  }
}
