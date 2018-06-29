import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from "@material-ui/icons/AddCircle";
import Input from '@material-ui/core/Input';

require('./TodoApp.css');

let idCounter = 0;
// single row in the list of todos
class TodoApp extends Component {

  state = {
    todos: []
  }

  addTodo = () => {
    const text = document.getElementById('todo-to-add').value;
    if (!text) return;
    const newTodo = {text: text, id: idCounter++ }
    this.setState(state => {return { todos: [...state.todos, newTodo] }});
    document.getElementById('todo-to-add').value = "";
  }

  removeTodo = (id) => {
    this.setState(state => {return {todos: state.todos.filter(todo => todo.id !== id)}});
  }

  render() {
    return (
      <div id='todos'>
        <h3>Todos!</h3>
        <TodoList
          todos={this.state.todos}
          remove={this.removeTodo}
          add={this.addTodo}
        />
        
      </div>
    )
  }
}

// entire list of todos
const TodoList = ({todos, remove, add}) => (
  <List dense>
    {todos.map(todo => (
      <Todo todo={todo} key={todo.id} remove={remove} />
    ))}
    <BlankTodo add={add} />
  </List>
)

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

const BlankTodo = ({todo, add}) => (
  <ListItem>
      <form action="#" onSubmit={add}>
        <Input
          onSubmit={add}
          id='todo-to-add'
          placeholder="Todo goes here"
        />
      </form>
      <ListItemSecondaryAction>
        <AddIcon onClick={add}/>
      </ListItemSecondaryAction>
  </ListItem>
)

export default TodoApp;
