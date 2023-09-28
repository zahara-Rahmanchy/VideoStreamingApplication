from flask import Flask, request, jsonify, send_from_directory
import os
import time
import subprocess
import ffmpeg
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
app = Flask(__name__)
CORS(app)

# Define a directory to store HLS files
@app.route("/")
def index():
    return jsonify({"base": "Video Streaming App"})

BASE_URL = "http://localhost:5000"
@app.route('/convert', methods=['POST'])
def convert_rtsp_to_hls():
    # Get the RTSP URL from the request JSON
    data = request.get_json()
    rtsp_url = data.get('rtsp_url')

    if not rtsp_url:
        return "RTSP URL not provided", 400

    # Ensure the 'videos' directory exists
    os.makedirs('videos', exist_ok=True)

    # Generate an HLS output directory
    hls_output_dir = 'videos/hls_output'
    os.makedirs(hls_output_dir, exist_ok=True)

    # Run FFmpeg to convert the RTSP stream to HLS
    try:
        ffmpeg.input(rtsp_url, rtsp_transport='tcp').output(
            os.path.join(hls_output_dir, 'output.m3u8'),
            format='hls',
            start_number=0,
            hls_time=2,
            hls_list_size=0,
            hls_flags='delete_segments'
        ).run(overwrite_output=True)
    except ffmpeg.Error as e:
        return f"Error converting RTSP to HLS: {e.stderr.decode()}", 500

    # Provide the HLS playlist URL as a response
    hls_playlist_url = 'f"{BASE_URL}/videos/hls_output/output.m3u8'
    return jsonify({"hls_playlist_url": hls_playlist_url}), 200

@app.route('/videos/<path:path>')
def serve_video(path):
    # Serve the HLS video segments
    return send_from_directory('videos/hls_output', path)




uri = "mongodb+srv://flask:dCrjsqFkSJJJYz64@flask.l9oa6sk.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

if __name__ == "__main__":
    app.run(debug=True)
