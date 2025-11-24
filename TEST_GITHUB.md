# 📝 GitHub統合テスト - すぐに実行できます

## 🚀 今すぐ試す（3ステップ）

### ステップ1: GitHubトークンを取得

1. https://github.com/settings/tokens/new にアクセス
2. Note: `soccer-hyperreal-test`
3. 権限を選択:
   - ✅ `repo` (すべて)
   - ✅ `write:discussion`
4. "Generate token" をクリック
5. トークンをコピー（`ghp_xxxxx...`）

### ステップ2: トークンを設定して試合を実行

```bash
cd /Users/hirano/_MyDev/soccer-hyperreal-experiment

# トークンを設定（あなたのトークンに置き換え）
export GITHUB_TOKEN="ghp_ここにあなたのトークン"

# 短い試合を実行（30秒）
npm run match:quick
```

### ステップ3: GitHubで確認

実行中にリアルタイムで以下が作成されます:

**Issues（ゴールとファウル）:**
https://github.com/hiranotomo/soccer-hyperreal-experiment/issues

**Pull Requests（戦術変更）:**
https://github.com/hiranotomo/soccer-hyperreal-experiment/pulls

**Discussions（ハーフタイム・試合後）:**
https://github.com/hiranotomo/soccer-hyperreal-experiment/discussions

---

## 📊 何が起こるか

### 試合開始
```
⚽ Match Starting: Team Alpha vs Team Beta

[0:01] 🦶 PASS: player-01-team-a - success
[0:03] ⚽ GOAL: player-02-team-a - success
   📝 GitHub Issue #1 created for goal
```

### コーチの分析
```
🎯 Coach Team Alpha proposes: formation_change
   Reasoning: We've conceded 2 goals. Need defensive reinforcement.
   📝 GitHub PR #1 created for tactical change
```

### ハーフタイム
```
⏸️  HALFTIME: Team Alpha 2 - 2 Team Beta

💬 Creating halftime discussions...
   💬 GitHub Discussion created: https://github.com/.../discussions/1
```

### 試合終了
```
🏁 FULL TIME: Team Alpha 3 - 2 Team Beta
📊 Total Events: 45
⚽ Goals: 5

💬 Creating post-match discussions...
   💬 GitHub Discussion created: https://github.com/.../discussions/2
   💬 GitHub Discussion created: https://github.com/.../discussions/3

📤 Pushing all commits to GitHub...
   ✅ Commits pushed successfully
```

---

## ⚙️ 実装済み機能

### ✅ GitHub Issues
- ゴール時に自動作成
- ファウル時に自動作成（イエローカード・レッドカード付き）
- Hyper Real完全記録（位置、時間、決定理由）
- ラベル自動付与（`goal`, `foul`, `team-a`, `team-b`）

### ✅ GitHub Pull Requests
- コーチが15フレームごとに分析
- 戦術変更が必要な場合にPR自動作成
- 実際のGitブランチ作成
- 戦術ファイル（JSON）をコミット

### ✅ GitHub Discussions
- ハーフタイムに両チームのディスカッション作成
- 試合後に両チームの分析ディスカッション作成
- 統計、重要イベント、議論ポイント含む

### ✅ Git Commits（オプション）
- 全アクションをGitコミットとして記録
- 環境変数 `ENABLE_GIT_COMMITS=true` で有効化

---

## 🔧 トラブルシューティング

### "GITHUB_TOKEN is required"
```bash
# トークンが設定されているか確認
echo $GITHUB_TOKEN

# 設定されていない場合
export GITHUB_TOKEN="ghp_your_token_here"
```

### "Bad credentials"
トークンが間違っています。新しいトークンを作成してください。

### "Resource not accessible"
トークンに `repo` と `write:discussion` 権限がありません。

### Discussionが作成されない
GitHub Discussionsがリポジトリで有効になっているか確認:
1. https://github.com/hiranotomo/soccer-hyperreal-experiment/settings
2. "Features" セクション
3. "Discussions" にチェックを入れる

---

## 🎯 確認すべきこと

実行後、以下を確認してください:

1. **Issues**: ゴールとファウルが記録されているか
2. **Pull Requests**: コーチの戦術変更提案があるか
3. **Discussions**: ハーフタイムと試合後の議論があるか
4. **Commits**: （有効化した場合）全アクションがコミットされているか

---

## 💡 次のコマンド

```bash
# 短い試合（30秒、60フレーム）
npm run match:quick

# 通常の試合（90分相当、5400フレーム）
npm run match:full

# Gitコミット有効化
export ENABLE_GIT_COMMITS=true
npm run match:quick
```

---

**今すぐ実行してください！実際のGitHub Issueが作成されます！** 🎉
