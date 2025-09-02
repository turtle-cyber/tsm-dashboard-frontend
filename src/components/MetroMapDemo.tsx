import React from 'react';
import MetroMap, { type Station, type Line } from './MetroMap';

// Sample data matching the images provided
const sampleStations: Station[] = [
  {
    id: 'behavioral-seq-1',
    x: 200,
    y: 150,
    label: 'Behavioral Sequence Analysis',
    note: 'Build temporal models of process execution chains and user context',
  },
  {
    id: 'noise-reduction',
    x: 650,
    y: 150,
    label: 'Noise Reduction & Filtering',
    note: 'Distinguish malicious activity from legitimate administrative operations',
  },
  {
    id: 'event-pattern',
    x: 200,
    y: 280,
    label: 'Event ID Pattern Recognition',
    note: 'Analyze sequence of Windows Event IDs to identify suspicious behavior patterns',
  },
  {
    id: 'behavioral-seq-2',
    x: 650,
    y: 280,
    label: 'Behavioral Sequence Analysis',
    note: 'Build temporal models of process execution chains and user context',
  },
  {
    id: 'intervened',
    x: 425,
    y: 200,
    label: 'Intervened',
    campaignId: 'Campaign 2',
  },
];

const sampleLines: Line[] = [
  {
    id: 'red-line',
    colorVar: 'red',
    stations: ['behavioral-seq-1', 'intervened'],
  },
  {
    id: 'blue-line',
    colorVar: 'blue',
    stations: ['noise-reduction', 'intervened'],
  },
  {
    id: 'green-line',
    colorVar: 'green',
    stations: ['event-pattern', 'behavioral-seq-2'],
  },
];

const MetroMapDemo: React.FC = () => {
  const handleStationSelect = (stationId: string) => {
    console.log('Selected station:', stationId);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Metro Map Component Demo
        </h1>
        <div className="bg-card rounded-lg p-4">
          <MetroMap
            width={900}
            height={380}
            grid={true}
            stations={sampleStations}
            lines={sampleLines}
            onSelectStation={handleStationSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default MetroMapDemo;