import Header from '../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';

const EventContent = props => (
  <Fragment>
    <Helmet>
      <title>{props.event.name}</title>
    </Helmet>
    <Header>
      <Typography variant="headline">{props.event.name}</Typography>
    </Header>
  </Fragment>
);

EventContent.propTypes = {
  event: PropTypes.object.isRequired
};

export default EventContent;
