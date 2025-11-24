# 🚀 クイックスタートガイド

## 1️⃣ 今すぐ試合を実行

ターミナルを開いて、以下を実行してください：

```bash
# プロジェクトディレクトリに移動
cd /Users/hirano/_MyDev/soccer-hyperreal-experiment

# クイック試合を実行（1分間）
npm run match:quick
```

**これだけです！** 試合が始まります。

---

## 2️⃣ 試合の種類

### **クイック試合（1分）** - おすすめ！
```bash
npm run match:quick
```
- 所要時間: 約10秒
- 60フレーム（30秒相当）
- 動作確認に最適

### **標準試合（3分）**
```bash
npm run match
```
- 所要時間: 約30秒
- 180フレーム（3分相当）
- バランスの良いテスト

### **フル試合（90分シミュレーション）**
```bash
npm run match:full
```
- 所要時間: 約90秒
- 5400フレーム（90分相当）
- 本格的な試合

---

## 3️⃣ カスタム試合

チーム名や試合時間を変更できます：

```bash
npm run match -- --teamA="レアル・マドリード" --teamB="バルセロナ" --duration=300
```

**パラメータ**:
- `--teamA`: チームAの名前
- `--teamB`: チームBの名前
- `--duration`: フレーム数（60 = 1分, 180 = 3分, 5400 = 90分）
- `--fps`: フレームレート（1 = 毎秒1フレーム, 2 = 毎秒2フレーム）

---

## 4️⃣ 試合の見方

試合を実行すると、以下のような出力が表示されます：

```
============================================================
⚽ SOCCER HYPER REAL EXPERIMENT
   AI-Driven Match Simulation
   GitHub as Stadium
============================================================

📋 Match Configuration:
   Team A: Team Alpha
   Team B: Team Beta
   Duration: 60 frames (1 minutes)
   FPS: 2

⚽ Match Starting: Team Alpha vs Team Beta

[0:00] 🦶 PASS: player-01-team-a - success
[0:01] ⚽ GOAL: player-02-team-a - success
[0:02] 🛡️ TACKLE: player-01-team-b - failed
...

⏸️  HALFTIME: Team Alpha 2 - 2 Team Beta

...

🏁 FULL TIME: Team Alpha 5 - 3 Team Beta

📊 Total Events: 52
⚽ Goals: 8
```

### **表示の意味**

| 絵文字 | 意味 |
|--------|------|
| 🦶 | パス |
| ⚽ | ゴール |
| 🎯 | シュート |
| 🛡️ | タックル |
| ⏸️ | ハーフタイム |
| 🏁 | 試合終了 |

---

## 5️⃣ 記録の確認

試合後、以下が記録されています：

### **コンソール出力**
```
📊 MATCH STATISTICS
==================

🎯 Event Summary:
   Total Events: 52
   Passes: 24 (21 successful, 87.5%)
   Shots: 8
   Goals: 8
   Tackles: 12 (4 successful, 33.3%)

⚽ Final Score:
   Team Alpha: 5
   Team Beta: 3

🏃 Player Stamina:
   player-01-team-a: 99.4%
   player-02-team-a: 99.4%
   player-01-team-b: 99.4%
   player-02-team-b: 99.4%
```

### **今後の機能（Phase 2で実装予定）**
- ✅ GitHubにIssue作成（ゴール、ファウルなど）
- ✅ Git commitとして各アクションを記録
- ✅ 試合タイムラインをJSONファイルに保存
- ✅ ダッシュボードで可視化

---

## 6️⃣ トラブルシューティング

### **エラー: `npm: command not found`**

Node.jsがインストールされていません。

```bash
# Homebrewでインストール（推奨）
brew install node

# 確認
node --version
npm --version
```

### **エラー: `Cannot find module`**

依存関係が足りません。

```bash
cd /Users/hirano/_MyDev/soccer-hyperreal-experiment
npm install
```

### **エラー: TypeScriptエラー**

問題ありません。試合は実行できます。

```bash
# 無視して実行
npm run match:quick
```

---

## 7️⃣ 次のステップ

### **今できること**
1. ✅ クイック試合を何度も実行
2. ✅ チーム名を変更して実行
3. ✅ 試合時間を変えて実行

### **これから追加される機能（Phase 2）**
- 🔜 本物のAIエージェント（Claude）が意思決定
- 🔜 GitHubに自動でIssue/PR作成
- 🔜 11v11フル試合
- 🔜 リアルタイムダッシュボード

---

## 8️⃣ さらに詳しく知りたい

### **ドキュメント**
- `README.md` - プロジェクト概要
- `IMPLEMENTATION_SUMMARY.md` - 完全な実装サマリー
- `docs/COMMUNICATION_FLOW.md` - 意思決定の仕組み
- `docs/EXAMPLE_SCENARIO.md` - 実例シナリオ

### **GitHub**
https://github.com/hiranotomo/soccer-hyperreal-experiment

---

## ❓ よくある質問

### **Q: これは何をするプロジェクト？**
A: サッカーの試合をAIエージェントがシミュレートし、すべてのアクション（パス、シュート、ゴール）をGitHub上に記録します。試合の意思決定（監督の指示、選手の判断など）もすべて記録されます。

### **Q: 今の状態で何ができる？**
A: 簡易的な2v2の試合シミュレーションを実行できます。パス、シュート、ゴール、タックルがランダムに発生し、スコアが記録されます。

### **Q: 次は何を作る？**
A: Phase 2で本物のAIエージェント（Claude）を組み込み、選手や監督が実際に考えて行動するようにします。また、GitHubに自動でIssue/PRを作成します。

### **Q: 実用性は？**
A: これはTeleportOS/HumanityOSの概念実証です。「現実をGitのように記録・管理できる」という未来のOSのプロトタイプです。

---

## 🎯 今すぐ試す！

```bash
cd /Users/hirano/_MyDev/soccer-hyperreal-experiment
npm run match:quick
```

**楽しんでください！** ⚽🚀
