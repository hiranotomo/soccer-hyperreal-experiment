/**
 * PR Creator - Creates REAL GitHub Pull Requests for tactical changes
 */

import { simpleGit, SimpleGit } from 'simple-git';
import { GitHubClient } from './github-client.js';
import type { TacticalDecision } from '../agents/simple-coach.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export class PRCreator {
  private git: SimpleGit;
  private github: GitHubClient;
  private repoPath: string;

  constructor(repoPath: string = process.cwd()) {
    this.git = simpleGit(repoPath);
    this.github = new GitHubClient();
    this.repoPath = repoPath;
  }

  /**
   * Create a REAL Pull Request for tactical change
   */
  async createTacticalPR(
    decision: TacticalDecision,
    matchTime: string,
    teamId: string,
    teamName: string
  ): Promise<number> {
    const branchName = `tactical/${decision.type}-${Date.now()}`;
    const timestamp = new Date().toISOString();

    try {
      // 1. Create new branch
      console.log(`   🌿 Creating branch: ${branchName}`);
      await this.git.checkoutLocalBranch(branchName);

      // 2. Create/modify tactics file
      await this.createTacticsFile(decision, matchTime, teamId, timestamp);

      // 3. Commit changes
      const commitMessage = `🎯 Tactical Change: ${decision.type} at ${matchTime}

${decision.reasoning}

Priority: ${decision.priority}
Team: ${teamName}
Timestamp: ${timestamp}`;

      console.log(`   💾 Committing changes...`);
      await this.git.add('tactics/');
      await this.git.commit(commitMessage);

      // 4. Push branch
      console.log(`   📤 Pushing branch to GitHub...`);
      await this.git.push('origin', branchName, ['--set-upstream']);

      // 5. Create Pull Request
      console.log(`   🔀 Creating Pull Request...`);
      const prBody = this.generatePRBody(decision, matchTime, teamName, timestamp);
      const prNumber = await this.github.createTacticalPR(
        branchName,
        `[Tactical Change] ${decision.type} - ${matchTime}`,
        prBody,
        'main'
      );

      // 6. Return to main branch
      await this.git.checkout('main');

      console.log(`   ✅ PR #${prNumber} created successfully!`);
      return prNumber;

    } catch (error) {
      console.error(`   ❌ Failed to create PR:`, error);
      // Try to return to main branch
      try {
        await this.git.checkout('main');
      } catch (e) {
        // Ignore
      }
      throw error;
    }
  }

  private async createTacticsFile(
    decision: TacticalDecision,
    matchTime: string,
    teamId: string,
    timestamp: string
  ): Promise<void> {
    const tacticsDir = join(this.repoPath, 'tactics');
    await mkdir(tacticsDir, { recursive: true });

    const tacticsFile = join(tacticsDir, `${teamId}-tactics.json`);
    const tacticsData = {
      timestamp,
      matchTime,
      decisionType: decision.type,
      reasoning: decision.reasoning,
      details: decision.details,
      priority: decision.priority,
      targetPlayers: decision.targetPlayers || [],
      appliedAt: timestamp,
    };

    await writeFile(tacticsFile, JSON.stringify(tacticsData, null, 2), 'utf-8');
  }

  private generatePRBody(
    decision: TacticalDecision,
    matchTime: string,
    teamName: string,
    timestamp: string
  ): string {
    return `## 🎯 Tactical Change Proposal

### Type
${decision.type.replace(/_/g, ' ').toUpperCase()}

### Match Context
- **Match Time:** ${matchTime}
- **Team:** ${teamName}
- **Priority:** ${decision.priority}
- **Timestamp:** ${timestamp}

### Reasoning
${decision.reasoning}

### Proposed Changes
${decision.details}

${decision.targetPlayers && decision.targetPlayers.length > 0 ? `
### Target Players
${decision.targetPlayers.map(p => `- \`${p}\``).join('\n')}
` : ''}

### Expected Impact
This tactical adjustment is expected to:
- Address current match situation
- ${decision.priority === 'critical' ? '**URGENT**: Requires immediate action' : decision.priority === 'high' ? 'High priority change' : 'Moderate tactical adjustment'}
- Improve team performance

### Approval Required
- [ ] @assistant-coach (optional review)
- [x] Auto-approved by match engine

---

*This PR was automatically created by the coach agent during the match.*
*Decision metadata recorded in Hyper Real format.*
    `;
  }
}
