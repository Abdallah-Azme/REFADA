// Types for activities API response

export interface Activity {
  id: number;
  description: string;
  subject_type: string;
  subject_id: number;
  causer_id: number;
  properties: {
    old?: Record<string, any>;
    attributes?: Record<string, any>;
  };
  created_at: string;
}

export interface ActivitiesResponse {
  success: boolean;
  message: string;
  data: Activity[];
}
