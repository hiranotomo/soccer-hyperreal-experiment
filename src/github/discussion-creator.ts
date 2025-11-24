/**
 * Discussion Creator - Creates REAL GitHub Discussions for team communication
 */

import { GitHubClient } from './github-client.js';
import type { HyperRealEvent, MatchState } from '../../hyperreal/types.js';

export class DiscussionCreator {
  private github: GitHubClient;

  constructor() {
    this.github = new GitHubClient();
  }

  /**
   * Create halftime discussion for team
   */
  async createHalftimeDiscussion(
    teamId: string,
    teamName: string,
    matchState: MatchState,
    recentEvents: HyperRealEvent[]
  ): Promise<string> {
    const scoreDiff = teamId === 'team-a'
      ? matchState.score.teamA - matchState.score.teamB
      : matchState.score.teamB - matchState.score.teamA;

    const goalsScored = recentEvents.filter(
      e => e.action.type === 'goal' && e.action.agent.includes(teamId)
    ).length;

    const goalsConceded = recentEvents.filter(
      e => e.action.type === 'goal' && !e.action.agent.includes(teamId)
    ).length;

    const fouls = recentEvents.filter(
      e => e.action.type === 'foul' && e.action.agent.includes(teamId)
    ).length;

    const title = `🏟️ Halftime Discussion - ${teamName}`;
    const body = `## ⏸️ Halftime Review - ${teamName}

### Current Score
**${matchState.score.teamA}** - **${matchState.score.teamB}**
${scoreDiff > 0 ? `✅ We're ahead by ${scoreDiff} goal(s)` : scoreDiff < 0 ? `⚠️ We're behind by ${Math.abs(scoreDiff)} goal(s)` : `🟰 Match is tied`}

### First Half Performance

**Goals Scored:** ${goalsScored}
**Goals Conceded:** ${goalsConceded}
**Fouls Committed:** ${fouls}

### Key Events

${this.formatKeyEvents(recentEvents, teamId)}

### Discussion Points

**What's working well?**
-

**What needs improvement?**
-

**Tactical adjustments for second half?**
-

### Player Input

Players, share your thoughts:
- What are you seeing on the field?
- Any suggestions for tactical changes?
- Who needs support?

---

**Coach's Instructions:**
- TBD (will be updated based on discussion)

**Match Time:** ${matchState.matchTime}
**Timestamp:** ${matchState.timestamp}
    `;

    const url = await this.github.createTeamDiscussion(title, body);
    console.log(`   💬 GitHub Discussion created: ${url}`);
    return url;
  }

  /**
   * Create post-match discussion
   */
  async createPostMatchDiscussion(
    teamId: string,
    teamName: string,
    matchState: MatchState,
    allEvents: HyperRealEvent[],
    won: boolean,
    drew: boolean
  ): Promise<string> {
    const result = won ? '✅ Victory!' : drew ? '🟰 Draw' : '❌ Defeat';

    const title = `🏁 Post-Match Review - ${teamName} ${result}`;
    const body = `## Post-Match Analysis - ${teamName}

### Final Result
**${matchState.score.teamA}** - **${matchState.score.teamB}**
${result}

### Match Statistics

${this.generateMatchStats(allEvents, teamId)}

### Performance Review

**What went well:**
-

**Areas for improvement:**
-

**Key moments:**
${this.formatKeyEvents(allEvents.slice(-10), teamId)}

### Player Ratings

*(To be filled by coaching staff)*

### Next Steps

-

---

**Full match data available in repository commits and issues.**
**Timestamp:** ${matchState.timestamp}
    `;

    const url = await this.github.createTeamDiscussion(title, body);
    console.log(`   💬 GitHub Discussion created: ${url}`);
    return url;
  }

  private formatKeyEvents(events: HyperRealEvent[], teamId: string): string {
    const keyEvents = events.filter(e =>
      e.action.type === 'goal' || e.action.type === 'foul' || e.action.type === 'card'
    );

    if (keyEvents.length === 0) {
      return '- No major events';
    }

    return keyEvents.map(e => {
      const emoji = e.action.type === 'goal' ? '⚽' : '⚠️';
      const isOurTeam = e.action.agent.includes(teamId);
      return `- **[${e.matchTime}]** ${emoji} ${e.action.type.toUpperCase()}: ${e.action.agent} ${isOurTeam ? '(us)' : '(opponent)'}`;
    }).join('\n');
  }

  private generateMatchStats(events: HyperRealEvent[], teamId: string): string {
    const ourEvents = events.filter(e => e.action.agent.includes(teamId));
    const opponentEvents = events.filter(e => !e.action.agent.includes(teamId));

    const ourPasses = ourEvents.filter(e => e.action.type === 'pass');
    const ourShots = ourEvents.filter(e => e.action.type === 'shot' || e.action.type === 'goal');
    const ourGoals = ourEvents.filter(e => e.action.type === 'goal');
    const ourFouls = ourEvents.filter(e => e.action.type === 'foul');

    const opponentGoals = opponentEvents.filter(e => e.action.type === 'goal');

    const passAccuracy = ourPasses.length > 0
      ? ((ourPasses.filter(p => p.action.result === 'success').length / ourPasses.length) * 100).toFixed(1)
      : '0';

    return `
| Stat | Us | Opponent |
|------|-------|----------|
| Goals | ${ourGoals.length} | ${opponentGoals.length} |
| Shots | ${ourShots.length} | - |
| Passes | ${ourPasses.length} (${passAccuracy}% acc.) | - |
| Fouls | ${ourFouls.length} | - |
    `.trim();
  }
}
