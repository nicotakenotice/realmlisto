export enum TOAST_TYPE {
  SUCCESS = 'success',
  WARNING = 'warning'
}

export class Toast {
  id: number = Math.floor(Math.random() * 10000);
  type: TOAST_TYPE = TOAST_TYPE.SUCCESS;
  icon: string = '';
  text: string = '';
  timeout: number = 5000;
}
