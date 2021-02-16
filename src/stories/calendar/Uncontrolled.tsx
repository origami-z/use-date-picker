import React from "react";
import { Calendar } from "../../calendar";

export const Uncontrolled = (args: any) => {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  return (
    <>
      <h4>{selectedDate.toISOString()}</h4>

      <Calendar
        {...args}
        selectedDate={selectedDate}
        onChange={(_, date) => setSelectedDate(date)}
      />
    </>
  );
};
