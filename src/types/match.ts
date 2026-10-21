
export interface Team {
    id: string;
    name: string;
    city: string;
}

export interface MatchScore {
    home: number;
    away: number;
}

export interface Match {
    id: string;
    startsAt: string | null;
    status: string;
    home: Team;
    away: Team;
    score: MatchScore | null;
    minute?: number;
}

export interface MatchesResponse {
    round: number;
    matches: Match[];
}
