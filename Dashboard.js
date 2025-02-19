import React, { useState, useEffect, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Webcam from "react-webcam"; 
import 'leaflet/dist/leaflet.css';
import 'chart.js/auto';
import L from "leaflet";

// Define a red alert icon for the map
const redAlertIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Warning_icon.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

const Dashboard = () => {
  const webcamRef = useRef(null);
  const [genderData, setGenderData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  
  // Send Webcam Frame to Backend
  const sendFrameToBackend = () => {
    const imageSrc = webcamRef.current.getScreenshot(); // Get image from webcam
    if (imageSrc) {
      fetch('http://192.168.43.41:3000/api/process-frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSrc })  // Send base64 image string to backend
      }).then(response => response.json())
      .then(data => {
        setGenderData(data.genderDistribution);
        setAlerts(data.alerts);
      });
    }
  };

  // Fetch Hotspots
  // useEffect(() => {
  //   fetch('http://192.168.137.158:3000/api/hotspots')
  //     .then(res => res.json())
  //     .then(data => setHotspots(data));
  // }, []);

  // Send frames to backend every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      sendFrameToBackend();
    }, 1000);  // Send frames every second
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#007bff" }}>
        Admin Dashboard - Smart Surveillance System
      </h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {/* Live Camera Feeds */}
        <div style={{ flex: 1, marginRight: "20px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <h3>Live Camera Feeds</h3>
          <Webcam
            ref={webcamRef}
            audio={false}
            height={550}
            width={750}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "user"
            }}
          />
        </div>

        {/* Gender Distribution Chart */}
        <div style={{ flex: 1, marginLeft: "20px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <h3>Real-Time Gender Distribution</h3>
          {genderData ? <Pie data={genderData} /> : <p>Loading...</p>}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Alert Notifications */}
        <div style={{ flex: 1, marginRight: "20px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <h3>Alert Notifications</h3>
          {alerts.map((alert, index) => (
            <div key={index} style={{ backgroundColor: alert.color, padding: "15px", borderRadius: "5px", marginBottom: "10px" }}>
              {alert.message}
            </div>
          ))}
        </div>

        {/* Hotspot Map */}
        <div style={{ flex: 1, marginLeft: "20px", border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
          <h3>Hotspot Map</h3>
          <div style={{ height: "300px", width: "100%" }}>
            <MapContainer center={[16.5449, 81.5212]} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Hotspot Markers with Red Alert Icon */}
              {hotspots.map((hotspot, index) => (
                <Marker key={index} position={hotspot.position} icon={redAlertIcon}>
                  <Popup>{hotspot.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
