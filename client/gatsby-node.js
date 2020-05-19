const getBye = require('./src/utils/get-bye');

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
                out {
                  id
                }
              }
            }
          }
        }
      }
    `
  );

  const EventTemplate = require.resolve('./src/components/event-template');
  const GameTemplate = require.resolve('./src/components/game-template');
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
      const isBye = getBye(replacements);
      if (!isBye) {
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
