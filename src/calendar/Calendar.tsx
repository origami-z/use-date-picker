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
  isEqual,
  startOfDay,
  addHours,
  getMonth,
  getYear,
} from "date-fns";
import cn from "classnames";

import classes from "./Calendar.module.css";

export const Cell = ({
  date,
  className,
  isSelected,
  notCurrentMonth,
  onClick: onClickProp,
  ...restProps
}: {
  date: Date;
  isSelected?: boolean;
  notCurrentMonth?: boolean;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    date: Date
  ) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onClick">) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log("Cell clicked", date);
    onClickProp?.(event, date);
  };
  return (
    <div
      className={cn(
        classes.Cell,
        {
          [classes.CellSelected]: isSelected,
          [classes.CellNotCurrentMonth]: notCurrentMonth,
        },
        className
      )}
      onClick={handleClick}
      {...restProps}
    >
      {getDate(date)}
    </div>
  );
};

const WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6];

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  selectedDate?: Date;
  onChange?: (event: React.SyntheticEvent, date: Date) => void;
}

export const Calendar = ({
  selectedDate = new Date(),
  onChange: onChangeProp,
  ...restProps
}: CalendarProps) => {
  const midDayOfSelectedDate = addHours(startOfDay(selectedDate), 12);

  const firstDateToDisplay = startOfWeek(startOfMonth(midDayOfSelectedDate));

  const handleCellClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    date: Date
  ) => {
    onChangeProp?.(event, date);
  };

  const renderWeekRow = (weekIndex: number) => {
    return WEEK_DAYS.map((day) => {
      const dateToRender = addDays(firstDateToDisplay, weekIndex * 7 + day);
      const isCurrentMonth =
        getMonth(dateToRender) === getMonth(midDayOfSelectedDate);
      return (
        <Cell
          key={`cell-week-${weekIndex}-day-${day}`}
          date={dateToRender}
          isSelected={
            isCurrentMonth &&
            getDate(dateToRender) === getDate(midDayOfSelectedDate)
          }
          notCurrentMonth={!isCurrentMonth}
          onClick={handleCellClick}
        />
      );
    });
  };

  return (
    <div {...restProps}>
      <div>
        Month {getMonth(midDayOfSelectedDate)} Year{" "}
        {getYear(midDayOfSelectedDate)}
      </div>
      {Array.from(Array(getWeeksInMonth(selectedDate)).keys()).map(
        (week, i) => (
          <div key={`week-row-${i}`}>
            <label>Week {week}</label>
            {renderWeekRow(i)}
          </div>
        )
      )}
    </div>
  );
};
