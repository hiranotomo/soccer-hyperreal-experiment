# Phase 2 Implementation Plan

## 🎯 Goal: Full AI Agent Integration

Transform the current random-event simulator into a **true AI-driven match** where every decision is made by Claude-powered agents.

---

## 📋 Implementation Checklist

### **1. Claude API Integration** (2-3 hours)

#### **1.1 Agent Base Class**
```typescript
// src/agents/base-agent.ts
import Anthropic from '@anthropic-ai/sdk';

export abstract class BaseAgent {
  protected anthropic: Anthropic;
  protected characteristics: Record<string, number>;
  protected agentId: string;

  async decide(context: DecisionContext): Promise<Decision> {
    const prompt = this.buildPrompt(context);
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    return this.parseDecision(response);
  }

  abstract buildPrompt(context: DecisionContext): string;
  abstract parseDecision(response: any): Decision;
}
```

#### **1.2 Player Agent**
```typescript
// src/agents/player-agent.ts
export class PlayerAgent extends BaseAgent {
  private position: string;

  buildPrompt(context: DecisionContext): string {
    return `
You are ${this.agentId}, a ${this.position} for ${this.team}.

YOUR CHARACTERISTICS (out of 100):
${this.formatCharacteristics()}

CURRENT MATCH SITUATION:
- Time: ${context.matchTime}
- Score: ${context.score}
- Ball position: (${context.ball.x}, ${context.ball.y})
- Your position: (${context.yourPosition.x}, ${context.yourPosition.y})
- Distance to goal: ${context.distanceToGoal}m
- Stamina: ${this.characteristics.stamina}%

NEARBY PLAYERS:
${context.nearbyTeammates.map(p => `- ${p.id} at (${p.x}, ${p.y})`).join('\n')}

OPPONENTS:
${context.opponents.map(p => `- ${p.id} at (${p.x}, ${p.y})`).join('\n')}

COACH INSTRUCTIONS:
"${context.coachInstruction}"

DECIDE YOUR NEXT ACTION:
Based on your characteristics, what should you do?

Options:
1. PASS to [teammate-id] with power [0-1]
2. SHOOT at goal with power [0-1]
3. DRIBBLE in direction [angle in degrees]
4. TACKLE [opponent-id]

Respond in JSON:
{
  "action": "pass|shot|dribble|tackle",
  "target": "player-id or null",
  "power": 0.5,
  "direction": 45,
  "reasoning": "why you chose this action"
}
    `;
  }
}
```

#### **1.3 Coach Agent**
```typescript
// src/agents/coach-agent.ts
export class CoachAgent extends BaseAgent {
  buildPrompt(context: DecisionContext): string {
    return `
You are ${this.name}, head coach of ${this.team}.

YOUR COACHING CHARACTERISTICS:
${this.formatCharacteristics()}

MATCH SITUATION:
- Time: ${context.matchTime}
- Score: ${context.score}
- Formation: ${context.formation}

RECENT EVENTS (last 5 minutes):
${context.recentEvents.map(e => `- ${e.matchTime}: ${e.description}`).join('\n')}

TACTICAL ISSUES:
${context.tacticalIssues.map(i => `- ${i.description}`).join('\n')}

PLAYER STATUS:
${context.players.map(p => `- ${p.id}: Stamina ${p.stamina}%`).join('\n')}

DECIDE:
Should you make any changes?

Options:
1. TACTICAL_INSTRUCTION: Give specific instruction to player(s)
2. FORMATION_CHANGE: Change formation (create GitHub PR)
3. SUBSTITUTION: Replace a player (create GitHub PR)
4. NO_ACTION: Continue with current plan

Respond in JSON:
{
  "action": "tactical_instruction|formation_change|substitution|no_action",
  "target": "player-id or formation or null",
  "instruction": "what to do",
  "reasoning": "why",
  "priority": "low|normal|high|critical"
}
    `;
  }
}
```

