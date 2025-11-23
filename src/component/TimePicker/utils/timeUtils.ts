export const generateHours = (is24Hour: boolean, hourStep: number = 1) => {
  const minHour = is24Hour ? 0 : 1;
  const maxHour = is24Hour ? 23 : 12;
  const hours = [];

  for (let i = minHour; i <= maxHour; i += hourStep) {
    hours.push(i.toString().padStart(2, "0"));
  }

  return hours;
};

export const generateMinutes = (minuteStep: number = 5) => {
  const minutes = [];
  for (let i = 0; i < 60; i += minuteStep) {
    minutes.push(i.toString().padStart(2, "0"));
  }
  return minutes;
};

export const calculateNextHour = (
  currentHour: number,
  increment: boolean,
  is24Hour: boolean,
  hourStep: number
) => {
  const minHour = is24Hour ? 0 : 1;
  const maxHour = is24Hour ? 23 : 12;

  if (increment) {
    let newHour = currentHour >= maxHour - (hourStep - 1) ? minHour : currentHour + hourStep;
    if (newHour > maxHour) newHour = minHour;
    return newHour;
  } else {
    let newHour = currentHour <= minHour + (hourStep - 1) ? maxHour : currentHour - hourStep;
    if (newHour < minHour) newHour = maxHour - (maxHour % hourStep);
    return newHour;
  }
};

export const calculateNextMinute = (
  currentMinute: number,
  increment: boolean,
  minuteStep: number
) => {
  if (increment) {
    return (currentMinute + minuteStep) % 60;
  } else {
    return (currentMinute - minuteStep + 60) % 60;
  }
};
