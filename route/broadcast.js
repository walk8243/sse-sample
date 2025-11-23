import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import express from 'express';

const router = express.Router();

// 1. 接続中の全クライアントを保存するリスト（グローバル変数）
let clients = [];

// 接続中の全クライアントにメッセージを送信する
const sendMessage = ({ type = 'message', message }) => {
    for (const client of clients) {
        client.write(`event: ${type}\n`);
        client.write(`data: ${message}\n\n`);
    }
}

router.get('', (req, res) => {
    // ヘッダ設定
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 2. リストに追加 (接続維持)
    // ここではデータを送らず、接続（res）だけを保持しておく
    clients.push(res);

    // 接続が切れたらリストから削除
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

// 3. 別の場所でイベントが発生したら、全員に配る
// 例：3秒ごとに全ユーザへ「現在時刻」を一斉送信
const timer = setInterval(() => {
    console.log(`ブロードキャスト中: 接続数 ${clients.length}`);
    sendMessage({ type: 'timestamp', message: new Date().toLocaleTimeString() });
}, 3000);

// コマンドラインからメッセージを送信する
const rl = readline.createInterface({ input, output });
rl.on('line', (line) => {
    sendMessage({ message: line });
});
rl.on('SIGINT', () => {
    console.log('Ctrl+Cが押されました');
    process.emit('SIGINT');
});

// プログラムを終了する
const exitHandler = () => {
	rl.close();
    sendMessage({ message: '[DONE]' });
    clearInterval(timer);
};
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGQUIT', exitHandler);

export default router;
