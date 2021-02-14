import React from "react";
import {
  getDaysInMonth,
  getWeeksInMonth,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  getDate,
} from "date-fns";
import cn from "classnames";

import classes from "./Calendar.module.css";

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedDate?: Date;
}

export const Cell = ({
  date,
  className,
  onClick: onClickProp,
  ...restProps
}: { date: Date } & React.HTMLAttributes<HTMLDivElement>) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log("Cell clicked", date);
    onClickProp?.(event);
  };
  return (
    <div
      className={cn(classes.Cell, className)}
      onClick={handleClick}
      {...restProps}
    >
      {getDate(date)}
    </div>
  );
};

const WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6];

export const Calendar = ({
  selectedDate = new Date(),
  ...restProps
}: CalendarProps) => {
  const firstDateToDisplay = startOfWeek(startOfMonth(selectedDate));

  const renderWeekRow = (weekIndex: number) => {
    return WEEK_DAYS.map((day) => {
      const dateToRender = addDays(firstDateToDisplay, weekIndex * 7 + day);
      return (
        <Cell key={`cell-week-${weekIndex}-day-${day}`} date={dateToRender} />
      );
    });
  };

  return (
    <div {...restProps}>
      <h4>{selectedDate.toString()}</h4>
      <div>header</div>
      {Array.from(Array(getWeeksInMonth(selectedDate)).keys()).map(
        (week, i) => (
          <div key={`week-row-${i}`}>
            <label>Week {week}</label>
            {renderWeekRow(i)}
          </div>
        )
      )}
      {/* <div>
        {Array.from(Array(getDaysInMonth(currentDate)).keys()).map(
          (item, i) => (
            <Cell  key={`day-cell-${i}`} date={} />
          )
        )}
      </div> */}
    </div>
  );
};
