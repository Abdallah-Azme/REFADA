export interface Page {
  pageType: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean | null;
}

export interface PagesResponse {
  success: boolean;
  message: string;
  data: Page[];
}
