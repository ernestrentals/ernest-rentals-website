export const DIGITAL_SCREEN_START_TIME =
  "6:00 AM";

export const DIGITAL_SCREEN_END_TIME =
  "1:00 AM";

export const DIGITAL_OPERATING_HOURS_PER_DAY =
  19;

export const DIGITAL_ROTATION_SECONDS =
  185;

export const ESTIMATED_PLAYS_PER_HOUR =
  Math.round(
    (3600 /
      DIGITAL_ROTATION_SECONDS) *
      10
  ) / 10;

export const ESTIMATED_PLAYS_PER_DAY =
  Math.round(
    (DIGITAL_OPERATING_HOURS_PER_DAY *
      3600) /
      DIGITAL_ROTATION_SECONDS
  );

export const ESTIMATED_PLAYS_PER_WEEK =
  ESTIMATED_PLAYS_PER_DAY *
  7;

export const DIGITAL_ROTATION_LABEL =
  "3 minutes 5 seconds";
