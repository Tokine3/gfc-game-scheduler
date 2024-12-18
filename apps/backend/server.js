const app = require('./dist/main');
const port = process.env.PORT || 8000;
const cors = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'],
  credentials: true,
};

app.listen(port, () => {
  console.log('Server is running...');
});
