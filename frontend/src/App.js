import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [downloadType, setDownloadType] = useState('mp4');

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/download?type=${downloadType}`, {
        params: { url },
        responseType: 'blob',
      });
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `video.${downloadType}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading video:', error);
    }
  };

  const fetchVideoInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/video-info', {
        params: { url },
      });
      setVideoInfo(response.data);
    } catch (error) {
      console.error('Error fetching video info:', error);
      setVideoInfo(null);
    }
  };

  const handleTypeChange = (event) => {
    setDownloadType(event.target.value);
  };

  return (
    <>
      {/* Navigation code */}
      <div className="flex flex-col items-center min-h-screen py-12 lg:py-24 bg-white dark:bg-gray-900">
        <div className="container flex flex-col items-center gap-4 px-4 text-center md:gap-8 md:px-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl  text-green-500 dark:text-green-400 ">
              Download YouTube Videos
            </h1>
            <p className="mx-auto text-gray-500 md:text-xl dark:text-gray-400 ">
              Enter the YouTube video link you want to download below.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 min-w-[300px]">
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 min-w-0 dark:bg-gray-900 text-white"
              placeholder="Enter YouTube link"
              type="text"
              value={url}
              onChange={handleInputChange}
            />
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-8 bg-white"
              onClick={fetchVideoInfo}
            >
              Get Info
            </button>
          </div>
          {videoInfo && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Video Information</h2>
              <div className="flex flex-col md:flex-row gap-4 items-center mt-4">
                <img src={videoInfo.thumbnail} alt="Video Thumbnail" className="w-32 h-24 md:w-48 md:h-36 object-cover" />
                <div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">{videoInfo.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{videoInfo.description}</p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4">
            <label className="text-gray-700 dark:text-gray-300">Download Type:</label>
            <select
              className="block w-full mt-1 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-300"
              value={downloadType}
              onChange={handleTypeChange}
            >
              <option value="mp4">MP4</option>
              <option value="mp3">MP3</option>
            </select>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <div className="w-1/3 bg-green-500 dark:bg-green-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please note that you should only download videos if you have
              permission from the copyright holder. We do not endorse or encourage
              illegal downloading of videos.
            </p>
          </div>
          <button
            className="mt-8 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-8 bg-white"
            onClick={handleDownload}
            disabled={!videoInfo}
          >
            Download
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
