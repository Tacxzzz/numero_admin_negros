import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

interface CountdownTimerProps {
  date: string; // Format: "MM/DD/YYYY"
  time: string; // Format: "hh:mm:ss am/pm"
  addMinutes?: number;
  onTimeUp?: () => void;
  shouldRetry?: () => boolean;
}

// Convert date + time string to a PH time DateTime
const getPhilippineTargetDateTime = (
  dateStr: string,
  timeStr: string,
  addMinutes = 0
): number => {
  const [month, day, year] = dateStr.split("/").map(Number);
  const [rawTime, modifier] = timeStr.trim().toLowerCase().split(" ");
  const [hourStr, minuteStr, secondStr] = rawTime.split(":");

  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const second = parseInt(secondStr, 10);

  if (modifier === "pm" && hour !== 12) hour += 12;
  if (modifier === "am" && hour === 12) hour = 0;

  // Create PH time DateTime
  const dt = DateTime.fromObject(
    {
      year,
      month,
      day,
      hour,
      minute,
      second,
    },
    { zone: "Asia/Manila" }
  ).plus({ minutes: addMinutes });

  return dt.toMillis(); // return timestamp in milliseconds
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  date,
  time,
  addMinutes = 0,
  onTimeUp,
  shouldRetry,
}) => {
  const [targetTime, setTargetTime] = useState<number>(
    getPhilippineTargetDateTime(date, time, addMinutes)
  );
  const [remaining, setRemaining] = useState<number>(targetTime - Date.now());

  useEffect(() => {
    const newTarget = getPhilippineTargetDateTime(date, time, addMinutes);
    setTargetTime(newTarget);
    setRemaining(newTarget - Date.now());
  }, [date, time, addMinutes]);

  useEffect(() => {
    let target = targetTime;
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      setRemaining(diff);

      if (diff <= 0) {
        clearInterval(interval);

        if (shouldRetry && shouldRetry()) {
          const retryTarget = Date.now() + 60 * 1000;
          setTargetTime(retryTarget);
          setRemaining(retryTarget - Date.now());
        } else {
          onTimeUp?.();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, shouldRetry, onTimeUp]);

  const minutes = Math.max(0, Math.floor(remaining / 60000));
  const seconds = Math.max(0, Math.floor((remaining % 60000) / 1000));

  return (
    <span>
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
};

export default CountdownTimer;
