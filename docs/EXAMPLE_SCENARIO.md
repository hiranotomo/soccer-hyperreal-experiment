# Complete Scenario Example

## Scenario: 戦術的課題の発見から解決まで

**Match Time**: 35:00 - 46:00 (前半終了まで)
**Situation**: Team Aの右サイドが繰り返し攻撃されている

---

## Timeline of Events

### **Frame 2100 (35:00)** - 問題発生

**Event**: 相手の左ウイングが右サイドを突破

```json
{
  "timestamp": "2025-11-24T10:35:00.000Z",
  "frame": 2100,
  "matchTime": "35:00",
  "space": {
    "physical": { "x": 75, "y": 60, "z": 0 },
    "logical": "matches/2025-11-24-103000/actions/breakthrough-2100.json"
  },
  "action": {
    "type": "dribble",
    "agent": "player-11-team-b",
    "target": "player-02-team-a",
    "result": "success",
    "metadata": { "beat_defender": true }
  },
  "decision": {
    "type": "autonomous",
    "from": "player-11-team-b",
    "channel": "internal",
    "reasoning": "Defender (player-02) isolated, no midfield support"
  },
  "git": {
    "commit": "a1b2c3d",
    "branch": "match/2025-11-24-team-a-vs-team-b",
    "message": "🦶 DRIBBLE: Player #11 (Team B) beats defender on right flank"
  }
}
```

**GitHub**: Commit `a1b2c3d`

---

### **Frame 2105 (35:05)** - アシスタントコーチが問題を認識

**Event**: アシスタントコーチが防御の脆弱性を検出

```json
{
  "timestamp": "2025-11-24T10:35:05.000Z",
  "frame": 2105,
  "matchTime": "35:05",
  "space": {
    "physical": { "x": 0, "y": 0, "z": 0 },
    "logical": "tactical-analysis/vulnerabilities/right-flank-35min.json"
  },
  "action": {
    "type": "tactical_analysis",
    "agent": "assistant-coach-team-a",
    "result": "success",
    "metadata": {
      "issue": "Right flank overloaded",
      "occurrences": 3,
      "timeframe": "30:00-35:00"
    }
  },
  "decision": {
    "type": "autonomous",
    "from": "assistant-coach-team-a",
    "channel": "internal",
    "reasoning": "Pattern detected: 3 breakthroughs on right in 5 minutes",
    "basedOn": [
      { "eventFrame": 1800, "source": "Breakthrough #1" },
      { "eventFrame": 1950, "source": "Breakthrough #2" },
      { "eventFrame": 2100, "source": "Breakthrough #3" }
    ],
    "priority": "high"
  }
}
```

**GitHub**: Issue #23 created

```markdown
Title: ⚠️ [TACTICS] Defensive vulnerability on right flank - 35:00

Body:
## Problem
Our right flank is being repeatedly exploited by opponent's left winger (#11).

## Evidence
- Frame 1800 (30:00): Breakthrough leading to corner
- Frame 1950 (32:30): Breakthrough leading to shot
- Frame 2100 (35:00): Breakthrough, beat our RB (#2)

## Analysis
- Right Back (#2) is isolated
- Right Midfielder (#6) not tracking back effectively
- Opponent creating 2v1 situations

## Recommended Action
- Instruct RM (#6) to track back more aggressively
- OR adjust formation to provide more coverage

Labels: tactics, analysis, team-a, high-priority
Assigned to: @coach-team-a
```

---

### **Frame 2110 (35:10)** - アシスタントコーチが監督に提案

**Event**: Discussion thread 開始

**Decision**:
```json
{
  "type": "suggestion",
  "from": "assistant-coach-team-a",
  "to": ["coach-team-a"],
  "channel": "discussion",
  "github": {
    "discussionNumber": 8,
    "issueNumber": 23
  },
  "reasoning": "Immediate tactical adjustment needed to prevent more damage",
  "priority": "high"
}
```

**GitHub**: Discussion #8

