import React, { useEffect, useRef } from 'react';

const Dashboard = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const earthRadius = 50;
    const earthX = canvas.width / 2;
    const earthY = canvas.height / 2;

    // Initialize asteroids with starting positions
    const asteroids = [
      {
        name: "(2014 HQ124)",
        diameterMax: 0.977,
        isHazardous: true,
        startX: -100,
        startY: 100
      },
      {
        name: "(2020 UJ2)",
        diameterMax: 0.101,
        isHazardous: false,
        startX: canvas.width + 100,
        startY: 400
      }
    ];

    const drawEarth = () => {
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2, false);
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();
    };

    const drawAsteroid = (asteroid, xPos, yPos) => {
      const radius = asteroid.diameterMax * 50;
      ctx.beginPath();
      ctx.arc(xPos, yPos, radius, 0, Math.PI * 2, false);
      ctx.fillStyle = asteroid.isHazardous ? 'red' : 'gray';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.stroke();

      // Draw asteroid name
      ctx.font = '14px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(asteroid.name, xPos, yPos + radius + 15);
    };

    const animateAsteroids = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawEarth();

      asteroids.forEach((asteroid, index) => {
        // Update asteroid position
        if (index === 0) {
          asteroid.startX += 2; // Move right
          asteroid.startY += 1; // Move downward
        } else {
          asteroid.startX -= 2; // Move left
          asteroid.startY -= 1; // Move upward
        }
        
        // Draw the asteroid
        drawAsteroid(asteroid, asteroid.startX, asteroid.startY);
      });

      animationRef.current = requestAnimationFrame(animateAsteroids);
    };

    animateAsteroids();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="dashboard">
      <canvas
        ref={canvasRef}
        className="tracker-canvas"
      />
    </div>
  );
};

export default Dashboard;