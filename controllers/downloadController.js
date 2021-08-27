// Buildin with nodejs
const fs = require('fs');
const cp = require('child_process');
const readline = require('readline');
// External modules
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');


// This will show the download page on the /download route
exports.show_download_page = (req, res) => {
  res.render("download");
};


// This function will run when the use will send the YouTube video link
exports.show_video_info = async (req, res) => {
  try {
    const ref = req.query.URL;

    const basic_info = await ytdl.getBasicInfo(ref);

    const title = basic_info.videoDetails.title;
    const vid_id = basic_info.player_response.videoDetails.videoId;
    const lengthSeconds = parseInt(
      basic_info.player_response.videoDetails.lengthSeconds
    );
    const length = (lengthSeconds / 60).toFixed(2);
    const thumbnail_length = basic_info.player_response.videoDetails.thumbnail.thumbnails.length
    const thumbnail_url =
      basic_info.player_response.videoDetails.thumbnail.thumbnails[thumbnail_length - 1].url;
    const formats = basic_info.player_response.streamingData.adaptiveFormats;

    let vidQualities = [];

    for (let i = 0; i < formats.length; i++) {
      // console.log(formats[i])
      filesize = (parseInt(formats[i].contentLength) / 1024 / 1024).toFixed(2);
      format_id = formats[i].itag;
      quality_label = formats[i].qualityLabel;
      let ext;
      extension = formats[i].mimeType.slice(6, 10);
      if (extension.includes(";")) {
        ext = extension.replace(";", "");
      } else {
        ext = extension;
      }
      vidQuality = formats[i].quality;
      fps = formats[i].fps;

      let newFormat = {
        filesize,
        format_id,
        quality_label,
        ext,
        vidQuality,
        fps,
      };
      vidQualities.push(newFormat);
    }

    let qualities_client_want;
    if (vidQualities.length == 16) {
      qualities_client_want = vidQualities.slice(0, -8);
    } else if (vidQualities.length == 14) {
      qualities_client_want = vidQualities.slice(0, -6);
    } else {
      qualities_client_want = vidQualities.slice(0, -10);
    }

    res.render("video_info", {
      title,
      vid_id,
      length,
      thumbnail_url,
      qualities_client_want,
    });
  }
  catch (err) {
  console.log(err)
  }
};

exports.download_video = async (req, res) => {
  try {
  const { id, q, title } = req.query;
  const q_id = parseInt(q);

  const ref = `https://www.youtube.com/watch?v=${id}`
  const newTitle = title.slice(0, 25);
  const output = `${newTitle}-${Date.now()}-smvid.mp4`;

  // res.header("Content-Disposition", `attachment; filename=${output}`);
  const tracker = {
  start: Date.now(),
  audio: { downloaded: 0, total: Infinity },
  video: { downloaded: 0, total: Infinity },
  merged: { frame: 0, speed: '0x', fps: 0 },
  };

// Get audio and video streams
const audio = ytdl(id, { quality: 'highestaudio' })
  .on('progress', (_, downloaded, total) => {
    tracker.audio = { downloaded, total };
  });
const video = ytdl(id, { quality: q_id })
  .on('progress', (_, downloaded, total) => {
    tracker.video = { downloaded, total };
  });

// Prepare the progress bar
let progressbarHandle = null;
const progressbarInterval = 1000;
const showProgress = () => {
  readline.cursorTo(process.stdout, 0);
  const toMB = i => (i / 1024 / 1024).toFixed(2);

  process.stdout.write(`Audio  | ${(tracker.audio.downloaded / tracker.audio.total * 100).toFixed(2)}% processed `);
  process.stdout.write(`(${toMB(tracker.audio.downloaded)}MB of ${toMB(tracker.audio.total)}MB).${' '.repeat(10)}\n`);

  process.stdout.write(`Video  | ${(tracker.video.downloaded / tracker.video.total * 100).toFixed(2)}% processed `);
  process.stdout.write(`(${toMB(tracker.video.downloaded)}MB of ${toMB(tracker.video.total)}MB).${' '.repeat(10)}\n`);

  process.stdout.write(`Merged | processing frame ${tracker.merged.frame} `);
  process.stdout.write(`(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${' '.repeat(10)}\n`);

  process.stdout.write(`running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(2)} Minutes.`);
  readline.moveCursor(process.stdout, 0, -3);
};

// Start the ffmpeg child process
const ffmpegProcess = cp.spawn(ffmpeg, [
  // Remove ffmpeg's console spamming
  '-loglevel', '8', '-hide_banner',
  // Redirect/Enable progress messages
  '-progress', 'pipe:3',
  // Set inputs
  '-i', 'pipe:4',
  '-i', 'pipe:5',
  // Map audio & video from streams
  '-map', '0:a',
  '-map', '1:v',
  // Keep encoding
  '-c:v', 'copy',
  // Define output file
  `${process.cwd()}/temp/${output}`,
], {
  windowsHide: true,
  stdio: [
    /* Standard: stdin, stdout, stderr */
    'inherit', 'inherit', 'inherit',
    /* Custom: pipe:3, pipe:4, pipe:5 */
    'pipe', 'pipe', 'pipe',
  ],
});
ffmpegProcess.on('close', () => {
  console.log('done');
  // Cleanup
  process.stdout.write('\n\n\n\n');
  clearInterval(progressbarHandle);

  // Send the file to the User
  res.download(`${process.cwd()}/temp/${output}`, error => {
    if (error) throw error;

    fs.unlinkSync(`${process.cwd()}/temp/${output}`)
  })
});

// Link streams
// FFmpeg creates the transformer streams and we just have to insert / read data
ffmpegProcess.stdio[3].on('data', chunk => {
  // Start the progress bar
  if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
  // Parse the param=value list returned by ffmpeg
  const lines = chunk.toString().trim().split('\n');
  const args = {};
  for (const l of lines) {
    const [key, value] = l.split('=');
    args[key.trim()] = value.trim();
  }
  tracker.merged = args;
});
audio.pipe(ffmpegProcess.stdio[4]);
video.pipe(ffmpegProcess.stdio[5]);

  // ytdl(id, {
  //   quality: q_id,
  //   format: "mp4"
  // }).pipe(res);
  }
  catch (err) {
    console.log(err) 
  }

};
