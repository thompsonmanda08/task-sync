import { OptionItem } from '@/types';

export const SERVER_URL = 'http://10.0.2.2:8080/api/v1';

export const EXISTING_USER = 'user-exists';
export const AUTH_SECRET = 'rwbj423oyw5%$vwdvbioybw45orr54wqhqr5HRQTHq=';

export const AUTH_SESSION = '__com.interwebb.dev.tasksync__';
export const USER_SESSION = '__com.interwebb.dev.tasksync_user__';
export const SESSION_TIME_STAMP = 'sessionTimeStamp';

export const PASSWORD_PATTERN =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export const PHONE_NUMBER_PATTERN = /^(?:\+?26|26)?0(96|76|97|77|95|75)\d{7}$/;

export const MTN_NO =
  /^(?:(?:\+?26|0?26)?096|\d{5})(\d{7})|(?:(?:\+?26|0?26)?076|\d{5})(\d{7})$/;

export const AIRTEL_NO =
  /^(?:(?:\+?26|0?26)?097|\d{5})(\d{7})|(?:(?:\+?26|0?26)?077|\d{5})(\d{7})$/;

export const ZAMTEL_NO =
  /^(?:(?:\+?26|0?26)?095|\d{5})(\d{7})|(?:(?:\+?26|0?26)?075|\d{5})(\d{7})$/;

export const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg'];

export const MAX_FILE_SIZE = 5000000; // 5MB

export const QUERY_KEYS = {
  GROUPS: 'groups',
  USER_LISTS: 'todo-lists',
  GROUP_LISTS: 'group-lists',
  PROFILE: 'user-profile',
};

export const DELIVERY_STATUSES: {
  [x: string]: string;
} = {
  READY: 'READY',
  IN_TRANSIT: 'IN TRANSIT',
  DELIVERED: 'DELIVERED',
};
