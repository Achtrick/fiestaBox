import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OWNER_OPTIONS, OwnerOptions } from '../decorators/owner.decorator';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private reflector: Reflector, private moduleRef: ModuleRef) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const opts = this.reflector.get<OwnerOptions>(
      OWNER_OPTIONS,
      ctx.getHandler()
    );
    if (!opts) {
      // No metadata means not an owner‑protected route
      return true;
    }

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    const id = req.params[opts.param];

    const service = this.moduleRef.get(opts.serviceToken, { strict: false });
    const resource = await service.findOne(id);
    if (!resource) throw new NotFoundException();
    if (resource[opts.ownerField] !== user.userId) {
      throw new ForbiddenException();
    }
    return true;
  }
}
