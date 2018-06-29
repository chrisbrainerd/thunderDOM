import React, { Fragment, Component } from 'react';
import L from 'leaflet';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

require('./TodoMapApp.css');

let idCounter = 0;

/*

Notes about this component: 
- We're handling all the map-related stuff inside of the same component as all the todo stuff - no separation of concerns!
- We're doing a naive approach for updating markers on the map inside of updateMap() - deleting all the markers every time
  and re-adding every single one
- The markers aren't really being _handled_ anywhere - we're adding them here but if we want to do something with a marker, 
  we'll need to iterate through the todos in state, find the applicable marker on the map, and then go from there
- This is fine for simple use cases, but for anything really data-driven, we'll want to refactor this

*/

class TodoMapApp extends Component {

  state = {
    todos: [],
    address: ''
  }

  map = null;
  markers = null;

  componentDidMount() {
    this.initializeMap();
  }

  addTodo = async (text) => {
    if (!text) return;
    const latLng = await this.geocodeAddress(text);
    const newTodo = {text, latLng, id: idCounter++}
    this.setState(state => {
      return { 
        todos: [...state.todos, newTodo], 
        address: '' 
      }
    }, () => {
      this.updateMap();
      
      // pan to last latlng
      this.map.setView(latLng);
    });
  }

  removeTodo = (id) => {
    this.setState(state => {
      return {
        todos: state.todos.filter(todo => todo.id !== id)
      }
    }, this.updateMap);
  }

  onAddressChange = address => {
    this.setState({address: address})
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

  initializeMap = () => {
    this.map = L.map("Map-host").setView([39.186039, -76.809053], 16);
    this.tileLayer = L.tileLayer("http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg");
    this.tileLayer.addTo(this.map);
    this.markers = L.featureGroup();
    this.markers.addTo(this.map);
  }

  updateMap = () => {
    this.markers.clearLayers();
    this.state.todos.forEach(todo => {
      const { latLng } = todo;
      const marker = new L.Marker(latLng);
      marker.addTo(this.markers);
    });
  }

  render() {
    return (
      <div id='Todo-and-map-container'>
        <div id='Todos'>
          <TodoList
            todos={this.state.todos}
            remove={this.removeTodo}
            add={this.addTodo}
            onAddressChange={this.onAddressChange}
            address={this.state.address}
          />
        </div>
        <div id='Map-host' />
      </div>
    )
  }
}

// entire list of todos
const TodoList = ({todos, remove, add, onAddressChange, address}) => (
  <Fragment>
    <h3>Todos!</h3>
    <List dense>
      {todos.map(todo => (
        <Todo todo={todo} key={todo.id} remove={remove} />
      ))}
      <BlankTodo onAddressChange={onAddressChange} address={address} add={add} />
    </List>
  </Fragment>
)

// single row in the list of todos
const Todo = ({todo, remove}) => (
  <ListItem>
    <ListItemText primary={todo.text} />
    <ListItemSecondaryAction>
      <IconButton style={{left: "12px"}} onClick={() => remove(todo.id)}>
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
                  <div {...getSuggestionItemProps(suggestion, { className })}>
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

export default TodoMapApp;