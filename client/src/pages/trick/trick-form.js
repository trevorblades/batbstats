import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import DialogButton from '../../components/dialog-button';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormField, {formFieldProps} from '../../components/form-field';
import Grid from '@material-ui/core/Grid';
import GridItem from './grid-item';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Select from '@material-ui/core/Select';
import defaultProps from 'recompose/defaultProps';
import gql from 'graphql-tag';
import theme from '@trevorblades/mui-theme';
import upperFirst from 'lodash/upperFirst';
import withProps from 'recompose/withProps';
import {Mutation} from 'react-apollo';
import {VARIATIONS} from '../../../../api/common';

const NumberField = defaultProps({type: 'number'})(FormField);
const FormFieldControl = withProps(formFieldProps)(FormControl);

const mutation = gql`
  mutation UpdateTrick(
    $id: ID
    $name: String
    $flip: Int
    $shuv: Int
    $spin: Int
    $variation: String
    $other: Boolean
  ) {
    updateTrick(
      id: $id
      name: $name
      flip: $flip
      shuv: $shuv
      spin: $spin
      variation: $variation
      other: $other
    ) {
      id
      name
      flip
      shuv
      spin
      variation
      other
    }
  }
`;

class TrickForm extends Component {
  static propTypes = {
    trick: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      other: Boolean(props.trick.other),
      variation: props.trick.variation || ''
    };
  }

  onVariationChange = event => this.setState({variation: event.target.value});

  onOtherChange = (event, checked) => this.setState({other: checked});

  render() {
    return (
      <DialogButton title="Edit trick" variant="outlined">
        {onClose => (
          <Mutation mutation={mutation}>
            {(updateTrick, {loading}) => (
              <form
                onSubmit={event => {
                  event.preventDefault();
                  const {
                    name,
                    flip,
                    shuv,
                    spin,
                    variation,
                    other
                  } = event.target;
                  updateTrick({
                    variables: {
                      id: this.props.trick.id,
                      name: name.value,
                      flip: Number(flip.value),
                      shuv: Number(shuv.value),
                      spin: Number(spin.value),
                      variation: variation.value,
                      other: other.value === 'true'
                    }
                  });
                }}
              >
                <DialogContent>
                  <FormField
                    defaultValue={this.props.trick.name}
                    label="Name"
                    name="name"
                  />
                  <Grid container spacing={theme.spacing.unit * 2}>
                    <GridItem>
                      <NumberField
                        defaultValue={this.props.trick.flip}
                        label="Flip"
                        name="flip"
                      />
                    </GridItem>
                    <GridItem>
                      <NumberField
                        defaultValue={this.props.trick.shuv}
                        label="Shuv"
                        name="shuv"
                      />
                    </GridItem>
                    <GridItem>
                      <NumberField
                        defaultValue={this.props.trick.spin}
                        label="Spin"
                        name="spin"
                      />
                    </GridItem>
                  </Grid>
                  <FormFieldControl>
                    <InputLabel>Variation</InputLabel>
                    <Select
                      name="variation"
                      value={this.state.variation}
                      onChange={this.onVariationChange}
                    >
                      <MenuItem value="">None</MenuItem>
                      {VARIATIONS.map(variation => (
                        <MenuItem key={variation} value={variation}>
                          {upperFirst(variation)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormFieldControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.other}
                        onChange={this.onOtherChange}
                      />
                    }
                    label="Other"
                  />
                  <input type="hidden" name="other" value={this.state.other} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button disabled={loading} type="submit">
                    Submit
                  </Button>
                </DialogActions>
              </form>
            )}
          </Mutation>
        )}
      </DialogButton>
    );
  }
}

export default TrickForm;
