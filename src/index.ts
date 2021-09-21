/* eslint-disable */
require("module-alias").addAlias("#", __dirname);

import {server} from "#/server";

const port = process.env.PORT ?? "3000";

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/* eslint-enable */
