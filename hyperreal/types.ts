/**
 * Hyper Real Type Definitions
 *
 * Core types for the Time × Space × Action model
 */

import { z } from 'zod';

// ============================================================================
// TIME
// ============================================================================

/**
 * Absolute time (UTC) - synchronizes all events to world clock
 */
export const AbsoluteTimeSchema = z.string().datetime();
export type AbsoluteTime = z.infer<typeof AbsoluteTimeSchema>;

/**
 * Relative time - frame number since match start
 */
export const RelativeTimeSchema = z.number().int().nonnegative();
export type RelativeTime = z.infer<typeof RelativeTimeSchema>;

/**
 * Match time - human-readable match clock
 */
export const MatchTimeSchema = z.string().regex(/^[0-9]{1,3}:[0-5][0-9]$/);
export type MatchTime = z.infer<typeof MatchTimeSchema>;

// ============================================================================
// SPACE
// ============================================================================

/**
 * Physical space - actual field coordinates
 * Standard soccer field: 105m × 68m
 */
export const PhysicalSpaceSchema = z.object({
  x: z.number().min(0).max(105), // Length
  y: z.number().min(0).max(68),  // Width
  z: z.number().min(0).optional(), // Height (for ball, headers)
});
export type PhysicalSpace = z.infer<typeof PhysicalSpaceSchema>;

/**
 * Logical space - Git repository location
 */
export const LogicalSpaceSchema = z.string();
export type LogicalSpace = z.infer<typeof LogicalSpaceSchema>;

/**
 * Complete space definition
 */
export const SpaceSchema = z.object({
  physical: PhysicalSpaceSchema,
  logical: LogicalSpaceSchema,
});
export type Space = z.infer<typeof SpaceSchema>;

// ============================================================================
// ACTION
// ============================================================================

/**
 * Action types in a soccer match
 */
export const ActionTypeSchema = z.enum([
  // Player actions
  'pass',
  'shot',
  'tackle',
  'interception',
  'clearance',
  'dribble',
  'cross',
  'header',
  'save',
  'goal',

  // Referee actions
  'foul',
  'card',
  'whistle',

  // Coach actions
  'substitution',
  'tactical_instruction',

  // Commentator actions
  'commentary',
]);
export type ActionType = z.infer<typeof ActionTypeSchema>;

/**
 * Agent identifier
 * Format: {type}-{id}-{team}
 * Examples: player-01-team-a, coach-team-b, referee-main
 */
export const AgentIdSchema = z.string().regex(/^(player|coach|referee|commentator)-[a-z0-9-]+$/);
export type AgentId = z.infer<typeof AgentIdSchema>;

/**
 * Action result
 */
export const ActionResultSchema = z.enum(['success', 'failure', 'partial', 'pending']);
export type ActionResult = z.infer<typeof ActionResultSchema>;

/**
 * Action definition
 */
export const ActionSchema = z.object({
  type: ActionTypeSchema,
  agent: AgentIdSchema,
  target: z.string().optional(),
  result: ActionResultSchema,
  metadata: z.record(z.unknown()).optional(),
});
export type Action = z.infer<typeof ActionSchema>;

// ============================================================================
// COMMUNICATION & DECISION
// ============================================================================

/**
 * Decision type - how this action was decided
 */
export const DecisionTypeSchema = z.enum([
  'command',        // 命令: 上位者から下位者への指示（監督 → 選手）
  'consensus',      // 合意形成: 複数エージェント間の協議結果
  'autonomous',     // 自己判断: エージェント独自の意思決定
  'suggestion',     // 提案: 下位者から上位者への推奨
  'ruling',         // 裁定: 審判による判定
  'request',        // 依頼: 対等な関係での要請（選手 ⇄ 選手）
  'approval',       // 承認: 提案に対する許可
  'rejection',      // 却下: 提案に対する拒否
]);
export type DecisionType = z.infer<typeof DecisionTypeSchema>;

/**
 * Communication channel - how the decision was communicated
 */
export const CommunicationChannelSchema = z.enum([
  'direct',         // 直接指示（監督 → 特定選手）
  'broadcast',      // 全体への指示（監督 → チーム全員）
  'discussion',     // ディスカッション（GitHub Discussions）
  'pr-review',      // PR レビュー（戦術変更の承認プロセス）
  'issue-comment',  // Issue コメント（イベントに対する議論）
  'tactical-board', // 戦術ボード（ハーフタイムミーティング）
  'field-shout',    // フィールド上の声かけ（選手間）
  'internal',       // 内部思考（エージェント自身）
]);
export type CommunicationChannel = z.infer<typeof CommunicationChannelSchema>;