#### **1.4 Referee Agent**
```typescript
// src/agents/referee-agent.ts
export class RefereeAgent extends BaseAgent {
  buildPrompt(context: DecisionContext): string {
    return `
You are ${this.name}, the referee for this match.

YOUR CHARACTERISTICS:
- Foul Detection: ${this.characteristics.foulDetection}
- Card Threshold: ${this.characteristics.cardThreshold}
- Consistency: ${this.characteristics.consistency}

INCIDENT:
${context.incident.description}

DETAILS:
- Players involved: ${context.incident.players}
- Speed of contact: ${context.incident.speed}
- Intent: ${context.incident.intent}
- Danger level: ${context.incident.danger}

MATCH CONTEXT:
- Time: ${context.matchTime}
- Score: ${context.score}
- Previous cards: ${context.previousCards}

DECIDE:
Is this a foul? If so, what action?

Respond in JSON:
{
  "ruling": "play_on|free_kick|penalty|yellow_card|red_card",
  "player": "player-id",
  "reasoning": "why this decision",
  "confidence": 0.85
}
    `;
  }
}
```

---

### **2. Match Engine Upgrade** (2 hours)

Replace random event generation with agent-driven decisions:

```typescript
// src/engine/agent-match-engine.ts
export class AgentMatchEngine extends MatchEngine {
  private playerAgents: Map<string, PlayerAgent>;
  private coachAgents: Map<string, CoachAgent>;
  private refereeAgent: RefereeAgent;

  async runFrame(): Promise<HyperRealEvent | null> {
    // 1. Determine who has the ball
    const ballCarrier = this.getBallCarrier();

    // 2. Ask that player what to do (AI decision)
    const decision = await this.playerAgents.get(ballCarrier).decide({
      matchState: this.matchState,
      ball: this.matchState.ball,
      yourPosition: this.getPlayerPosition(ballCarrier),
      nearbyTeammates: this.getNearbyTeammates(ballCarrier),
      opponents: this.getNearbyOpponents(ballCarrier),
      coachInstruction: this.getCoachInstruction(ballCarrier),
      ...
    });

    // 3. Execute the action
    const event = await this.executeAction(ballCarrier, decision);

    // 4. Check if referee needs to intervene
    if (this.needsRefereeCheck(event)) {
      const ruling = await this.refereeAgent.decide({
        incident: event,
        matchState: this.matchState,
        ...
      });

      if (ruling.ruling !== 'play_on') {
        // Create GitHub Issue for foul/card
        await this.createFoulIssue(ruling);
      }
    }

    // 5. Check if coach wants to make changes
    if (this.shouldCheckCoach()) {
      const coachDecision = await this.coachAgents.get('team-a').decide({
        matchState: this.matchState,
        recentEvents: this.getRecentEvents(),
        tacticalIssues: this.identifyTacticalIssues(),
        ...
      });

      if (coachDecision.action !== 'no_action') {
        // Create GitHub PR for tactical change
        await this.createTacticalPR(coachDecision);
      }
    }

    return event;
  }
}
```

---

### **3. GitHub Integration** (2 hours)

#### **3.1 Auto-create Issues**
```typescript
// src/github/issue-creator.ts
export async function createGoalIssue(event: HyperRealEvent) {
  await octokit.issues.create({
    owner: 'hiranotomo',
    repo: 'soccer-hyperreal-experiment',
    title: `⚽ GOAL: ${event.action.agent} - ${event.matchTime}`,
    body: `## Goal Scored

**Scorer:** ${event.action.agent}
**Assist:** ${event.action.metadata.assist || 'None'}
**Time:** ${event.matchTime}
**Position:** (${event.space.physical.x}, ${event.space.physical.y})

**How it happened:**
${event.decision.reasoning}

**Match context:**
- Score before: ${event.metadata.scoreBefore}
- Score after: ${event.metadata.scoreAfter}

