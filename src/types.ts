import { Readable } from "stream";

import Ffmpeg from "fluent-ffmpeg";

export interface AudioCodecs {
  name: string;
  description: string;
}

export interface StreamingOptions {
  input: Readable;
  codec: string;
  address: string;
  port: string | undefined;
  bitrate: string | undefined;
  onStart: (commandLine: string) => void;
  onError: (ffmpegError: string) => void;
  onStderr: (stderr: string) => void;
}

export interface StartStreamEventData {
  address: string;
  port: string | undefined;
  codec: string;
  bitrate: string | undefined
}

export interface Streams {
  stream: Readable,
  process: Ffmpeg.FfmpegCommand
}

