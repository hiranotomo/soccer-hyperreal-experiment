/**
 * Hyper Real Type Definitions
 *
 * Core types for the Time × Space × Action model
 */
import { z } from 'zod';
/**
 * Absolute time (UTC) - synchronizes all events to world clock
 */
export declare const AbsoluteTimeSchema: z.ZodString;
export type AbsoluteTime = z.infer<typeof AbsoluteTimeSchema>;
/**
 * Relative time - frame number since match start
 */
export declare const RelativeTimeSchema: z.ZodNumber;
export type RelativeTime = z.infer<typeof RelativeTimeSchema>;
/**
 * Match time - human-readable match clock
 */
export declare const MatchTimeSchema: z.ZodString;
export type MatchTime = z.infer<typeof MatchTimeSchema>;
/**
 * Physical space - actual field coordinates
 * Standard soccer field: 105m × 68m
 */
export declare const PhysicalSpaceSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    z: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    z?: number | undefined;
}, {
    x: number;
    y: number;
    z?: number | undefined;
}>;
export type PhysicalSpace = z.infer<typeof PhysicalSpaceSchema>;
/**
 * Logical space - Git repository location
 */
export declare const LogicalSpaceSchema: z.ZodString;
export type LogicalSpace = z.infer<typeof LogicalSpaceSchema>;
/**
 * Complete space definition
 */
export declare const SpaceSchema: z.ZodObject<{
    physical: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z?: number | undefined;
    }, {
        x: number;
        y: number;
        z?: number | undefined;
    }>;
    logical: z.ZodString;
}, "strip", z.ZodTypeAny, {
    physical: {
        x: number;
        y: number;
        z?: number | undefined;
    };
    logical: string;
}, {
    physical: {
        x: number;
        y: number;
        z?: number | undefined;
    };
    logical: string;
}>;
export type Space = z.infer<typeof SpaceSchema>;
/**
 * Action types in a soccer match
 */
export declare const ActionTypeSchema: z.ZodEnum<["pass", "shot", "tackle", "interception", "clearance", "dribble", "cross", "header", "save", "goal", "foul", "card", "whistle", "substitution", "tactical_instruction", "commentary"]>;
export type ActionType = z.infer<typeof ActionTypeSchema>;
/**
 * Agent identifier
 * Format: {type}-{id}-{team}
 * Examples: player-01-team-a, coach-team-b, referee-main
 */
export declare const AgentIdSchema: z.ZodString;
export type AgentId = z.infer<typeof AgentIdSchema>;
/**
 * Action result
 */
export declare const ActionResultSchema: z.ZodEnum<["success", "failure", "partial", "pending"]>;
export type ActionResult = z.infer<typeof ActionResultSchema>;
/**
 * Action definition
 */
export declare const ActionSchema: z.ZodObject<{
    type: z.ZodEnum<["pass", "shot", "tackle", "interception", "clearance", "dribble", "cross", "header", "save", "goal", "foul", "card", "whistle", "substitution", "tactical_instruction", "commentary"]>;
    agent: z.ZodString;
    target: z.ZodOptional<z.ZodString>;
    result: z.ZodEnum<["success", "failure", "partial", "pending"]>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
    agent: string;
    result: "success" | "failure" | "partial" | "pending";
    target?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
    agent: string;
    result: "success" | "failure" | "partial" | "pending";
    target?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}>;
export type Action = z.infer<typeof ActionSchema>;
/**
 * Decision type - how this action was decided
 */
export declare const DecisionTypeSchema: z.ZodEnum<["command", "consensus", "autonomous", "suggestion", "ruling", "request", "approval", "rejection"]>;
export type DecisionType = z.infer<typeof DecisionTypeSchema>;
/**
 * Communication channel - how the decision was communicated
 */
export declare const CommunicationChannelSchema: z.ZodEnum<["direct", "broadcast", "discussion", "pr-review", "issue-comment", "tactical-board", "field-shout", "internal"]>;
export type CommunicationChannel = z.infer<typeof CommunicationChannelSchema>;
/**
 * Decision metadata - who decided what, how, and why
 */
