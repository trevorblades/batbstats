import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Select from '@material-ui/core/Select';
import countriesClient from '../../util/countries-client';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import upperFirst from 'lodash/upperFirst';
import {DatePicker} from 'material-ui-pickers';
import {FormField, FormFieldControl, formFieldProps} from '../../components';
import {Mutation, Query} from 'react-apollo';
import {STANCES, STANCE_REGULAR} from '@batbstats/common';

const mutation = gql`
  mutation UpdateSkater(
    $id: ID
    $first_name: String
    $last_name: String
    $stance: String
    $country: String
    $birth_date: String
  ) {
    updateSkater(
      id: $id
      first_name: $first_name
      last_name: $last_name
      stance: $stance
      country: $country
      birth_date: $birth_date
    ) {
      id
      first_name
      last_name
      full_name
      stance
      country
      birth_date
    }
  }
`;

class SkaterForm extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    skater: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      birthDate: props.skater.birth_date
        ? new Date(Number(props.skater.birth_date))
        : null,
      country: props.skater.country || 'US',
      stance: props.skater.stance || STANCE_REGULAR
    };
  }

  onSelectChange = event =>
    this.setState({[event.target.name]: event.target.value});

  onBirthDateChange = date => this.setState({birthDate: date});

  render() {
    return (
      <Mutation mutation={mutation}>
        {(updateSkater, {loading}) => (
          <form
            onSubmit={event => {
              event.preventDefault();

              const {first_name, last_name, stance, country} = event.target;
              updateSkater({
                variables: {
                  id: this.props.skater.id,
                  first_name: first_name.value,
                  last_name: last_name.value,
                  stance: stance.value,
                  country: country.value
                }
              });
            }}
          >
            <DialogTitle>Editing skater</DialogTitle>
            <DialogContent>
              <FormField
                label="First name"
                name="first_name"
                defaultValue={this.props.skater.first_name}
              />
              <FormField
                label="Last name"
                name="last_name"
                defaultValue={this.props.skater.last_name}
              />
              <FormFieldControl>
                <InputLabel>Stance</InputLabel>
                <Select
                  name="stance"
                  value={this.state.stance}
                  onChange={this.onSelectChange}
                >
                  {STANCES.map(stance => (
                    <MenuItem key={stance} value={stance}>
                      {upperFirst(stance)}
                    </MenuItem>
                  ))}
                </Select>
              </FormFieldControl>
              <FormFieldControl>
                <InputLabel>Country</InputLabel>
                <Query
                  query={gql`
                    {
                      countries {
                        code
                        name
                      }
                    }
                  `}
                  client={countriesClient}
                >
                  {({loading, data}) => (
                    <Select
                      disabled={loading}
                      name="country"
                      value={this.state.country}
                      onChange={this.onSelectChange}
                    >
                      {loading ? (
                        <MenuItem value={this.state.country}>
                          Loading...
                        </MenuItem>
                      ) : (
                        sortBy(data.countries, 'name').map(country => (
                          <MenuItem key={country.code} value={country.code}>
                            {country.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                </Query>
              </FormFieldControl>
              <DatePicker
                {...formFieldProps}
                disableFuture
                openToYearSelection
                label="Date of birth"
                format="MMMM Do, YYYY"
                value={this.state.birthDate}
                onChange={this.onBirthDateChange}
              />
              {this.state.birthDate && (
                <input
                  type="hidden"
                  name="birth_date"
                  value={this.state.birthDate.toISOString()}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.onClose}>Cancel</Button>
              <Button disabled={loading} type="submit">
                Submit
              </Button>
            </DialogActions>
          </form>
        )}
      </Mutation>
    );
  }
}

export default SkaterForm;
