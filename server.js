const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { createServer } = require('http');
const socketIo = require("socket.io");
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err, err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const ws = createServer(app);
const io = socketIo(ws);
io.on("connection", (socket) => {
  socket.on('data', (data) => {
  })
  socket.on("disconnect", () => {
  });

});
const socketIoObject = io;

const port = process.env.PORT || 5115;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });
ws.listen(port, () => {
  console.log(`App running on port ${port}...`)
})


process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err, err.name, err.message);
  ws.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
