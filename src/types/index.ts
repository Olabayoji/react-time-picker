
 type TimePickerClasses = Partial<{
  container: string;
  label: string;
  timePicker: string;
  timeInputs: string;
  timeInput: string;
  separator: string;
  pipe: string;
  periodSelect: string;
  selectContent: string;
  selectItem: string;
  selectIndicator: string;
  selectScrollButton: string;
  popoverContent: string;
  popoverColumns: string;
  popoverColumn: string;
  popoverColumnTitle: string;
  popoverItem: string;
  popoverActiveItem: string;
  timeTrigger: string;
}>;
export type TimePickerValue = {
  hour: string;
  minute: string;
  period?: "AM" | "PM";
};

 type TimePickerProps = {
  is24Hour?: boolean;
  value?: TimePickerValue;
  minuteStep?: number;
  minutePlaceholder?: string;
  hourStep?: number;
  hourPlaceholder?: string;
  onChange?: (value: TimePickerValue) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  classes?: TimePickerClasses;
  popoverColumnHourTitle?: string;
  popoverColumnMinuteTitle?: string;
};

export type { TimePickerClasses, TimePickerProps };