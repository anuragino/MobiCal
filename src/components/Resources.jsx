import React from 'react';

// Component to display resources and events in a calendar-like grid
export const Resources = ({
  year,
  month,
  events,
  currentDragEvent,
  onMouseDown,
  onDelete,
}) => {
  // List of resources
  const resources = [
    'Resource A', 'Resource B', 'Resource C', 'Resource D', 'Resource E',
    'Resource F', 'Resource G', 'Resource H', 'Resource I', 'Resource J',
    'Resource K', 'Resource L', 'Resource M', 'Resource N', 'Resource O'
  ];

  // Get the number of days in the selected month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create an array of Date objects for each day in the month
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  // Function to format time from hours to a 12-hour clock with AM/PM
  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const period = h < 12 ? 'AM' : 'PM';
    const formattedHour = h % 12 === 0 ? 12 : h % 12;
    return `${formattedHour}:${m.toString().padStart(2, '0')} ${period}`;
  };

  // Handler for delete button click event with confirmation
  const handleDeleteClick = (e, id) => {
    e.stopPropagation(); // Prevent event from bubbling up
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(id); // Call the onDelete function passed as a prop
    }
  };

  return (
    <div className="grid grid-cols-12 w-full">
      {/* Render resource names on the left column */}
      <div className="col-span-2">
        {resources.map((resource, index) => (
          <div key={index} className="flex items-center h-12 border border-gray-300">
            <span className="p-4 cursor-default font-medium">{resource}</span>
          </div>
        ))}
      </div>

      {/* Render days and events for each resource */}
      <div className="col-span-10">
        {resources.map((_, resourceIndex) => (
          <div key={resourceIndex} className="flex h-12 relative">
            {days.map((_, dayIndex) => (
              <div
                key={dayIndex}
                className="min-w-[80px] border border-gray-300 p-2 relative cell"
                onMouseDown={(e) => onMouseDown(e, resourceIndex, dayIndex)} // Start dragging on mouse down
              >
                {/* Render events for the specific resource and day */}
                {events
                  .filter((event) => event.resource === resourceIndex && event.day === dayIndex)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="event absolute flex flex-col items-center justify-center p-1"
                      style={{
                        left: `${event.start}px`,
                        width: `${event.width}px`,
                        top: '10%',
                        height: '80%',
                        backgroundColor: event.color,
                        borderRadius: '8px',
                      }}
                    >
                      <div className="event-content w-full relative">
                        <div className="text-center">{formatTime(event.startTime)} - {formatTime(event.endTime)}</div>
                        <button
                          className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center z-10"
                          onClick={(e) => handleDeleteClick(e, event.id)} // Handle delete event
                        >
                          X
                        </button>
                      </div>
                    </div>
                  ))}

                {/* Render the event being dragged */}
                {currentDragEvent &&
                  currentDragEvent.resource === resourceIndex &&
                  currentDragEvent.day === dayIndex && (
                    <div
                      className="event absolute flex flex-col items-center justify-center p-1"
                      style={{
                        left: `${currentDragEvent.start}px`,
                        width: `${currentDragEvent.width}px`,
                        top: '10%',
                        height: '80%',
                        backgroundColor: currentDragEvent.color,
                        opacity: 0.5,
                        borderRadius: '8px',
                      }}
                    >
                      <div className="event-content w-full relative">
                        <div className="text-center">Dragging</div>
                        <div className="text-center">
                          {formatTime(currentDragEvent.startTime)} - {formatTime(currentDragEvent.endTime)}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
