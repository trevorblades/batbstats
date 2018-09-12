import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';

export function getEventsFromGames(games) {
  const events = sortBy(uniqBy(map(games, 'event'), 'id'), 'id');
  const groups = groupBy(games, 'event.id');
  return events.map(event => ({
    ...event,
    games: groups[event.id]
  }));
}

const pattern = /^battle at the berrics ([\d\w]+)(: [\w\\. ]+)?$/i;
export function getShortName(event) {
  const match = event.name.match(pattern);
  return match ? `BATB ${match[1]}` : event.name;
}
