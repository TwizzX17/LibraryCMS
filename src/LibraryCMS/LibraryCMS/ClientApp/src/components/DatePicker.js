import DatePicker from 'react-datepicker';
import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
const MyDatePicker = (props) => {

  /**
   * Life up state to parent component
   * @param {*} date 
   */
  function handleChange(date){
    props.onDateChange(date);
  }

  return (
    <DatePicker 
    className="datePicker"
    selected={props.selectedDate}
    onChange={(date) => handleChange(date)}
    dateFormat="dd/MM/yyyy"
    selectsStart
    startDate={props.selectedDate}
    endDate={props.endDate}
    disabled={props.disabled}
    minDate={props.minDate}
     />
  );
};
  export default MyDatePicker;