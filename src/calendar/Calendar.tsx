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
  getDay,
} from "date-fns";
import cn from "classnames";

import classes from "./Calendar.module.css";

export const Cell = ({
  date,
  className,
  isSelected,
  isHighlighted,
  notCurrentMonth,
  onClick: onClickProp,
  ...restProps
}: {
  date: Date;
  isSelected?: boolean;
  isHighlighted?: boolean;
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
          [classes.CellHighlighted]: isHighlighted,
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
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  onKeyDown: onKeyDownProp,
  ...restProps
}: CalendarProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState<
    [number, number] | null
  >(null);

  const midDayOfSelectedDate = addHours(startOfDay(selectedDate), 12);

  React.useEffect(() => {
    if (isFocused) {
      if (highlightedIndex === null) {
        const date = getDate(midDayOfSelectedDate);
        setHighlightedIndex([Math.floor(date / 7), date % 7]);
      }
    } else {
      setHighlightedIndex(null);
    }
  }, [isFocused]);

  const firstDateToDisplay = startOfWeek(startOfMonth(midDayOfSelectedDate));

  const weeksArray = Array(getWeeksInMonth(selectedDate));

  const handleCellClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    date: Date
  ) => {
    onChangeProp?.(event, date);
  };

  const renderWeekRow = (weekIndex: number) => {
    return WEEK_DAYS.map((dayIndex) => {
      const dateIndex = weekIndex * 7 + dayIndex;
      const dateToRender = addDays(firstDateToDisplay, dateIndex);
      const isCurrentMonth =
        getMonth(dateToRender) === getMonth(midDayOfSelectedDate);
      return (
        <Cell
          key={`cell-week-${weekIndex}-day-${dayIndex}`}
          date={dateToRender}
          isSelected={
            isCurrentMonth &&
            getDate(dateToRender) === getDate(midDayOfSelectedDate)
          }
          notCurrentMonth={!isCurrentMonth}
          isHighlighted={
            highlightedIndex
              ? weekIndex === highlightedIndex[0] &&
                dayIndex === highlightedIndex[1]
              : undefined
          }
          onClick={handleCellClick}
        />
      );
    });
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(true);
    onFocusProp?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(false);
    onBlurProp?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (highlightedIndex) {
      if (event.key === "ArrowLeft") {
        let leftColumnIndex = highlightedIndex[1] - 1;
        setHighlightedIndex([
          highlightedIndex[0],
          leftColumnIndex < 0 ? 6 : leftColumnIndex,
        ]);
      } else if (event.key === "ArrowRight") {
        let rightColumnIndex = highlightedIndex[1] + 1;
        setHighlightedIndex([
          highlightedIndex[0],
          rightColumnIndex > 6 ? 0 : rightColumnIndex,
        ]);
      } else if (event.key === "ArrowUp") {
        let upRowIndex = highlightedIndex[0] - 1;
        setHighlightedIndex([
          upRowIndex < 0 ? weeksArray.length - 1 : upRowIndex,
          highlightedIndex[1],
        ]);
      } else if (event.key === "ArrowDown") {
        let bottomRowIndex = highlightedIndex[0] + 1;
        setHighlightedIndex([
          bottomRowIndex > weeksArray.length - 1 ? 0 : bottomRowIndex,
          highlightedIndex[1],
        ]);
      }
    }
    onKeyDownProp?.(event);
  };

  return (
    <div
      className={classes.Calendar}
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      {...restProps}
    >
      <div className={classes.Header}>
        Month {getMonth(midDayOfSelectedDate)} Year{" "}
        {getYear(midDayOfSelectedDate)}
      </div>
      {Array.from(weeksArray.keys()).map((week, i) => (
        <div key={`week-row-${i}`}>
          {/* <label>Week {week}</label> */}
          {renderWeekRow(i)}
        </div>
      ))}
    </div>
  );
};
