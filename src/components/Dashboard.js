import React, { useEffect, useRef } from 'react';

const Dashboard = () => {
  const canvasRef = useRef(null);

  const asteroids = [
    {
      name: "(2014 HQ124)",
      diameterMin: 0.437,
      diameterMax: 0.977,
      distance: 47386089.346134067,
      velocity: 67370.4445307069,
      closeApproachTime: "2024-Dec-22 02:26",
      isHazardous: true
    },
    {
      name: "(2020 UJ2)",
      diameterMin: 0.045,
      diameterMax: 0.101,
      distance: 58373587.767936663,
      velocity: 59995.5695509838,
      closeApproachTime: "2024-Dec-22 16:29",
      isHazardous: false
    }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const earthRadius = 50;
    const earthX = canvas.width / 2;
    const earthY = canvas.height / 2;

    const drawEarth = () => {
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2, false);
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.stroke();
    };

    const drawAsteroid = (asteroid, xPos, yPos) => {
      ctx.beginPath();
      ctx.arc(xPos, yPos, (asteroid.diameterMax * 10), 0, Math.PI * 2, false);
      ctx.fillStyle = asteroid.isHazardous ? 'red' : 'gray';
      ctx.fill();
      ctx.stroke();
    };

    const animateAsteroids = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawEarth();
      asteroids.forEach((asteroid, index) => {
        const asteroidX = earthX + Math.cos(index * Math.PI / 2) * (canvas.width / 2 - 100);
        const asteroidY = earthY + Math.sin(index * Math.PI / 2) * (canvas.height / 2 - 100);
        drawAsteroid(asteroid, asteroidX, asteroidY);
      });
      requestAnimationFrame(animateAsteroids);
    };

    animateAsteroids();

    // Cleanup function to cancel animation frame
    return () => {
      cancelAnimationFrame(animateAsteroids);
    };
  }, []); // Empty dependency array since we don't have any dependencies

  return (
    <div className="dashboard">
      <div className="info">
        <h3>NEO's Dashboard</h3>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="tracker-canvas"
      />
    </div>
  );
};

export default Dashboard;