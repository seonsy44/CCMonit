export type TaskStatus =
  | 'queued'
  | 'running'
  | 'waiting'
  | 'blocked'
  | 'retrying'
  | 'completed'
  | 'failed'
  | 'cancelled';
