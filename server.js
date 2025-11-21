import app from './app.js';

const PORT = 8000;
app.listen(PORT, () => {
	console.log(`Express server running at http://localhost:${PORT}`);
});