export declare const DecisionMetadataSchema: z.ZodObject<{
    type: z.ZodEnum<["command", "consensus", "autonomous", "suggestion", "ruling", "request", "approval", "rejection"]>;
    from: z.ZodString;
    to: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    channel: z.ZodEnum<["direct", "broadcast", "discussion", "pr-review", "issue-comment", "tactical-board", "field-shout", "internal"]>;
    github: z.ZodOptional<z.ZodObject<{
        issueNumber: z.ZodOptional<z.ZodNumber>;
        prNumber: z.ZodOptional<z.ZodNumber>;
        discussionNumber: z.ZodOptional<z.ZodNumber>;
        commentId: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        issueNumber?: number | undefined;
        prNumber?: number | undefined;
        discussionNumber?: number | undefined;
        commentId?: number | undefined;
    }, {
        issueNumber?: number | undefined;
        prNumber?: number | undefined;
        discussionNumber?: number | undefined;
        commentId?: number | undefined;
    }>>;
    reasoning: z.ZodOptional<z.ZodString>;
    basedOn: z.ZodOptional<z.ZodArray<z.ZodObject<{
        eventFrame: z.ZodOptional<z.ZodNumber>;
        issueNumber: z.ZodOptional<z.ZodNumber>;
        source: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        source: string;
        issueNumber?: number | undefined;
        eventFrame?: number | undefined;
    }, {
        source: string;
        issueNumber?: number | undefined;
        eventFrame?: number | undefined;
    }>, "many">>;
    approvedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    rejectedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    priority: z.ZodOptional<z.ZodEnum<["low", "normal", "high", "critical"]>>;
    validUntil: z.ZodOptional<z.ZodObject<{
        frame: z.ZodOptional<z.ZodNumber>;
        matchTime: z.ZodOptional<z.ZodString>;
        condition: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        frame?: number | undefined;
        matchTime?: string | undefined;
        condition?: string | undefined;
    }, {
        frame?: number | undefined;
        matchTime?: string | undefined;
        condition?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
    from: string;
    channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
    to?: string[] | undefined;
    github?: {
        issueNumber?: number | undefined;
        prNumber?: number | undefined;
        discussionNumber?: number | undefined;
        commentId?: number | undefined;
    } | undefined;
    reasoning?: string | undefined;
    basedOn?: {
        source: string;
        issueNumber?: number | undefined;
        eventFrame?: number | undefined;
    }[] | undefined;
    approvedBy?: string[] | undefined;
    rejectedBy?: string[] | undefined;
    priority?: "low" | "normal" | "high" | "critical" | undefined;
    validUntil?: {
        frame?: number | undefined;
        matchTime?: string | undefined;
        condition?: string | undefined;
    } | undefined;
}, {
    type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
    from: string;
    channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
    to?: string[] | undefined;
    github?: {
        issueNumber?: number | undefined;
        prNumber?: number | undefined;
        discussionNumber?: number | undefined;
        commentId?: number | undefined;
    } | undefined;
    reasoning?: string | undefined;
    basedOn?: {
        source: string;
        issueNumber?: number | undefined;
        eventFrame?: number | undefined;
    }[] | undefined;
    approvedBy?: string[] | undefined;
    rejectedBy?: string[] | undefined;
    priority?: "low" | "normal" | "high" | "critical" | undefined;
    validUntil?: {
        frame?: number | undefined;
        matchTime?: string | undefined;
        condition?: string | undefined;
    } | undefined;
}>;
export type DecisionMetadata = z.infer<typeof DecisionMetadataSchema>;
/**
 * Git metadata for tracking changes
 */
export declare const GitMetadataSchema: z.ZodObject<{
    commit: z.ZodOptional<z.ZodString>;
    branch: z.ZodDefault<z.ZodString>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branch: string;
    message?: string | undefined;
    commit?: string | undefined;
}, {
    message?: string | undefined;
    commit?: string | undefined;
    branch?: string | undefined;
}>;
export type GitMetadata = z.infer<typeof GitMetadataSchema>;
/**
 * The complete Hyper Real event
 * Every occurrence in reality is captured as Time × Space × Action × Decision
 */
export declare const HyperRealEventSchema: z.ZodObject<{
    timestamp: z.ZodString;
    frame: z.ZodNumber;
    matchTime: z.ZodOptional<z.ZodString>;
    space: z.ZodObject<{
        physical: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z?: number | undefined;
        }, {
            x: number;
            y: number;
            z?: number | undefined;
        }>;
        logical: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        physical: {
            x: number;
            y: number;
            z?: number | undefined;
        };
        logical: string;
    }, {
        physical: {
            x: number;
            y: number;
            z?: number | undefined;
        };
        logical: string;
    }>;
    action: z.ZodObject<{
        type: z.ZodEnum<["pass", "shot", "tackle", "interception", "clearance", "dribble", "cross", "header", "save", "goal", "foul", "card", "whistle", "substitution", "tactical_instruction", "commentary"]>;
        agent: z.ZodString;
        target: z.ZodOptional<z.ZodString>;
        result: z.ZodEnum<["success", "failure", "partial", "pending"]>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
        agent: string;
        result: "success" | "failure" | "partial" | "pending";
        target?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    }, {
        type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
        agent: string;
        result: "success" | "failure" | "partial" | "pending";
        target?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    }>;
    decision: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["command", "consensus", "autonomous", "suggestion", "ruling", "request", "approval", "rejection"]>;
        from: z.ZodString;
        to: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        channel: z.ZodEnum<["direct", "broadcast", "discussion", "pr-review", "issue-comment", "tactical-board", "field-shout", "internal"]>;
        github: z.ZodOptional<z.ZodObject<{
            issueNumber: z.ZodOptional<z.ZodNumber>;
            prNumber: z.ZodOptional<z.ZodNumber>;
            discussionNumber: z.ZodOptional<z.ZodNumber>;
            commentId: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            issueNumber?: number | undefined;
            prNumber?: number | undefined;
            discussionNumber?: number | undefined;
            commentId?: number | undefined;
        }, {
            issueNumber?: number | undefined;
            prNumber?: number | undefined;
            discussionNumber?: number | undefined;
            commentId?: number | undefined;
        }>>;
        reasoning: z.ZodOptional<z.ZodString>;
        basedOn: z.ZodOptional<z.ZodArray<z.ZodObject<{
            eventFrame: z.ZodOptional<z.ZodNumber>;
            issueNumber: z.ZodOptional<z.ZodNumber>;
            source: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            source: string;
            issueNumber?: number | undefined;
            eventFrame?: number | undefined;
        }, {
            source: string;
            issueNumber?: number | undefined;
            eventFrame?: number | undefined;
        }>, "many">>;
        approvedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        rejectedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        priority: z.ZodOptional<z.ZodEnum<["low", "normal", "high", "critical"]>>;
        validUntil: z.ZodOptional<z.ZodObject<{
            frame: z.ZodOptional<z.ZodNumber>;
            matchTime: z.ZodOptional<z.ZodString>;
            condition: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            frame?: number | undefined;
            matchTime?: string | undefined;
            condition?: string | undefined;
        }, {
            frame?: number | undefined;
            matchTime?: string | undefined;
            condition?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
        from: string;
        channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
        to?: string[] | undefined;
        github?: {
            issueNumber?: number | undefined;
            prNumber?: number | undefined;
            discussionNumber?: number | undefined;
            commentId?: number | undefined;
        } | undefined;
        reasoning?: string | undefined;
        basedOn?: {
            source: string;
            issueNumber?: number | undefined;
            eventFrame?: number | undefined;
        }[] | undefined;
        approvedBy?: string[] | undefined;
        rejectedBy?: string[] | undefined;
        priority?: "low" | "normal" | "high" | "critical" | undefined;
        validUntil?: {
            frame?: number | undefined;
            matchTime?: string | undefined;
            condition?: string | undefined;
        } | undefined;
    }, {
        type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
        from: string;
        channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
        to?: string[] | undefined;
        github?: {
            issueNumber?: number | undefined;
            prNumber?: number | undefined;
            discussionNumber?: number | undefined;
            commentId?: number | undefined;
        } | undefined;
        reasoning?: string | undefined;
        basedOn?: {
            source: string;
            issueNumber?: number | undefined;
            eventFrame?: number | undefined;
        }[] | undefined;
        approvedBy?: string[] | undefined;
        rejectedBy?: string[] | undefined;
        priority?: "low" | "normal" | "high" | "critical" | undefined;
        validUntil?: {
            frame?: number | undefined;
            matchTime?: string | undefined;
            condition?: string | undefined;
        } | undefined;
    }>>;
    git: z.ZodOptional<z.ZodObject<{
        commit: z.ZodOptional<z.ZodString>;
        branch: z.ZodDefault<z.ZodString>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        branch: string;
        message?: string | undefined;
        commit?: string | undefined;
    }, {
        message?: string | undefined;
        commit?: string | undefined;
        branch?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    frame: number;
    timestamp: string;
    space: {
        physical: {
            x: number;
            y: number;
            z?: number | undefined;
        };
        logical: string;
    };
    action: {
        type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
        agent: string;
        result: "success" | "failure" | "partial" | "pending";
        target?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    };
    matchTime?: string | undefined;
    decision?: {
        type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
        from: string;
        channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
        to?: string[] | undefined;
        github?: {
            issueNumber?: number | undefined;
            prNumber?: number | undefined;
            discussionNumber?: number | undefined;
            commentId?: number | undefined;
        } | undefined;
        reasoning?: string | undefined;
        basedOn?: {
            source: string;
            issueNumber?: number | undefined;
            eventFrame?: number | undefined;
        }[] | undefined;
        approvedBy?: string[] | undefined;
        rejectedBy?: string[] | undefined;
        priority?: "low" | "normal" | "high" | "critical" | undefined;
        validUntil?: {
            frame?: number | undefined;
            matchTime?: string | undefined;
            condition?: string | undefined;
        } | undefined;
    } | undefined;
    git?: {
        branch: string;
        message?: string | undefined;
        commit?: string | undefined;
    } | undefined;
}, {
    frame: number;
    timestamp: string;
    space: {
        physical: {
            x: number;
            y: number;
            z?: number | undefined;
        };
        logical: string;
    };
    action: {
        type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
        agent: string;
        result: "success" | "failure" | "partial" | "pending";
        target?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    };
    matchTime?: string | undefined;
    decision?: {
        type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
        from: string;
        channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
        to?: string[] | undefined;
        github?: {
            issueNumber?: number | undefined;
            prNumber?: number | undefined;
            discussionNumber?: number | undefined;
            commentId?: number | undefined;
        } | undefined;
        reasoning?: string | undefined;
        basedOn?: {
            source: string;
            issueNumber?: number | undefined;
            eventFrame?: number | undefined;
        }[] | undefined;
        approvedBy?: string[] | undefined;
        rejectedBy?: string[] | undefined;
        priority?: "low" | "normal" | "high" | "critical" | undefined;
        validUntil?: {
            frame?: number | undefined;
            matchTime?: string | undefined;
            condition?: string | undefined;
        } | undefined;
    } | undefined;
    git?: {
        message?: string | undefined;
        commit?: string | undefined;
        branch?: string | undefined;
    } | undefined;
}>;
export type HyperRealEvent = z.infer<typeof HyperRealEventSchema>;
/**
 * Complete match state at any point in time
 */
export declare const MatchStateSchema: z.ZodObject<{
    timestamp: z.ZodString;
    frame: z.ZodNumber;
    matchTime: z.ZodString;
    ball: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        z: z.ZodOptional<z.ZodNumber>;
    } & {
        velocity: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        z?: number | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
    }, {
        x: number;
        y: number;
        z?: number | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
    }>;
    players: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z?: number | undefined;
        }, {
            x: number;
            y: number;
            z?: number | undefined;
        }>;
        velocity: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
        }, {
            x: number;
            y: number;
        }>>;
        stamina: z.ZodNumber;
        state: z.ZodEnum<["idle", "running", "tackling", "shooting", "passing"]>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        position: {
            x: number;
            y: number;
            z?: number | undefined;
        };
        stamina: number;
        state: "idle" | "running" | "tackling" | "shooting" | "passing";
        velocity?: {
            x: number;
            y: number;
        } | undefined;
    }, {
        id: string;
        position: {
            x: number;
            y: number;
            z?: number | undefined;
        };
        stamina: number;
        state: "idle" | "running" | "tackling" | "shooting" | "passing";
        velocity?: {
            x: number;
            y: number;
        } | undefined;
    }>, "many">;
    score: z.ZodObject<{
        teamA: z.ZodNumber;
        teamB: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        teamA: number;
        teamB: number;
    }, {
        teamA: number;
        teamB: number;
    }>;
    phase: z.ZodEnum<["kickoff", "play", "freekick", "corner", "penalty", "halftime", "fulltime"]>;
}, "strip", z.ZodTypeAny, {
    frame: number;
    matchTime: string;
    timestamp: string;
    ball: {
        x: number;
        y: number;
        z?: number | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
    };
    players: {
        id: string;
        position: {
            x: number;
            y: number;
            z?: number | undefined;
        };
        stamina: number;
        state: "idle" | "running" | "tackling" | "shooting" | "passing";
        velocity?: {
            x: number;
            y: number;
        } | undefined;
    }[];
    score: {
        teamA: number;
        teamB: number;
    };
    phase: "kickoff" | "play" | "freekick" | "corner" | "penalty" | "halftime" | "fulltime";
}, {
    frame: number;
    matchTime: string;
    timestamp: string;
    ball: {
        x: number;
        y: number;
        z?: number | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
    };
    players: {
        id: string;
        position: {
            x: number;
            y: number;
            z?: number | undefined;
        };
        stamina: number;
        state: "idle" | "running" | "tackling" | "shooting" | "passing";
        velocity?: {
            x: number;
            y: number;
        } | undefined;
    }[];
    score: {
        teamA: number;
        teamB: number;
    };
    phase: "kickoff" | "play" | "freekick" | "corner" | "penalty" | "halftime" | "fulltime";
}>;
export type MatchState = z.infer<typeof MatchStateSchema>;
/**
 * Agent role definition
 */
