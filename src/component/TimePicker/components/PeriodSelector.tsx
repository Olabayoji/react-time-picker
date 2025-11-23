import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import classNames from "classnames";
import styles from "../TimePicker.module.css";

interface PeriodSelectorProps {
  period: "AM" | "PM";
  disabled?: boolean;
  classes?: {
    pipe?: string;
    periodSelect?: string;
    selectContent?: string;
    selectScrollButton?: string;
    selectItem?: string;
    selectIndicator?: string;
  };
  onPeriodChange: (period: "AM" | "PM") => void;
}

export const PeriodSelector = ({
  period,
  disabled,
  classes = {},
  onPeriodChange,
}: PeriodSelectorProps) => {
  return (
    <>
      <span className={classNames(styles.pipe, classes.pipe)} aria-hidden="true">
        |
      </span>
      <Select.Root
        value={period}
        onValueChange={(val) => onPeriodChange(val as "AM" | "PM")}
        disabled={disabled}
      >
        <Select.Trigger
          className={classNames(styles.periodSelect, classes.periodSelect)}
          aria-label="AM/PM"
          tabIndex={0}
        >
          <Select.Value placeholder="AM/PM" />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className={classNames(styles.selectContent, classes.selectContent)}>
            <Select.ScrollUpButton
              className={classNames(styles.selectScrollButton, classes.selectScrollButton)}
            />
            <Select.Viewport>
              <Select.Item value="AM" className={classNames(styles.selectItem, classes.selectItem)}>
                <Select.ItemIndicator
                  className={classNames(styles.selectIndicator, classes.selectIndicator)}
                >
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>AM</Select.ItemText>
              </Select.Item>
              <Select.Item value="PM" className={classNames(styles.selectItem, classes.selectItem)}>
                <Select.ItemIndicator
                  className={classNames(styles.selectIndicator, classes.selectIndicator)}
                >
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>PM</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
            <Select.ScrollDownButton
              className={classNames(styles.selectScrollButton, classes.selectScrollButton)}
            />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  );
};
