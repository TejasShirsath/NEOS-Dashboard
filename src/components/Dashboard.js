import React, { useEffect, useRef, useState, useCallback } from 'react';

const Dashboard = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [asteroids, setAsteroids] = useState([]);
  const [scale, setScale] = useState(0.5);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const startTime = useRef(Date.now());

  const SCALE = 100000;
  const AU_TO_KM = 149597870.7;

  const planets = [
    { name: 'Sun', distance: 0, color: '#ffdd00' },
    { name: 'Mercury', distance: 0.387 * AU_TO_KM/SCALE, color: '#A0522D' },
    { name: 'Venus', distance: 0.723 * AU_TO_KM/SCALE, color: '#DEB887' },
    { name: 'Earth', distance: 1 * AU_TO_KM/SCALE, color: '#4682b4' },
    { name: 'Mars', distance: 1.524 * AU_TO_KM/SCALE, color: '#cd5c5c' }
  ];

  const fetchAsteroidData = async (startDate, endDate) => {
    try {
      const response = await fetch(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=DEMO_KEY`
      );
      const data = await response.json();
      const neos = Object.values(data.near_earth_objects).flat();

      setAsteroids(neos.map(neo => ({
        name: neo.name,
        diameter: neo.estimated_diameter.kilometers.estimated_diameter_max,
        velocity: parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_second),
        isHazardous: neo.is_potentially_hazardous_asteroid,
        missDistance: parseFloat(neo.close_approach_data[0].miss_distance.kilometers),
        initialAngle: Math.random() * Math.PI * 2,
        orbitSpeed: parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_second) / 100
      })));
    } catch (error) {
      console.error('Failed to fetch asteroid data:', error);
    }
  };

  const draw = useCallback((ctx, width, height) => {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime.current) / 1000;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    // Stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 500; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * width,
        Math.random() * height,
        0.5,
        0, Math.PI * 2
      );
      ctx.fill();
    }

    const centerX = width/2 + offset.x;
    const centerY = height/2 + offset.y;

    // Orbits and planets
    planets.forEach(planet => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.distance * scale, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.stroke();

      const x = centerX + planet.distance * scale;
      const y = centerY;
      
      ctx.fillStyle = '#888';
      ctx.textAlign = 'center';
      ctx.font = '14px Arial';
      ctx.fillText(planet.name, x, y + 20);
    });

    // Asteroids
    const earthOrbit = planets[3].distance;
    asteroids.forEach(asteroid => {
      const currentAngle = asteroid.initialAngle + (elapsed * asteroid.orbitSpeed);
      const distance = (earthOrbit + asteroid.missDistance/SCALE) * scale;
      const x = centerX + distance * Math.cos(currentAngle);
      const y = centerY + distance * Math.sin(currentAngle);

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = asteroid.isHazardous ? '#ff4444' : '#ffffff';
      ctx.fill();

      ctx.fillStyle = asteroid.isHazardous ? '#ff4444' : '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(`(${asteroid.name})`, x, y - 10);
    });
  }, [asteroids, offset, scale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      draw(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    fetchAsteroidData(today, tomorrow);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black text-white font-sans">
      <div className="fixed top-5 left-1/2 -translate-x-1/2 flex gap-4 z-10">
        <span>Start Date:</span>
        <input
          type="date"
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
          onChange={e => {
            const endDate = document.querySelector('input[type="date"]:last-child').value;
            fetchAsteroidData(e.target.value, endDate);
          }}
          defaultValue={new Date().toISOString().split('T')[0]}
        />
        <span>End Date:</span>
        <input
          type="date"
          className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
          onChange={e => {
            const startDate = document.querySelector('input[type="date"]:first-child').value;
            fetchAsteroidData(startDate, e.target.value);
          }}
          defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
        />
      </div>

      <div className="fixed top-24 left-5 bg-black/80 p-4 rounded-lg text-sm max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-3">Near-Earth Objects</h3>
        {asteroids.map(asteroid => (
          <div key={asteroid.name} className="mb-4">
            <strong>{asteroid.name}</strong>
            <br />
            Diameter: {asteroid.diameter.toFixed(2)} km
            <br />
            Velocity: {asteroid.velocity.toFixed(2)} km/s
            <br />
            Miss Distance: {asteroid.missDistance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} km
            <br />
            Status: <span className={asteroid.isHazardous ? 'text-red-400' : 'text-green-400'}>
              {asteroid.isHazardous ? 'Potentially Hazardous' : 'Safe'}
            </span>
          </div>
        ))}
      </div>

      <div className="fixed bottom-5 right-5 bg-black/80 p-2.5 rounded text-xs">
        1 pixel = 100,000 km
      </div>

      <canvas
        ref={canvasRef}
        onWheel={e => {
          e.preventDefault();
          setScale(s => Math.max(0.1, Math.min(s * (e.deltaY > 0 ? 0.9 : 1.1), 5)));
        }}
        onMouseDown={e => {
          setIsDragging(true);
          setLastPos({ x: e.clientX, y: e.clientY });
        }}
        onMouseMove={e => {
          if (isDragging) {
            setOffset(prev => ({
              x: prev.x + e.clientX - lastPos.x,
              y: prev.y + e.clientY - lastPos.y
            }));
            setLastPos({ x: e.clientX, y: e.clientY });
          }
        }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        className="block"
      />
    </div>
  );
};

export default Dashboard;