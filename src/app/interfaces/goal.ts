export interface Goal {
  id?: number | null;
  createdTime?: Date | null;
  lastUpdated?: Date | null;
  isActivated?:boolean|null;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  isQuitting?: boolean;
  goalValue?: number | null;
}
