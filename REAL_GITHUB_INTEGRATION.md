# 🚀 Real GitHub Integration

## これが本物です

試合中に**実際のGitHub Issue**が自動作成されます。

---

## セットアップ

### 1. GitHub Personal Access Token を作成

https://github.com/settings/tokens

**必要な権限**:
- `repo` (フルアクセス)
- `write:discussion` (Discussions作成)

### 2. 環境変数を設定

```bash
export GITHUB_TOKEN="your_github_token_here"
```

または `.env` ファイルを作成：

```bash
# .env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx
```

### 3. 試合を実行

```bash
cd /Users/hirano/_MyDev/soccer-hyperreal-experiment
export GITHUB_TOKEN="your_token"
npm run match:quick
```

---

## 何が起こるか

### ⚽ ゴールが決まると...

**リアルタイムで GitHub Issue が作成されます！**

```
[0:01] ⚽ GOAL: player-02-team-a - success
   📝 GitHub Issue #15 created for goal
```

**実際のIssue**:
- Title: `⚽ GOAL: player-02-team-a (Team A) - 0:01`
- Labels: `goal`, `match-event`, `team-a`
- Body: 完全な Hyper Real データ + 位置情報 + 意思決定メタデータ

**確認方法**:
https://github.com/hiranotomo/soccer-hyperreal-experiment/issues

---

## 試合後の確認

試合が終わると、GitHubに以下が記録されています：

### **Issues**
- ゴールごとに1つのIssue
- フォールごとに1つのIssue（実装予定）
- 戦術問題ごとに1つのIssue（実装予定）

### **すべてのIssueに含まれる情報**
- ⏰ タイムスタンプ（絶対時間 + 試合時間）
- 📍 フィールド上の位置（x, y, z座標）
- 🤖 エージェントID
- 🧠 意思決定メタデータ（なぜその行動をしたか）
- 📊 完全なHyper Realイベントデータ（JSON）

---

## 次に追加される機能

### **Phase 2.2: Pull Requests**
監督が戦術変更を提案すると、**実際のPR**が作成されます：

```
[30:00] 🎯 TACTICAL CHANGE: coach-team-a
   📝 GitHub PR #20 created: "Switch to 4-5-1 formation"
```

### **Phase 2.3: Discussions**
選手がハーフタイムに議論すると、**実際のDiscussion**が作成されます：

```
[45:00] 💬 TEAM DISCUSSION: player-07-team-a
   📝 GitHub Discussion created: "Halftime Review - Team A"
```

### **Phase 2.4: Git Commits**
すべてのアクション（パス、シュート）が**実際のGitコミット**になります：

```
[0:05] 🦶 PASS: player-01-team-a - success
   📝 Git commit: abc123d "🦶 PASS: player-01 → player-02"
```

---

## トラブルシューティング

### エラー: `GITHUB_TOKEN is required`

環境変数が設定されていません：

```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

### エラー: `Bad credentials`

トークンが無効です。新しいトークンを作成してください。

### エラー: `Resource not accessible by integration`

トークンに十分な権限がありません。`repo` 権限を追加してください。

### Issue が作成されない

ゴールが決まらなかった可能性があります。もう一度試合を実行してください：

```bash
npm run match:quick
```

---

## デモ実行

**GITHUB_TOKEN なし** （ローカルテスト）:
```bash
npm run match:quick
# → GitHubには何も作成されない（通常の試合シミュレーション）
```

**GITHUB_TOKEN あり** （本物の統合）:
```bash
export GITHUB_TOKEN="ghp_xxxxx"
npm run match:quick
# → ゴールごとにGitHub Issueが実際に作成される！
```

---

## 現在の実装状況

| 機能 | 状態 |
|------|------|
| ⚽ ゴール → GitHub Issue | ✅ 実装済み |
| 🟨 ファウル/カード → GitHub Issue | 🔜 次 |
| 🎯 戦術変更 → GitHub PR | 🔜 Phase 2.2 |
| 💬 チーム議論 → GitHub Discussion | 🔜 Phase 2.3 |
| 🦶 アクション → Git Commit | 🔜 Phase 2.4 |

---

## これの意味

**GitHub空間がサッカーチーム組織そのものになります。**

- Issues = イベント記録
- PRs = 意思決定プロセス
- Discussions = チームコミュニケーション
- Commits = 個々のアクション
- Repository = 生きた組織空間

**Hyper Real × GitHub = 現実の完全な記録**

---

## 次のステップ

1. ✅ GITHUB_TOKEN を設定
2. ✅ 試合を実行
3. ✅ GitHub Issues を確認
4. 🔜 Phase 2.2 で PR/Discussions を追加

**これが TeleportOS/HumanityOS の始まりです。** 🚀
