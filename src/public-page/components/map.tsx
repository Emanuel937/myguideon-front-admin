import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Définir les icônes via URLs (Flaticon ou autre)
const restaurantIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2838/2838912.png', // Icône de restaurant
  iconSize: [32, 32], // Taille de l'icône
});

const museumIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2838/2838881.png', // Icône de musée
  iconSize: [32, 32],
});

const parkIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046872.png', // Icône de parc
  iconSize: [32, 32],
});

// Exemple de données d'activités dans une ville
const activities = [
  { id: 1, name: 'Restaurant Le Gourmet', position: [48.8566, 2.3522] as [number, number], icon: restaurantIcon },
  { id: 2, name: 'Musée du Louvre', position: [48.8606, 2.3376] as [number, number], icon: museumIcon },
  { id: 3, name: 'Parc Monceau', position: [48.8792, 2.3093] as [number, number], icon: parkIcon },
];

const Map = () => {
  const cityPosition: [number, number] = [48.8566, 2.3522]; // Coordonnées pour Paris

  return (
    <MapContainer center={cityPosition} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {activities.map((activity) => (
        <Marker key={activity.id} position={activity.position} icon={activity.icon}>
          <Popup>{activity.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
