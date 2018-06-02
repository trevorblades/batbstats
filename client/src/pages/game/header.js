import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getFullName} from '../../util/skater';
import {getTitle} from '../../selectors/game';

const Names = styled.div({
  display: 'flex'
});

const Name = styled(Typography)({
  flexGrow: 1,
  width: 0,
  ':first-child': {
    textAlign: 'right'
  }
});

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
        <div>
          <Typography align="center" variant="title">
            {this.props.game.event.name}
          </Typography>
          <Names>
            {this.props.game.skaters.map(skater => (
              <Name key={skater.id}>
                <Link to={`/skaters/${skater.id}`}>{getFullName(skater)}</Link>
              </Name>
            ))}
          </Names>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties,
  title: getTitle(state)
});

export default connect(mapStateToProps)(Header);
