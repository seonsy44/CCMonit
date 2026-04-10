export interface ReportWriterPort {
  write(report: unknown): Promise<void>;
}
