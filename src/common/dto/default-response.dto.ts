export class DefaultResponseDto<T = any> {
  success: boolean;
  message: string;
  data: T;
  status?: number;
}
