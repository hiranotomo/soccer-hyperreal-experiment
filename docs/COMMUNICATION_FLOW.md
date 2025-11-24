# Communication Flow & Decision Recording

## Overview

Every action in the match is accompanied by **decision metadata** that records:
1. **誰から誰へ** (Who → Who)
2. **命令 / 合意形成 / 自己判断** (Decision Type)
3. **どのチャネルで** (Communication Channel)
4. **GitHub上のどこに記録** (GitHub Integration)

This creates a complete **organizational communication graph** of the team.

---

## Decision Types (意思決定の種類)

### 1. **Command (命令)**
- **From**: 監督 → 選手
- **Authority**: 上位者 → 下位者
- **Example**: 監督が選手にポジション変更を指示

```json
{
  "decision": {
    "type": "command",
    "from": "coach-team-a",
    "to": ["player-10-team-a"],
    "channel": "direct",
    "reasoning": "Player #10 needs to drop deeper to help midfield",
    "priority": "high"
  }
}
```

### 2. **Consensus (合意形成)**
- **From**: 複数エージェント
- **Authority**: 対等な関係
- **Example**: 選手たちがハーフタイムに戦術を議論して合意

```json
{
  "decision": {
    "type": "consensus",
    "from": "player-07-team-a",
    "to": ["player-10-team-a", "player-09-team-a", "player-06-team-a"],
    "channel": "discussion",
    "github": {
      "discussionNumber": 5
    },
    "reasoning": "Agreed to press higher after halftime",
    "approvedBy": ["player-10-team-a", "player-09-team-a", "player-06-team-a"]
  }
}
```

### 3. **Autonomous (自己判断)**
- **From**: エージェント自身
- **Authority**: 独立した判断
- **Example**: 選手が自分でパスかシュートかを判断

```json
{
  "decision": {
    "type": "autonomous",
    "from": "player-10-team-a",
    "to": null,
    "channel": "internal",
    "reasoning": "Open shooting lane, high confidence (shooting_accuracy: 85)",
    "basedOn": [
      {
        "eventFrame": 1234,
        "source": "Visual analysis of goalkeeper position"
      }
    ]
  }
}
```

### 4. **Suggestion (提案)**
- **From**: 下位者 → 上位者
- **Authority**: 提案・推奨
- **Example**: アシスタントコーチが監督に選手交代を提案

```json
{
  "decision": {
    "type": "suggestion",
    "from": "assistant-coach-team-a",
    "to": ["coach-team-a"],
    "channel": "pr-review",
    "github": {
      "prNumber": 12
    },
    "reasoning": "Player #5 stamina at 35%, risk of injury",
    "priority": "high"
  }
}
```

### 5. **Ruling (裁定)**
- **From**: 審判
- **Authority**: 絶対的な判定
- **Example**: 審判がファウルを宣告

```json
{
  "decision": {
    "type": "ruling",
    "from": "referee-main",
    "to": ["player-07-team-b"],
    "channel": "broadcast",
    "github": {
      "issueNumber": 23
    },
    "reasoning": "Tactical foul to stop counter-attack, yellow card issued",
    "priority": "critical"
  }
}
```

### 6. **Request (依頼)**
- **From**: 対等な関係
- **Authority**: 要請・お願い
- **Example**: 選手が他の選手にパスを要求

```json
{
  "decision": {
    "type": "request",
    "from": "player-09-team-a",
    "to": ["player-07-team-a"],
    "channel": "field-shout",
    "reasoning": "Making run into space, requesting through ball",
    "priority": "normal"
  }
}
```

### 7. **Approval (承認)**
- **From**: 承認権限者
- **Authority**: 提案の許可
- **Example**: 監督が戦術変更PRを承認

```json
{
  "decision": {
    "type": "approval",
    "from": "coach-team-a",
    "to": ["assistant-coach-team-a"],
    "channel": "pr-review",
    "github": {
      "prNumber": 12,
      "commentId": 456
    },
    "reasoning": "Good suggestion, proceed with substitution",
    "approvedBy": ["coach-team-a"]
  }
}
```

### 8. **Rejection (却下)**
- **From**: 承認権限者
- **Authority**: 提案の拒否
- **Example**: 監督が戦術変更を却下

```json
{
  "decision": {
    "type": "rejection",
    "from": "coach-team-a",
    "to": ["assistant-coach-team-a"],
    "channel": "pr-review",
    "github": {
      "prNumber": 13,
      "commentId": 457
    },
    "reasoning": "Too risky at this stage, maintain current formation",
    "rejectedBy": ["coach-team-a"]
  }
}
```

---

## Communication Channels (コミュニケーション手段)

### 1. **Direct (直接指示)**
- 1対1の指示
- GitHub: Issue comment (@ mention)

### 2. **Broadcast (全体通知)**
- 監督 → チーム全員
- GitHub: Issue with team label, Discussion

### 3. **Discussion (ディスカッション)**
- 複数エージェント間の議論
- GitHub: Discussions

### 4. **PR Review (PR レビュー)**
- 戦術変更の提案・承認プロセス
- GitHub: Pull Request + Reviews

### 5. **Issue Comment (Issue コメント)**
- イベント記録への議論
- GitHub: Issue comments

### 6. **Tactical Board (戦術ボード)**
- ハーフタイムミーティング
- GitHub: Dedicated Discussion thread

### 7. **Field Shout (フィールド上の声かけ)**
- 選手間のリアルタイムコミュニケーション
- GitHub: Commit message annotations

### 8. **Internal (内部思考)**
- エージェント自身の思考プロセス
- GitHub: Commit message details

---

## Practical Examples (実例)

