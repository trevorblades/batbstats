import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {css} from 'react-emotion';
import {load as loadSkaters} from '../../actions/skaters';
import SkaterListItem from './skater-list-item';

const inheritBackgroundColor = css({
  backgroundColor: 'inherit'
});

class SkaterList extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    skaters: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.dispatch(loadSkaters());
  }

  render() {
    if (this.props.loading) {
      return <CircularProgress />;
    }

    return (
      <List
        className={inheritBackgroundColor}
        subheader={
          <ListSubheader className={inheritBackgroundColor}>
            All skaters
          </ListSubheader>
        }
      >
        {this.props.skaters.map(skater => (
          <SkaterListItem key={skater.id} skater={skater} />
        ))}
      </List>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.skaters.loading,
  skaters: state.skaters.items
});

export default connect(mapStateToProps)(SkaterList);