/**
 * Decision metadata - who decided what, how, and why
 */
export const DecisionMetadataSchema = z.object({
  // 意思決定の種類
  type: DecisionTypeSchema,

  // 誰から
  from: AgentIdSchema,

  // 誰へ（複数可）
  to: z.array(AgentIdSchema).optional(),

  // どのチャネルで
  channel: CommunicationChannelSchema,

  // GitHub上の記録先
  github: z.object({
    issueNumber: z.number().optional(),
    prNumber: z.number().optional(),
    discussionNumber: z.number().optional(),
    commentId: z.number().optional(),
  }).optional(),

  // 意思決定の理由
  reasoning: z.string().optional(),

  // 参照した情報
  basedOn: z.array(z.object({
    eventFrame: z.number().optional(),
    issueNumber: z.number().optional(),
    source: z.string(),
  })).optional(),

  // 承認/却下された場合、誰が
  approvedBy: z.array(AgentIdSchema).optional(),
  rejectedBy: z.array(AgentIdSchema).optional(),

  // 優先度・緊急度
  priority: z.enum(['low', 'normal', 'high', 'critical']).optional(),

  // この決定が有効な期間
  validUntil: z.object({
    frame: z.number().optional(),
    matchTime: z.string().optional(),
    condition: z.string().optional(), // "until goal scored", "until halftime"
  }).optional(),
});
export type DecisionMetadata = z.infer<typeof DecisionMetadataSchema>;

// ============================================================================
// GIT INTEGRATION
// ============================================================================

/**
 * Git metadata for tracking changes
 */
export const GitMetadataSchema = z.object({
  commit: z.string().optional(),
  branch: z.string().default('main'),
  message: z.string().optional(),
});
export type GitMetadata = z.infer<typeof GitMetadataSchema>;

// ============================================================================
// HYPER REAL EVENT
// ============================================================================

/**
 * The complete Hyper Real event
 * Every occurrence in reality is captured as Time × Space × Action × Decision
 */
export const HyperRealEventSchema = z.object({
  // TIME
  timestamp: AbsoluteTimeSchema,
  frame: RelativeTimeSchema,
  matchTime: MatchTimeSchema.optional(),

  // SPACE
  space: SpaceSchema,

  // ACTION
  action: ActionSchema,

  // DECISION (新規: 意思決定とコミュニケーションフロー)
  decision: DecisionMetadataSchema.optional(),

  // GIT (for recording)
  git: GitMetadataSchema.optional(),
});

export type HyperRealEvent = z.infer<typeof HyperRealEventSchema>;

// ============================================================================
// MATCH STATE
// ============================================================================

/**
 * Complete match state at any point in time
 */
export const MatchStateSchema = z.object({
  timestamp: AbsoluteTimeSchema,
  frame: RelativeTimeSchema,
  matchTime: MatchTimeSchema,

  ball: PhysicalSpaceSchema.extend({
    velocity: z.object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
    }).optional(),
  }),

  players: z.array(z.object({
    id: AgentIdSchema,
    position: PhysicalSpaceSchema,
    velocity: z.object({
      x: z.number(),
      y: z.number(),
    }).optional(),
    stamina: z.number().min(0).max(100),
    state: z.enum(['idle', 'running', 'tackling', 'shooting', 'passing']),
  })),

  score: z.object({
    teamA: z.number().int().nonnegative(),
    teamB: z.number().int().nonnegative(),
  }),

  phase: z.enum(['kickoff', 'play', 'freekick', 'corner', 'penalty', 'halftime', 'fulltime']),
});

export type MatchState = z.infer<typeof MatchStateSchema>;

// ============================================================================
// AGENT DEFINITIONS
// ============================================================================

/**
 * Agent role definition
 */
export const AgentRoleSchema = z.enum([
  'goalkeeper',
  'defender',
  'midfielder',
  'forward',
  'coach',
  'referee',
  'commentator',
]);
export type AgentRole = z.infer<typeof AgentRoleSchema>;

/**
 * Agent decision context
 */
export const AgentDecisionContextSchema = z.object({
  matchState: MatchStateSchema,
  recentEvents: z.array(HyperRealEventSchema),
  teamInstructions: z.string().optional(),
});
export type AgentDecisionContext = z.infer<typeof AgentDecisionContextSchema>;
