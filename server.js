import app from './app.js';

const PORT = 8000;
const server = app.listen(PORT, () => {
	console.log(`Express server running at http://localhost:${PORT}`);
});

// プログラムを終了する
const exitHandler = () => {
	console.log('プログラムを終了します...');
	server.close(() => {
		console.log('サーバを正常に終了しました');
	});
};
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
process.on('SIGQUIT', exitHandler);