### Example 1: 監督からの戦術指示 (Command)

**Situation**: 35分、相手の右サイドから何度も攻撃を受けている

**Flow**:
1. アシスタントコーチが問題を検出
   - **Decision Type**: `autonomous` (自己判断)
   - **Action**: Issue を作成 (#23: "Defensive vulnerability on right flank")

2. アシスタントコーチが監督に提案
   - **Decision Type**: `suggestion`
   - **Channel**: `discussion`
   - **GitHub**: Discussion thread #5

3. 監督が戦術変更を決定
   - **Decision Type**: `command`
   - **Channel**: `broadcast`
   - **Action**: PR作成 (#14: "Tactical Change: Right midfielder track back")

4. 選手が指示を受ける
   - **Decision Type**: `autonomous` (指示に基づいた実行判断)
   - **Action**: ポジショニング変更を実行

**GitHub Timeline**:
```
Issue #23: ⚠️ Defensive vulnerability on right flank
  ├─ Comment by assistant-coach-team-a: "Noticed repeated attacks on our right"
  ├─ Comment by coach-team-a: "Agreed, let's adjust"
  └─ Linked to Discussion #5

Discussion #5: Tactical adjustment for right flank
  ├─ Post by assistant-coach-team-a
  ├─ Reply by coach-team-a: "Approve adjustment"
  └─ Linked to PR #14

PR #14: Tactical Change: Right midfielder track back
  ├─ Review by coach-team-a: APPROVED
  ├─ Merged → tactics applied
  └─ Commit: "🎯 Tactical: Player #6 instructed to track back"

Commit abc123: Player #6 adjusts position
  └─ Decision: { type: "autonomous", from: "player-06-team-a", based_on: PR #14 }
```

---

### Example 2: 選手間の合意形成 (Consensus)

**Situation**: ハーフタイム、選手たちが戦術を議論

**Flow**:
1. キャプテンがディスカッション開始
   - **Channel**: `tactical-board`
   - **GitHub**: Discussion #7 "Halftime Review - What's working?"

2. 複数選手が意見交換
   - Player #7: "We need to press higher"
   - Player #10: "Agreed, but watch stamina"
   - Player #9: "I can make more runs if midfield pushes up"

3. 合意形成
   - **Decision Type**: `consensus`
   - **Approved by**: 5 players
   - **Channel**: `discussion`

4. 監督に提案
   - **Decision Type**: `suggestion`
   - **From**: captain → coach

**GitHub Timeline**:
```
Discussion #7: Halftime Review - Team A
  ├─ player-07-team-a: "Press higher second half?"
  ├─ player-10-team-a: "👍 Yes but manage energy"
  ├─ player-09-team-a: "I'll make more runs"
  ├─ player-06-team-a: "Support from midfield"
  ├─ player-04-team-a: "Defense stays compact"
  └─ Consensus: Press higher in second half
      → Suggested to coach via PR #15
```

---

### Example 3: 審判の裁定 (Ruling)

**Situation**: 45分、タックルがファウルかどうか

**Flow**:
1. Player #7 がタックル
   - **Decision Type**: `autonomous`
   - **Action**: Tackle attempt

2. 審判が判定
   - **Decision Type**: `ruling`
   - **Channel**: `broadcast`
   - **Action**: Foul + Yellow Card

3. GitHub記録
   - **Issue #25**: "🟨 Yellow Card: Player #7 - Tactical Foul"
   - **Commit**: Foul recorded with decision metadata

**Hyper Real Event**:
```json
{
  "timestamp": "2025-11-24T10:45:30.123Z",
  "frame": 2700,
  "matchTime": "45:00",
  "action": {
    "type": "foul",
    "agent": "player-07-team-b",
    "target": "player-10-team-a",
    "result": "success"
  },
  "decision": {
    "type": "ruling",
    "from": "referee-main",
    "to": ["player-07-team-b"],
    "channel": "broadcast",
    "github": {
      "issueNumber": 25
    },
    "reasoning": "Tactical foul to stop counter-attack, no attempt to play ball",
    "priority": "critical"
  }
}
```

---

## Communication Graph Analysis

すべてのdecisionメタデータを集計することで、組織のコミュニケーショングラフが可視化できます：

### Node Types
- **Coaches** (decision makers)
- **Players** (executors + collaborators)
- **Referee** (authority)
- **Commentators** (observers)

### Edge Types
- **Command** (太い矢印: →)
- **Suggestion** (破線矢印: ⇢)
- **Consensus** (双方向: ⇄)
- **Ruling** (赤い矢印: ⚠→)

### Metrics
- **Command Density**: 監督からの指示頻度
- **Consensus Rate**: 選手間の合意形成割合
- **Autonomous Ratio**: 自己判断の割合
- **Suggestion Acceptance**: 提案の承認率

---

## Implementation in Match Engine

試合エンジンは、すべてのアクションに対してdecisionメタデータを自動付与：

```typescript
async function executeAction(agent: Agent, action: Action) {
  const decision = await determineDecisionType(agent, action);

  const event: HyperRealEvent = {
    timestamp: new Date().toISOString(),
    frame: currentFrame,
    matchTime: getMatchTime(),
    space: {
      physical: agent.position,
      logical: `matches/current/actions/${action.type}-${currentFrame}.json`
    },
    action: action,
    decision: decision,  // ← Decision metadata
    git: {
      commit: await createCommit(event),
      branch: 'match/current'
    }
  };

  await recordEvent(event);
  await createGitHubArtifacts(event);  // Issues, PRs, Discussions
}
```

---

**これで、試合の「組織としての動き」が完全に記録されます。** 🎯
