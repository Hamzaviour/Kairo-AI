"""Original soundtrack + SFX for the Kairo brag video, synthesized with numpy.

112.5 BPM so the reveal (3.2 s) lands exactly on beat 6; Am-F-C-G in A minor.
SFX are pitched to the same key and share the music's reverb so they sit inside the mix.
"""
import sys
import wave
import numpy as np

SR = 48000
DUR = 20.0
BEAT = 60 / 112.5
N = int(SR * DUR)
rng = np.random.default_rng(7)


def t_axis(sec):
    return np.arange(int(SR * sec)) / SR


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def add(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    buf[i:i + len(sig)] += sig * gain


def env(n, attack, decay_tau):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-t / decay_tau)


def lowpass(x, cutoff):
    # one-pole low-pass, fine for taming synth edges
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def kick():
    t = t_axis(0.35)
    f = 45 + 75 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 11)


def hat():
    n = int(SR * 0.05)
    x = rng.standard_normal(n)
    x = x - lowpass(x, 6000)  # keep the top end only
    return x * env(n, 0.001, 0.012)


def pluck_bass(midi, length):
    t = t_axis(length)
    f = hz(midi)
    sig = sum(np.sin(2 * np.pi * f * k * t) / k for k in (1, 2, 3))
    return lowpass(sig * np.exp(-t * 6), 900)


def pad(midis, length):
    t = t_axis(length)
    sig = np.zeros_like(t)
    for m in midis:
        f = hz(m)
        for det in (-0.12, 0.12):
            sig += np.sin(2 * np.pi * f * (1 + det / 100) * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    a = np.clip(t / 0.35, 0, 1) * np.clip((length - t) / 0.4, 0, 1)
    return lowpass(sig * a / (len(midis) * 2), 1800)


def blip(midi, length=0.18, tau=0.05):
    t = t_axis(length)
    f = hz(midi)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * env(len(t), 0.002, tau)


def thunk(midi=45):
    t = t_axis(0.4)
    f = hz(midi) * (1 + 0.4 * np.exp(-t * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.003, 0.09)


def reverb(x, seconds=1.6, mix=0.22):
    n = int(SR * seconds)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 4.2)
    ir = lowpass(ir, 4500)
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return x * (1 - mix) + wet * mix


music = np.zeros(N)
sfx = np.zeros(N)

# Am - F - C - G, one chord per bar
CHORDS = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [55, 60, 64]), (55, [55, 59, 62])]
bar = 4 * BEAT
n_bars = int(np.ceil(DUR / bar)) + 1
for b in range(n_bars):
    root, notes = CHORDS[b % 4]
    start = b * bar
    add(music, pad([m + 12 for m in notes], bar + 0.3), start, 0.16)
    for e in range(8):  # eighth-note bass
        at = start + e * BEAT / 2
        if at >= 3.2 or e % 2 == 0:
            add(music, pluck_bass(root - 12 if e % 4 else root - 12, BEAT / 2), at, 0.30 if at >= 3.2 else 0.16)

beats = int(DUR / BEAT) + 1
for k in range(beats):
    at = k * BEAT
    if at >= 3.2 - 1e-6 and at < 19.0:
        if k % 2 == 0:
            add(music, kick(), at, 0.55)
        add(music, hat(), at + BEAT / 2, 0.10)
    elif at < 3.2:
        add(music, hat(), at + BEAT / 2, 0.06)

# SFX (A minor pentatonic pitches)
for i, at in enumerate([1.35, 1.63, 1.91]):           # rings around the bad cells
    add(sfx, blip(76 + [0, 3, 5][i], 0.25, 0.07), at, 0.10)
add(sfx, blip(69, 0.6, 0.18) + blip(76, 0.6, 0.14), 3.25, 0.16)   # reveal pop
for k in range(0, 23):                                 # typing ticks, sparse and soft
    add(sfx, blip(93, 0.03, 0.006), 7.2 + k * 0.087, 0.035)
for i in range(3):                                     # parsed pills land
    add(sfx, blip(81 + [0, 3, 7][i], 0.2, 0.05), 9.55 + i * 0.12, 0.07)
add(sfx, blip(88, 0.04, 0.008), 13.55, 0.09)           # cursor click
add(sfx, thunk(45), 13.66, 0.28)                       # rows collapse
for i, m in enumerate([69, 72, 76, 81]):               # outro chime
    add(sfx, blip(m, 0.9, 0.3), 16.45 + i * 0.08, 0.07)

mix = reverb(music + sfx)
fade = np.clip((DUR - np.arange(N) / SR) / 1.2, 0, 1)
fade_in = np.clip(np.arange(N) / SR / 0.15, 0, 1)
mix *= fade * fade_in
mix /= np.max(np.abs(mix)) * 1.12
stereo = np.stack([mix, np.roll(mix, int(SR * 0.004))], axis=1)

out = sys.argv[1] if len(sys.argv) > 1 else 'audio.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype('<i2').tobytes())
print('wrote', out)