```markdown
Title: Tactical Adjustment - Right Flank Coverage

Coach @coach-team-a,

I've noticed a pattern (see Issue #23). Opponent's LW (#11) is exploiting our right side.

**Options:**
1. Instruct RM (#6) to track back more
2. Switch to 4-5-1 temporarily for more midfield coverage
3. Substitute RB (#2) for more defensive option

**My recommendation**: Option 1 (immediate) + Option 2 if problem persists.

What do you think?
```

---

### **Frame 2115 (35:15)** - 監督が戦術変更を決定

**Event**: 監督が指示を決定

**Decision**:
```json
{
  "type": "command",
  "from": "coach-team-a",
  "to": ["player-06-team-a"],
  "channel": "direct",
  "github": {
    "discussionNumber": 8,
    "prNumber": 16
  },
  "reasoning": "Agree with assistant coach. Instruct RM to track back immediately.",
  "priority": "critical"
}
```

**GitHub**: PR #16 created

```markdown
Title: [Tactical Change] RM #6 - Increased Defensive Duties

## Change Type
- [x] Player Instruction
- [ ] Formation Change
- [ ] Substitution

## From
Current role: Right Midfielder (balanced)

## To
Right Midfielder (defensive-minded)
- Track opponent's LW (#11) aggressively
- Prioritize defensive positioning over attacking runs
- Stay within 15m of RB (#2) when out of possession

## Reason
Opponent's LW (#11) repeatedly exploiting right flank (see Issue #23).
Need immediate tactical adjustment to prevent further damage.

## Match Context
- Match Time: 35:15
- Score: 0-0
- Current Formation: 4-3-3

## Expected Impact
- [x] Better defensive stability on right
- [x] Reduce 2v1 situations
- [ ] May reduce attacking threat on right side

## Reviewers
- [x] @assistant-coach-team-a (APPROVED)
- [x] @coach-team-a (APPROVED - will merge immediately)

## Timeline
- Requested: Frame 2115 (35:15)
- Execute: Next stoppage (throw-in at 35:30)
```

---

### **Frame 2130 (35:30)** - PR Merged, 指示適用

**Event**: 戦術変更が承認され、選手に伝達

**GitHub**:
- PR #16 merged
- Comment on Issue #23: "Tactical adjustment applied"

**Commit**:
```
🎯 Tactical Change: RM #6 defensive duties increased

Decision: command
From: coach-team-a → player-06-team-a
Channel: direct
Priority: critical
Related: Issue #23, PR #16
```

---

### **Frame 2135 (35:35)** - 選手が指示を実行

**Event**: Player #6 がポジショニング変更

```json
{
  "action": {
    "type": "positioning_adjustment",
    "agent": "player-06-team-a",
    "result": "success"
  },
  "decision": {
    "type": "autonomous",
    "from": "player-06-team-a",
    "channel": "internal",
    "reasoning": "Following coach's tactical instruction (PR #16)",
    "basedOn": [
      { "source": "Coach command via PR #16" }
    ]
  }
}
```

---

### **Frame 2400 (40:00)** - 戦術変更の効果検証

**Event**: アシスタントコーチが効果を分析

```json
{
  "action": {
    "type": "tactical_analysis",
    "agent": "assistant-coach-team-a",
    "result": "success",
    "metadata": {
      "finding": "Right flank stabilized",
      "opponent_breakthroughs": 0,
      "timeframe": "35:30-40:00"
    }
  },
  "decision": {
    "type": "autonomous",
    "from": "assistant-coach-team-a",
    "channel": "issue-comment",
    "github": {
      "issueNumber": 23,
      "commentId": 789
    },
    "reasoning": "Tactical adjustment successful - no breakthroughs in last 5 minutes"
  }
}
```

**GitHub**: Comment on Issue #23

```markdown
## Update (40:00)

Tactical adjustment is working:
- No opponent breakthroughs on right flank since 35:30
- RM (#6) successfully tracking LW (#11)
- RB (#2) no longer isolated

Recommend maintaining this tactical setup for remainder of first half.

Status: ✅ Resolved
```

