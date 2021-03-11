const readline = require('readline');
const ffmpeg = require('fluent-ffmpeg');
const ytdl = require('ytdl-core');

const mp4tomp3 = async (req, res) => {
   const url = req.query.URL
    // https://www.youtube.com/watch?v=a6gWOdE5y3I
    console.log(url)
   const id = url.slice(-11)
   console.log(id)

   const info = await ytdl.getInfo(id)
   const title = info.player_response.videoDetails.title

    
    const stream = ytdl(id, {
      quality: 'highestaudio',
    });
    
    const start = Date.now();
    ffmpeg(stream)
      .audioBitrate(128)
      .save(`${process.cwd()}/output/mp3/${title}.mp3`)
      .on('progress', p => {
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${p.targetSize}kb downloaded`);
      })
      .on('end', () => {
        console.log(`\ndone, thanks - ${(Date.now() - start) / 1000}s`);
      });
}

module.exports = mp4tomp3;