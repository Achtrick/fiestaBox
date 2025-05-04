import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { UploadService } from './services/upload.service';
import {
  DiskProviderOptions,
  UploadOptions,
} from './interfaces/upload-options.interface';
import { STORAGE_PROVIDER, UPLOAD_OPTIONS } from './constants/upload.constants';
import { DiskStorageProvider } from './providers/disk/disk-storage.provider';

@Global()
@Module({})
export class UploadModule {
  static register(options: UploadOptions): DynamicModule {
    const storageProvider = this.createStorageProvider(options);

    return {
      module: UploadModule,
      providers: [
        {
          provide: UPLOAD_OPTIONS,
          useValue: options,
        },
        storageProvider,
        UploadService,
      ],
      exports: [UploadService, UPLOAD_OPTIONS],
    };
  }

  private static createStorageProvider(options: UploadOptions): Provider {
    return {
      provide: STORAGE_PROVIDER,
      useFactory: () => {
        switch (options.provider) {
          case 'disk':
            return new DiskStorageProvider(
              options.providerOptions as DiskProviderOptions
            );
          case 's3':
            throw new Error('S3 provider not implemented yet');
          default:
            throw new Error(`Unknown storage provider: ${options.provider}`);
        }
      },
    };
  }
}
