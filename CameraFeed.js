// components/CameraFeed.js
import React from 'react';

const CameraFeed = ({ videoRef, canvasRef }) => (
  <div className="camera-feed">
    <video ref={videoRef} autoPlay muted playsInline width="640" height="480" />
    <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480"></canvas>
  </div>
);

export default CameraFeed;
