import { KeyboardEvent, RefObject } from "react";
import classNames from "classnames";
import styles from "../TimePicker.module.css";
import { calculateNextHour, calculateNextMinute } from "../utils/timeUtils";

interface TimeInputsProps {
  hour: string;
  minute: string;
  hourRef: RefObject<HTMLInputElement | null>;
  minuteRef: RefObject<HTMLInputElement | null>;
  is24Hour: boolean;
  disabled?: boolean;
  required?: boolean;
  hourStep: number;
  minuteStep: number;
  hourPlaceholder: string;
  minutePlaceholder: string;
  id?: string;
  classes?: {
    timeInputs?: string;
    timeInput?: string;
    separator?: string;
  };
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
}

export const TimeInputs = ({
  hour,
  minute,
  hourRef,
  minuteRef,
  is24Hour,
  disabled,
  required,
  hourStep,
  minuteStep,
  hourPlaceholder,
  minutePlaceholder,
  id,
  classes = {},
  onHourChange,
  onMinuteChange,
}: TimeInputsProps) => {
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (disabled) return;

    if (val === "" || /^\d+$/.test(val)) {
      if (val.length <= 1) {
        onHourChange(val);
      } else if (val.length === 2) {
        const numVal = parseInt(val, 10);
        const minHour = is24Hour ? 0 : 1;
        const maxHour = is24Hour ? 23 : 12;
        if (numVal >= minHour && numVal <= maxHour) {
          onHourChange(val);
          setTimeout(() => {
            minuteRef.current?.focus();
          }, 0);
        }
      }
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (disabled) return;

    if (val === "" || /^\d+$/.test(val)) {
      const numVal = val === "" ? 0 : parseInt(val, 10);
      if (val === "" || (numVal >= 0 && numVal <= 59)) {
        onMinuteChange(val);
      }
    }
  };

  const handleHourKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentHour = hour === "" ? (is24Hour ? 0 : 1) : parseInt(hour, 10);
      const newHour = calculateNextHour(currentHour, e.key === "ArrowUp", is24Hour, hourStep);
      onHourChange(newHour.toString().padStart(2, "0"));
    }
  };

  const handleMinuteKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace" && minute.length <= 1) {
      setTimeout(() => {
        hourRef.current?.focus();
      }, 0);
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentMinute = minute === "" ? 0 : parseInt(minute, 10);
      const newMinute = calculateNextMinute(currentMinute, e.key === "ArrowUp", minuteStep);
      onMinuteChange(newMinute.toString().padStart(2, "0"));
    }
  };

  const handleHourBlur = () => {
    if (disabled) return;
    if (!is24Hour && hour === "0") {
      onHourChange("12");
    } else if (hour.length === 1) {
      onHourChange(`0${hour}`);
    }
  };

  const handleMinuteBlur = () => {
    if (disabled) return;
    if (minute === "") {
      onMinuteChange("00");
    } else if (minute.length === 1) {
      onMinuteChange(`0${minute}`);
    } else {
      const minuteNum = parseInt(minute, 10);
      const roundedMinute = Math.round(minuteNum / minuteStep) * minuteStep;
      const finalMinute = roundedMinute % 60;
      onMinuteChange(finalMinute.toString().padStart(2, "0"));
    }
  };

  return (
    <div className={classNames(styles.timeInputs, classes.timeInputs)}>
      <input
        ref={hourRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={hour}
        onChange={handleHourChange}
        onKeyDown={handleHourKeyDown}
        onBlur={handleHourBlur}
        placeholder={hourPlaceholder}
        className={classNames(styles.timeInput, classes.timeInput)}
        aria-label="Hour"
        id={id ? `${id}-hour` : undefined}
        disabled={disabled}
        required={required}
      />
      <span className={classNames(styles.separator, classes.separator)}>:</span>
      <input
        ref={minuteRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={minute}
        onChange={handleMinuteChange}
        onKeyDown={handleMinuteKeyDown}
        onBlur={handleMinuteBlur}
        placeholder={minutePlaceholder}
        className={classNames(styles.timeInput, classes.timeInput)}
        aria-label="Minute"
        id={id ? `${id}-minute` : undefined}
        disabled={disabled}
        required={required}
      />
    </div>
  );
};
