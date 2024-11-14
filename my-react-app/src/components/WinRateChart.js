import React, { useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const WinRateChart = ({ wins, losses, winRate }) => {
  const chartRef = useRef(null);

  const data = {
    labels: ['Losses', 'Wins'],
    datasets: [
      {
        data: [losses, wins],
        backgroundColor: ['#e63946', '#4a90e2'], // Red for losses, blue for wins
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    cutout: '75%',
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  useEffect(() => {
    const chartInstance = chartRef.current?.chartInstance;
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
      <Doughnut ref={chartRef} data={data} options={options} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#f0f0f0',
        fontSize: '24px',
        fontWeight: 'bold',
        textShadow: '0px 1px 5px rgba(0, 0, 0, 0.3)',
      }}>
        {winRate}%
      </div>
      <div style={{
        textAlign: 'center',
        color: '#f0f0f0',
        marginTop: '10px',
        fontSize: '14px',
        textShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
      }}>
        {wins + losses} Games | {wins}W {losses}L
      </div>
    </div>
  );
};

export default WinRateChart;
