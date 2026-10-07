---
title: How Do You Remove Noise from a WAV File with a Frequency Filter?
description: The idea behind cleaning noise out of a recording with a frequency filter.
date: '2026-08-12'
---

When you record audio, you hear something besides the speech or music: hum, crackle, fan noise, hiss. All of that is **noise**. The good news is that most noise sits at **frequencies** different from the sound you actually want. So you can remove it by looking at frequency. That's exactly what my [Noise Cleaner](https://noise-cleaner.kubrainy.me/) project does: it removes unwanted sound from a WAV file based on the frequency filter you apply. In this post I explain the idea behind it from scratch.

## Sound is really a sum of waves

Your ear hears a sound as one sound, but it's actually the sum of many waves vibrating at different speeds. The number of times a wave vibrates per second is called its **frequency**, measured in **Hertz (Hz)**.

- **Low frequency** (say, 100 Hz): deep, rumbling sounds. Bass, hum.
- **High frequency** (say, 8000 Hz): thin, sharp sounds. Crackle, hiss.

A human voice sits roughly between 85 Hz and a few thousand Hz. Some noise, like electrical hum, is concentrated in a very narrow frequency range. A filter takes advantage of exactly that difference.

## What does a frequency filter do?

A frequency filter lets the waves in the frequency range you choose pass through and weakens the rest. There are three basic kinds:

- **Low-pass:** Lets frequencies **below** a certain point through and cuts the ones above. Used to clean up crackle and hiss.
- **High-pass:** Lets frequencies **above** a certain point through and cuts the ones below. Used to clean up hum and wind noise.
- **Band-pass:** Only lets through the region between two frequencies.

In all of them, the most important setting is the **cutoff frequency**. For example, a low-pass filter with its cutoff set to 2500 Hz leaves sounds below 2500 Hz as they are and gradually weakens those above.

There's a small but important detail here: a filter doesn't cut as sharply as a wall. As you approach the cutoff frequency, the sound fades gradually. How steep that fade is depends on the filter's **order**. The higher the order, the sharper the cut.

## What's inside a WAV file?

WAV is a format that stores audio without compression. It holds two basic pieces of information:

- **Sample rate:** How many measurements are taken per second. CD quality is 44100 Hz.
- **Samples:** The sound level at each measurement, as a number.

You need to know the sample rate when designing the filter, because the highest frequency a recording can represent is **half** the sample rate. This is called the **Nyquist frequency**. For a 44100 Hz recording, it's 22050 Hz. We always give the cutoff frequency as a ratio of that limit.

## Let's try it in Python

The easiest way to see the concept is a small example. The code below applies a low-pass filter with a 2500 Hz cutoff to a 16-bit WAV file:

```python
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, filtfilt

rate, data = wavfile.read("recording.wav")
data = data.astype(np.float32)

cutoff = 2500  # Hz
nyquist = rate / 2
b, a = butter(4, cutoff / nyquist, btype="low")

cleaned = filtfilt(b, a, data, axis=0)
cleaned = np.clip(cleaned, -32768, 32767).astype(np.int16)

wavfile.write("recording_clean.wav", rate, cleaned)
```

What happens, line by line:

1. `wavfile.read` opens the file and gives you the sample rate and the samples.
2. `butter(4, ...)` creates a fourth-order **Butterworth** filter. This filter keeps the level as flat as possible in the region it lets through, which is why it's a common choice for cleaning up audio.
3. `cutoff / nyquist` scales the cutoff frequency to between 0 and 1. That's what the library expects.
4. `filtfilt` applies the filter forward and then backward. That way the timing of the sound doesn't shift.
5. `np.clip` pins values that overflow to the 16-bit limit; otherwise the file comes out corrupted.

## How do you choose the cutoff frequency?

There's no rule here, only your ears. But I can give you a direction to start with:

- If there's **crackle or hiss**, try a low-pass filter. For speech recordings, around 3000–4000 Hz is a good starting point. Go lower and the noise drops, but the voice starts to sound muffled.
- If there's **hum or wind**, try a high-pass filter. Around 80–150 Hz works.
- **Don't try to get it right in one go.** Make a few copies with different cutoff frequencies, listen to them one by one and pick the one with the best balance.

Every filter has a cost: along with the noise, you also lose part of the sound. The goal isn't to wipe out the noise completely, but to **bring it down to a level where it doesn't bother you**.

## What can't a filter fix?

To be honest, a frequency filter doesn't fix every kind of noise. If the noise is **in the same frequency range** as the sound you want, the filter can't tell them apart. For example, you can't filter out another person's voice in the background of a speech recording, because both sit in the same region. Cases like that need more advanced methods.

## In short

- Noise usually sits at different frequencies from the sound you want, and a filter uses that difference.
- **Low-pass** cuts the high frequencies (crackle), **high-pass** cuts the low ones (hum).
- The most important setting is the **cutoff frequency**, given as a ratio of half the sample rate (Nyquist).
- You find the right value **by listening**, not by calculating.

If you want to clean up a recording, you can upload your WAV file to [Noise Cleaner](https://noise-cleaner.kubrainy.me/) and try different filters yourself.
