import { Note } from '@aws-cloud-native-sst-stack/core/note';
import { useJsonBody } from 'sst/node/api';
import { z } from 'zod';
import { createHandler } from './utils/handler.helpers';
import { useSession } from 'sst/node/auth';

export const create = createHandler({
  auth: {
    allowedUserTypes: ['user'],
  },
  body: {
    schema: z.object({
      title: z.string(),
      content: z.string(),
    }),
  },
  handler: async () => {
    const body = useJsonBody();
    const session = useSession();
    const response = await Note.create({
      // @ts-ignore
      userId: session.properties.userId,
      title: body.title,
      content: body.content,
    });

    return {
      statusCode: 201,
      body: JSON.stringify(response),
    };
  },
});

export const update = createHandler({
  auth: {
    allowedUserTypes: ['user'],
  },
  body: {
    schema: z.object({
      title: z.string(),
      content: z.string(),
    }),
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters?.id || '';
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing ID',
        }),
      }
    }
    const body = useJsonBody();
    const session = useSession();
    const response = await Note.update(id, {
      // @ts-ignore
      userId: session.properties.userId,
      title: body.title,
      content: body.content,
    });

    return {
      statusCode: 201,
      body: JSON.stringify(response),
    };
  },
});

export const get = createHandler({
  auth: {
    allowedUserTypes: ['user'],
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters?.id || '';
    const notFoundResponse = {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not Found',
      }),
    };
    if (id) {
      const data = await Note.get(id);
      if (!data) {
        return notFoundResponse;
      }
      const session = useSession();
      // @ts-ignore
      const userId = session.properties.userId;
      if (data.user !== userId) {
        return {
          statusCode: 403,
          body: JSON.stringify({
            message: 'Forbidden',
          })
        }
      }
      return {
        statusCode: 200,
        body: JSON.stringify({
          data,
        }),
      }
    }
    return notFoundResponse;
  },
});

export const list = createHandler({
  auth: {
    allowedUserTypes: ['user'],
  },
  handler: async () => {
    const session = useSession();
    const response = Note.list({
      // @ts-ignore
      userId: session.properties.userId,
    });
    return {
      statusCode: 201,
      body: JSON.stringify(response),
    };
  },
});
