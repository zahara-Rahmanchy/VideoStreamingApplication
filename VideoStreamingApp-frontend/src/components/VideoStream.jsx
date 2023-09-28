// import {TheosPlayer} from "@aka_theos/react-hls-player";
// import React, {useState, useEffect} from "react";
// import ReactPlayer from "react-player";

// const VideoStream = () => {
//   const [hlsUrl, setHlsUrl] = useState("");

//   useEffect(() => {
//     const fetchHlsUrl = async () => {
//       try {
//         // Send the RTSP URL to the backend for conversion
//         const response = await fetch(
//           "http://127.0.0.1:5000/convert_rtsp_to_hls",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               rtsp_url:
//                 "rtsp://zephyr.rtsp.stream/movie?streamKey=aec27a516234e5d86e647a2d1336d46d",
//             }),
//           }
//         );
//         console.log("response: ", response);
//         if (response.ok) {
//           const data = await response.json();
//           console.log(data);
//           setHlsUrl(data.hls_url);
//         } else {
//           console.error("Error converting RTSP to HLS");
//         }
//       } catch (error) {
//         console.error("Error:", error);
//       }
//     };

//     // Fetch the HLS URL when the component mounts

//     fetchHlsUrl();
//   }, []);

//   return (
//     <div>
//       VideoStream
//       {hlsUrl && <TheosPlayer src={hlsUrl} controls />}
//       <video id="videoPlayer" controls autoplay>
//         <source
//           src="http://127.0.0.1:5000/stream/stream.m3u8"
//           type="application/x-mpegURL"
//         />
//         Your browser does not support the video tag.
//       </video>
//     </div>
//   );
// };

// export default VideoStream;
// const fetchData = async () => {
//   try {
//     // Send the RTSP URL to the backend for conversion
//     const response = await fetch("http://127.0.0.1:5000/", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     console.log("response: ", response);
//     if (response.ok) {
//       const data = await response.json();
//       console.log(data);
//       //   setHlsUrl(data.hls_url);
//     } else {
//       console.error("Error converting RTSP to HLS");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import {TheosPlayer} from "@aka_theos/react-hls-player";

function VideoStream() {
  const [rtspUrl, setRtspUrl] = useState("");
  const [hlsPlaylistUrl, setHlsPlaylistUrl] = useState("");
  const [conversionStatus, setConversionStatus] = useState("");

  const convertToHLS = () => {
    if (!rtspUrl) {
      setConversionStatus("Please enter an RTSP URL.");
      return;
    }

    setConversionStatus("Converting...");

    axios
      .post("http://127.0.0.1:5000/convert", {rtsp_url: rtspUrl})
      .then(response => {
        console.log(response);
        setHlsPlaylistUrl(response.data.hls_playlist_url);
        setConversionStatus("Conversion successful!");
      })
      .catch(error => {
        setConversionStatus(
          error.response
            ? error.response.data
            : "An error occurred during conversion."
        );
      });
  };

  return (
    <div>
      <h1>RTSP to HLS Converter</h1>
      <div>
        <label htmlFor="rtspUrl">Enter RTSP URL:</label>
        <input
          type="text"
          id="rtspUrl"
          value={rtspUrl}
          onChange={e => setRtspUrl(e.target.value)}
          placeholder=""
          required
        />
      </div>
      <button onClick={convertToHLS}>Convert to HLS</button>
      <div>
        <p>{conversionStatus}</p>
        {hlsPlaylistUrl && (
          <>
            <p>
              HLS Playlist URL:{" "}
              <a
                href={hlsPlaylistUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hlsPlaylistUrl}
              </a>
            </p>
            <p>ReactPlayer</p>
            <ReactPlayer
              url="http://localhost:5000/videos/hls_output/output.m3u8"
              controls={true}
              width="640px"
              height="480px"
            />

            <p>TheosPlayer</p>
            <TheosPlayer src="http://localhost:5000/videos/hls_output/output.m3u8" />
          </>
        )}
      </div>
    </div>
  );
}

export default VideoStream;

// const videoRef = useRef(null);
// let player;

// useEffect(() => {
//   // Replace with your actual HLS stream URL
//   const hlsVideoSource =hlsPlaylistUrl
//     // "http://127.0.0.1:5173/videos/hls_output/output.m3u8";

//   player = videojs(videoRef.current, {
//     autoplay: true,
//     controls: true,
//     fluid: true,
//     sources: [
//       {
//         src: hlsVideoSource,
//         type: "application/x-mpegURL",
//       },
//     ],
//   });

//   return () => {
//     if (player) {
//       player.dispose();
//     }
//   };
// }, []);
