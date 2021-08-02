exports.createPages = async ({graphql, actions}) => {
  const {data} = await graphql(
    `
      {
        batbstats {
          events {
            id
            games {
              id
            }
          }
        }
      }
    `
  );

  const EventTemplate = require.resolve('./src/templates/event');
  const GameTemplate = require.resolve('./src/templates/game');
  data.batbstats.events.forEach(({id, games}) => {
    if (games.length) {
      // only render pages for events that have games
      // TODO: only render pages for events that are completely data-entered
      // calculate number of necessary games based on size of first round
      actions.createPage({
        path: `/events/${id}`,
        component: EventTemplate,
        context: {id}
      });
    }

    games.forEach(({id}) => {
      // TODO: don't render game pages for bye rounds
      actions.createPage({
        path: `/games/${id}`,
        component: GameTemplate,
        context: {id}
      });
    });
  });
};
