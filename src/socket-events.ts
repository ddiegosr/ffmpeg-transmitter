import { Socket } from "socket.io";

import { StartStreamEventData, Streams } from "#/types";
import { getFfmpegAvailableAudioCodecs, getNewReadableStream, startStreaming } from "#/utils";

export class SocketEventsHandler {
  private dataReceived = false;

  public constructor(
    private readonly socket: Socket,
    private readonly streams: Map<string, Streams>
  ) {
    this.log("Connected");
    this.emitInitialEvents();
  }

  public handle(): void {
    this.socket.on("start-stream", (data: StartStreamEventData) => this.handleStartStreamEvent(data));
    this.socket.on("stop-stream", () => this.handleStopStreamEvent());
    this.socket.on("stream-data", (data) => this.handleStreamDataEvent(data));
    this.socket.on("disconnect", () => this.handleStopStreamEvent());
  }

  private emitInitialEvents() {
    this.emitAvailableCodecsEvent();
  }

  private handleStartStreamEvent(data: StartStreamEventData): void {
    const stream = getNewReadableStream();
    const ffmpegProcess = startStreaming({
      input: stream,
      address: data.address,
      port: data.port,
      codec: data.codec,
      bitrate: data.bitrate,
      onStart: (commandLine) => this.emitStreamStartedEvent(commandLine),
      onError: (error) => this.emitStreamErrorEvent(error),
      onStderr: (stderrLines) => this.emitStreamOutputEvent(stderrLines),
    });

    this.streams.set(this.socket.id, {
      stream,
      process: ffmpegProcess,
    });
  }

  private handleStopStreamEvent(): void {
    const streamData = this.streams.get(this.socket.id);
    if (streamData === undefined) {
      return;
    }
    streamData.stream.destroy();
    streamData.process.kill("SIGTERM");

    this.streams.delete(this.socket.id);
    this.log("Disconnected");
  }

  private handleStreamDataEvent(data: unknown): void {
    if (!this.dataReceived) {
      this.log("Enviando dados");
      this.dataReceived = true;
    }

    const streamData = this.streams.get(this.socket.id);
    if (streamData === undefined) {
      const errorMessage = "Couldn't readable stream for this id";
      this.socket.emit("stream-error", errorMessage);
      throw new Error(errorMessage);
    }

    streamData.stream.push(data);
  }

  private emitAvailableCodecsEvent() {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getFfmpegAvailableAudioCodecs()
      .then((availableCodecs) => {
        this.socket.emit("available-codecs", availableCodecs);
      })
      .catch();
  }

  private emitStreamStartedEvent(data: unknown) {
    this.socket.emit("stream-started", data);
  }

  private emitStreamErrorEvent(data: unknown) {
    this.socket.emit("stream-error", data);
  }

  private emitStreamOutputEvent(data: unknown) {
    this.socket.emit("stream-output", data);
  }

  private log(message: string): void {
    // eslint-disable-next-line no-console
    console.log(`[${this.socket.id}]: ${message}`);
  }
}
