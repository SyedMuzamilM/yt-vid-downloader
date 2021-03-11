const readline = require('readline');
const fs = require('fs');
const cp = require('child_process');
const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');

const timeController = async (req, res) => {
        
    const url = 'a6gWOdE5y3I';
    const timeStart = '00:01:00';
    const timeDuration = '00:00:10';
    const output = `${process.cwd()}/output/out.mkv`;

    const video = ytdl(url);

    // Print download progress.
    process.stdout.write('downloading video...');
    video.on('progress', (chunkLength, downloaded, total) => {
    const percent = downloaded / total;
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`downloading video... ${(percent * 100).toFixed(2)}%`);
    });

    video.pipe(fs.createWriteStream(`${process.cwd()}/output/tmp.mp4`)).on('finish', () => {
    const ffmpegProcess = cp.spawn(ffmpeg, [
        '-y', '-v', 'error', // -y overwrites output files without asking, "-v"
        '-progress', 'pipe:3', // "-progress" Send programme friendly progress information to the url
        '-i', `${process.cwd()}/output/tmp.mp4`, // "-i" input file url
        '-vcodec', 'copy', '-acodec', 'copy', // "-vcodec" Set the video codec. This is an alias for -codec:v
        '-ss', timeStart, '-t', timeDuration, // "-t" stops writing the output file when duration reatches timeDuration
        '-f', 'matroska', 'pipe:4', // "-f" force input or output file format
    ], {
        windowsHide: true,
        stdio: [
        'inherit', 'inherit', 'inherit',
        'pipe', 'pipe',
        ],
    });

    process.stdout.write('\n');
    ffmpegProcess.stdio[3].on('data', chunk => {
        readline.cursorTo(process.stdout, 0);
        const args = chunk.toString().trim().split('\n')
        .reduce((acc, line) => {
            let parts = line.split('=');
            acc[parts[0]] = parts[1];
            return acc;
        }, {});
        process.stdout.write(`cutting video... ${args.progress}${' '.repeat(3)}`);
    });

    ffmpegProcess.on('close', () => {
        process.stdout.write(`\nsaved to ${output}\n`);
    });

    ffmpegProcess.stdio[4].pipe(fs.createWriteStream(output));
    });
}

module.exports = timeController;