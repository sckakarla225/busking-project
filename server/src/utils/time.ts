
function createTimeFromString(timeString: string): Date {
  const currentDate = new Date();
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

  if (modifier.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
  } else if (modifier.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
  }

  currentDate.setHours(hours, minutes, 0, 0);
  return currentDate;
}

export {
  createTimeFromString
};