import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import FormField, {formFieldProps} from '../../../components/form-field';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Select from '@material-ui/core/Select';
import upperFirst from 'lodash/upperFirst';
import {STANCES, STANCE_REGULAR} from '../../../../../api/common';
import {DatePicker} from 'material-ui-pickers';
import {connect} from 'react-redux';
import {
  save as saveSkater,
  reset as resetSkater
} from '../../../actions/skater';

class SkaterForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    skater: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      birthDate: props.skater.birth_date
        ? new Date(props.skater.birth_date)
        : null,
      stance: props.skater.stance || STANCE_REGULAR
    };
  }

  componentWillUnmount() {
    this.props.dispatch(resetSkater());
  }

  onSubmit = event => {
    event.preventDefault();
    this.props.dispatch(
      saveSkater({
        id: this.props.skater.id,
        first_name: event.target.first_name.value,
        last_name: event.target.last_name.value,
        stance: this.state.stance,
        birth_date: this.state.birthDate,
        hometown: event.target.hometown.value
      })
    );
  };

  onStanceChange = event => this.setState({stance: event.target.value});

  onBirthDateChange = date => this.setState({birthDate: date});

  render() {
    const {errors} = this.props.error || {};
    return (
      <form onSubmit={this.onSubmit}>
        <DialogTitle>Editing {this.props.skater.full_name}</DialogTitle>
        <DialogContent>
          <FormField
            label="First name"
            name="first_name"
            defaultValue={this.props.skater.first_name}
            errors={errors}
          />
          <FormField
            label="Last name"
            name="last_name"
            defaultValue={this.props.skater.last_name}
            errors={errors}
          />
          <FormControl {...formFieldProps}>
            <InputLabel>Stance</InputLabel>
            <Select value={this.state.stance} onChange={this.onStanceChange}>
              {STANCES.map(stance => (
                <MenuItem key={stance} value={stance}>
                  {upperFirst(stance)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormField
            label="Hometown"
            name="hometown"
            defaultValue={this.props.skater.hometown}
            errors={errors}
          />
          <DatePicker
            {...formFieldProps}
            disableFuture
            openToYearSelection
            label="Date of birth"
            error={Boolean(errors && errors.birth_date)}
            value={this.state.birthDate}
            onChange={this.onBirthDateChange}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={this.props.loading} onClick={this.props.onCancel}>
            Cancel
          </Button>
          <Button disabled={this.props.loading} type="submit" color="primary">
            Save changes
          </Button>
        </DialogActions>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  error: state.skater.error,
  loading: state.skater.loading
});

export default connect(mapStateToProps)(SkaterForm);
