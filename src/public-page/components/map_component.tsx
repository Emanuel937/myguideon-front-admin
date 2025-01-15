import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const iconSize:[number, number] = [60, 60];
// Définir les icônes via URLs (Flaticon ou autre)
const restaurantIcon:L.Icon<L.IconOptions> = new L.Icon({
  iconUrl: '/assets/img/destination/maps/cofre.svg', // Icône de restaurant
  iconSize: iconSize, // Taille de l'icône
}); 

const museumIcon:L.Icon<L.IconOptions> = new L.Icon({
  iconUrl: '/assets/img/destination/maps/ob.svg', // Icône de musée
  iconSize: iconSize,
});


const parkIcon:L.Icon<L.IconOptions> = new L.Icon({
  iconUrl: '/assets/img/destination/maps/build.svg', // Icône de parc
  iconSize:iconSize,
});


// Exemple de données d'activités dans une ville
interface Activity {
  id: number;
  position: [number, number]; // LatLngExpression spécifié comme tuple [number, number]
  arrondissement?: string;   // Optionnel pour les arrondissements
  city?: string;             // Optionnel pour les villes hors Paris
  name: string;
  icon: L.Icon;
}

const activities: Activity[] = [
  // Arrondissements de Paris
  { id: 1, name: 'Restaurant Le Gourmet', position: [48.8626, 2.3365], arrondissement: '1er Arrondissement (Paris)', icon: restaurantIcon },
  { id: 2, name: 'Musée du Louvre', position: [48.8680, 2.3412], arrondissement: '2e Arrondissement (Paris)', icon: museumIcon },
  { id: 3, name: 'Parc Monceau', position: [48.8634, 2.3615], arrondissement: '3e Arrondissement (Paris)', icon: parkIcon },
  { id: 4, name: 'Restaurant Le Gourmet', position: [48.8555, 2.3551], arrondissement: '4e Arrondissement (Paris)', icon: restaurantIcon },
  { id: 5, name: 'Musée d’Orsay', position: [48.8600, 2.3266], arrondissement: '7e Arrondissement (Paris)', icon: museumIcon },
  
  // Banlieue parisienne
  { id: 6, name: 'Château de Versailles', position: [48.8049, 2.1204], city: 'Versailles', icon: museumIcon },
  { id: 7, name: 'Parc Disneyland', position: [48.8670, 2.7805], city: 'Marne-la-Vallée', icon: parkIcon },
  { id: 8, name: 'Basilique Saint-Denis', position: [48.9362, 2.3574], city: 'Saint-Denis', icon: museumIcon },
  { id: 9, name: 'Parc des Buttes-Chaumont', position: [48.8853, 2.3924], city: 'Pantin', icon: parkIcon },
  { id: 10, name: 'Restaurant Chez Maurice', position: [48.8411, 2.4392], city: 'Montreuil', icon: restaurantIcon },
  { id: 11, name: 'La Défense (Grande Arche)', position: [48.8913, 2.2376], city: 'La Défense', icon: museumIcon },
  { id: 12, name: 'Parc André Malraux', position: [48.8934, 2.2511], city: 'Nanterre', icon: parkIcon },
  { id: 13, name: 'Restaurant La Belle Étoile', position: [48.9170, 2.3067], city: 'Asnières-sur-Seine', icon: restaurantIcon },
  { id: 14, name: 'Parc de l’Île-Saint-Germain', position: [48.8227, 2.2605], city: 'Issy-les-Moulineaux', icon: parkIcon },
  { id: 15, name: 'Château de Vincennes', position: [48.8422, 2.4350], city: 'Vincennes', icon: museumIcon },
  { id: 16, name: 'Centre aquatique', position: [48.7880, 2.3684], city: 'Créteil', icon: parkIcon },
  { id: 17, name: 'Parc de Sceaux', position: [48.7742, 2.2976], city: 'Sceaux', icon: parkIcon },
  { id: 18, name: 'Restaurant Le Muguet', position: [48.7943, 2.1860], city: 'Boulogne-Billancourt', icon: restaurantIcon },
];


function MapComponent({height ='100vh'}) {
  var cityPosition:[number, number] = [48.8049, 2.1204]; // Coordonnées pour Paris


  return (
    <MapContainer center={cityPosition} zoom={18} style={{ height: height, width: '100%' }}>
       
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
        <Circle
            center={[48.7880, 2.3684]}
            radius={5000} // Rayon en mètres
            color="#007BFF"
            fillColor="lightblue"
            fillOpacity={0.3}
            weight={1}
      />
      {activities.map((activity) => (
        <Marker key={activity.id} position={activity.position} icon={activity.icon}>
          <Popup>{activity.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}



export default MapComponent;