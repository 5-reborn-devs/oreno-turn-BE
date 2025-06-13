export class SessionUser {
  constructor(
    public readonly sessionId: string,
    public readonly id: number,
    public readonly email: string,
    public readonly nickname: string,
  ) {}
}
