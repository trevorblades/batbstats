import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {withRouter} from 'react-router-dom';
import {getFullName} from '../../../util/skater';

const Results = styled.div({
  display: 'flex',
  justifyContent: 'space-between'
});

const Skater = styled.div({
  ':last-child': {
    textAlign: 'right'
  }
});

const Name = withProps({variant: 'body2'})(Typography);
const Result = withProps({
  variant: 'caption',
  color: 'inherit'
})(Typography);

const LETTERS = 'skate'.toUpperCase().split('');
const req = require.context('../../../assets/events');

class GameCard extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  onClick = () => this.props.history.push(`/games/${this.props.game.id}`);

  renderResults() {
    const {letters} = this.props.game;
    return (
      <Results>
        {this.props.game.skaters.map(skater => {
          const lettersAgainst = letters[skater.id];
          const didLose = lettersAgainst === 5;
          return (
            <Skater key={skater.id}>
              <Name>{getFullName(skater)}</Name>
              <Result
                style={{
                  textDecoration: didLose ? 'line-through' : 'none'
                }}
              >
                {LETTERS.map((letter, index) => (
                  <span
                    key={letter}
                    style={{
                      opacity: index > lettersAgainst - 1 ? 0.5 : 1
                    }}
                  >
                    {letter}.
                  </span>
                ))}
              </Result>
            </Skater>
          );
        })}
      </Results>
    );
  }

  render() {
    const {event} = this.props.game;
    return (
      <Grid key={this.props.game.id} item xs={4}>
        <Card>
          <CardHeader
            title={event.name}
            subheader={`Round ${this.props.game.round}`}
            avatar={<Avatar src={req(`./${event.id}.jpg`)} />}
          />
          <Divider />
          <CardContent>{this.renderResults()}</CardContent>
          <CardActions>
            <Button size="small" onClick={this.onClick}>
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default withRouter(GameCard);
