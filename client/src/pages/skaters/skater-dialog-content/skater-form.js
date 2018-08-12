import FormControl from '@material-ui/core/FormControl';
import Form from '../../../components/form';
import FormField, {formFieldProps} from '../../../components/form-field';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Select from '@material-ui/core/Select';
import upperFirst from 'lodash/upperFirst';
import {STANCES, STANCE_REGULAR} from '../../../../../api/common';
import {DatePicker} from 'material-ui-pickers';
import {updateSkater} from '../../../actions/games';

class SkaterForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      birthDate: props.data.birth_date ? new Date(props.data.birth_date) : null,
      stance: props.data.stance || STANCE_REGULAR
    };
  }

  onStanceChange = event => this.setState({stance: event.target.value});

  onBirthDateChange = date => this.setState({birthDate: date});

  render() {
    return (
      <Form
        method="put"
        action={`/skaters/${this.props.data.id}`}
        title={`Editing ${this.props.data.full_name}`}
        onCancel={this.props.onCancel}
        successActionCreator={updateSkater}
        render={errors => (
          <Fragment>
            <FormField
              errors={errors}
              label="First name"
              name="first_name"
              defaultValue={this.props.data.first_name}
            />
            <FormField
              errors={errors}
              label="Last name"
              name="last_name"
              defaultValue={this.props.data.last_name}
            />
            <FormControl {...formFieldProps}>
              <InputLabel>Stance</InputLabel>
              <Select
                name="stance"
                value={this.state.stance}
                onChange={this.onStanceChange}
              >
                {STANCES.map(stance => (
                  <MenuItem key={stance} value={stance}>
                    {upperFirst(stance)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormField
              errors={errors}
              label="Hometown"
              name="hometown"
              defaultValue={this.props.data.hometown}
            />
            <DatePicker
              {...formFieldProps}
              disableFuture
              openToYearSelection
              label="Date of birth"
              format="MMMM Do, YYYY"
              error={Boolean(errors && errors.birth_date)}
              value={this.state.birthDate}
              onChange={this.onBirthDateChange}
            />
            <input
              type="hidden"
              name="birth_date"
              value={this.state.birthDate.toISOString()}
            />
          </Fragment>
        )}
      />
    );
  }
}

export default SkaterForm;
