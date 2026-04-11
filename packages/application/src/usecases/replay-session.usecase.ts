/** V1 기능 — MVP에서는 구현하지 않음. 이벤트 재생 기반 세션 복기. */
export class ReplaySessionUsecase {
  async execute(input?: unknown): Promise<unknown> {
    void input;
    throw new Error('Not implemented — scheduled for V1');
  }
}
