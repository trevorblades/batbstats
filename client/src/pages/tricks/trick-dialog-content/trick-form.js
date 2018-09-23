import Checkbox from '@material-ui/core/Checkbox';
import Form from '../../../components/form';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormField, {formFieldProps} from '../../../components/form-field';
import Grid from '@material-ui/core/Grid';
import GridItem from './grid-item';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Select from '@material-ui/core/Select';
import defaultProps from 'recompose/defaultProps';
import theme from '@trevorblades/mui-theme';
import upperFirst from 'lodash/upperFirst';
import {VARIATIONS} from '../../../../../api/common';
import {updateTrick} from '../../../actions/games';

const NumberField = defaultProps({type: 'number'})(FormField);

class TrickForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      other: Boolean(props.data.other),
      variation: props.data.variation || ''
    };
  }

  onVariationChange = event => this.setState({variation: event.target.value});

  onOtherChange = (event, checked) => this.setState({other: checked});

  render() {
    return (
      <Form
        method="put"
        action={`/tricks/${this.props.data.id}`}
        title={`Editing ${this.props.data.name}`}
        onCancel={this.props.onCancel}
        successActionCreator={updateTrick}
        render={errors => (
          <Fragment>
            <FormField
              errors={errors}
              defaultValue={this.props.data.name}
              label="Name"
              name="name"
            />
            <Grid container spacing={theme.spacing.unit * 2}>
              <GridItem>
                <NumberField
                  errors={errors}
                  defaultValue={this.props.data.flip}
                  label="Flip"
                  name="flip"
                />
              </GridItem>
              <GridItem>
                <NumberField
                  errors={errors}
                  defaultValue={this.props.data.shuv}
                  label="Shuv"
                  name="shuv"
                />
              </GridItem>
              <GridItem>
                <NumberField
                  errors={errors}
                  defaultValue={this.props.data.spin}
                  label="Spin"
                  name="spin"
                />
              </GridItem>
            </Grid>
            <FormControl {...formFieldProps}>
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
            </FormControl>
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
          </Fragment>
        )}
      />
    );
  }
}

export default TrickForm;
