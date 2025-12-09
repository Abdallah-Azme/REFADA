export interface Stats {
  projectsCount: number;
  familiesCount: number;
  contributorsCount: number;
  CampsCount: number;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: Stats;
}
