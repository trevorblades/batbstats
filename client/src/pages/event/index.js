import EventBracket from './event-bracket';
import EventCharts from './event-charts';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import flatMap from 'lodash/flatMap';
import gql from 'graphql-tag';
import keyBy from 'lodash/keyBy';
import styled from 'react-emotion';
import {CenteredCircularProgress} from '../../components';
import {Query} from 'react-apollo';
import {getBye, getLetters} from '../../util/game';

const StyledHeader = styled(Header)({
  display: 'block',
  paddingBottom: 0
});

const query = gql`
  query($id: ID) {
    event(id: $id) {
      id
      name
      games {
        id
        round
        skaters {
          id
          full_name
          country
          stance
        }
        replacements {
          in_id
          out_id
        }
        attempts {
          offense
          successful
          skater_id
          trick {
            id
            variation
            flip
            spin
          }
        }
      }
    }
  }
`;

class Event extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired
  };

  state = {
    tab: 0
  };

  onTabsChange = (event, index) => this.setState({tab: index});

  render() {
    return (
      <Query query={query} variables={{id: this.props.match.params.id}}>
        {({loading, error, data}) => {
          if (loading) return <CenteredCircularProgress />;
          if (error) return <NotFound />;

          const games = data.event.games.map(game => ({
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
                <title>{data.event.name}</title>
              </Helmet>
              <StyledHeader>
                <Typography gutterBottom variant="h3">
                  {data.event.name}
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
        }}
      </Query>
    );
  }
}

export default Event;
