import express from 'express';

const router = express.Router();

router.get('', (req, res) => {
	// 1. SSE用のヘッダ設定
	// Expressでも基本は同じですが、res.setHeaderを使います
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');

	// 送信するメッセージ
	const message = "Expressサーバからの通知です！\nルート定義やミドルウェアが使えるので、大規模なアプリでも管理しやすくなりますね。";
	const chars = message.split('');
	let index = 0;

	// 2. 定期的にデータを送信
	const intervalId = setInterval(() => {
		if (index < chars.length) {
			// data: <内容>\n\n の形式で送信
			res.write(`data: ${chars[index]}\n\n`);
			index++;
		} else {
			// 終了合図
			res.write('data: [DONE]\n\n');
			clearInterval(intervalId);
			res.end(); // レスポンス完了
		}
	}, 100); // 0.1秒間隔

	// 3. 接続終了時のクリーンアップ（重要！）
	// クライアントがブラウザを閉じたりした場合、ここが呼ばれます
	req.on('close', () => {
		clearInterval(intervalId);
		console.log('クライアントが接続を切りました');
	});
});

export default router;
