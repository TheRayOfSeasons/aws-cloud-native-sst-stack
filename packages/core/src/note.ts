import { z } from 'zod';
import crypto from 'crypto';
import { event } from './event';
import { Table } from 'sst/node/table';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetCommand,
  PutCommand,
  DynamoDBDocumentClient,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  type PutCommandOutput,
  type DeleteCommandOutput
} from '@aws-sdk/lib-dynamodb';
import { DateTime } from 'luxon';
export * as Note from './note';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ?? 'us-east-1'
});
const docClient = DynamoDBDocumentClient.from(client);

export interface NoteDto {
  userId: string
  title: string
  content: string
}

const Schema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  dateCreated: z.string(),
  dateUpdated: z.string()
});

export const Events = {
  Created: event('note.created', Schema)
};

const createTimestamp = (): string => DateTime.now().toMillis().toString();

export async function create (note: NoteDto): Promise<PutCommandOutput> {
  const item: z.infer<typeof Schema> = {
    id: crypto.randomUUID(),
    dateCreated: createTimestamp(),
    dateUpdated: createTimestamp(),
    ...note
  };
  const command = new PutCommand({
    TableName: Table.Notes.tableName,
    Item: item
  });
  const response = await docClient.send(command);
  await Events.Created.publish(item);
  return response;
}

export async function update (id: string, note: NoteDto): Promise<Record<string, any> | undefined> {
  const command = new UpdateCommand({
    TableName: Table.Notes.tableName,
    Key: {
      id,
      userId: note.userId
    },
    UpdateExpression: 'set' +
     ' title = :title,' +
     ' content = :content,' +
     ' dateUpdated = :dateUpdated',
    ExpressionAttributeValues: {
      ':title': note.title,
      ':content': note.content,
      ':dateUpdated': createTimestamp()
    },
    ReturnValues: 'ALL_NEW'
  });
  const response = await docClient.send(command);
  return response.Attributes;
}

export async function get ({
  id,
  userId
}: {
  id: string
  userId: string
}): Promise<Record<string, any> | undefined> {
  const command = new GetCommand({
    TableName: Table.Notes.tableName,
    Key: {
      id,
      userId
    }
  });
  const response = await docClient.send(command);
  return response.Item;
}

export async function list ({
  userId
}: {
  userId: string
}): Promise<{
    count: number | undefined
    data: Array<Record<string, any>> | undefined
  }> {
  const command = new QueryCommand({
    TableName: Table.Notes.tableName,
    KeyConditionExpression: 'userId = :userId',
    IndexName: 'dateCreatedIndex',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ProjectionExpression: 'id, userId, title'
  });
  const response = await docClient.send(command);
  return {
    count: response.Count,
    data: response.Items
  };
}

export async function remove ({
  id,
  userId
}: {
  id: string
  userId: string
}): Promise<DeleteCommandOutput> {
  const command = new DeleteCommand({
    TableName: Table.Notes.tableName,
    Key: {
      id,
      userId
    }
  });
  const response = await docClient.send(command);
  return response;
}
