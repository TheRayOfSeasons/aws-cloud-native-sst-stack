import { ApiHandler } from "sst/node/api";
import { Note } from "@aws-cloud-native-sst-stack/core/note";
import { AuthorizedHandler } from "./middleware/session";

export const create = AuthorizedHandler(async (evt) => {
  const body = JSON.parse(evt.body || '');
  await Note.create(body);

  return {
    statusCode: 201,
    body: JSON.stringify(evt),
  };
}, {
  authorizedUsers: ['user'],
});

export const get = AuthorizedHandler(async (evt) => {
  const id = evt.pathParameters?.id || '';
  if (id) {
    const data = await Note.get(id);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data,
      }),
    }
  }
  return {
    statusCode: 404,
    body: JSON.stringify({
      message: "Not Found",
    }),
  }
}, {
  authorizedUsers: ['user'],
});
