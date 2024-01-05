import express from "express";
const app = express();
const port = process.env.PORT;

import route from "./routes/routes.js";
app.use(route);
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
