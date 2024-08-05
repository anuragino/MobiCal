export const Days = ({ year, month }) => {
  // Calculate the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Generate an array of Date objects for each day in the month
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  
  // Get today's date for comparison
  const todayDate = new Date();

  // Helper function to check if a given day is today
  const isToday = (day) =>
    day.getDate() === todayDate.getDate() &&
    day.getMonth() === todayDate.getMonth() &&
    day.getFullYear() === todayDate.getFullYear();

  return (
    <div className="grid grid-cols-12">
      {/* Empty column for resource names or other content */}
      <div className="grid col-span-2 border"></div>
      
      {/* Grid to display days */}
      <div className="grid col-span-10">
        <div className="flex flex-col">
          <div className="flex h-12">
            {/* Map over the days array to render each day */}
            {days.map((day, index) => (
              <div
                key={index} // Unique key for each day element
                className={`min-w-[80px] border p-2 text-sm text-center ${
                  isToday(day) ? 'bg-blue-500 rounded-full text-white p-0' : ''
                } relative`}
              >
                <div>{day.getDate()}</div> {/* Display the day of the month */}
                <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div> {/* Display the weekday */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
