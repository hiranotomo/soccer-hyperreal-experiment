# 🚀 実際の試合を実行してGitHub Issueを作成

## ステップ1: GitHub Personal Access Tokenを取得

1. https://github.com/settings/tokens にアクセス
2. "Generate new token" → "Generate new token (classic)"
3. 以下の権限を選択：
   - ✅ `repo` (フルアクセス)
   - ✅ `write:discussion`
4. "Generate token" をクリック
5. トークンをコピー（`ghp_xxxxxxxxxxxxx` の形式）

## ステップ2: 環境変数を設定

```bash
cd /Users/hirano/_MyDev/soccer-hyperreal-experiment

# GITHUB_TOKENを設定（あなたのトークンに置き換えてください）
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## ステップ3: 試合を実行

```bash
npm run match:quick
```

## 何が起こるか

試合中にゴールが決まると：
```
[0:01] ⚽ GOAL: player-02-team-a - success
   📝 GitHub Issue #1 created for goal
```

ファウルが起こると：
```
[0:15] 🟨 FOUL: player-01-team-b - yellow card
   📝 GitHub Issue #2 created for foul
```

## 確認方法

https://github.com/hiranotomo/soccer-hyperreal-experiment/issues

**実際のIssueが作成されているはずです！**

---

## トラブルシューティング

### Issue が作成されない場合

1. **GITHUB_TOKENが設定されているか確認**
   ```bash
   echo $GITHUB_TOKEN
   # → ghp_xxx... が表示されるはず
   ```

2. **トークンの権限を確認**
   - `repo` 権限が必要です

3. **ゴールが決まらなかった**
   - もう一度実行してください（ランダムなので）
   ```bash
   npm run match:quick
   ```

### エラー: "Bad credentials"

トークンが間違っています。新しいトークンを作成してください。

### エラー: "Resource not accessible"

トークンに `repo` 権限がありません。権限を追加してください。

---

## 今すぐ試す！

```bash
cd /Users/hirano/_MyDev/soccer-hyperreal-experiment
export GITHUB_TOKEN="your_token_here"
npm run match:quick
```

**これで実際のGitHub Issueが作成されます！** 🎉
