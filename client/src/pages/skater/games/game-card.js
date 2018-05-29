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
import thumb from '../../../assets/thumb.jpg';
import {getFullName} from '../../../util/skater';
import {getResults} from '../../../util/game';

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

const letters = 'skate'.toUpperCase().split('');

class GameCard extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired
  };

  render() {
    const skaters = getResults(this.props.game);
    return (
      <Grid key={this.props.game.id} item xs={4}>
        <Card>
          <CardHeader
            title={this.props.game.event.name}
            subheader={`Round ${this.props.game.round}`}
            avatar={<Avatar src={thumb} />}
          />
          <Divider />
          <CardContent>
            <Results>
              {skaters.map(skater => {
                const loser = skater.letters === 5;
                return (
                  <Skater key={skater.id}>
                    <Name>{getFullName(skater)}</Name>
                    <Result
                      style={{
                        textDecoration: loser ? 'line-through' : 'none'
                      }}
                    >
                      {letters.map((letter, index) => (
                        <span
                          key={letter}
                          style={{
                            opacity: index > skater.letters - 1 ? 0.5 : 1
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
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default GameCard;
