import { useState, useRef, useEffect } from 'react'
import './App.css'

import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2NrYWthcmxhMzYiLCJhIjoiY2xybnYycm83MDNhNTJxbXQ2cmQ5ZmJ0dCJ9.ZSJE4zAuy3c2WxfnO69igQ';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [long, setLong] = useState(-78.63917457604737);
  const [lat, setLat] = useState(35.7810570210254);
  const [zoom, setZoom] = useState(14);

  useEffect(() => {
    if (map.current) return; // initialize map only once
      map.current = new mapboxgl.Map({
      container: mapContainer.current,
      
      center: [long, lat],
      zoom: zoom
    });
    map.current.on('move', () => {
      setLong(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {long} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App
