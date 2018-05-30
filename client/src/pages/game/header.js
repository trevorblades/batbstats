import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux';
import {getTitle} from '../../selectors/game';

class Header extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired
  };

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{this.props.title}</title>
        </Helmet>
        <Typography variant="title">{this.props.game.event.name}</Typography>
        <Typography variant="subheading">{this.props.title}</Typography>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties,
  title: getTitle(state)
});

export default connect(mapStateToProps)(Header);