**Issue #23**: Closed with label `resolved`

---

### **Frame 2700 (45:00)** - ハーフタイム、選手間でディスカッション

**Event**: 選手たちがハーフタイムに議論

**GitHub**: Discussion #9 "Halftime Review - First Half Performance"

```markdown
**player-06-team-a** (RM):
Tracked back a lot in second half. Opponent's LW quieter now.
Felt less involved in attack though. Should we adjust for 2nd half?

**player-02-team-a** (RB):
Thanks for the support #6. Made a huge difference.
I think we can maintain this but maybe be more aggressive when we win the ball?

**player-07-team-a** (CM):
Agreed. Right side more stable now.
For 2nd half: when we win ball on right, quick counter?

**player-10-team-a** (RW):
Yes! I'll make runs in behind when we counter.

**Consensus reached**:
- Maintain defensive discipline on right (Decision: consensus)
- When ball won, quick counter with RW running in behind
- RM can push forward in counter situations only
```

**Decision**:
```json
{
  "type": "consensus",
  "from": "player-06-team-a",
  "to": ["player-02-team-a", "player-07-team-a", "player-10-team-a"],
  "channel": "tactical-board",
  "github": {
    "discussionNumber": 9
  },
  "reasoning": "Team agreement on tactical approach for second half",
  "approvedBy": [
    "player-02-team-a",
    "player-06-team-a",
    "player-07-team-a",
    "player-10-team-a"
  ]
}
```

---

### **Frame 2750 (46:00)** - 監督が選手の提案を承認

**Event**: 監督がDiscussionを確認し、承認

**Decision**:
```json
{
  "type": "approval",
  "from": "coach-team-a",
  "to": ["player-06-team-a", "player-02-team-a", "player-07-team-a", "player-10-team-a"],
  "channel": "discussion",
  "github": {
    "discussionNumber": 9,
    "commentId": 801
  },
  "reasoning": "Good tactical awareness from players. Approve their counter-attack plan.",
  "approvedBy": ["coach-team-a"]
}
```

**GitHub**: Comment on Discussion #9

```markdown
**coach-team-a**:
Excellent tactical discussion team. I approve your plan:

✅ Maintain defensive discipline on right
✅ Quick counters when we win the ball
✅ RW (#10) make runs in behind

Let's execute this in the second half!
```

---

## Summary: Communication Flow Graph

```
Frame 2100: Opponent breakthrough (autonomous decision)
    ↓
Frame 2105: Assistant Coach detects pattern (autonomous)
    ↓ creates Issue #23
Frame 2110: Assistant Coach suggests to Head Coach (suggestion)
    ↓ Discussion #8
Frame 2115: Head Coach commands Player #6 (command)
    ↓ PR #16
Frame 2130: PR merged, instruction applied
    ↓
Frame 2135: Player #6 executes (autonomous, based on command)
    ↓
Frame 2400: Assistant Coach verifies success (autonomous)
    ↓ Comment on Issue #23
Frame 2700: Players discuss at halftime (consensus)
    ↓ Discussion #9
Frame 2750: Head Coach approves player plan (approval)
```

## GitHub Artifacts Created

1. **Issue #23**: Tactical problem identification
2. **Discussion #8**: Coach communication
3. **PR #16**: Tactical change proposal + approval
4. **Commits**: Every action with decision metadata
5. **Discussion #9**: Player consensus formation
6. **Issue #23 closed**: Problem resolved

## Decision Types Used

1. ✅ **Autonomous** - Player actions, coach analysis
2. ✅ **Suggestion** - Assistant → Head Coach
3. ✅ **Command** - Coach → Player
4. ✅ **Consensus** - Players among themselves
5. ✅ **Approval** - Coach → Player consensus

---

**完全なコミュニケーションフローが記録され、組織としてのチームの動きが可視化されました！** 🎯⚽
