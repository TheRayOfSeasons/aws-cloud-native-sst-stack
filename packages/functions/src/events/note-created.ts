import { EventHandler } from "sst/node/event-bus";
import { Note } from "@aws-cloud-native-sst-stack/core/note";

export const handler = EventHandler(Note.Events.Created, async (evt) => {
  console.log("Note created", evt);
});
