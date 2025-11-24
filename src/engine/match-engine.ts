/**
 * Match Engine - Simplified MVP
 *
 * Generates and records soccer match events using Hyper Real model
 */

import type {
  HyperRealEvent,
  MatchState,
  PhysicalSpace,
  ActionType,
  DecisionType,
  CommunicationChannel,
} from '../hyperreal/types.js';
import { SimpleCoach } from '../agents/simple-coach.js';
import { PRCreator } from '../github/pr-creator.js';
import { DiscussionCreator } from '../github/discussion-creator.js';
import { GitCommitter } from '../github/git-committer.js';

export interface MatchConfig {
  teamA: string;
  teamB: string;
  duration: number; // in frames (default: 5400 = 90 min at 1 frame/sec)
  framesPerSecond: number;
}

export class MatchEngine {
  private config: MatchConfig;
  private currentFrame: number = 0;
  private events: HyperRealEvent[] = [];
  private matchState: MatchState;
  private startTime: Date;
  private coachTeamA: SimpleCoach;
  private coachTeamB: SimpleCoach;
  private prCreator: PRCreator;
  private discussionCreator: DiscussionCreator;
  private gitCommitter: GitCommitter;
  private lastCoachCheck: number = 0;

  constructor(config: MatchConfig) {
    this.config = config;
    this.startTime = new Date();
    this.matchState = this.initializeMatch();
    this.coachTeamA = new SimpleCoach('team-a', config.teamA);
    this.coachTeamB = new SimpleCoach('team-b', config.teamB);
    this.prCreator = new PRCreator();
    this.discussionCreator = new DiscussionCreator();
    this.gitCommitter = new GitCommitter();
  }

  private initializeMatch(): MatchState {
    return {
      timestamp: this.startTime.toISOString(),
      frame: 0,
      matchTime: '0:00',
      ball: {
        x: 52.5, // Center of field
        y: 34,
        z: 0,
      },
      players: this.initializePlayers(),
      score: {
        teamA: 0,
        teamB: 0,
      },
      phase: 'kickoff',
    };
  }

  private initializePlayers() {
    const players = [];

    // Team A players (simplified 2v2)
    players.push({
      id: 'player-01-team-a' as any,
      position: { x: 30, y: 30, z: 0 },
      stamina: 100,
      state: 'idle' as const,
    });
    players.push({
      id: 'player-02-team-a' as any,
      position: { x: 30, y: 38, z: 0 },
      stamina: 100,
      state: 'idle' as const,
    });

    // Team B players (simplified 2v2)
    players.push({
      id: 'player-01-team-b' as any,
      position: { x: 75, y: 30, z: 0 },
      stamina: 100,
      state: 'idle' as const,
    });
    players.push({
      id: 'player-02-team-b' as any,
      position: { x: 75, y: 38, z: 0 },
      stamina: 100,
      state: 'idle' as const,
    });

    return players;
  }

