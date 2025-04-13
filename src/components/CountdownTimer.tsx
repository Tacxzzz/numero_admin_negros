import React, { useEffect, useState } from "react";

const parseDateTime = (dateStr, timeStr) => {
  const [month, day, year] = dateStr.split("/").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
};

const CountdownTimer = ({ date, time, addMinutes, onTimeUp, shouldRetry }) => {
  const initialTarget = parseDateTime(date, time).getTime() + addMinutes * 60000;
  const [targetTime, setTargetTime] = useState(initialTarget);
  const [remaining, setRemaining] = useState(targetTime - Date.now());

  useEffect(() => {
    let target = targetTime;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;
      setRemaining(diff);

      if (diff <= 0) {
        clearInterval(interval);

        if (shouldRetry && shouldRetry()) {
          target = Date.now() + 60 * 1000;
          setTargetTime(target);
          setRemaining(target - Date.now());
        } else {
          onTimeUp?.();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, shouldRetry, onTimeUp]);

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return (
    <span>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
};

export default CountdownTimer;
