const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static')
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const streams = [
    { resolution: "640x360", bitrate: "800k" },
    { resolution: "842x480", bitrate: "1400k" },
    { resolution: "1280x720", bitrate: "2800k" },
    { resolution: "1920x1080", bitrate: "5000k" }
];

const input = path.join(__dirname, 'uploads', '100.mp4');
const outputDir = path.join(__dirname, 'converted');
const output = path.join(outputDir, '100.m3u8');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

streams.forEach(stream => {
    ffmpeg(input)
    .addOption('-profile:v', 'baseline')
    .addOption('-level', '3.0')
    .addOption('-start_number', '0')
    .addOption('-hls_time', '10')
    .addOption('-hls_list_size', '0')
    .addOption('-s', stream.resolution)
    .addOption('-b:v', stream.bitrate)
    .addOption('-hls_segment_filename', path.join(outputDir, 'segment_%03d.ts'))
    .addOption('-f', 'hls')
    .output(output)
    .on('end', () => {
        console.log('Conversion finished');
    })
    .on('error', (err) => {
        console.log('Error:', err);
    })
    .run();

})