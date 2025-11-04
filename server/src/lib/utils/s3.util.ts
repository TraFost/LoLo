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

// @ts-ignore
const bucket = Resource.storage;
const bucketName = bucket?.name;
const bucketRegion = bucket?.region ?? ENV.aws.region;

if (!bucketName) {
  throw new Error('Missing S3 bucket name. Ensure the SST bucket is linked to this function.');
}

const s3 = new S3Client({ region: bucketRegion });

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
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });

  const response = await s3.send(command);
  return response.Contents ?? [];
}

export async function getObject(key: string): Promise<GetObjectCommandOutput> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return s3.send(command);
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
  const { key = randomUUID(), body, contentType, metadata } = options;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
    Metadata: metadata,
  });

  await s3.send(command);
  return { key };
}

export async function createPresignedUploadUrl(
  key: string,
  options: CreatePresignedUrlOptions = {},
) {
  const { expiresIn = 15 * 60, contentType } = options;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3, command, { expiresIn });
}

export async function createPresignedDownloadUrl(
  key: string,
  options: CreatePresignedUrlOptions = {},
) {
  const { expiresIn = 15 * 60 } = options;
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn });
}
