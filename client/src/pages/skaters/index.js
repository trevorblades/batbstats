import CenteredCircularProgress from '../../components/centered-circular-progress';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import NotFound from '../not-found';
import React, {Fragment} from 'react';
import SkatersTable from './skaters-table';
import Typography from '@material-ui/core/Typography';
import filter from 'lodash/filter';
import gql from 'graphql-tag';
import round from 'lodash/round';
import sumBy from 'lodash/sumBy';
import {Query} from 'react-apollo';
import {getBye, getLetters} from '../../util/game';

const title = 'Skaters';
const query = gql`
  {
    skaters {
      id
      full_name
      games {
        id
        replacements {
          in_id
          out_id
        }
        attempts {
          offense
          successful
          redos
          skater_id
        }
      }
    }
  }
`;

const Skaters = () => (
  <Fragment>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Query query={query}>
      {({loading, error, data}) => {
        if (loading) return <CenteredCircularProgress />;
        if (error) return <NotFound />;

        const skaters = data.skaters
          .filter(skater => skater.games.length > 0)
          .map(skater => {
            const wins = skater.games.reduce((count, game) => {
              const bye = getBye(game.replacements);
              if (!bye) {
                const letters = getLetters(game.attempts);
                if (letters[skater.id] < 5) {
                  return count + 1;
                }
              }

              return count;
            }, 0);

            const attempts = skater.games.flatMap(game =>
              filter(game.attempts, ['skater_id', skater.id])
            );
            const makes = filter(attempts, 'successful').length;

            const gamesPlayed = skater.games.length;
            return {
              ...skater,
              wins,
              losses: gamesPlayed - wins,
              win_percentage: gamesPlayed && round(wins / gamesPlayed * 100, 2),
              attempts,
              makes,
              misses: attempts.length - makes,
              redos: sumBy(attempts, 'redos')
            };
          });

        return (
          <Fragment>
            <Header>
              <Typography variant="display1">{title}</Typography>
            </Header>
            <SkatersTable skaters={skaters} />
          </Fragment>
        );
      }}
    </Query>
  </Fragment>
);

export default Skaters;