  private frameToMatchTime(frame: number): string {
    const seconds = Math.floor(frame / this.config.framesPerSecond);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  private generateRandomEvent(): HyperRealEvent | null {
    // Simple probability-based event generation
    const rand = Math.random();

    let actionType: ActionType;
    let agent: string;
    let success: boolean;
    let isFoul = false;
    let cardType: 'yellow' | 'red' | 'none' = 'none';

    if (rand < 0.3) {
      actionType = 'pass';
      agent = Math.random() < 0.5 ? 'player-01-team-a' : 'player-01-team-b';
      success = Math.random() < 0.8; // 80% pass success rate
    } else if (rand < 0.5) {
      actionType = 'shot';
      agent = Math.random() < 0.5 ? 'player-02-team-a' : 'player-02-team-b';
      success = Math.random() < 0.3; // 30% shot success rate (goal)
    } else if (rand < 0.7) {
      actionType = 'tackle';
      agent = Math.random() < 0.5 ? 'player-01-team-a' : 'player-01-team-b';
      success = Math.random() < 0.6; // 60% tackle success

      // Some tackles are fouls
      if (!success && Math.random() < 0.3) {
        isFoul = true;
        actionType = 'foul';
        // 20% chance of yellow card if it's a foul
        if (Math.random() < 0.2) {
          cardType = 'yellow';
        }
      }
    } else {
      // No event this frame
      return null;
    }

    // Check if shot resulted in goal
    if (actionType === 'shot' && success) {
      actionType = 'goal';

      // Update score
      if (agent.includes('team-a')) {
        this.matchState.score.teamA++;
      } else {
        this.matchState.score.teamB++;
      }
    }

    const event: HyperRealEvent = {
      timestamp: new Date(this.startTime.getTime() + (this.currentFrame * 1000 / this.config.framesPerSecond)).toISOString(),
      frame: this.currentFrame,
      matchTime: this.frameToMatchTime(this.currentFrame),
      space: {
        physical: this.getPlayerPosition(agent),
        logical: `matches/current/actions/${actionType}-${this.currentFrame}.json`,
      },
      action: {
        type: actionType,
        agent: agent as any,
        result: success ? 'success' : 'failure',
        metadata: isFoul ? { cardType } : {},
      },
      decision: {
        type: isFoul ? 'ruling' as DecisionType : 'autonomous' as DecisionType,
        from: isFoul ? 'referee-main' as any : agent as any,
        channel: isFoul ? 'broadcast' as CommunicationChannel : 'internal' as CommunicationChannel,
        reasoning: isFoul
          ? `Foul called: dangerous tackle. ${cardType !== 'none' ? cardType + ' card issued.' : 'No card.'}`
          : `Autonomous decision to ${actionType}`,
      },
      git: {
        branch: 'match/current',
        message: this.generateCommitMessage(actionType, agent, success, cardType),
      },
    };

    return event;
  }

  private getPlayerPosition(agentId: string): PhysicalSpace {
    const player = this.matchState.players.find(p => p.id === agentId);
    return player ? player.position : { x: 50, y: 34, z: 0 };
  }

  private generateCommitMessage(action: ActionType, agent: string, success: boolean, cardType: 'yellow' | 'red' | 'none' = 'none'): string {
    const emojiMap: Record<string, string> = {
      pass: '🦶',
      shot: '🎯',
      goal: '⚽',
      tackle: '🛡️',
      dribble: '⚡',
      foul: cardType === 'yellow' ? '🟨' : cardType === 'red' ? '🟥' : '⚠️',
      save: '🧤',
      interception: '🚫',
      cross: '↗️',
      header: '🤕',
      clearance: '🦵',
      substitution: '🔄',
      card: cardType === 'yellow' ? '🟨' : '🟥',
      tactical_instruction: '📋',
      whistle: '🎺',
      commentary: '🎙️',
    };
    const emoji = emojiMap[action] || '⚽';

    if (action === 'foul') {
      return `${emoji} FOUL: ${agent} - ${cardType !== 'none' ? cardType + ' card' : 'no card'}`;
    }

    const result = success ? 'success' : 'failed';
    return `${emoji} ${action.toUpperCase()}: ${agent} - ${result}`;
  }

  public async runFrame(): Promise<HyperRealEvent | null> {
    if (this.currentFrame >= this.config.duration) {
      this.matchState.phase = 'fulltime';
      return null;
    }

    const event = this.generateRandomEvent();

    if (event) {
      this.events.push(event);
      console.log(`[${event.matchTime}] ${event.git?.message}`);

      // REAL GitHub integration
      await this.recordEventToGitHub(event);

      // REAL Git commit
      const commitHash = await this.gitCommitter.commitAction(event);
      if (commitHash) {
        event.git = event.git || { branch: 'main' };
        event.git.commit = commitHash;
      }
    }

    this.currentFrame++;
    this.matchState.frame = this.currentFrame;
    this.matchState.matchTime = this.frameToMatchTime(this.currentFrame);
    this.matchState.timestamp = new Date().toISOString();

    // Decrease player stamina
    this.matchState.players.forEach(player => {
      player.stamina = Math.max(0, player.stamina - 0.01);
    });

    return event;
  }

  public async runMatch(): Promise<void> {
    console.log(`\n⚽ Match Starting: ${this.config.teamA} vs ${this.config.teamB}\n`);

    while (this.matchState.phase !== 'fulltime') {
      await this.runFrame();

      // Coach checks every 15 frames
      if (this.currentFrame - this.lastCoachCheck >= 15) {
        await this.runCoachAnalysis();
        this.lastCoachCheck = this.currentFrame;
      }

      // Halftime
      if (this.currentFrame === Math.floor(this.config.duration / 2)) {
        this.matchState.phase = 'halftime';
        console.log(`\n⏸️  HALFTIME: ${this.config.teamA} ${this.matchState.score.teamA} - ${this.matchState.score.teamB} ${this.config.teamB}\n`);

        // Create halftime discussions
        await this.createHalftimeDiscussions();

        // Coaches analyze at halftime
        await this.runCoachAnalysis();

        this.matchState.phase = 'play';
      }
    }

    console.log(`\n🏁 FULL TIME: ${this.config.teamA} ${this.matchState.score.teamA} - ${this.matchState.score.teamB} ${this.config.teamB}\n`);
    console.log(`📊 Total Events: ${this.events.length}`);
    console.log(`⚽ Goals: ${this.events.filter(e => e.action.type === 'goal').length}`);

    // Create post-match discussions
    await this.createPostMatchDiscussions();

    // Push all commits
    await this.gitCommitter.pushCommits();
  }

  public getEvents(): HyperRealEvent[] {
    return this.events;
  }

  public getMatchState(): MatchState {
    return this.matchState;
  }

  /**
   * Record event to REAL GitHub
   */
  private async recordEventToGitHub(event: HyperRealEvent): Promise<void> {
    // Only create GitHub artifacts if GITHUB_TOKEN is set
    if (!process.env.GITHUB_TOKEN) {
      return; // Skip GitHub integration in local testing
    }

    try {
      const { GitHubClient } = await import('../github/github-client.js');
      const github = new GitHubClient();

      // Create GitHub Issue for important events
      if (event.action.type === 'goal') {
        const issueNumber = await github.createGoalIssue(event);
        console.log(`   📝 GitHub Issue #${issueNumber} created for goal`);
      } else if (event.action.type === 'foul') {
        const cardType = (event.action.metadata?.cardType as 'yellow' | 'red' | 'none') || 'none';
        const issueNumber = await github.createFoulIssue(event, cardType);
        console.log(`   📝 GitHub Issue #${issueNumber} created for foul`);
      }

      // TODO: Add more event types (tactical changes, discussions, etc.)
    } catch (error) {
      console.error(`   ⚠️  Failed to create GitHub issue:`, error instanceof Error ? error.message : error);
    }
  }

  /**
   * Run coach analysis and create PRs if needed
   */
  private async runCoachAnalysis(): Promise<void> {
    if (!process.env.GITHUB_TOKEN) {
      return; // Skip if no token
    }

    try {
      // Get recent events (last 15 frames)
      const recentEvents = this.events.slice(-15);

      // Coach Team A analyzes
      const decisionA = this.coachTeamA.analyzeAndDecide(this.matchState, recentEvents);
      if (decisionA.type !== 'no_action') {
        console.log(`\n🎯 Coach ${this.config.teamA} proposes: ${decisionA.type}`);
        console.log(`   Reasoning: ${decisionA.reasoning}`);

        const prNumber = await this.prCreator.createTacticalPR(
          decisionA,
          this.matchState.matchTime,
          this.coachTeamA.getTeamId(),
          this.coachTeamA.getTeamName()
        );
        console.log(`   📝 GitHub PR #${prNumber} created for tactical change\n`);
      }

      // Coach Team B analyzes
      const decisionB = this.coachTeamB.analyzeAndDecide(this.matchState, recentEvents);
      if (decisionB.type !== 'no_action') {
        console.log(`\n🎯 Coach ${this.config.teamB} proposes: ${decisionB.type}`);
        console.log(`   Reasoning: ${decisionB.reasoning}`);

        const prNumber = await this.prCreator.createTacticalPR(
          decisionB,
          this.matchState.matchTime,
          this.coachTeamB.getTeamId(),
          this.coachTeamB.getTeamName()
        );
        console.log(`   📝 GitHub PR #${prNumber} created for tactical change\n`);
      }
    } catch (error) {
      console.error(`   ⚠️  Failed to run coach analysis:`, error instanceof Error ? error.message : error);
    }
  }

  /**
   * Create halftime discussions
   */
  private async createHalftimeDiscussions(): Promise<void> {
    if (!process.env.GITHUB_TOKEN) {
      return;
    }

    try {
      console.log(`\n💬 Creating halftime discussions...\n`);

      // Team A discussion
      await this.discussionCreator.createHalftimeDiscussion(
        'team-a',
        this.config.teamA,
        this.matchState,
        this.events
      );

      // Team B discussion
      await this.discussionCreator.createHalftimeDiscussion(
        'team-b',
        this.config.teamB,
        this.matchState,
        this.events
      );
    } catch (error) {
      console.error(`   ⚠️  Failed to create discussions:`, error instanceof Error ? error.message : error);
    }
  }

  /**
   * Create post-match discussions
   */
  private async createPostMatchDiscussions(): Promise<void> {
    if (!process.env.GITHUB_TOKEN) {
      return;
    }

    try {
      console.log(`\n💬 Creating post-match discussions...\n`);

      const teamAWon = this.matchState.score.teamA > this.matchState.score.teamB;
      const teamBWon = this.matchState.score.teamB > this.matchState.score.teamA;
      const drew = this.matchState.score.teamA === this.matchState.score.teamB;

      // Team A discussion
      await this.discussionCreator.createPostMatchDiscussion(
        'team-a',
        this.config.teamA,
        this.matchState,
        this.events,
        teamAWon,
        drew
      );

      // Team B discussion
      await this.discussionCreator.createPostMatchDiscussion(
        'team-b',
        this.config.teamB,
        this.matchState,
        this.events,
        teamBWon,
        drew
      );
    } catch (error) {
      console.error(`   ⚠️  Failed to create post-match discussions:`, error instanceof Error ? error.message : error);
    }
  }
}
