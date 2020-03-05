import { config } from "dotenv";
import { SiteClient } from "datocms-client";
import { generateEntry } from "./generator";
import ora from "ora";

const createRecord = async (client: any, itemType: string) => {
  const gatsbypreview = null;

  const item = generateEntry();
  return client.items
    .create({ itemType, gatsbypreview, ...item })
    .catch((err: Error) => console.error(err));
};

const parallel = 15;

const run = async () => {
  const spinner = ora("Generating records").start();
  config();
  const { DATO_TOKEN } = process.env;
  if (!DATO_TOKEN) {
    throw new Error("No Dato token");
  }
  const client = new SiteClient(DATO_TOKEN);
  const models = await client.itemTypes.all();
  const { id: itemType } = models.find((m: any) => m.apiKey === "blog_post");
  if (!itemType) {
    throw new Error("Blog post type not found");
  }
  for (let i = 0; i < 8500; i += parallel) {
    await Promise.all(
      new Array(parallel)
        .fill(undefined)
        .map(() => createRecord(client, itemType))
    );
    spinner.text = `Created record ${i}.`;
  }
  spinner.stop();
};
run();
