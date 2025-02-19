// components/Alerts.js
import React from 'react';

const Alerts = ({ sosAlertTriggered, loneWomanDetected }) => (
  <div className="alerts">
    <h3>Alerts</h3>
    {sosAlertTriggered && <p style={{ color: 'red' }}>SOS Alert Triggered!</p>}
    {loneWomanDetected && <p style={{ color: 'orange' }}>Lone Woman Detected!</p>}
  </div>
);

export default Alerts;
