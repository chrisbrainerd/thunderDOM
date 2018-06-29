import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Map from './1 - Just a map/Map';
import TodoApp from './2 - Todo/TodoApp';
import TodoMapApp from './3 - Map + Todo/TodoMapApp';
import TodoMapAppRefactor from './3b - Map + Todo - Refactor/TodoMapAppRefactor';
import TwitterDemoApp from './4 - Functional Demo/TwitterDemoApp';

import './App.css';

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

function getSteps() {
  return ['Just a map', 'Just a todo list', 'Todo with a map', 'Todo with a map (refactored)', 'Twitter map demo'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Map />;
    case 1:
      return <TodoApp />;
    case 2:
      return <TodoMapApp />;
    case 3: 
      return <TodoMapAppRefactor />
    case 4: 
      return <TwitterDemoApp />
    default:
      return "huh...that's bad";
  }
}
    
class App extends Component {
  state = {
    activeStep: 0
  }
  
  handleNext = () => {
    this.setState(state => {
      return {
        activeStep: state.activeStep + 1
      }
    });
  }
  handleBack = () => {
    this.setState(state => {
      return {
        activeStep: state.activeStep - 1
      }
    });
  }
  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };


  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <div id="App" className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => (
            <Step key={label}> 
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>   
        <div>
          <div>
            <Button
              disabled={activeStep === 0}
              onClick={this.handleBack}
              className={classes.button}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleNext}
              className={classes.button}
              disabled={activeStep === steps.length - 1}
            >
              Next
            </Button>
          </div>
        {/* <Typography className={classes.instructions}> */}
        {getStepContent(activeStep)}
        {/* </Typography> */}
        </div>     
      </div>
    );
  }
}

export default withStyles(styles)(App);