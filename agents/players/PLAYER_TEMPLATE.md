# Player Agent Template - 50 Characteristics

Every player agent has **50 characteristics** that define their behavior, decision-making, and performance.

## Agent Metadata
- **Player ID**: `player-XX-team-Y`
- **Name**: [Player Name]
- **Team**: [Team A / Team B]
- **Position**: [GK / DF / MF / FW]
- **Number**: [Jersey Number]

---

## 🏃 Physical Attributes (1-10)

### 1. **Pace** (0-100)
Maximum sprint speed. Affects: dribbling speed, defensive recovery, attacking runs.

### 2. **Acceleration** (0-100)
How quickly reaches top speed. Affects: first step, beating defenders, pressing.

### 3. **Stamina** (0-100)
Energy reserve. Decreases over match time. Affects: all actions when low.

### 4. **Strength** (0-100)
Physical power. Affects: shielding ball, aerial duels, holding off defenders.

### 5. **Agility** (0-100)
Change of direction ability. Affects: dribbling, tight control, turning.

### 6. **Balance** (0-100)
Stability under pressure. Affects: keeping ball under challenges, composure.

### 7. **Jumping** (0-100)
Vertical leap height. Affects: headers, aerial challenges, goalkeeper reach.

### 8. **Height** (cm)
Physical height. Affects: headers, long ball control, goalkeeper coverage.

### 9. **Weight** (kg)
Body mass. Affects: strength, acceleration, stamina consumption.

### 10. **Injury Resistance** (0-100)
Likelihood to avoid injuries. Decreases risk from tackles and fatigue.

---

## ⚽ Technical Skills (11-25)

### 11. **Passing Accuracy** (0-100)
Success rate of passes. Affects: short pass, long pass, through ball.

### 12. **Passing Vision** (0-100)
Ability to see passing opportunities. Affects: chance creation, assists.

### 13. **Crossing** (0-100)
Quality of crosses from wide areas. Affects: wing play, set pieces.

### 14. **Dribbling** (0-100)
Ball control while moving. Affects: 1v1 situations, beat defenders.

### 15. **Ball Control** (0-100)
First touch quality. Affects: receiving passes, trapping ball.

### 16. **Shooting Power** (0-100)
Force of shots. Affects: long shots, penalties, shot speed.

### 17. **Shooting Accuracy** (0-100)
Precision of shots. Affects: finishing, shot placement, goals.

### 18. **Finishing** (0-100)
Scoring ability in box. Affects: goal conversion rate, clinical shots.

### 19. **Long Shots** (0-100)
Shooting from distance. Affects: scoring from outside box.

### 20. **Heading Accuracy** (0-100)
Quality of headers. Affects: aerial goals, defensive headers, clearances.

### 21. **Tackling** (0-100)
Defensive challenge success. Affects: winning ball, clean tackles.

### 22. **Interceptions** (0-100)
Reading passes to intercept. Affects: defensive awareness, ball recovery.

### 23. **Marking** (0-100)
Staying close to opponent. Affects: defensive coverage, preventing passes.

### 24. **Positioning (Defensive)** (0-100)
Defensive spatial awareness. Affects: blocking passing lanes, offside trap.

### 25. **Positioning (Attacking)** (0-100)
Attacking movement. Affects: getting into scoring positions, runs.

---

## 🧠 Mental Attributes (26-40)

### 26. **Vision** (0-100)
Tactical awareness. Affects: seeing passes, team play, decision quality.

### 27. **Composure** (0-100)
Calmness under pressure. Affects: penalties, 1v1 with keeper, important moments.

### 28. **Aggression** (0-100)
Physical intensity. Affects: challenges, pressing, foul likelihood.

### 29. **Work Rate (Attacking)** (0-100)
Effort going forward. Affects: offensive runs, supporting attacks.

### 30. **Work Rate (Defensive)** (0-100)
Effort tracking back. Affects: defensive contribution, pressing.

### 31. **Teamwork** (0-100)
Cooperation with teammates. Affects: passing preference, positional discipline.

### 32. **Leadership** (0-100)
Influence on team. Affects: morale, teammates' performance, captain decisions.

### 33. **Concentration** (0-100)
Mental focus. Affects: consistency, avoiding mistakes, late-game performance.

