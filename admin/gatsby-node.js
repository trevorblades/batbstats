exports.createPages = async ({graphql, actions}) => {
  const {data} = await graphql(
    `
      {
        batbstats {
          events {
            id
            games {
              id
              replacements {
                in {
                  id
                }
              }
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
      actions.createPage({
        path: `/events/${id}`,
        component: EventTemplate,
        context: {id}
      });
    }

    games.forEach(({id, replacements}) => {
      if (!replacements.some(replacement => !replacement.in)) {
        // don't render game pages for bye rounds
        actions.createPage({
          path: `/games/${id}`,
          component: GameTemplate,
          context: {id}
        });
      }
    });
  });
};
