/**
 * GitHub Client - Real GitHub API Integration
 *
 * Agents use this to ACTUALLY create Issues, PRs, Discussions, and Commits
 */

import { Octokit } from '@octokit/rest';
import type { HyperRealEvent } from '../../hyperreal/types.js';

export class GitHubClient {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is required');
    }

    this.octokit = new Octokit({ auth: token });
    this.owner = 'hiranotomo'; // TODO: Make configurable
    this.repo = 'soccer-hyperreal-experiment';
  }

  /**
   * Create a REAL GitHub Issue for a goal
   */
  async createGoalIssue(event: HyperRealEvent): Promise<number> {
    const team = event.action.agent.includes('team-a') ? 'Team A' : 'Team B';
    const teamLabel = event.action.agent.includes('team-a') ? 'team-a' : 'team-b';

    const response = await this.octokit.issues.create({
      owner: this.owner,
      repo: this.repo,
      title: `⚽ GOAL: ${event.action.agent} (${team}) - ${event.matchTime}`,
      body: `## ⚽ Goal Scored!

**Scorer:** \`${event.action.agent}\`
**Team:** ${team}
**Match Time:** ${event.matchTime}
**Timestamp:** ${event.timestamp}
**Frame:** ${event.frame}

### Position on Field
- **X:** ${event.space.physical.x}m
- **Y:** ${event.space.physical.y}m
- **Z:** ${event.space.physical.z}m

### Decision Metadata
- **Type:** ${event.decision?.type || 'autonomous'}
- **From:** ${event.decision?.from}
- **Reasoning:** ${event.decision?.reasoning || 'No reasoning provided'}

### Hyper Real Record
\`\`\`json
${JSON.stringify(event, null, 2)}
\`\`\`

---
*This issue was automatically created by the match engine.*
*Commit: ${event.git?.commit || 'pending'}*
      `,
      labels: ['goal', 'match-event', teamLabel]
    });

    console.log(`✅ GitHub Issue created: #${response.data.number}`);
    return response.data.number;
  }

  /**
   * Create a REAL GitHub Issue for a foul/card
   */
  async createFoulIssue(event: HyperRealEvent, cardType: 'yellow' | 'red' | 'none'): Promise<number> {
    const emoji = cardType === 'yellow' ? '🟨' : cardType === 'red' ? '🟥' : '⚠️';
    const team = event.action.agent.includes('team-a') ? 'Team A' : 'Team B';
    const teamLabel = event.action.agent.includes('team-a') ? 'team-a' : 'team-b';

    const response = await this.octokit.issues.create({
      owner: this.owner,
      repo: this.repo,
      title: `${emoji} ${cardType.toUpperCase()} CARD: ${event.action.agent} - ${event.matchTime}`,
      body: `## ${emoji} Foul - ${cardType === 'none' ? 'No Card' : cardType.toUpperCase() + ' Card'}

**Player:** \`${event.action.agent}\`
**Team:** ${team}
**Match Time:** ${event.matchTime}
**Card:** ${cardType === 'none' ? 'No card issued' : cardType.toUpperCase()}

### Incident Details
- **Type:** ${event.action.type}
- **Target:** ${event.action.target || 'N/A'}
- **Position:** (${event.space.physical.x}, ${event.space.physical.y})

### Referee Decision
- **Ruling:** ${event.decision?.type || 'ruling'}
- **Reasoning:** ${event.decision?.reasoning || 'Standard foul'}

### Hyper Real Record
\`\`\`json
${JSON.stringify(event, null, 2)}
\`\`\`

---
*This issue was automatically created by the referee agent.*
      `,
      labels: ['foul', cardType === 'none' ? 'no-card' : `${cardType}-card`, teamLabel]
    });

    console.log(`✅ GitHub Issue created: #${response.data.number}`);
    return response.data.number;
  }

  /**
   * Create a REAL GitHub Discussion for team communication
   */
  async createTeamDiscussion(
    title: string,
    body: string,
    categoryId: string = 'DIC_kwDONXxK284ClaLa' // TODO: Get actual category ID
  ): Promise<string> {
    // Note: Discussions API requires GraphQL
    const mutation = `
      mutation CreateDiscussion($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
        createDiscussion(input: {
          repositoryId: $repositoryId,
          categoryId: $categoryId,
          title: $title,
          body: $body
        }) {
          discussion {
            id
            number
            url
          }
        }
      }
    `;

    const result = await this.octokit.graphql(mutation, {
      repositoryId: await this.getRepositoryId(),
      categoryId,
      title,
      body
    });

    console.log(`✅ GitHub Discussion created`);
    return (result as any).createDiscussion.discussion.url;
  }

  /**
   * Create a REAL Pull Request for tactical changes
   */
  async createTacticalPR(
    branchName: string,
    title: string,
    body: string,
    baseBranch: string = 'main'
  ): Promise<number> {
    const response = await this.octokit.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title,
      head: branchName,
      base: baseBranch,
      body
    });

    console.log(`✅ GitHub PR created: #${response.data.number}`);
    return response.data.number;
  }

  /**
   * Add a comment to an existing Issue or PR
   */
  async addComment(issueNumber: number, body: string): Promise<void> {
    await this.octokit.issues.createComment({
      owner: this.owner,
      repo: this.repo,
      issue_number: issueNumber,
      body
    });

    console.log(`✅ Comment added to #${issueNumber}`);
  }

  /**
   * Helper: Get repository ID for GraphQL operations
   */
  private async getRepositoryId(): Promise<string> {
    const query = `
      query GetRepositoryId($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
        }
      }
    `;

    const result = await this.octokit.graphql(query, {
      owner: this.owner,
      name: this.repo
    });

    return (result as any).repository.id;
  }
}
