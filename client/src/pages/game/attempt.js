import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';
import styled, {css} from 'react-emotion';
import {size} from 'polished';
import theme from '../../theme';

const Container = styled.div(props => ({
  display: 'flex',
  flexDirection: props.right ? 'row-reverse' : 'row',
  alignItems: 'center',
  justifyContent: props.right ? 'flex-start' : 'flex-end'
}));

const iconClassName = css(size(theme.spacing.unit * 2), {
  ':not(:last-child)': {
    marginRight: theme.spacing.unit / 2
  }
});

class Attempt extends Component {
  static propTypes = {
    attempt: PropTypes.object.isRequired,
    right: PropTypes.bool.isRequired
  };

  renderResult() {
    if (this.props.attempt.successful) {
      return <CheckCircleIcon className={iconClassName} color="inherit" />;
    }
    return <CloseIcon className={iconClassName} color="action" />;
  }

  renderRedos() {
    if (!this.props.attempt.redos) {
      return null;
    }

    const redos = [];
    for (let i = 0; i < this.props.attempt.redos; i++) {
      redos.push(
        <RefreshIcon
          key={i.toString()}
          color="action"
          className={iconClassName}
        />
      );
    }
    return redos;
  }

  render() {
    return (
      <Container right={this.props.right}>
        <Typography>{this.props.attempt.trick.name}</Typography>
        {this.renderRedos()}
        {this.renderResult()}
      </Container>
    );
  }
}

export default Attempt;
