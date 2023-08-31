import { create } from "ipfs-http-client";

export const client = create();

async function getJsonFromIpfs(cid) {
  let asyncitr = client.cat(cid);
  let data = "";
  for await (const itr of asyncitr) {
    data = Buffer.from(itr).toString();
  }
  return JSON.parse(data);
}

export default getJsonFromIpfs;
