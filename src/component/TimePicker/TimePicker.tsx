import { useState, useRef, KeyboardEvent } from "react";
import * as Select from "@radix-ui/react-select";
import * as Popover from "@radix-ui/react-popover";
import * as Toolbar from "@radix-ui/react-toolbar";
import { CheckIcon, ChevronDownIcon, TimerIcon } from "@radix-ui/react-icons";
import styles from "./TimePicker.module.css";
import classNames from "classnames";
import { TimePickerProps, TimePickerValue } from "../../types";
import ScrollArea from "../ScrollArea/ScrollArea";

export function TimePicker({
  is24Hour = true,
  value,
  onChange,
  label,
  id,
  disabled,
  required,
  minuteStep = 5,
  hourStep = 1,
  classes = {},
}: TimePickerProps) {
  // Internal state for uncontrolled mode
  const [internalHour, setInternalHour] = useState("");
  const [internalMinute, setInternalMinute] = useState("");
  const [internalPeriod, setInternalPeriod] = useState<"AM" | "PM">("AM");

  // State for popover
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Determine the values (controlled vs. uncontrolled)
  const hour = value?.hour ?? internalHour;
  const minute = value?.minute ?? internalMinute;
  const period = value?.period ?? internalPeriod;

  // Refs for input focus
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  // Helper to update time and notify parent if controlled
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

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (disabled) return;
    // Only allow digits and empty string
    if (val === "" || /^\d+$/.test(val)) {
      if (val.length <= 1) {
        updateTime({ hour: val });
      } else if (val.length === 2) {
        const numVal = parseInt(val, 10);
        const minHour = is24Hour ? 0 : 1;
        const maxHour = is24Hour ? 23 : 12;
        if (numVal >= minHour && numVal <= maxHour) {
          updateTime({ hour: val });
          // Delay auto-advance so state update is applied first.
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
        updateTime({ minute: val });
      }
    }
  };

  // Handle keyboard navigation within the popover
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    type: "hour" | "minute"
  ) => {
    const items = Array.from(
      document.querySelectorAll(
        type === "hour" ? "[data-hour]" : "[data-minute]"
      )
    ) as HTMLElement[];

    if (!items.length) return;

    const currentIndex = items.findIndex(
      (item) => document.activeElement === item
    );

    let nextIndex;
    if (e.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (e.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else {
      return;
    }

    e.preventDefault();
    items[nextIndex].focus();
  };

  const handleHourKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentHour = hour === "" ? (is24Hour ? 0 : 1) : parseInt(hour, 10);
      const minHour = is24Hour ? 0 : 1;
      const maxHour = is24Hour ? 23 : 12;
      let newHour;

      // Apply hourStep when incrementing/decrementing
      if (e.key === "ArrowUp") {
        newHour =
          currentHour >= maxHour - (hourStep - 1)
            ? minHour
            : currentHour + hourStep;
        // Handle overflow
        if (newHour > maxHour) newHour = minHour;
      } else {
        newHour =
          currentHour <= minHour + (hourStep - 1)
            ? maxHour
            : currentHour - hourStep;
        // Handle underflow
        if (newHour < minHour) newHour = maxHour - (maxHour % hourStep);
      }
      updateTime({ hour: newHour.toString().padStart(2, "0") });
    }
  };

  const handleMinuteKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    // If Backspace is pressed and the minute input has one or no characters,
    // it will clear the field. After that, shift focus to the hour input.
    if (e.key === "Backspace" && minute.length <= 1) {
      // Allow the backspace event to process then shift focus.
      setTimeout(() => {
        hourRef.current?.focus();
      }, 0);
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const currentMinute = minute === "" ? 0 : parseInt(minute, 10);
      let newMinute;

      // Apply minuteStep when incrementing/decrementing
      if (e.key === "ArrowUp") {
        newMinute = (currentMinute + minuteStep) % 60;
      } else {
        newMinute = (currentMinute - minuteStep + 60) % 60;
      }
      updateTime({ minute: newMinute.toString().padStart(2, "0") });
    }
  };

  const handleHourBlur = () => {
    if (disabled) return;
    if (!is24Hour && hour === "0") {
      updateTime({ hour: "12" });
    } else if (hour.length === 1) {
      updateTime({ hour: `0${hour}` });
    }
  };

  const handleMinuteBlur = () => {
    if (disabled) return;
    if (minute === "") {
      updateTime({ minute: "00" });
    } else if (minute.length === 1) {
      updateTime({ minute: `0${minute}` });
    } else {
      // Round to nearest step on blur
      const minuteNum = parseInt(minute, 10);
      const roundedMinute = Math.round(minuteNum / minuteStep) * minuteStep;
      const finalMinute = roundedMinute % 60;
      updateTime({ minute: finalMinute.toString().padStart(2, "0") });
    }
  };

  // Generate hours for selection
  const generateHours = () => {
    const minHour = is24Hour ? 0 : 1;
    const maxHour = is24Hour ? 23 : 12;
    const hours = [];

    for (let i = minHour; i <= maxHour; i += hourStep) {
      hours.push(i.toString().padStart(2, "0"));
    }

    return hours;
  };

  // Generate minutes for selection based on minuteStep
  const generateMinutes = () => {
    const minutes = [];
    for (let i = 0; i < 60; i += minuteStep) {
      minutes.push(i.toString().padStart(2, "0"));
    }
    return minutes;
  };

  const hours = generateHours();
  const minutes = generateMinutes();

  const handleHourClick = (h: string) => {
    updateTime({ hour: h });
  };

  const handleMinuteClick = (m: string) => {
    updateTime({ minute: m });
    // Optionally close the popover after both values are selected
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
            placeholder={"HH"}
            className={classNames(styles.timeInput, classes.timeInput)}
            aria-label="Hour"
            id={id ? `${id}-hour` : undefined}
            disabled={disabled}
            required={required}
          />
          <span className={classNames(styles.separator, classes.separator)}>
            :
          </span>
          <input
            ref={minuteRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minute}
            onChange={handleMinuteChange}
            onKeyDown={handleMinuteKeyDown}
            onBlur={handleMinuteBlur}
            placeholder="MM"
            className={classNames(styles.timeInput, classes.timeInput)}
            aria-label="Minute"
            id={id ? `${id}-minute` : undefined}
            disabled={disabled}
            required={required}
          />
        </div>
        {!is24Hour && (
          <>
            <span
              className={classNames(styles.pipe, classes.pipe)}
              aria-hidden="true"
            >
              |
            </span>
            <Select.Root
              value={period}
              onValueChange={(val) =>
                updateTime({ period: val as "AM" | "PM" })
              }
              disabled={disabled}
            >
              <Select.Trigger
                className={classNames(
                  styles.periodSelect,
                  classes.periodSelect
                )}
                aria-label="AM/PM"
                tabIndex={0}
              >
                <Select.Value placeholder="AM/PM" />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  className={classNames(
                    styles.selectContent,
                    classes.selectContent
                  )}
                >
                  <Select.ScrollUpButton
                    className={classNames(
                      styles.selectScrollButton,
                      classes.selectScrollButton
                    )}
                  />
                  <Select.Viewport>
                    <Select.Item
                      value="AM"
                      className={classNames(
                        styles.selectItem,
                        classes.selectItem
                      )}
                    >
                      <Select.ItemIndicator
                        className={classNames(
                          styles.selectIndicator,
                          classes.selectIndicator
                        )}
                      >
                        <CheckIcon />
                      </Select.ItemIndicator>
                      <Select.ItemText>AM</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      value="PM"
                      className={classNames(
                        styles.selectItem,
                        classes.selectItem
                      )}
                    >
                      <Select.ItemIndicator
                        className={classNames(
                          styles.selectIndicator,
                          classes.selectIndicator
                        )}
                      >
                        <CheckIcon />
                      </Select.ItemIndicator>
                      <Select.ItemText>PM</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                  <Select.ScrollDownButton
                    className={classNames(
                      styles.selectScrollButton,
                      classes.selectScrollButton
                    )}
                  />
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </>
        )}
        <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Popover.Trigger
            className={classNames(styles.timerTrigger, classes.timeTrigger)}
            disabled={disabled}
            data-state={popoverOpen ? "open" : "closed"}
            tabIndex={0}
          >
            <TimerIcon />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className={classNames(
                styles.popoverContent,
                classes.popoverContent
              )}
              sideOffset={5}
              data-ignore-outside-click
            >
              <div
                className={classNames(
                  styles.popoverColumns,
                  classes.popoverColumns
                )}
                onKeyDown={(e) => {
                  // Prevent closing on key presses within the popover
                  e.stopPropagation();
                }}
              >
                {/* Hours Column */}
                <Toolbar.Root
                  className={classNames(
                    styles.popoverColumn,
                    classes.popoverColumn
                  )}
                  aria-label="Select Hour"
                  onKeyDown={(e) => handleKeyDown(e, "hour")}
                >
                  <div
                    className={classNames(
                      styles.popoverColumnTitle,
                      classes.popoverColumnTitle
                    )}
                  >
                    Hours
                  </div>
                  <ScrollArea>
                    <div className={styles.popoverColumnContent}>
                      {hours.map((h) => (
                        <Toolbar.Button asChild key={h} value={h}>
                          <button
                            type="button"
                            data-hour
                            className={classNames(
                              styles.popoverItem,
                              hour === h && styles.popoverActiveItem,
                              classes.popoverItem,
                              hour === h && classes.popoverActiveItem
                            )}
                            onClick={() => handleHourClick(h)}
                          >
                            {h}
                          </button>
                        </Toolbar.Button>
                      ))}
                    </div>
                  </ScrollArea>
                </Toolbar.Root>

                {/* Minutes Column */}
                <Toolbar.Root
                  className={classNames(
                    styles.popoverColumn,
                    classes.popoverColumn
                  )}
                  aria-label="Select Minute"
                  onKeyDown={(e) => handleKeyDown(e, "minute")}
                >
                  <div
                    className={classNames(
                      styles.popoverColumnTitle,
                      classes.popoverColumnTitle
                    )}
                  >
                    Minutes
                  </div>
                  <ScrollArea>
                    <div className={styles.popoverColumnContent}>
                      {minutes.map((m) => (
                        <Toolbar.Button asChild key={m} value={m}>
                          <button
                            type="button"
                            data-minute
                            className={classNames(
                              styles.popoverItem,
                              minute === m && styles.popoverActiveItem,
                              classes.popoverItem,
                              minute === m && classes.popoverActiveItem
                            )}
                            onClick={() => handleMinuteClick(m)}
                          >
                            {m}
                          </button>
                        </Toolbar.Button>
                      ))}
                    </div>
                  </ScrollArea>
                </Toolbar.Root>
              </div>

              <Popover.Arrow />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}

export default TimePicker;
