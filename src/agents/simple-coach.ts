/**
 * Simple Coach Agent
 *
 * Monitors match and makes tactical decisions
 * Creates REAL GitHub PRs for tactical changes
 */

import type { MatchState, HyperRealEvent } from '../../hyperreal/types.js';

export interface TacticalDecision {
  type: 'formation_change' | 'player_instruction' | 'substitution' | 'no_action';
  reasoning: string;
  details: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  targetPlayers?: string[];
}

export class SimpleCoach {
  private teamId: string;
  private teamName: string;
  private issuesDetected: Map<string, number> = new Map();

  constructor(teamId: string, teamName: string) {
    this.teamId = teamId;
    this.teamName = teamName;
  }

  /**
   * Analyze recent events and decide if action is needed
   */
  analyzeAndDecide(
    matchState: MatchState,
    recentEvents: HyperRealEvent[]
  ): TacticalDecision {
    // Count goals conceded
    const opponentTeam = this.teamId === 'team-a' ? 'team-b' : 'team-a';
    const goalsAgainst = recentEvents.filter(
      e => e.action.type === 'goal' && e.action.agent.includes(opponentTeam)
    ).length;

    // If we've conceded 2+ goals, change tactics
    if (goalsAgainst >= 2) {
      return {
        type: 'formation_change',
        reasoning: `We've conceded ${goalsAgainst} goals. Need defensive reinforcement.`,
        details: `Switch to more defensive formation. Push midfielders back to provide cover.`,
        priority: 'high',
        targetPlayers: this.getDefensiveMidfielders(),
      };
    }

    // Count fouls committed
    const foulsCommitted = recentEvents.filter(
      e => e.action.type === 'foul' && e.action.agent.includes(this.teamId)
    ).length;

    if (foulsCommitted >= 3) {
      return {
        type: 'player_instruction',
        reasoning: `We've committed ${foulsCommitted} fouls. Risk of cards increasing.`,
        details: `Instruct players to be more careful in challenges. Focus on positioning over tackling.`,
        priority: 'normal',
        targetPlayers: this.getDefenders(),
      };
    }

    // Check if we're winning and should defend lead
    const scoreDiff = this.getScoreDifference(matchState);
    const matchTime = matchState.matchTime;
    const minutesPlayed = parseInt(matchTime.split(':')[0]);

    if (scoreDiff > 0 && minutesPlayed > 40) {
      return {
        type: 'formation_change',
        reasoning: `We're ahead ${scoreDiff} goal(s) and match is in late stage. Protect the lead.`,
        details: `Pull back one midfielder to defensive position. Focus on maintaining possession.`,
        priority: 'normal',
      };
    }

    return {
      type: 'no_action',
      reasoning: 'Match situation is under control. Continue current tactics.',
      details: 'No tactical changes needed at this time.',
      priority: 'low',
    };
  }

  private getScoreDifference(matchState: MatchState): number {
    if (this.teamId === 'team-a') {
      return matchState.score.teamA - matchState.score.teamB;
    } else {
      return matchState.score.teamB - matchState.score.teamA;
    }
  }

  private getDefensiveMidfielders(): string[] {
    // Simplified - in real version would query actual team composition
    return [`player-01-${this.teamId}`];
  }

  private getDefenders(): string[] {
    return [`player-01-${this.teamId}`];
  }

  getTeamId(): string {
    return this.teamId;
  }

  getTeamName(): string {
    return this.teamName;
  }
}