export declare const AgentRoleSchema: z.ZodEnum<["goalkeeper", "defender", "midfielder", "forward", "coach", "referee", "commentator"]>;
export type AgentRole = z.infer<typeof AgentRoleSchema>;
/**
 * Agent decision context
 */
export declare const AgentDecisionContextSchema: z.ZodObject<{
    matchState: z.ZodObject<{
        timestamp: z.ZodString;
        frame: z.ZodNumber;
        matchTime: z.ZodString;
        ball: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodOptional<z.ZodNumber>;
        } & {
            velocity: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                z: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                z: number;
            }, {
                x: number;
                y: number;
                z: number;
            }>>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z?: number | undefined;
            velocity?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
        }, {
            x: number;
            y: number;
            z?: number | undefined;
            velocity?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
        }>;
        players: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                z: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                z?: number | undefined;
            }, {
                x: number;
                y: number;
                z?: number | undefined;
            }>;
            velocity: z.ZodOptional<z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
            }, {
                x: number;
                y: number;
            }>>;
            stamina: z.ZodNumber;
            state: z.ZodEnum<["idle", "running", "tackling", "shooting", "passing"]>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            position: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            stamina: number;
            state: "idle" | "running" | "tackling" | "shooting" | "passing";
            velocity?: {
                x: number;
                y: number;
            } | undefined;
        }, {
            id: string;
            position: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            stamina: number;
            state: "idle" | "running" | "tackling" | "shooting" | "passing";
            velocity?: {
                x: number;
                y: number;
            } | undefined;
        }>, "many">;
        score: z.ZodObject<{
            teamA: z.ZodNumber;
            teamB: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            teamA: number;
            teamB: number;
        }, {
            teamA: number;
            teamB: number;
        }>;
        phase: z.ZodEnum<["kickoff", "play", "freekick", "corner", "penalty", "halftime", "fulltime"]>;
    }, "strip", z.ZodTypeAny, {
        frame: number;
        matchTime: string;
        timestamp: string;
        ball: {
            x: number;
            y: number;
            z?: number | undefined;
            velocity?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
        };
        players: {
            id: string;
            position: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            stamina: number;
            state: "idle" | "running" | "tackling" | "shooting" | "passing";
            velocity?: {
                x: number;
                y: number;
            } | undefined;
        }[];
        score: {
            teamA: number;
            teamB: number;
        };
        phase: "kickoff" | "play" | "freekick" | "corner" | "penalty" | "halftime" | "fulltime";
    }, {
        frame: number;
        matchTime: string;
        timestamp: string;
        ball: {
            x: number;
            y: number;
            z?: number | undefined;
            velocity?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
        };
        players: {
            id: string;
            position: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            stamina: number;
            state: "idle" | "running" | "tackling" | "shooting" | "passing";
            velocity?: {
                x: number;
                y: number;
            } | undefined;
        }[];
        score: {
            teamA: number;
            teamB: number;
        };
        phase: "kickoff" | "play" | "freekick" | "corner" | "penalty" | "halftime" | "fulltime";
    }>;
    recentEvents: z.ZodArray<z.ZodObject<{
        timestamp: z.ZodString;
        frame: z.ZodNumber;
        matchTime: z.ZodOptional<z.ZodString>;
        space: z.ZodObject<{
            physical: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                z: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                z?: number | undefined;
            }, {
                x: number;
                y: number;
                z?: number | undefined;
            }>;
            logical: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            physical: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            logical: string;
        }, {
            physical: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            logical: string;
        }>;
        action: z.ZodObject<{
            type: z.ZodEnum<["pass", "shot", "tackle", "interception", "clearance", "dribble", "cross", "header", "save", "goal", "foul", "card", "whistle", "substitution", "tactical_instruction", "commentary"]>;
            agent: z.ZodString;
            target: z.ZodOptional<z.ZodString>;
            result: z.ZodEnum<["success", "failure", "partial", "pending"]>;
            metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, "strip", z.ZodTypeAny, {
            type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
            agent: string;
            result: "success" | "failure" | "partial" | "pending";
            target?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
        }, {
            type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
            agent: string;
            result: "success" | "failure" | "partial" | "pending";
            target?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
        }>;
        decision: z.ZodOptional<z.ZodObject<{
            type: z.ZodEnum<["command", "consensus", "autonomous", "suggestion", "ruling", "request", "approval", "rejection"]>;
            from: z.ZodString;
            to: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            channel: z.ZodEnum<["direct", "broadcast", "discussion", "pr-review", "issue-comment", "tactical-board", "field-shout", "internal"]>;
            github: z.ZodOptional<z.ZodObject<{
                issueNumber: z.ZodOptional<z.ZodNumber>;
                prNumber: z.ZodOptional<z.ZodNumber>;
                discussionNumber: z.ZodOptional<z.ZodNumber>;
                commentId: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                issueNumber?: number | undefined;
                prNumber?: number | undefined;
                discussionNumber?: number | undefined;
                commentId?: number | undefined;
            }, {
                issueNumber?: number | undefined;
                prNumber?: number | undefined;
                discussionNumber?: number | undefined;
                commentId?: number | undefined;
            }>>;
            reasoning: z.ZodOptional<z.ZodString>;
            basedOn: z.ZodOptional<z.ZodArray<z.ZodObject<{
                eventFrame: z.ZodOptional<z.ZodNumber>;
                issueNumber: z.ZodOptional<z.ZodNumber>;
                source: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                source: string;
                issueNumber?: number | undefined;
                eventFrame?: number | undefined;
            }, {
                source: string;
                issueNumber?: number | undefined;
                eventFrame?: number | undefined;
            }>, "many">>;
            approvedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            rejectedBy: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            priority: z.ZodOptional<z.ZodEnum<["low", "normal", "high", "critical"]>>;
            validUntil: z.ZodOptional<z.ZodObject<{
                frame: z.ZodOptional<z.ZodNumber>;
                matchTime: z.ZodOptional<z.ZodString>;
                condition: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                frame?: number | undefined;
                matchTime?: string | undefined;
                condition?: string | undefined;
            }, {
                frame?: number | undefined;
                matchTime?: string | undefined;
                condition?: string | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
            from: string;
            channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
            to?: string[] | undefined;
            github?: {
                issueNumber?: number | undefined;
                prNumber?: number | undefined;
                discussionNumber?: number | undefined;
                commentId?: number | undefined;
            } | undefined;
            reasoning?: string | undefined;
            basedOn?: {
                source: string;
                issueNumber?: number | undefined;
                eventFrame?: number | undefined;
            }[] | undefined;
            approvedBy?: string[] | undefined;
            rejectedBy?: string[] | undefined;
            priority?: "low" | "normal" | "high" | "critical" | undefined;
            validUntil?: {
                frame?: number | undefined;
                matchTime?: string | undefined;
                condition?: string | undefined;
            } | undefined;
        }, {
            type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
            from: string;
            channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
            to?: string[] | undefined;
            github?: {
                issueNumber?: number | undefined;
                prNumber?: number | undefined;
                discussionNumber?: number | undefined;
                commentId?: number | undefined;
            } | undefined;
            reasoning?: string | undefined;
            basedOn?: {
                source: string;
                issueNumber?: number | undefined;
                eventFrame?: number | undefined;
            }[] | undefined;
            approvedBy?: string[] | undefined;
            rejectedBy?: string[] | undefined;
            priority?: "low" | "normal" | "high" | "critical" | undefined;
            validUntil?: {
                frame?: number | undefined;
                matchTime?: string | undefined;
                condition?: string | undefined;
            } | undefined;
        }>>;
        git: z.ZodOptional<z.ZodObject<{
            commit: z.ZodOptional<z.ZodString>;
            branch: z.ZodDefault<z.ZodString>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            branch: string;
            message?: string | undefined;
            commit?: string | undefined;
        }, {
            message?: string | undefined;
            commit?: string | undefined;
            branch?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        frame: number;
        timestamp: string;
        space: {
            physical: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            logical: string;
        };
        action: {
            type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
            agent: string;
            result: "success" | "failure" | "partial" | "pending";
            target?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        matchTime?: string | undefined;
        decision?: {
            type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
            from: string;
            channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
            to?: string[] | undefined;
            github?: {
                issueNumber?: number | undefined;
                prNumber?: number | undefined;
                discussionNumber?: number | undefined;
                commentId?: number | undefined;
            } | undefined;
            reasoning?: string | undefined;
            basedOn?: {
                source: string;
                issueNumber?: number | undefined;
                eventFrame?: number | undefined;
            }[] | undefined;
            approvedBy?: string[] | undefined;
            rejectedBy?: string[] | undefined;
            priority?: "low" | "normal" | "high" | "critical" | undefined;
            validUntil?: {
                frame?: number | undefined;
                matchTime?: string | undefined;
                condition?: string | undefined;
            } | undefined;
        } | undefined;
        git?: {
            branch: string;
            message?: string | undefined;
            commit?: string | undefined;
        } | undefined;
    }, {
        frame: number;
        timestamp: string;
        space: {
            physical: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            logical: string;
        };
        action: {
            type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
            agent: string;
            result: "success" | "failure" | "partial" | "pending";
            target?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        matchTime?: string | undefined;
        decision?: {
            type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
            from: string;
            channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
            to?: string[] | undefined;
            github?: {
                issueNumber?: number | undefined;
                prNumber?: number | undefined;
                discussionNumber?: number | undefined;
                commentId?: number | undefined;
            } | undefined;
            reasoning?: string | undefined;
            basedOn?: {
                source: string;
                issueNumber?: number | undefined;
                eventFrame?: number | undefined;
            }[] | undefined;
            approvedBy?: string[] | undefined;
            rejectedBy?: string[] | undefined;
            priority?: "low" | "normal" | "high" | "critical" | undefined;
            validUntil?: {
                frame?: number | undefined;
                matchTime?: string | undefined;
                condition?: string | undefined;
            } | undefined;
        } | undefined;
        git?: {
            message?: string | undefined;
            commit?: string | undefined;
            branch?: string | undefined;
        } | undefined;
    }>, "many">;
    teamInstructions: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    matchState: {
        frame: number;
        matchTime: string;
        timestamp: string;
        ball: {
            x: number;
            y: number;
            z?: number | undefined;
            velocity?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
        };
        players: {
            id: string;
            position: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            stamina: number;
            state: "idle" | "running" | "tackling" | "shooting" | "passing";
            velocity?: {
                x: number;
                y: number;
            } | undefined;
        }[];
        score: {
            teamA: number;
            teamB: number;
        };
        phase: "kickoff" | "play" | "freekick" | "corner" | "penalty" | "halftime" | "fulltime";
    };
    recentEvents: {
        frame: number;
        timestamp: string;
        space: {
            physical: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            logical: string;
        };
        action: {
            type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
            agent: string;
            result: "success" | "failure" | "partial" | "pending";
            target?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        matchTime?: string | undefined;
        decision?: {
            type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
            from: string;
            channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
            to?: string[] | undefined;
            github?: {
                issueNumber?: number | undefined;
                prNumber?: number | undefined;
                discussionNumber?: number | undefined;
                commentId?: number | undefined;
            } | undefined;
            reasoning?: string | undefined;
            basedOn?: {
                source: string;
                issueNumber?: number | undefined;
                eventFrame?: number | undefined;
            }[] | undefined;
            approvedBy?: string[] | undefined;
            rejectedBy?: string[] | undefined;
            priority?: "low" | "normal" | "high" | "critical" | undefined;
            validUntil?: {
                frame?: number | undefined;
                matchTime?: string | undefined;
                condition?: string | undefined;
            } | undefined;
        } | undefined;
        git?: {
            branch: string;
            message?: string | undefined;
            commit?: string | undefined;
        } | undefined;
    }[];
    teamInstructions?: string | undefined;
}, {
    matchState: {
        frame: number;
        matchTime: string;
        timestamp: string;
        ball: {
            x: number;
            y: number;
            z?: number | undefined;
            velocity?: {
                x: number;
                y: number;
                z: number;
            } | undefined;
        };
        players: {
            id: string;
            position: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            stamina: number;
            state: "idle" | "running" | "tackling" | "shooting" | "passing";
            velocity?: {
                x: number;
                y: number;
            } | undefined;
        }[];
        score: {
            teamA: number;
            teamB: number;
        };
        phase: "kickoff" | "play" | "freekick" | "corner" | "penalty" | "halftime" | "fulltime";
    };
    recentEvents: {
        frame: number;
        timestamp: string;
        space: {
            physical: {
                x: number;
                y: number;
                z?: number | undefined;
            };
            logical: string;
        };
        action: {
            type: "pass" | "shot" | "tackle" | "interception" | "clearance" | "dribble" | "cross" | "header" | "save" | "goal" | "foul" | "card" | "whistle" | "substitution" | "tactical_instruction" | "commentary";
            agent: string;
            result: "success" | "failure" | "partial" | "pending";
            target?: string | undefined;
            metadata?: Record<string, unknown> | undefined;
        };
        matchTime?: string | undefined;
        decision?: {
            type: "command" | "consensus" | "autonomous" | "suggestion" | "ruling" | "request" | "approval" | "rejection";
            from: string;
            channel: "direct" | "broadcast" | "discussion" | "pr-review" | "issue-comment" | "tactical-board" | "field-shout" | "internal";
            to?: string[] | undefined;
            github?: {
                issueNumber?: number | undefined;
                prNumber?: number | undefined;
                discussionNumber?: number | undefined;
                commentId?: number | undefined;
            } | undefined;
            reasoning?: string | undefined;
            basedOn?: {
                source: string;
                issueNumber?: number | undefined;
                eventFrame?: number | undefined;
            }[] | undefined;
            approvedBy?: string[] | undefined;
            rejectedBy?: string[] | undefined;
            priority?: "low" | "normal" | "high" | "critical" | undefined;
            validUntil?: {
                frame?: number | undefined;
                matchTime?: string | undefined;
                condition?: string | undefined;
            } | undefined;
        } | undefined;
        git?: {
            message?: string | undefined;
            commit?: string | undefined;
            branch?: string | undefined;
        } | undefined;
    }[];
    teamInstructions?: string | undefined;
}>;
export type AgentDecisionContext = z.infer<typeof AgentDecisionContextSchema>;
//# sourceMappingURL=types.d.ts.map