/**
 * Git Committer - Creates REAL Git commits for every action
 */

import { simpleGit, SimpleGit } from 'simple-git';
import type { HyperRealEvent } from '../../hyperreal/types.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export class GitCommitter {
  private git: SimpleGit;
  private repoPath: string;
  private enabled: boolean;

  constructor(repoPath: string = process.cwd()) {
    this.git = simpleGit(repoPath);
    this.repoPath = repoPath;
    this.enabled = !!process.env.GITHUB_TOKEN && process.env.ENABLE_GIT_COMMITS === 'true';
  }

  /**
   * Create a REAL Git commit for this action
   */
  async commitAction(event: HyperRealEvent): Promise<string | null> {
    if (!this.enabled) {
      return null; // Skip if not enabled
    }

    try {
      // Create event file
      const matchDir = join(this.repoPath, 'matches', 'current', 'events');
      await mkdir(matchDir, { recursive: true });

      const eventFile = join(matchDir, `${event.action.type}-${event.frame}.json`);
      await writeFile(eventFile, JSON.stringify(event, null, 2), 'utf-8');

      // Add to git
      await this.git.add(eventFile);

      // Commit
      const commitMessage = event.git?.message || `${event.action.type}: ${event.action.agent}`;
      const fullMessage = `${commitMessage}

Frame: ${event.frame}
Time: ${event.matchTime}
Agent: ${event.action.agent}
Result: ${event.action.result}

Decision: ${event.decision?.type}
From: ${event.decision?.from}
Reasoning: ${event.decision?.reasoning}

Position: (${event.space.physical.x}, ${event.space.physical.y})
`;

      await this.git.commit(fullMessage);

      // Get commit hash
      const log = await this.git.log({ n: 1 });
      const commitHash = log.latest?.hash || 'unknown';

      console.log(`      📝 Git commit: ${commitHash.substring(0, 7)}`);
      return commitHash;

    } catch (error) {
      console.error(`      ⚠️  Failed to create git commit:`, error instanceof Error ? error.message : error);
      return null;
    }
  }

  /**
   * Push all commits to remote
   */
  async pushCommits(): Promise<void> {
    if (!this.enabled) {
      return;
    }

    try {
      console.log(`\n📤 Pushing all commits to GitHub...`);
      await this.git.push('origin', 'main');
      console.log(`   ✅ Commits pushed successfully\n`);
    } catch (error) {
      console.error(`   ⚠️  Failed to push commits:`, error instanceof Error ? error.message : error);
    }
  }
}
