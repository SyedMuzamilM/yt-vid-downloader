const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const http = require('http').createServer()

const io = require('socket.io')(http)

const index = (req, res) => {
    res.render('index', {title: "Video Downloader"})
}

const download = (req, res) => {
    res.render('download')
}

const downloadVideo = async (req, res) => {
    const url = req.query.URL;
    console.log(url)

    const info = await ytdl.getInfo('soerr09FYCw');
    const title = info.player_response.videoDetails.title;
    console.log(title);
    const video = ytdl('soerr09FYCw');
    
    const output = path.resolve(process.cwd() + '/output', `${title}.mp4`)

    let startTime;
    video.pipe(fs.createWriteStream(output));
    video.once('response', () => {
        startTime = Date.now();
    });

    video.on('progress', (chunkLength, downloaded, total) => {
        const percent = downloaded / total;
        const downloadedMinutes = (Date.now() - startTime) / 1000 / 60;
        const estimatedDownloadTime = (downloadedMinutes / percent) - downloadedMinutes;
        


        let perDownloaded = (percent * 100).toFixed(2) + "% downloaded"
        let dowVid = (downloaded / 1024 / 1024).toFixed(2) + "MB of " + (total / 1024 / 1024).toFixed(2) + "MB";
        let timeRun = "Running for: " + downloadedMinutes.toFixed(2) + "minutes";
        let extimatedTime = "Extimated time left: " + estimatedDownloadTime.toFixed(2) + "minutes"
    
        io.on('connection', (socket) => {
            socket.emmit('data-downloading', {perDownloaded, dowVid, timeRun, extimatedTime})
        })
    });

    video.on('end', () => [
        res.send({message: "Video Downloaded"})
    ])
}


module.exports = { index, download, downloadVideo}

