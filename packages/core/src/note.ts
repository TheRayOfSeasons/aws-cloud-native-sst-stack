export * as Note from './note';
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
} from '@aws-sdk/lib-dynamodb';
import { DateTime } from 'luxon';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const docClient = DynamoDBDocumentClient.from(client);

export type NoteDto = {
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
  dateUpdated: z.string(),
});

export const Events = {
  Created: event('note.created', Schema),
}

const createTimestamp = () => DateTime.now().toMillis().toString();

export async function create(note: NoteDto) {
  const item: z.infer<typeof Schema> = {
    id: crypto.randomUUID(),
    dateCreated: createTimestamp(),
    dateUpdated: createTimestamp(),
    ...note,
  };
  const command = new PutCommand({
    TableName: Table.Notes.tableName,
    Item: item,
  });
  const response = await docClient.send(command);
  await Events.Created.publish(item);
  return response;
}

export async function update(id: string, note: NoteDto) {
  const command = new UpdateCommand({
    TableName: Table.Notes.tableName,
    Key: {
      id,
    },
    UpdateExpression:
     + 'set user = :user,'
     + 'set title = :title,'
     + 'set content = :content,'
     + 'set dateUpdated = :dateUpdated',
    ExpressionAttributeValues: {
      ':user': note.userId,
      ':title': note.title,
      ':content': note.content,
      ':dateUpdated': createTimestamp(),
    },
    ReturnValues: 'ALL_NEW',
  });
  const response = await docClient.send(command);
  return response.Attributes;
}

export async function get(id: string) {
  const command = new GetCommand({
    TableName: Table.Notes.tableName,
    Key: {
      id,
    },
  });
  const response = await docClient.send(command);
  return response.Item;
}

// TODO: Implement pagination
export async function list({
  userId,
}: {
  userId: string
}) {
  const command = new QueryCommand({
    TableName: Table.Notes.tableName,
    KeyConditionExpression: 'userId = :userId',
    IndexName: 'dateCreatedIndex',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    ProjectionExpression: 'id, userId, title',
  });
  const response = await docClient.send(command);
  return {
    count: response.Count,
    data: response.Items,
  };
}
