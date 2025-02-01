import React, { useState } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import Sidebar from '../Components/Sidebar';
import { usePrivy } from '@privy-io/react-auth';
import { Link } from 'react-router-dom';

function Mapscreen({ navigation }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const { authenticated, ready, user, login, logout } = usePrivy();

  const handleSidebarData = (data) => {
    setSelectedItem(data);
  };

  const mapContainerStyle = {
    width: "100vw",
    height: "100vh",
  };

  // Define the center of the map
  const center = {
    lat: 37.7749, // San Francisco latitude
    lng: -122.4194, // San Francisco longitude
  };

  // Generate random coordinates within a bounding box
  const getRandomLocation = (minLat, maxLat, minLng, maxLng) => ({
    lat: Math.random() * (maxLat - minLat) + minLat,
    lng: Math.random() * (maxLng - minLng) + minLng,
  });

  const items = [
    { id: 1, name: "Lobby A", lat: 37.7749, lng: -122.4194, info: "Details about Item A" },
    { id: 2, name: "Lobby B", lat: 34.0522, lng: -118.2437, info: "Details about Item B" },
    { id: 3, name: "Lobby C", lat: 40.7128, lng: -74.006, info: "Details about Item C" },
  ];

  const mapStyle = [
    {
      elementType: "labels",
      stylers: [{ visibility: "off" }], // Hide all labels
    },
    {
      featureType: "poi",
      stylers: [{ visibility: "off" }], // Hide points of interest
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }], // Hide transit features
    },
  ];


  // Randomize locations for items
  const randomLocations = items.map((item) => ({
    ...item,
    location: getRandomLocation(37.7, 37.8, -122.5, -122.4), // Example bounding box for San Francisco
  }));


  return (
    <div>
      <Sidebar items={items} onDataSend={handleSidebarData} />
      <LoadScript googleMapsApiKey="AIzaSyDD2pjcdH39N3PgoP8794Dm-5s8DwvXdHU">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={selectedItem ? { lat: selectedItem.lat, lng: selectedItem.lng } : center}
          zoom={selectedItem ? 14 : 10} // Zoom in when an item is selected
          options={{
            styles: mapStyle,
            minZoom: 5, // Minimum zoom level (e.g., show more of the world)
            maxZoom: 18, // Maximum zoom level (e.g., detailed view)
            tilt: 45, // Enables the 3D tilt view
            heading: 90, // Rotate the map (0 = north, 90 = east)
            disableDefaultUI: true, // Hide UI for clean look
          }}
        >
          {items.map((item) => (
            <Marker
              key={item.id}
              position={{lat: item.lat, lng: item.lng}}
              onClick={() => setSelectedItem(item)}
            />
          ))}

          {/* Display InfoWindow when a marker is clicked */}
          {selectedItem && (
            <Marker position={{ lat: selectedItem.lat, lng: selectedItem.lng }}>
              <InfoWindow
                position={{ lat: selectedItem.lat, lng: selectedItem.lng }}
                onCloseClick={() => setSelectedItem(null)}
              >
                <div>
                  <h3 className="font-bold">{selectedItem.name}</h3>
                  <p>{selectedItem.info}</p>
                  <Link className='btn btn-primary btn-sm' to={'/game/' + selectedItem.id}>Enter Realm</Link>
                </div>
              </InfoWindow>
            </Marker>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

export default Mapscreen