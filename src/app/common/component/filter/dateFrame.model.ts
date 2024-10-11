import { DateTime } from "luxon";

export enum Mode {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export type DateFrame = {
  start: DateTime;
  finish: DateTime;
  display?: string;
  mode?: Mode;
}