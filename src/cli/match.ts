#!/usr/bin/env node
/**
 * Match CLI - Run a soccer match simulation
 *
 * Usage:
 *   npm run match
 *   npm run match -- --duration=180 --fps=2
 */

import { MatchEngine } from '../engine/match-engine.js';

interface CLIArgs {
  teamA?: string;
  teamB?: string;
  duration?: number;
  fps?: number;
}

function parseArgs(): CLIArgs {
  const args: CLIArgs = {};

  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      if (key === 'teamA') args.teamA = value;
      if (key === 'teamB') args.teamB = value;
      if (key === 'duration') args.duration = parseInt(value, 10);
      if (key === 'fps') args.fps = parseInt(value, 10);
    }
  });

  return args;
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('⚽ SOCCER HYPER REAL EXPERIMENT');
  console.log('   AI-Driven Match Simulation');
  console.log('   GitHub as Stadium');
  console.log('='.repeat(60) + '\n');

  const args = parseArgs();

  const config = {
    teamA: args.teamA || 'Team Alpha',
    teamB: args.teamB || 'Team Beta',
    duration: args.duration || 180, // 180 frames = 3 min match (for quick test)
    framesPerSecond: args.fps || 1,
  };

  console.log('📋 Match Configuration:');
  console.log(`   Team A: ${config.teamA}`);
  console.log(`   Team B: ${config.teamB}`);
  console.log(`   Duration: ${config.duration} frames (${config.duration / 60} minutes)`);
  console.log(`   FPS: ${config.framesPerSecond}`);
  console.log('');

  const engine = new MatchEngine(config);

  try {
    await engine.runMatch();

    console.log('\n' + '='.repeat(60));
    console.log('📊 MATCH STATISTICS');
    console.log('='.repeat(60));

    const events = engine.getEvents();
    const state = engine.getMatchState();

    const passes = events.filter(e => e.action.type === 'pass');
    const shots = events.filter(e => e.action.type === 'shot');
    const goals = events.filter(e => e.action.type === 'goal');
    const tackles = events.filter(e => e.action.type === 'tackle');

    const passSuccess = passes.filter(e => e.action.result === 'success').length;
    const shotSuccess = shots.filter(e => e.action.result === 'success').length;
    const tackleSuccess = tackles.filter(e => e.action.result === 'success').length;

    console.log(`\n🎯 Event Summary:`);
    console.log(`   Total Events: ${events.length}`);
    console.log(`   Passes: ${passes.length} (${passSuccess} successful, ${((passSuccess/passes.length)*100).toFixed(1)}%)`);
    console.log(`   Shots: ${shots.length} (${shotSuccess} on target)`);
    console.log(`   Goals: ${goals.length}`);
    console.log(`   Tackles: ${tackles.length} (${tackleSuccess} successful, ${((tackleSuccess/tackles.length)*100).toFixed(1)}%)`);

    console.log(`\n⚽ Final Score:`);
    console.log(`   ${config.teamA}: ${state.score.teamA}`);
    console.log(`   ${config.teamB}: ${state.score.teamB}`);

    console.log(`\n🏃 Player Stamina:`);
    state.players.forEach(player => {
      console.log(`   ${player.id}: ${player.stamina.toFixed(1)}%`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ Match simulation complete!');
    console.log('');
    console.log('Next steps:');
    console.log('  - Events are recorded in Hyper Real format');
    console.log('  - In full version, these would:');
    console.log('    • Create Git commits for each action');
    console.log('    • Create GitHub Issues for goals/fouls');
    console.log('    • Generate match timeline files');
    console.log('    • Update GitHub Projects dashboard');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error running match:', error);
    process.exit(1);
  }
}

main();
