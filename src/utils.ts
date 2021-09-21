import { Readable } from "stream";

import Ffmpeg from "fluent-ffmpeg";

import { AudioCodecs, StreamingOptions } from "#/types";

const filterAndFormatAudioCodecs = (codecs: Ffmpeg.Codecs): AudioCodecs[] => {
  const codecsEntries = Object.entries(codecs);

  return codecsEntries.filter(([_, value]) => value.type === "audio")
    .map(([codecName, codecInfo]) => ({
      name: codecName,
      description: codecInfo.description,
    }));
};

export const getNewReadableStream = (): Readable => new Readable({
  read() {
    /**
     * This methods do anything, but it's necessary your declaration because
     * the Node.JS Readable complains if this method is not implemented/declared
     */
  },
});

export const startStreaming = (options: StreamingOptions): Ffmpeg.FfmpegCommand => {
  const ffmpeg = Ffmpeg()
    .on("start", (commandLine) => options.onStart(commandLine))
    .on("error", (errorLines) => options.onError(errorLines))
    .on("stderr", (stderr) => options.onStderr(stderr))
    .input(options.input)
    .withNativeFramerate()
    .withNoVideo()
    .withOutputFormat("rtp")
    .output(`rtp://${options.address}:${options.port}`);

  if (options.bitrate !== undefined && options.bitrate !== "") {
    ffmpeg.withAudioBitrate(options.bitrate);
  }

  ffmpeg.run();
  return ffmpeg;
};

export const getFfmpegAvailableAudioCodecs = async (): Promise<AudioCodecs[]> => new Promise((resolve, reject) => {
  const audioCodecs: AudioCodecs[] = [];
  Ffmpeg().getAvailableCodecs((error: Error | null, codecs) => {
    if (error !== null) {
      const errorMessage = "Unable to retrieve available codecs";
      // eslint-disable-next-line no-console
      console.log(errorMessage, error);
      reject(error);
    }

    const filteredCodecs = filterAndFormatAudioCodecs(codecs);
    filteredCodecs.forEach((c) => audioCodecs.push(c));
    resolve(audioCodecs);
  });
});
