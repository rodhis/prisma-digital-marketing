import cors from 'cors';
import express from 'express';
import {router} from './router.js';

const app = express();

app.use(cors());
app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
