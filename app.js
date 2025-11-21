import express from 'express';
import cors from 'cors';
import streamRouter from './route/stream.js';

const app = express();

// CORS許可（これだけで全ドメインからのアクセスを許可できます）
app.use(cors());

app.use(express.static('public'));

app.use('/stream', streamRouter);

export default app;
