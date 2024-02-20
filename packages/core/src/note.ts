export * as Note from './note';
import { z } from 'zod';
import crypto from "crypto";
import { event } from './event';
import { Table } from "sst/node/table";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  PutCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});
const docClient = DynamoDBDocumentClient.from(client);

export type NoteDto = {
  user: string
  title: string
  content: string
}

export const Events = {
  Created: event(
    'note.created',
    z.object({
      id: z.string(),
      user: z.string(),
      title: z.string(),
      content: z.string(),
    }),
  )
}

export async function create(note: NoteDto) {
  const item = {
    id: crypto.randomUUID(),
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
