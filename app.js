import express from "express";
const app = express();
const port = 3001;

import route from "./routes/routes.js";
app.use(route);
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
