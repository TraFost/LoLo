import { Resource } from 'sst';

import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type GetObjectCommandOutput,
  type ListObjectsV2CommandInput,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'node:crypto';
import { ENV } from '../../configs/env.config';

let bucketName: string | undefined;
let bucketRegion: string | undefined;

try {
  // @ts-ignore - SST injects resource metadata at runtime
  const bucket = Resource.storage;
  bucketName = bucket?.name;
  bucketRegion = bucket?.region ?? ENV.aws.region;
} catch (error) {
  if (process.env.NODE_ENV === 'production') {
    throw error;
  }

  bucketName = undefined;
  bucketRegion = undefined;
}

const s3 = bucketName ? new S3Client({ region: bucketRegion }) : null;

function getS3Context() {
  if (!bucketName || !s3) {
    throw new Error('S3 access is disabled in local development. Run through `sst dev` to enable.');
  }

  return { bucketName, s3 } as const;
}

export interface CreatePresignedUrlOptions {
  expiresIn?: number;
  contentType?: string;
}

export interface PutObjectOptions {
  key?: string;
  body: PutObjectCommandInput['Body'];
  contentType?: string;
  metadata?: Record<string, string>;
}

export async function listObjects(prefix?: ListObjectsV2CommandInput['Prefix']) {
  const { bucketName: activeBucketName, s3: client } = getS3Context();

  const command = new ListObjectsV2Command({
    Bucket: activeBucketName,
    Prefix: prefix,
  });

  const response = await client.send(command);
  return response.Contents ?? [];
}

export async function getObject(key: string): Promise<GetObjectCommandOutput> {
  const { bucketName: activeBucketName, s3: client } = getS3Context();

  const command = new GetObjectCommand({
    Bucket: activeBucketName,
    Key: key,
  });

  return client.send(command);
}

async function bodyToString(body: GetObjectCommandOutput['Body']): Promise<string> {
  if (!body) return '';
  if (typeof body === 'string') return body;
  if (body instanceof Uint8Array) {
    return Buffer.from(body).toString('utf8');
  }
  if (typeof (body as any).transformToString === 'function') {
    return (body as any).transformToString();
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of body as any) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function getJSONFromS3<T>(key: string): Promise<T> {
  const response = await getObject(key);
  const text = await bodyToString(response.Body);

  if (!text) {
    throw new Error(`Empty object returned for key ${key}`);
  }

  return JSON.parse(text) as T;
}

export async function putObject(options: PutObjectOptions) {
  const { bucketName: activeBucketName, s3: client } = getS3Context();

  const { key = randomUUID(), body, contentType, metadata } = options;

  const command = new PutObjectCommand({
    Bucket: activeBucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
  });

  await client.send(command);
  return { key };
}

export async function createPresignedUploadUrl(
  key: string,
  options: CreatePresignedUrlOptions = {},
) {
  const { bucketName: activeBucketName, s3: client } = getS3Context();

  const { expiresIn = 15 * 60, contentType } = options;
  const command = new PutObjectCommand({
    Bucket: activeBucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export async function createPresignedDownloadUrl(
  key: string,
  options: CreatePresignedUrlOptions = {},
) {
  const { bucketName: activeBucketName, s3: client } = getS3Context();

  const { expiresIn = 15 * 60 } = options;
  const command = new GetObjectCommand({
    Bucket: activeBucketName,
    Key: key,
  });

  return getSignedUrl(client, command, { expiresIn });
}
