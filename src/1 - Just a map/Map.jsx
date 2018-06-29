import React, { Component } from 'react';
import L from 'leaflet';

class Map extends Component {
  componentDidMount() {
    const visionistHQ = [39.186039, -76.809053]
    const map = L.map("Map-host").setView(visionistHQ, 16);
    const tileLayer = L.tileLayer("http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg");
    tileLayer.addTo(map);
    const marker = new L.Marker(visionistHQ)
    marker.addTo(map);
  }

  render() {
    return <div id='Map-host' />;
  }
}

export default Map;