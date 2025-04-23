import { SetMetadata } from '@nestjs/common';

export const OWNER_OPTIONS = 'owner:options';
export interface OwnerOptions {
  serviceToken: string; // token you used in Nest’s DI
  param: string; // route‑param key
  ownerField: string; // resource owner field
}
export const Owner = (opts: OwnerOptions) => SetMetadata(OWNER_OPTIONS, opts);
