export interface ConsoleMessage {
  id: string;
  timestamp: Date;
  message: string;
  type: 'system' | 'success' | 'error' | 'warning' | 'info';
  action?: string;
}