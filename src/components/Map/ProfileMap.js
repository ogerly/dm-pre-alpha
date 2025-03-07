import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './ProfileMap.css';

// Fix for marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ProfileMap = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('/api/profiles/locations');
        setProfiles(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profiles');
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, []);

  if (loading) return <div>Loading map...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-map-container">
      <h2>Find Profiles Near You</h2>
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {profiles.map(profile => (
          <Marker 
            key={profile.id}
            position={[profile.latitude, profile.longitude]}
          >
            <Popup>
              <div className="map-popup">
                <img src={profile.avatar} alt={profile.name} className="popup-avatar" />
                <h3>{profile.name}</h3>
                <p>{profile.shortBio}</p>
                <a href={`/profile/${profile.id}`} className="view-profile-btn">View Profile</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ProfileMap;
