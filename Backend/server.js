const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
  try {
    const url = req.query.url;
    const downloadType = req.query.type || 'mp4';

    if (!ytdl.validateURL(url)) {
      return res.status(400).send('Invalid YouTube URL');
    }

    let format = 'mp4';
    if (downloadType === 'mp3') {
      format = 'mp3';
    }

    res.header('Content-Disposition', `attachment; filename="video.${format}"`);
    ytdl(url, { format }).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/video-info', async (req, res) => {
  try {
    const url = req.query.url;
    if (!ytdl.validateURL(url)) {
      return res.status(400).send('Invalid YouTube URL');
    }
    const info = await ytdl.getInfo(url);
    const videoInfo = {
      title: info.videoDetails.title,
      description: info.videoDetails.description,
      thumbnail: info.videoDetails.thumbnail.thumbnails[0].url,
    };
    res.json(videoInfo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
