const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const input = path.join(__dirname, 'uploads', '100.mp4');
const outputDir = path.join(__dirname, 'converted','100');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Define the resolutions and bitrates
const resolutions = [
    { name: '1080p', width: 1920, height: 1080, bitrate: '4500k' },
    { name: '720p', width: 1280, height: 720, bitrate: '2500k' },
    { name: '480p', width: 854, height: 480, bitrate: '1000k' },
    { name: '360p', width: 640, height: 360, bitrate: '600k' }
];

const output = path.join(outputDir, 'master.m3u8');

const ffmpegCommand = ffmpeg(input).outputOptions([
    '-profile:v baseline',
    '-level 3.0',
    '-start_number 0',
    '-hls_time 10',
    '-hls_list_size 0',
    '-f hls',
]);

resolutions.forEach((res, index) => {
    ffmpegCommand
        .output(path.join(outputDir, `${res.name}/index.m3u8`))
        .audioCodec('aac')
        .videoCodec('libx264')
        .addOption('-s', `${res.width}x${res.height}`)
        .addOption('-b:v', res.bitrate)
        .addOption('-hls_segment_filename', path.join(outputDir, `${res.name}/segment_%03d.ts`));
});

ffmpegCommand
    .output(output)
    .on('end', () => {
        console.log('All conversions finished and master playlist created');
    })
    .on('error', (err) => {
        console.error('An error occurred during the conversion process:', err);
    })
    .run();
