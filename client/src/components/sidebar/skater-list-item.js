import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import upperFirst from 'lodash/upperFirst';
import {withRouter} from 'react-router-dom';

class SkaterListItem extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    skater: PropTypes.object.isRequired
  };

  onClick = () => this.props.history.push(`/skaters/${this.props.skater.id}`);

  render() {
    const names = [
      this.props.skater.first_name,
      this.props.skater.last_name
    ].filter(Boolean);
    const fullName = names.join(' ');
    return (
      <ListItem key={this.props.skater.id} button onClick={this.onClick}>
        <Avatar alt={fullName} src={this.props.skater.avatar}>
          {fullName.charAt(0).toUpperCase()}
        </Avatar>
        <ListItemText
          primary={fullName}
          secondary={upperFirst(this.props.skater.stance)}
        />
      </ListItem>
    );
  }
}

export default withRouter(SkaterListItem);