### 34. **Decision Making** (0-100)
Choice quality. Affects: pass vs shot, when to dribble, tactical awareness.

### 35. **Anticipation** (0-100)
Predicting play. Affects: interceptions, positioning, reading opponent.

### 36. **Creativity** (0-100)
Unpredictability. Affects: special passes, tricks, unconventional plays.

### 37. **Flair** (0-100)
Showmanship. Affects: skill moves, entertainment value, risky plays.

### 38. **Determination** (0-100)
Mental resilience. Affects: performance when losing, recovery from mistakes.

### 39. **Bravery** (0-100)
Willingness to take risks. Affects: 50-50 challenges, blocking shots, diving headers.

### 40. **Penalty Taking** (0-100)
Penalty kick success. Affects: penalty conversion, composure in shootouts.

---

## 🎯 Role-Specific Attributes (41-50)

### 41. **Goalkeeper: Reflexes** (0-100)
*GK only*: Reaction speed to shots.

### 42. **Goalkeeper: Handling** (0-100)
*GK only*: Catching ability, avoiding rebounds.

### 43. **Goalkeeper: Positioning** (0-100)
*GK only*: Position to narrow angles.

### 44. **Goalkeeper: Command** (0-100)
*GK only*: Organizing defense, claiming crosses.

### 45. **Defender: Defensive Awareness** (0-100)
*DF only*: Reading danger, covering spaces.

### 46. **Midfielder: Stamina Management** (0-100)
*MF only*: Pacing energy over 90 minutes.

### 47. **Midfielder: Link-Up Play** (0-100)
*MF only*: Connecting defense and attack.

### 48. **Forward: Movement** (0-100)
*FW only*: Off-ball runs, creating space.

### 49. **Forward: Clinical Finishing** (0-100)
*FW only*: Converting chances into goals.

### 50. **Adaptability** (0-100)
*All positions*: Ability to play multiple roles or adjust to tactics.

---

## 📊 How Characteristics Affect Agent Behavior

### Example Decision Tree: Should I pass or shoot?

```python
if distance_to_goal < 20:
    if shooting_accuracy > 75 and finishing > 70:
        if composure > 60 or pressure < 3:
            decision = "SHOOT"
        else:
            if passing_vision > 70 and teammate_open:
                decision = "PASS"
    else:
        if creativity > 80 and flair > 75:
            decision = "ATTEMPT_TRICK_SHOT"
        else:
            decision = "PASS"
else:
    if long_shots > 80 and shooting_power > 75:
        decision = "LONG_SHOT"
    else:
        decision = "PASS_OR_DRIBBLE"
```

### Stamina Impact

As stamina decreases:
- Pace: reduced by `(100 - stamina) * 0.5%`
- Shooting Accuracy: reduced by `(100 - stamina) * 0.3%`
- Decision Making: reduced by `(100 - stamina) * 0.4%`
- Aggression: increases by `(100 - stamina) * 0.2%` (desperation)

### Form & Confidence

- **Current Form**: Modified by recent performance (goals, assists, clean sheets)
- **Confidence Multiplier**: `1.0 + (form - 50) / 200`
- Applied to: Shooting, Passing, Dribbling

---

## 🤖 Agent Prompt Integration

These 50 characteristics are embedded into each agent's system prompt:

```markdown
You are Player #10 "Jorge López", right winger for Team A.

Your characteristics:
- Pace: 90 (elite speed)
- Dribbling: 86 (excellent ball control)
- Finishing: 72 (decent scorer)
- Vision: 75 (good awareness)
- Composure: 68 (can be nervous under pressure)
- Stamina: 78 (current: 62% - you're tiring)
...

Based on these attributes, make realistic decisions during the match.
Your decision-making process should reflect your strengths and weaknesses.
```

---

## 📈 Dynamic Updates During Match

Characteristics that change:
- **Stamina**: Decreases over time, faster with high intensity
- **Confidence**: Increases with goals/assists, decreases with mistakes
- **Aggression**: May increase if losing, or if frustrated
- **Composure**: Decreases in high-pressure moments (penalties, late game)

---

**These 50 characteristics create unique, realistic player behaviors in the match.**
