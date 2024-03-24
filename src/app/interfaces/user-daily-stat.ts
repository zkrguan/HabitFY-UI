export interface UserDailyStat {
    userId?: string | null;
    data: {
        planedToFinishGoalCount?: number | null;
        actualFinishedGoalCount?: number | null;
        reachedGoalStreak?: number | null;
        beatingCompetitorPercentage?: number | null;
        totalUserCountInPostalCode?: number | null;
        samePerformanceUsersCount?: number | null;
    },
    postalCode?: string | null;
}
