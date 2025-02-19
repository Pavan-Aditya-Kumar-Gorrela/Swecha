// components/ResultsSection.js
import React from 'react';

const ResultsSection = ({ genderDistribution, detectedPeople }) => (
  <div className="results-section">
    <h2>Real-Time Data</h2>
    <div className="gender-distribution">
      <h3>Gender Distribution</h3>
      <p>Male: {genderDistribution.male}</p>
      <p>Female: {genderDistribution.female}</p>
    </div>
    <div className="people-detected">
      <h3>Detected People</h3>
      <ul>
        {detectedPeople.map((person, index) => (
          <li key={index}>
            Person {index + 1}: {person.gender} - Bounding Box: {person.bbox.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ResultsSection;
