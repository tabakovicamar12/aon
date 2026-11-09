export interface AonEnvironment {
  readonly production: boolean;
  /** Base URL of the AON API (contract v1). */
  readonly apiBaseUrl: string;
  /** When true, an in-browser mock backend answers every API call (no server needed). */
  readonly useMockBackend: boolean;
  /** Request timeout for API calls in ms. */
  readonly requestTimeoutMs: number;
  /** Interval between connectivity heartbeats while online, ms. */
  readonly heartbeatMs: number;
  /** Hotjar tag: Contentsquare tag id (text) or legacy numeric Site ID. null = Hotjar off. */
  readonly hotjarSiteId: number | string | null;
}
