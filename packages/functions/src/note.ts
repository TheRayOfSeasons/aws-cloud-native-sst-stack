import { ApiHandler } from "sst/node/api";
import { Note } from "@aws-cloud-native-sst-stack/core/note";

export const create = ApiHandler(async (evt) => {
  const body = JSON.parse(evt.body || '');
  await Note.create(body);

  return {
    statusCode: 201,
    body: JSON.stringify(evt),
  };
});

export const get = ApiHandler(async (evt) => {
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
});
