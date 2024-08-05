import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Days } from './components/Days';
import { Resources } from './components/Resources';

function App() {
  // State to track the currently selected date
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State to track the current year and month based on selected date
  const [year, setYear] = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth());

  // State to manage the list of events
  const [events, setEvents] = useState([]);

  // State to manage the currently dragged event
  const [currentDragEvent, setCurrentDragEvent] = useState(null);

  // Ref to keep track of the drag event's initial position
  const dragEvent = useRef(null);

  useEffect(() => {
    try {
      // Load events from local storage when the component mounts
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      console.log('Loaded events from localStorage:', storedEvents); // Debugging line
      setEvents(storedEvents);
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      // Save events to local storage whenever events change
      console.log('Saving events to localStorage:', events); // Debugging line
      localStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events to localStorage:', error);
    }
  }, [events]);

  // Handler to update the selected date and year/month based on the new date
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setYear(date.getFullYear());
    setMonth(date.getMonth());
  };

  // Handler for mouse down event to start dragging an event
  const handleMouseDown = (e, resourceIndex, dayIndex) => {
    const cell = e.target.getBoundingClientRect();
    const startX = e.clientX - cell.left;

    // Initialize a new event with start values and current month/year
    const newEvent = {
      id: new Date().getTime(),
      resource: resourceIndex,
      day: dayIndex,
      start: startX,
      width: 0,
      color: getRandomColor(resourceIndex),
      startTime: 0,
      endTime: 0,
      month,
      year,
    };

    dragEvent.current = { newEvent, startX, initialCell: cell };
    setCurrentDragEvent(newEvent);

    // Handler to update event width while dragging
    const handleMouseMove = (e) => {
      if (dragEvent.current) {
        const { newEvent, startX, initialCell } = dragEvent.current;
        const newWidth = Math.max(e.clientX - initialCell.left - startX, 0);
        const cellWidth = initialCell.width;

        const startTime = (newEvent.start / cellWidth) * 24;
        const endTime = ((newEvent.start + newWidth) / cellWidth) * 24;

        setCurrentDragEvent({
          ...newEvent,
          width: newWidth,
          startTime,
          endTime,
        });
      }
    };

    // Handler to finalize the event after dragging is complete
    const handleMouseUp = (e) => {
      if (dragEvent.current) {
        const { newEvent, startX, initialCell } = dragEvent.current;
        const newWidth = Math.max(e.clientX - initialCell.left - startX, 0);
        const cellWidth = initialCell.width;

        // Only add the event if its width is greater than zero
        if (newWidth > 0) {
          const startTime = (newEvent.start / cellWidth) * 24;
          const endTime = ((newEvent.start + newWidth) / cellWidth) * 24;

          setEvents((prevEvents) => [
            ...prevEvents,
            {
              ...newEvent,
              width: newWidth,
              startTime,
              endTime,
            },
          ]);
        }
      }

      // Cleanup after dragging
      setCurrentDragEvent(null);
      dragEvent.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    // Attach mouse move and mouse up event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handler to delete an event after confirmation
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    }
  };

  // Function to get a random color based on resource index
  const getRandomColor = (index) => {
    const colors = [
      '#f8b400', '#ff6b6b', '#4ecdc4', '#1a535c', '#1a3f64',
      '#b58ed8', '#ffadad', '#ffd6a5', '#fdffb6', '#caffbf',
      '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff', '#39a9da',
    ];
    return colors[index % colors.length];
  };

  // Filter events based on the selected month and year
  const filteredEvents = events.filter(
    (event) => event.year === year && event.month === month
  );

  return (
    <div className="h-screen flex flex-col">
      <Navbar selectedDate={selectedDate} onDateChange={handleDateChange} />
      <div className="flex-grow overflow-x-auto">
        <Days year={year} month={month} />
        <Resources
          year={year}
          month={month}
          events={filteredEvents}
          currentDragEvent={currentDragEvent}
          onMouseDown={handleMouseDown}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default App;
