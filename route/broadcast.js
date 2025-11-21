import express from 'express';

const router = express.Router();

// 1. 接続中の全クライアントを保存するリスト（グローバル変数）
let clients = [];

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
setInterval(() => {
    const message = `${new Date().toLocaleTimeString()}`;
    console.log(`ブロードキャスト中: 接続数 ${clients.length}`);

	for (const client of clients) {
		client.write(`data: ${message}\n\n`);
	}
}, 3000);

export default router;
