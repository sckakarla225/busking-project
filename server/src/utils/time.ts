
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

function getDayOfWeek(dateStr: string): string {
  const [month, day, year] = dateStr.split('/').map(num => parseInt(num, 10));
  const fullYear = year < 50 ? 2000 + year : 1900 + year;

  const date = new Date(fullYear, month - 1, day);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function getNextHour(timeStr: string): string {
  let [hour, minutePart] = timeStr.split(':');
  let [minutes, period] = minutePart.split(' ');

  let hourInt = parseInt(hour, 10);
  if (period === 'PM' && hourInt < 12) {
    hourInt += 12;
  } else if (period === 'AM' && hourInt === 12) {
    hourInt = 0;
  }

  hourInt += 1;

  if (hourInt >= 24) hourInt = 0;
  if (hourInt === 12) period = period === 'AM' ? 'PM' : 'AM';

  let newHour = hourInt % 12;
  newHour = newHour === 0 ? 12 : newHour;

  return `${newHour}:${minutes} ${period}`;
};

function reformatDateString(dateStr: string): string {
  let [month, day, year] = dateStr.split('/');
  month = month.length === 1 ? `0${month}` : month;
  day = day.length === 1 ? `0${day}` : day;

  const yearInt = parseInt(year, 10);
  year = yearInt < 50 ? `20${year}` : `19${year}`;

  return `${month}/${day}/${year}`;
}

export {
  createTimeFromString,
  getDayOfWeek,
  getNextHour,
  reformatDateString
};