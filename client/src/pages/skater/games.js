import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {connect} from 'react-redux';
import thumb from '../../assets/thumb.jpg';
import {getFullName} from '../../util/skater';
import {getResults} from '../../util/game';

const StyledCardMedia = styled(CardMedia)({
  paddingTop: `${9 / 16 * 100}%`
});

const Results = styled.div({
  display: 'flex',
  justifyContent: 'space-between'
});

const Skater = styled.div(props => ({
  opacity: props.winner ? 1 : 0.5
}));

const Name = withProps({variant: 'body2'})(Typography);

const Result = withProps({variant: 'caption'})(Typography);

class Games extends Component {
  static propTypes = {
    skater: PropTypes.object.isRequired
  };

  render() {
    return (
      <Grid container spacing={24}>
        {this.props.skater.games.map(game => {
          const results = getResults(game);
          console.log(results);
          return (
            <Grid key={game.id} item xs={4}>
              <Card>
                <CardHeader
                  title={game.event.name}
                  subheader={`Round ${game.round}`}
                  action={
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <StyledCardMedia image={thumb} />
                <CardContent>
                  <Results>
                    <Skater>
                      <Name>{getFullName(this.props.skater)}</Name>
                      <Result>S.K.A.T.E.</Result>
                    </Skater>
                    <Skater style={{textAlign: 'right'}}>
                      <Name>{getFullName(game.skaters[0])}</Name>
                      <Result>S.K.A.T.E.</Result>
                    </Skater>
                  </Results>
                </CardContent>
                <CardActions>
                  <Button size="small">Watch</Button>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  skater: state.skater.properties
});

export default connect(mapStateToProps)(Games);
