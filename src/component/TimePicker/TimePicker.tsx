import "../../assets/style.css";
import { useState, useRef } from "react";
import styles from "./TimePicker.module.css";
import classNames from "classnames";
import { TimePickerProps } from "../../types";
import { useTimeState } from "./hooks/useTimeState";
import { generateHours, generateMinutes } from "./utils/timeUtils";
import { TimeInputs } from "./components/TimeInputs";
import { PeriodSelector } from "./components/PeriodSelector";
import { TimePopover } from "./components/TimePopover";

function TimePicker({
  is24Hour = true,
  value,
  onChange,
  label,
  id,
  disabled,
  required,
  minuteStep = 5,
  hourStep = 1,
  hourPlaceholder = "HH",
  minutePlaceholder = "MM",
  popoverColumnHourTitle = "Hours",
  popoverColumnMinuteTitle = "Minutes",
  classes = {},
}: TimePickerProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { hour, minute, period, updateTime } = useTimeState(value, onChange);

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  const hours = generateHours(is24Hour, hourStep);
  const minutes = generateMinutes(minuteStep);

  const handleHourClick = (h: string) => {
    updateTime({ hour: h });
  };

  const handleMinuteClick = (m: string) => {
    updateTime({ minute: m });
    if (hour !== "") {
      setPopoverOpen(false);
    }
  };

  return (
    <div
      className={classNames(styles.container, classes.container)}
      role="group"
      aria-labelledby={id ? `${id}-label` : undefined}
    >
      {label && (
        <label
          id={id ? `${id}-label` : undefined}
          className={classNames(styles.label, classes.label)}
        >
          {label}
          {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      <div
        className={classNames(styles.timePicker, classes.timePicker, {
          [styles.disabled]: disabled,
        })}
      >
        <TimeInputs
          hour={hour}
          minute={minute}
          hourRef={hourRef}
          minuteRef={minuteRef}
          is24Hour={is24Hour}
          disabled={disabled}
          required={required}
          hourStep={hourStep}
          minuteStep={minuteStep}
          hourPlaceholder={hourPlaceholder}
          minutePlaceholder={minutePlaceholder}
          id={id}
          classes={classes}
          onHourChange={(val) => updateTime({ hour: val })}
          onMinuteChange={(val) => updateTime({ minute: val })}
        />
        {!is24Hour && (
          <PeriodSelector
            period={period}
            disabled={disabled}
            classes={classes}
            onPeriodChange={(val) => updateTime({ period: val })}
          />
        )}
        <TimePopover
          hour={hour}
          minute={minute}
          hours={hours}
          minutes={minutes}
          disabled={disabled}
          popoverOpen={popoverOpen}
          popoverColumnHourTitle={popoverColumnHourTitle}
          popoverColumnMinuteTitle={popoverColumnMinuteTitle}
          classes={classes}
          onPopoverOpenChange={setPopoverOpen}
          onHourClick={handleHourClick}
          onMinuteClick={handleMinuteClick}
        />
      </div>
    </div>
  );
}

export { TimePicker };
export default TimePicker;