**Commit:** ${event.git.commit}
    `,
    labels: ['goal', 'match-event', event.action.agent.includes('team-a') ? 'team-a' : 'team-b']
  });
}
```

#### **3.2 Auto-create PRs**
```typescript
// src/github/pr-creator.ts
export async function createTacticalPR(decision: CoachDecision) {
  // Create branch
  await git.checkout('-b', `tactical/${decision.type}-${Date.now()}`);

  // Modify tactics file
  await fs.writeFile('tactics/formation.json', JSON.stringify(decision.newFormation));

  // Commit
  await git.add('tactics/');
  await git.commit(`🎯 Tactical Change: ${decision.description}`);

  // Push
  await git.push('origin', branchName);

  // Create PR
  await octokit.pulls.create({
    owner: 'hiranotomo',
    repo: 'soccer-hyperreal-experiment',
    title: `[Tactical Change] ${decision.description}`,
    head: branchName,
    base: 'match/current',
    body: `## Proposed Change

${decision.reasoning}

**From:** ${decision.currentFormation}
**To:** ${decision.newFormation}

**Expected impact:**
${decision.expectedImpact}

**Proposed by:** ${decision.from}
**Priority:** ${decision.priority}
    `
  });
}
```

---

### **4. Testing** (1 hour)

```bash
# Test individual agents
npm run test:agent:player
npm run test:agent:coach
npm run test:agent:referee

# Test full match with AI
npm run match:ai -- --duration=60

# Test GitHub integration
npm run test:github-integration
```

---

## 📊 Expected Results

### **Before (MVP)**
```
[0:01] 🦶 PASS: player-01-team-a - success (random)
[0:02] ⚽ GOAL: player-02-team-a - success (random)
```

### **After (Phase 2)**
```
[0:01] 🦶 PASS: player-01-team-a → player-02-team-a - success
       Decision: Autonomous
       Reasoning: "I see player-02 making a run into space on the right.
                   My passing accuracy (85) is high, and he's unmarked.
                   This creates a good scoring opportunity."
       GitHub: Commit abc123

[0:02] ⚽ GOAL: player-02-team-a - success
       Decision: Autonomous
       Reasoning: "Received pass in good position, 18m from goal.
                   Goalkeeper slightly off position. My shooting accuracy (87)
                   is high and composure (78) is good. Taking the shot."
       GitHub: Issue #12 created, Commit def456

[2:15] 🎯 TACTICAL CHANGE: coach-team-a
       Decision: Command → all players
       Reasoning: "Opponent exploiting our right flank (3 breakthroughs).
                   Instructing RM to track back more aggressively."
       GitHub: PR #5 created, Discussion #3 opened
```

---

## 🚀 Implementation Timeline

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 2.1 | Claude API setup | 1h | ⏳ Not started |
| 2.2 | Player agent implementation | 2h | ⏳ Not started |
| 2.3 | Coach agent implementation | 2h | ⏳ Not started |
| 2.4 | Referee agent implementation | 1h | ⏳ Not started |
| 2.5 | Match engine upgrade | 2h | ⏳ Not started |
| 2.6 | GitHub integration | 2h | ⏳ Not started |
| 2.7 | Testing & refinement | 2h | ⏳ Not started |
| **Total** | | **12h** | |

---

## 💰 Cost Estimate

With Claude Sonnet:
- ~500 tokens per decision
- ~100 decisions per match (60 min)
- Cost: ~$0.02 per match

Very affordable for experimentation! ✅

---

## ✅ Success Criteria

- [ ] All 25+ agents running autonomously
- [ ] Every action has AI reasoning
- [ ] GitHub Issues auto-created for goals/fouls
- [ ] GitHub PRs auto-created for tactical changes
- [ ] Agents communicate via GitHub Discussions
- [ ] Complete match recorded in Git history
- [ ] Emergent tactical behavior observed

---

**Ready to start Phase 2?** 🚀
