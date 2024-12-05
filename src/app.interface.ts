enum EStatus {
  OK = 'OK',
  NOT_OK = 'NOT_OK',
}
type TStatus = keyof typeof EStatus;

export interface IHealthStatus {
  status: TStatus;
}
