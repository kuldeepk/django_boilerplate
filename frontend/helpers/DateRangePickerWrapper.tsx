import React from 'react';
import 'react-dates/initialize';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';

import { DateRangePicker, DateRangePickerShape, DateRangePickerPhrases } from 'react-dates';

import isInclusivelyAfterDay from 'react-dates/lib/utils/isInclusivelyAfterDay';
import isInclusivelyBeforeDay from 'react-dates/lib/utils/isInclusivelyBeforeDay';
import 'react-dates/lib/css/_datepicker.css';
import '../styles/day-picker.css';

const START_DATE = 'startDate';
const END_DATE = 'endDate';
const HORIZONTAL_ORIENTATION = 'horizontal';
const ANCHOR_LEFT = 'left';

const propTypes = {
  // example props for the demo
  autoFocus: PropTypes.bool,
  autoFocusEndDate: PropTypes.bool,
  stateDateWrapper: PropTypes.func,
  initialStartDate: momentPropTypes.momentObj,
  initialEndDate: momentPropTypes.momentObj,
  onDateChange: PropTypes.func,

  ...omit(DateRangePickerShape, [
    'startDate',
    'endDate',
    'onDatesChange',
    'focusedInput',
    'onFocusChange',
  ]),
};

const defaultProps = {
  // example props for the demo
  autoFocus: false,
  autoFocusEndDate: false,
  initialStartDate: null,
  initialEndDate: null,
  onDateChange: null,

  // input related props
  startDateId: START_DATE,
  startDatePlaceholderText: 'Start Date',
  endDateId: END_DATE,
  endDatePlaceholderText: 'End Date',
  disabled: false,
  required: false,
  screenReaderInputMessage: '',
  showClearDates: false,
  showDefaultInputIcon: false,
  customInputIcon: null,
  customArrowIcon: null,
  customCloseIcon: null,
  block: false,
  small: false,
  regular: false,
  hideKeyboardShortcutsPanel: true,

  // calendar presentation and interaction related props
  renderMonthText: null,
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 2,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDates: false,
  isRTL: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  onClose() {},

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  minimumNights: 1,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  isOutsideRange: day => !isInclusivelyBeforeDay(day, moment()),
  isDayHighlighted: () => false,

  // internationalization
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  phrases: DateRangePickerPhrases,

  stateDateWrapper: date => date,
};

class DateRangePickerWrapper extends React.Component {
  
  public static propTypes = propTypes;
  public static defaultProps = defaultProps;

  constructor(props) {
    super(props);
defaultProps
    let focusedInput = null;
    if (props.autoFocus) {
      focusedInput = START_DATE;
    } else if (props.autoFocusEndDate) {
      focusedInput = END_DATE;
    }

    this.state = {
      focusedInput,
      startDate: props.initialStartDate,
      endDate: props.initialEndDate,
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    // @ts-ignore
    const { stateDateWrapper } = this.props;
    this.setState({
      startDate: startDate && stateDateWrapper(startDate),
      endDate: endDate && stateDateWrapper(endDate),
    });
    // @ts-ignore
    if(this.props.onDateChange && startDate && endDate){
      // @ts-ignore
      this.props.onDateChange(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    }
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  render() {
    // @ts-ignore
    const { focusedInput, startDate, endDate } = this.state;

    // autoFocus, autoFocusEndDate, initialStartDate and initialEndDate are helper props for the
    // example wrapper but are not props on the SingleDatePicker itself and
    // thus, have to be omitted.
    const props = omit(this.props, [
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate',
      'stateDateWrapper',
      'onDateChange'
    ]);

    return (
      <div>
        <DateRangePicker
          {...omit(props, ['onDateChange'])}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    );
  }
}

export default DateRangePickerWrapper;