import * as stream from "stream";
import { promisify } from "util";
import { createWriteStream } from "fs";
import axios from "axios";

const finished = promisify(stream.finished);

export async function downloadFile(
  fileUrl,
  outputLocationPath,
  token,
  targetUsername
) {
  const writer = createWriteStream(outputLocationPath);
  return axios({
    method: "get",
    url: `${fileUrl}${targetUsername}`,
    responseType: "stream",
    header: {
      Authorizatoin: token,
    },
  }).then((response) => {
    response.data.pipe(writer);
    return finished(writer);
  });
}
