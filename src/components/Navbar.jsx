import React, { useState } from 'react';
import moment from 'moment';
import { Calendar } from './Calendar';

// Navbar component to handle date navigation and display
export const Navbar = ({ selectedDate, onDateChange }) => {
  // State to manage the visibility of the datepicker
  const [openDatepicker, setOpenDatepicker] = useState(false);

  // Toggle the visibility of the datepicker
  const toggleDatepicker = () => {
    setOpenDatepicker(!openDatepicker);
  };

  // Navigate to the previous month
  const handlePreviousMonth = () => {
    const previousMonth = moment(selectedDate).subtract(1, 'month').toDate();
    onDateChange(previousMonth); // Notify parent component of the date change
  };

  // Navigate to the next month
  const handleNextMonth = () => {
    const nextMonth = moment(selectedDate).add(1, 'month').toDate();
    onDateChange(nextMonth); // Notify parent component of the date change
  };

  // Set the selected date to today
  const handleToday = () => {
    const today = new Date();
    onDateChange(today); // Notify parent component of the date change
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 relative">
      {/* Display the selected month and year with an optional datepicker */}
      <div className="relative flex items-center">
        <div
          onClick={toggleDatepicker} // Toggle the datepicker on click
          className="text-xl text-blue-600 font-medium cursor-pointer hover:text-blue-400"
        >
          {moment(selectedDate).format('MMMM YYYY')} {/* Display the selected month and year */}
        </div>
        {/* Render the datepicker if it's open */}
        {openDatepicker && (
          <div className="absolute top-12 left-0 z-50 bg-white shadow-lg p-2 rounded-lg border border-gray-300">
            <Calendar selectedDate={selectedDate} onDateChange={onDateChange} /> {/* Datepicker component */}
          </div>
        )}
      </div>

      {/* Navigation buttons and "Today" button */}
      <div className="flex items-center">
        <button
          onClick={handlePreviousMonth} // Navigate to the previous month on click
          className="text-3xl mr-2 text-blue-600"
        >
          &lt; {/* Previous month icon */}
        </button>
        <span
          className="text-blue-600 font-medium cursor-pointer p-1.5 bg-blue-200 rounded-lg"
          onClick={handleToday} // Set the date to today on click
        >
          Today
        </span>
        <button
          onClick={handleNextMonth} // Navigate to the next month on click
          className="text-3xl ml-2 text-blue-600"
        >
          &gt; {/* Next month icon */}
        </button>
      </div>
    </div>
  );
};
