import * as Popover from "@radix-ui/react-popover";
import * as Toolbar from "@radix-ui/react-toolbar";
import { TimerIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import styles from "../TimePicker.module.css";
import ScrollArea from "../../ScrollArea/ScrollArea";

interface TimePopoverProps {
  hour: string;
  minute: string;
  hours: string[];
  minutes: string[];
  disabled?: boolean;
  popoverOpen: boolean;
  popoverColumnHourTitle: string;
  popoverColumnMinuteTitle: string;
  classes?: {
    timeTrigger?: string;
    popoverContent?: string;
    popoverColumns?: string;
    popoverColumn?: string;
    popoverColumnTitle?: string;
    popoverItem?: string;
    popoverActiveItem?: string;
  };
  onPopoverOpenChange: (open: boolean) => void;
  onHourClick: (hour: string) => void;
  onMinuteClick: (minute: string) => void;
}

export const TimePopover = ({
  hour,
  minute,
  hours,
  minutes,
  disabled,
  popoverOpen,
  popoverColumnHourTitle,
  popoverColumnMinuteTitle,
  classes = {},
  onPopoverOpenChange,
  onHourClick,
  onMinuteClick,
}: TimePopoverProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, type: "hour" | "minute") => {
    const items = Array.from(
      document.querySelectorAll(type === "hour" ? "[data-hour]" : "[data-minute]")
    ) as HTMLElement[];

    if (!items.length) return;

    const currentIndex = items.findIndex((item) => document.activeElement === item);

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

  return (
    <Popover.Root open={popoverOpen} onOpenChange={onPopoverOpenChange}>
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
          className={classNames(styles.popoverContent, classes.popoverContent)}
          sideOffset={5}
          data-ignore-outside-click
        >
          <div
            className={classNames(styles.popoverColumns, classes.popoverColumns)}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Hours Column */}
            <Toolbar.Root
              className={classNames(styles.popoverColumn, classes.popoverColumn)}
              aria-label="Select Hour"
              onKeyDown={(e) => handleKeyDown(e, "hour")}
            >
              <div className={classNames(styles.popoverColumnTitle, classes.popoverColumnTitle)}>
                {popoverColumnHourTitle}
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
                        onClick={() => onHourClick(h)}
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
              className={classNames(styles.popoverColumn, classes.popoverColumn)}
              aria-label="Select Minute"
              onKeyDown={(e) => handleKeyDown(e, "minute")}
            >
              <div className={classNames(styles.popoverColumnTitle, classes.popoverColumnTitle)}>
                {popoverColumnMinuteTitle}
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
                        onClick={() => onMinuteClick(m)}
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
  );
};
