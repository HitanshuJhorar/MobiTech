import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initAdmin } from "./utils/initAdmin.js";

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await initAdmin();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
