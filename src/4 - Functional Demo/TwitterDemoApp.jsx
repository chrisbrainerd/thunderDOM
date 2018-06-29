import React, { Fragment, Component } from 'react';
import L from 'leaflet';
import Tweet from 'react-tweet';

/*

Notes about this component: 
- Now we have a separate Marker AND Map component! 
- The Map follows the same pattern as in the TodoMapAppRefactor - it's responsible for its own stuff and that only
- In the render method, look how clear it is what's happening
- We have a Map which has one marker per tweet in component state....that's it!

*/

class Map extends Component {
  map = {}
  componentDidMount() {
    this.map = L.map("Map-host").setView([39.186039, -76.809053], 16).setMaxZoom(16);
    this.tileLayer = L.tileLayer("http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg");
    this.tileLayer.addTo(this.map);
    this.props.saveMapRef(this.map);
  }

  render() { 
    return (
    <div id='Map-host'>
      {this.props.children}
    </div>    
    )
  }
}

class Marker extends Component {
  constructor(props) {
    super(props);
    this.marker = null;
  }
  componentDidMount() {
    this.marker = new L.Marker(this.props.tweet.latLng);
    this.marker.addTo(this.props.featureGroup);
    this.marker.on('click', () => this.props.highlightTweet(this.props.tweet));
  }

  componentWillUnmount() {
    this.marker.remove();
  }

  render() {
    return null;
  }
}

class TwitterDemoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: [],
      highlightedTweet: null
    }
    this.map = null;
  }
  
  componentWillMount() {
    // eslint-disable-next-line
    const socket = io(`${window.location.protocol}//${window.location.hostname}:3001`);

    // This looks complicated, but it's just because twitter data is weird. Some tweets will have 
    // a precise location taken from a phone's GPS, and some will have a bounding box around a 
    // location - (e.g. if you tag your tweet as being in DC, we won't receive a point or a shape of
    // DC, we'll receive the smallest box that will fit all of DC inside of it, hence all the calculations 
    // on lines 78-83.
    // If there's none of those locations, the server won't bother passing it to the front end )
    socket.on('tweet', tweet => {
      if (tweet.coordinates) {
        this.addLatLng(tweet.coordinates.coordinates.reverse(), tweet);
      } else if (tweet.geo) {
        this.addLatLng(tweet.geo.coordinates, tweet)
      } else if (tweet.place) {
        const bbox = tweet.place.bounding_box.coordinates[0];
        const lonSize = Math.max(...bbox.map(a => a[0])) - Math.min(...bbox.map(a => a[0]));
        const lon = Math.min(...bbox.map(a => a[0])) + .5 * lonSize;
        const latSize = Math.max(...bbox.map(a => a[1])) - Math.min(...bbox.map(a => a[1]));
        const lat = Math.min(...bbox.map(a => a[1])) + .5 * latSize;
        const latLng = [lat, lon];
        this.addLatLng(latLng, tweet);
      }
    })
  }

  addLatLng = (latLng, tweet) => {
    const { tweets } = this.state;
    if (tweets.length > 2) tweets.shift();
    tweets.push({...tweet, latLng: latLng});
    this.setState({tweets}, this.zoomToFit);
  }

  zoomToFit = () => {
    const latLngs = this.state.tweets.map(tweet => tweet.latLng);
    this.map.fitBounds(latLngs);
  }

  saveMapRef = mapObj => {
    this.map = mapObj;
    this.markers = L.featureGroup();
    this.markers.addTo(mapObj);
  }

  highlightTweet = tweet => {
    this.setState({highlightedTweet: tweet});
  }

  render() {
    return (
      <Fragment>
        <Map saveMapRef={this.saveMapRef}>
          {this.state.tweets.map(tweet => (
            <Marker 
              key={tweet.id} 
              tweet={tweet} 
              featureGroup={this.markers} 
              highlightTweet={this.highlightTweet}
            />
          ))}
        </Map>
        {this.state.highlightedTweet && 
          <Tweet data={this.state.highlightedTweet} />
        }
      </Fragment>
    )
  }
}

export default TwitterDemoApp;