type UserStatus = {
    name: string;
    rank: number;
    total_projects: number;
    completed_projects: number;
    practice_counts: number[];
    total_score: number;
    speed_score: number;
    pose_score: number;
    qna_score: number;
};


export type ProjectInfo = {
    id: string;
    name: string;
    description: string;
    due_date: string;
    goal_time: number;
    practice_count: number;
    total_score: number;
    speed_score: number;
    pose_score: number;
    qna_score: number;
    pronunciation_score: number;
    created_at: string;
    last_practiced_at: string;
};

export type PracticeInfo = {
    id: string;
    project_id: string;
    practice_count_id: number;
    practice_time: number;
    score: number;
    speed_score: number;
    pose_score: number;
    qna_score: number;
    pronunciation_score: number;
    created_at: string;
};

export type QnAInfo = {
    id: string;
    project_id: string;
    qna_count_id: number;
    qna_time: number;
    score: number;
    perfect_answer_count: number;
    good_answer_count: number;
    bad_answer_count: number;
    created_at: string;
};