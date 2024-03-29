import { Note } from '@aws-cloud-native-sst-stack/core/note';
import { useJsonBody } from 'sst/node/api';
import { z } from 'zod';
import { createHandler } from './utils/handler.helpers';
import { useSession } from 'sst/node/auth';

export const create = createHandler({
  auth: {
    allowedUserTypes: ['user']
  },
  body: {
    schema: z.object({
      title: z.string(),
      content: z.string()
    })
  },
  handler: async () => {
    const body = useJsonBody();
    const session = useSession();
    const response = await Note.create({
      // @ts-expect-error TODO: To fix typing
      userId: session.properties.userId,
      title: body.title,
      content: body.content
    });

    return {
      statusCode: 201,
      body: JSON.stringify(response)
    };
  }
});

export const update = createHandler({
  auth: {
    allowedUserTypes: ['user']
  },
  body: {
    schema: z.object({
      title: z.string(),
      content: z.string()
    })
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters?.id ?? '';
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing ID'
        })
      };
    }
    const body = useJsonBody();
    const session = useSession();
    const response = await Note.update(id, {
      // @ts-expect-error TODO: To fix typing
      userId: session.properties.userId,
      title: body.title,
      content: body.content
    });

    return {
      statusCode: 201,
      body: JSON.stringify(response)
    };
  }
});

export const get = createHandler({
  auth: {
    allowedUserTypes: ['user']
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters?.id ?? '';
    const notFoundResponse = {
      statusCode: 404,
      body: JSON.stringify({
        message: 'Not Found'
      })
    };
    if (id) {
      const session = useSession();
      // @ts-expect-error TODO: To fix typing
      const userId = session.properties.userId;
      const data = await Note.get({
        id,
        userId
      });
      if (!data) {
        return notFoundResponse;
      }
      if (data.userId !== userId) {
        return {
          statusCode: 403,
          body: JSON.stringify({
            message: 'Forbidden'
          })
        };
      }
      return {
        statusCode: 200,
        body: JSON.stringify({
          data
        })
      };
    }
    return notFoundResponse;
  }
});

export const list = createHandler({
  auth: {
    allowedUserTypes: ['user']
  },
  handler: async () => {
    const session = useSession();
    const response = await Note.list({
      // @ts-expect-error TODO: To fix typing
      userId: session.properties.userId
    });
    return {
      statusCode: 201,
      body: JSON.stringify(response)
    };
  }
});

export const remove = createHandler({
  auth: {
    allowedUserTypes: ['user']
  },
  handler: async ({ pathParameters }) => {
    const id = pathParameters?.id ?? '';
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing ID'
        })
      };
    }
    const session = useSession();
    const response = await Note.remove({
      id,
      // @ts-expect-error TODO: To fix typing
      userId: session.properties.userId
    });
    return {
      statusCode: 201,
      body: JSON.stringify(response)
    };
  }
});
