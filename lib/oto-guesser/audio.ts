// lib/oto-guesser/audio.ts

// AudioContextは生成コストが高いため、使い回す（シングルトン）
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // タブを長時間放置すると自動でsuspendされることがあるため、再開しておく
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * 指定した周波数のサイン波を鳴らす。
 * ユーザーのクリック等、操作のタイミングで呼び出すこと（ブラウザの自動再生制限のため）。
 */
export function playTone(freq: number, duration = 1.2): void {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.connect(gain).connect(ctx.destination);

  // クリックノイズを防ぐためのフェードイン・フェードアウト
  const now = ctx.currentTime;
  const attack = 0.02;
  const release = 0.08;
  const peakGain = 0.25;

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peakGain, now + attack);
  gain.gain.setValueAtTime(peakGain, now + duration - release);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  osc.start(now);
  osc.stop(now + duration);
}
