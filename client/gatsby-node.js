exports.createPages = async ({graphql, actions}) => {
  const {data} = await graphql(
    `
      {
        batbstats {
          events {
            id
          }
        }
      }
    `
  );

  const EventTemplate = require.resolve('./src/components/event-template');
  data.batbstats.events.forEach(({id}) => {
    actions.createPage({
      path: `/events/${id}`,
      component: EventTemplate,
      context: {id}
    });
  });
};
