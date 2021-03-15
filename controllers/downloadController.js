const ytdl = require("ytdl-core");

// This will show the download page on the /download route
exports.show_download_page = (req, res) => {
  res.render("download");
};

// This function will run when the use will send the YouTube video link
exports.show_video_info = async (req, res) => {
  const ref = req.query.URL;

  const basic_info = await ytdl.getBasicInfo(ref);

  const title = basic_info.videoDetails.title;
  const vid_id = basic_info.player_response.videoDetails.videoId;
  const lengthSeconds = parseInt(
    basic_info.player_response.videoDetails.lengthSeconds
  );
  const length = (lengthSeconds / 60).toFixed(2);
  const thumbnail_url_1 =
    basic_info.player_response.videoDetails.thumbnail.thumbnails[4].url;
  const thumbnail_url_2 =
    basic_info.player_response.videoDetails.thumbnail.thumbnails[3].url;
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
  if (vidQualities.length == 16)
    qualities_client_want = vidQualities.slice(0, -8);
  else if (vidQualities.length == 14)
    qualities_client_want = vidQualities.slice(0, -6);
  else qualities_client_want = vidQualities.slice(0, -10);

  let thumbnail_url;
  if (thumbnail_url_1 === undefined || thumbnail_url_1 === null)
    thumbnail_url = thumbnail_url_2;
  else thumbnail_url = thumbnail_url_2;

  res.render("video_info", {
    title,
    vid_id,
    length,
    thumbnail_url,
    qualities_client_want,
  });
};


exports.download_video = async (req, res) => {
  const {id, q} = req.query;
  const q_id = parseInt(q);

  res.send({id, q_id});
}