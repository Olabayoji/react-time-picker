import { useState } from "react";
import { TimePickerValue } from "../../../types";

export const useTimeState = (
  value?: TimePickerValue,
  onChange?: (value: TimePickerValue) => void
) => {
  const [internalHour, setInternalHour] = useState("");
  const [internalMinute, setInternalMinute] = useState("");
  const [internalPeriod, setInternalPeriod] = useState<"AM" | "PM">("AM");

  const hour = value?.hour ?? internalHour;
  const minute = value?.minute ?? internalMinute;
  const period = value?.period ?? internalPeriod;

  const updateTime = (newTime: Partial<TimePickerValue>) => {
    const updated = {
      hour,
      minute,
      period,
      ...newTime,
    };
    if (onChange) {
      onChange(updated);
    } else {
      if (newTime.hour !== undefined) setInternalHour(newTime.hour);
      if (newTime.minute !== undefined) setInternalMinute(newTime.minute);
      if (newTime.period !== undefined) setInternalPeriod(newTime.period);
    }
  };

  return {
    hour,
    minute,
    period,
    updateTime,
  };
};
