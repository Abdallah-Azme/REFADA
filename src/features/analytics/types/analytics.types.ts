export interface AnalyticsStats {
  totalCamps: number;
  totalProjects: number;
  totalContributors: number;
  totalFamilies: number;
  totalBudget: string;
  activeRepresentatives: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}
