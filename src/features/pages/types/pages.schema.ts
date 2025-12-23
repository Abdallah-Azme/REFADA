import { LocalizedText } from "./page.schema";

export interface Page {
  pageType: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string | null;
  file: string | null;
  isActive: boolean | null;
}

export interface PagesResponse {
  success: boolean;
  message: string;
  data: Page[];
}
