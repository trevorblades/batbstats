import EventBracket from './event-bracket';
import EventCharts from './event-charts';
import Header from '../../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import flatMap from 'lodash/flatMap';
import keyBy from 'lodash/keyBy';
import styled from 'react-emotion';
import {getBye, getLetters} from '../../../util/game';

const StyledHeader = styled(Header)({
  display: 'block',
  paddingBottom: 0
});

class EventContent extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired
  };

  state = {
    tab: 0
  };

  onTabsChange = (event, index) => this.setState({tab: index});

  render() {
    const games = this.props.event.games.map(game => ({
      ...game,
      bye: getBye(game.replacements),
      letters: getLetters(game.attempts)
    }));

    const attempts = flatMap(games, game => {
      const skaters = keyBy(game.skaters, 'id');
      return game.attempts.map(attempt => ({
        ...attempt,
        round: game.round,
        skater: skaters[attempt.skater_id]
      }));
    });

    return (
      <Fragment>
        <Helmet>
          <title>{this.props.event.name}</title>
        </Helmet>
        <StyledHeader withDivider>
          <Typography gutterBottom variant="h3">
            {this.props.event.name}
          </Typography>
          <Tabs value={this.state.tab} onChange={this.onTabsChange}>
            <Tab label="Bracket" />
            <Tab label="Charts" />
          </Tabs>
        </StyledHeader>
        {!this.state.tab && <EventBracket games={games} />}
        {this.state.tab === 1 && <EventCharts attempts={attempts} />}
      </Fragment>
    );
  }
}

export default EventContent;
