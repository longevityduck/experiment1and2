export interface Step {
  id: number;
  content: string;
  timeframe: string;
  isEditing: boolean;
  explanation?: string;
  isOriginal?: boolean;
}