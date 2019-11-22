const {getBye} = require('./src/utils');

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
                inId
                outId
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
    actions.createPage({
      path: `/events/${id}`,
      component: EventTemplate,
      context: {id}
    });

    games.forEach(({id, replacements}) => {
      const isBye = getBye(replacements);
      // don't render game pages for bye rounds
      if (!isBye) {
        actions.createPage({
          path: `/games/${id}`,
          component: GameTemplate,
          context: {id}
        });
      }
    });
  });
};
