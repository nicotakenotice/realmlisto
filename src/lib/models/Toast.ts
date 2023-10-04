export enum TOAST_TYPE {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning'
}

export class Toast {
  id: number = Math.floor(Math.random() * 10000);
  type: TOAST_TYPE = TOAST_TYPE.INFO;
  icon: string = '';
  text: string = '';
  duration: number = 4000;
}
