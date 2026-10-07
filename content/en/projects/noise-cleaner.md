---
title: Noise Cleaner
description: Removes unwanted noise from a WAV file based on the frequency filter you apply, then shows the before and after as charts and lets you listen to both.
role: Individual
---

## Problem

Cleaning hum or crackle out of a recording usually means opening heavy audio software. Yet most noise sits at frequencies different from the sound you want, and the right filter can remove it.

Noise Cleaner brings this to the browser: you upload a WAV file or record from your microphone, pick a filter, then see the result on charts and listen to it. If you like it, you download the cleaned file.

In the example above, a low-pass filter with a 2500 Hz cutoff was applied to a noisy recording. You can compare the before and after with the slider and listen to both.

## Architecture

```
Upload or record a WAV
      │
      ▼
Nuxt client
      │  POST /api/filter
      ▼
FastAPI
  ├─ Butterworth filter (SciPy)
  ├─ FFT and chart data
  └─ cleaned WAV
      │  JSON
      ▼
Chart.js charts, player, download
```

- **Client (Nuxt, Vue, TypeScript):** Drag-and-drop file upload (up to 10 MB) or recording from the microphone with `MediaRecorder`. There are three filters: high-pass, low-pass and band-pass. The cutoff frequency is set with a slider.
- **Backend (Python, FastAPI):** Reads the file with `soundfile`, mixes stereo down to mono and applies a 4th-order Butterworth filter (`scipy.signal.butter` + `lfilter`). Then it takes the FFT of both the original and the filtered signal, and returns the chart data and the cleaned WAV in a single JSON response.
- **Results screen:** Four before/after charts for the time domain and the frequency domain, an audio player and a download button.
- **Deployment:** The Nuxt client and the Python backend run as two separate services in the same Vercel project. Requests to `/api/*` are routed to the backend.

## Where I struggled

- **Sending tens of thousands of points to a chart.** Even a 4-second recording means about 90,000 samples. Sending all of them to the browser bloats the response and slows the chart down. The obvious approach is to keep every Nth sample (`y[::step]`). But that can turn an oscillating signal into an almost flat line, because the samples it picks can keep landing on the same part of the wave. So I split the signal into equal chunks and kept the minimum and maximum of each chunk. That way the real amplitude of the wave survives even with 1,000 points.
- **Shipping two languages in one project.** The client runs on Node.js, the filtering on Python. In development, Nuxt proxies the request to a local Python server; in production, Vercel's services configuration puts both sides under the same domain.
- **Passing the cutoff frequency correctly.** The filter doesn't take the frequency directly; it has to be given as a ratio of the Nyquist frequency (half the sample rate). I explain this detail in a [blog post](/en/blog/wav-gurultu-frekans-filtresi).

## What I learned

- I learned to put signal processing basics such as frequency, cutoff frequency, filter order and the Nyquist limit into practice.
- I saw how the way you pick samples can make a visualization misleading.
- I learned to connect a Nuxt client to an API written in Python and deploy the two together.
