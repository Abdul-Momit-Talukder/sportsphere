export const parseTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const generateTimeSlots = (openTime, closeTime, intervalMinutes = 60) => {
  const slots = [];
  let current = parseTimeToMinutes(openTime);
  const end = parseTimeToMinutes(closeTime);

  while (current + intervalMinutes <= end) {
    slots.push({
      startTime: minutesToTime(current),
      endTime: minutesToTime(current + intervalMinutes),
    });
    current += intervalMinutes;
  }

  return slots;
};

export const calculateHours = (startTime, endTime) => {
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  return (end - start) / 60;
};
