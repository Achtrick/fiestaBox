export interface UploadOptions {
  provider: 'disk' | 's3' | string;
  providerOptions: DiskProviderOptions | S3ProviderOptions;
}

export interface DiskProviderOptions {
  destination: string;
}

export interface S3ProviderOptions {
  bucket: string;
  region: string;
  accessKey: string;
  secretKey: string;
}
