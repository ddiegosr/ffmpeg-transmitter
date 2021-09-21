import { Server } from "http";
import path from "path";

import express from "express";
import cors from "cors";
import { Server as IOServer } from "socket.io";
import { StatusCodes } from "http-status-codes";

import { Streams } from "#/types";
import { SocketEventsHandler } from "#/socket-events";

const app = express();
const server = new Server(app);
const io = new IOServer(server, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

const streams = new Map<string, Streams>();

app.use(cors());

app.get("/public", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("OK");
});

io.on("connection", (socket) => {
  const socketHandler = new SocketEventsHandler(socket, streams);
  socketHandler.handle();
});

export { server };
