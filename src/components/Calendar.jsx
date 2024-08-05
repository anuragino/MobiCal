import React, { useState } from 'react';
import moment from 'moment';

// Calendar component to select a date
export const Calendar = ({ selectedDate, onDateChange }) => {
  // Get the current year and create an array of years to display in the year dropdown
  const currentYear = moment().year();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);
  const months = moment.months();

  // State to manage the currently displayed month and year in the calendar
  const [displayedMonth, setDisplayedMonth] = useState(moment(selectedDate).month());
  const [displayedYear, setDisplayedYear] = useState(moment(selectedDate).year());

  // Handler for changing the month
  const handleMonthChange = (event) => {
    setDisplayedMonth(moment().month(event.target.value).month());
  };

  // Handler for changing the year
  const handleYearChange = (event) => {
    setDisplayedYear(parseInt(event.target.value, 10));
  };

  // Handler for clicking on a date
  const handleDateClick = (date) => {
    onDateChange(date); // Notify parent component of the selected date
  };

  // Calculate the start of the month and number of days in the month
  const startOfMonth = moment([displayedYear, displayedMonth]);
  const daysInMonth = startOfMonth.daysInMonth();
  const firstDayOfMonth = startOfMonth.day();

  // Create an array of dates for rendering the calendar
  const dates = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push(null); // Add empty cells for days before the start of the month
  }
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(displayedYear, displayedMonth, i)); // Add dates for the current month
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-72">
      {/* Month and Year selection */}
      <div className="flex justify-between mb-4">
        <select
          value={months[displayedMonth]}
          onChange={handleMonthChange}
          className="bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-700 shadow-sm"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={displayedYear}
          onChange={handleYearChange}
          className="bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-700 shadow-sm"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-gray-600">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="font-medium">
            {day}
          </div>
        ))}
        
        {/* Render dates */}
        {dates.map((date, index) =>
          date ? (
            <button
              key={index}
              onClick={() => handleDateClick(date)} // Handle date click
              className={`p-2 rounded-full ${
                moment(date).isSame(selectedDate, 'day')
                  ? 'bg-blue-600 text-white' // Highlight selected date
                  : 'text-gray-700 hover:bg-blue-200' // Styling for other dates
              }`}
            >
              {moment(date).date()} {/* Display the day of the month */}
            </button>
          ) : (
            <div key={index} /> // Empty cell for days before the start of the month
          )
        )}
      </div>
    </div>
  );
};
