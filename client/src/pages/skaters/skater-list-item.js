import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {getFullName} from '../../util/skater';

class SkaterListItem extends Component {
  static propTypes = {
    skater: PropTypes.object.isRequired
  };

  render() {
    const fullName = getFullName(this.props.skater);
    return (
      <ListItem
        key={this.props.skater.id}
        button
        component={Link}
        to={`/skaters/${this.props.skater.id}`}
      >
        <Avatar alt={fullName} src={this.props.skater.avatar}>
          {fullName.charAt(0).toUpperCase()}
        </Avatar>
        <ListItemText
          primary={fullName}
          secondary={this.props.skater.hometown}
        />
      </ListItem>
    );
  }
}

export default SkaterListItem;
