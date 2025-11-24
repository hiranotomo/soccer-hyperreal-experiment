# Git Branching Strategy - Soccer Philosophy

This repository uses a branching strategy inspired by how soccer teams operate.

## Branch Structure

### 🏆 `main` - The Real Match
- **Purpose**: Official match timeline - the "reality"
- **Protection**: Protected branch, requires PR approval
- **Merges**: Only approved tactical changes and substitutions
- **History**: Complete record of the actual match
- **Commits**: Every action (pass, shot, tackle) during the match

### 🎯 `match/<match-id>` - Individual Match Branches
- **Purpose**: Each match gets its own branch
- **Format**: `match/2025-11-24-team-a-vs-team-b`
- **Lifecycle**: Created at kickoff, merged to `main` after match completion
- **Contains**: Full match timeline, all events

### 🧠 `tactical-simulation/<scenario>` - What-If Scenarios
- **Purpose**: Test tactical changes without affecting the real match
- **Examples**:
  - `tactical-simulation/4-3-3-to-3-5-2`
  - `tactical-simulation/high-press-vs-possession`
  - `tactical-simulation/player-10-injury-scenario`
- **Use**: Coaches create these to simulate tactical adjustments
- **Merging**: Never merged to `main` - used for analysis only
- **PR**: Can propose merging to match branch if simulation successful

### 🏋️ `training/<session-type>` - Training & Practice
- **Purpose**: Non-match activities
- **Examples**:
  - `training/set-pieces-practice`
  - `training/fitness-drills`
  - `training/formation-practice`
- **Use**: Develop tactics, test player combinations
- **Merging**: Successful tactics can be PRed to match branches

### ⚙️ `develop` - System Development
- **Purpose**: Non-soccer technical development
- **Use**: Engine improvements, bug fixes, new features
- **Merging**: Only for system changes, not match content

### 🔧 `feature/<feature-name>` - New Capabilities
- **Purpose**: Add new agent types, mechanics, rules
- **Examples**:
  - `feature/var-system`
  - `feature/weather-effects`
  - `feature/injury-simulation`

### 🐛 `bugfix/<issue-number>` - Fixes
- **Purpose**: Fix broken mechanics, incorrect rules
- **Merging**: Fast-track to `develop`, then to active matches if critical

## Branch Lifecycle

### Starting a Match
```bash
# Create match branch from main
git checkout main
git checkout -b match/2025-11-24-team-a-vs-team-b

# Initialize match
npm run match:init --teams="Team A,Team B"

# Push match branch
git push -u origin match/2025-11-24-team-a-vs-team-b
```

### Tactical Simulation (What-If)
```bash
# Branch from current match state
git checkout match/2025-11-24-team-a-vs-team-b
git checkout -b tactical-simulation/switch-to-4-3-3

# Run simulation
npm run match:simulate --tactics="4-3-3"

# Analyze results (never merge to main)
```

### Proposing Tactical Change (PR)
```bash
# From simulation or direct change
git checkout -b tactical/halftime-formation-change

# Modify tactics files
vim tactics/formation.json

# Commit change
git add tactics/
git commit -m "🎯 Tactical Change: 4-4-2 → 4-3-3 at halftime"

# Create PR
gh pr create --title "Tactical Change: Switch to 4-3-3" \
             --template tactical_change.md \
             --base match/2025-11-24-team-a-vs-team-b

# Coaches review PR
# If approved & merged → tactics applied in match
```

### Completing a Match
```bash
# After final whistle
git checkout match/2025-11-24-team-a-vs-team-b

# Finalize match
npm run match:finalize

# Create PR to merge into main
gh pr create --title "Match Complete: Team A vs Team B (2-1)" \
             --body "Final score, all events recorded" \
             --base main

# After approval, merge to main
# Match becomes permanent history
```

## Merge Rules

| From | To | Requires | Auto-merge? |
|------|----|---------| ------------|
| `tactical/*` | `match/*` | Coach approval | ✅ Yes (if 2+ approvals) |
| `match/*` | `main` | Match completion | ❌ Manual only |
| `tactical-simulation/*` | Anywhere | N/A | ❌ Never merged |
| `training/*` | `match/*` | Coach review | ✅ Yes (if approved) |
| `feature/*` | `develop` | Code review | ✅ Yes (CI passes) |
| `develop` | `main` | Full testing | ❌ Manual only |

## Commit Message Convention

### Match Actions
```
⚽ GOAL: Player #10 (Team A) - 23:45
🎯 SHOT: Player #9 (Team B) - saved
🦶 PASS: Player #7 → Player #10 (Team A) - successful
🛡️ TACKLE: Player #5 (Team B) - won ball
🟨 YELLOW CARD: Player #3 (Team A) - tactical foul
🔄 SUBSTITUTION: Player #10 OUT, Player #15 IN (Team A)
```

### Tactical Changes
```
🎯 Tactical Change: 4-4-2 → 4-3-3
🔀 Formation Adjustment: Push fullbacks higher
📋 Set Piece Update: New corner routine
```

### System Changes
```
✨ Feature: Add VAR system
🐛 Fix: Ball physics calculation error
📝 Docs: Update team roster
```

## Philosophy

This branching model reflects how soccer teams actually operate:

- **Main branch = Reality**: What actually happened in official matches
- **Match branches = Games**: Each game is a contained timeline
- **Simulations = Training Ground**: Test ideas without consequences
- **PRs = Tactical Meetings**: Propose, discuss, approve changes
- **Commits = Actions**: Every meaningful event is recorded

---

**The field is the repository. The match is the history. The tactics are the code.**
