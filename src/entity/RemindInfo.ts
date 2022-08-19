export interface IRemindInfo {
  id?: number;
  toUser: string;
  method: string;
  type: string;
  day: number;
  hour: number;
  minutes: number;
  [idx: string]: any;
}
