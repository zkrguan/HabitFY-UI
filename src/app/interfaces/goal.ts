export interface Goal {
  id?: number | null;
  createdTime?: Date | null;
  lastUpdated?: Date | null;
  isActivated?: boolean | null;
  description?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  isQuitting?: boolean;
  goalValue?: number | null;
  unit?: string | null;
}
