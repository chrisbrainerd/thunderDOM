import React, { Fragment, Component } from 'react';
import L from 'leaflet';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PlaceIcon from '@material-ui/icons/Place';

import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

require('./TodoMapApp.css');

let idCounter = 0;

/*

Notes about this component: 
- Now we have a separate Marker component! 
- The marker is now only responsible for marker stuff - adding and removing itself from the map and doing individual marker stuff
- We're now actually leveraging react's data lifecycle to deal with the markers - if one marker is added, we only add _that_ marker, etc.

*/

class TodoMarker extends Component {
  marker = null;
  componentDidMount() {
    this.marker = new L.Marker(this.props.latLng);
    this.marker.addTo(this.props.featureGroup);
    this.props.panTo(this.props.latLng);
  }

  componentWillUnmount() {
    this.marker.remove();
  }

  render() {
    return null;
  }
}

class TodoMapAppRefactor extends Component {

  state = {
    todos: [],
    address: ''
  }

  map = null;
  markers = null;

  componentDidMount() {
    this.initializeMap();
  }

  initializeMap = () => {
    this.map = L.map("Map-host").setView([39.186039, -76.809053], 16);
    this.tileLayer = L.tileLayer("http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg");
    this.tileLayer.addTo(this.map);
    this.markers = L.featureGroup();
    this.markers.addTo(this.map);
  }

  //
  // this doesn't need to do anything anymore! each marker is handling itself
  // we are now proud parents 🎉🎉🎉
  // 
  // updateMap = () => {
  //   this.markers.clearLayers();
  //   this.state.todos.forEach(todo => {
  //     const { latLng } = todo;
  //     const marker = new L.Marker(latLng);
  //     marker.addTo(this.markers);
  //   });
  // }
  
  addTodo = async (text) => {
    if (!text) return;
    const latLng = await this.geocodeAddress(text);
    const newTodo = {text, latLng, id: idCounter++}
    this.setState(state => {
      return { 
        todos: [...state.todos, newTodo], 
        address: '' 
      }
    });
  }

  panToLatLng = latLng => this.map.setView(latLng);

  removeTodo = (id) => {
    this.setState(state => {
      return {
        todos: state.todos.filter(todo => todo.id !== id)
      }
    });
  }

  onAddressChange = address => { 
    this.setState({address: address});
  } 

  geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        resolve(latLng);
      })
      .catch(error => {
        console.error('Error', error);
        reject();
      })
    })
  }  

  render() {
    const { todos, address } = this.state;
    return (
      <div id='Todo-and-map-container'>
        <div id='Todos'>
          <TodoList
            todos={todos}
            remove={this.removeTodo}
            add={this.addTodo}
            onAddressChange={this.onAddressChange}
            address={address}
            panTo={this.panToLatLng}
          />
        </div>
        <div id='Map-host'>
          {todos.map(todo => (
            <TodoMarker 
              key={todo.id} 
              panTo={this.panToLatLng} 
              featureGroup={this.markers} 
              latLng={todo.latLng} 
            />
          ))}
        </div>
      </div>
    )
  }
}

// entire list of todos
const TodoList = ({todos, remove, add, onAddressChange, address, panTo}) => (
  <Fragment>
    <h3>Todos!</h3>
    <List dense>
      {todos.map(todo => (
        <Todo todo={todo} key={todo.id} remove={remove} panTo={panTo}/>
      ))}
      <BlankTodo onAddressChange={onAddressChange} address={address} add={add} />
    </List>
  </Fragment>
)

// single row in the list of todos
const Todo = ({todo, remove, panTo}) => (
  <ListItem>
    <ListItemText primary={todo.text} />
    <ListItemSecondaryAction>
      <IconButton onClick={() => panTo(todo.latLng)}>
        <PlaceIcon />
      </IconButton>
      <IconButton onClick={() => remove(todo.id)}>
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

const BlankTodo = ({todo, add, onAddressChange, address}) => (
  <ListItem>
      <PlacesAutocomplete
        value={address}
        onChange={onAddressChange}
        onSelect={add}
        highlightFirstSuggestion
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div style={{width: "100%"}}>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input'
              })}
            />
            <div className="autocomplete-dropdown-container">
              {suggestions.map(suggestion => {
                const className = suggestion.active ? 'suggestion-item suggestion-item--active' : 'suggestion-item';
                return (
                  <div key={suggestion.description} {...getSuggestionItemProps(suggestion, { className })}>
                    <span>{suggestion.description}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
  </ListItem>
)

export default TodoMapAppRefactor;