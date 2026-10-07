---
title: Etik Mail
description: An AI-assisted email client that catches unethical language in Turkish corporate emails before they are sent.
role: Project lead, researcher
---

## Problem

In corporate communication, the problem isn't always an open insult. "You sent the report at the last minute again. How many more times do we need to talk about this?" contains no swearing, but it has a pressuring, belittling tone. Face to face, tone of voice and facial expressions provide that context. In an email, all we have left are the words.

When we looked at the literature, there was a lot of work on detecting toxic language, spam and phishing. But there was no study, and no ready-made dataset, that directly asked "Is this email appropriate for ethical corporate communication?" for Turkish. Etik Mail ("Ethical Mail") is our work on that gap: it catches unethical language before the email is sent and gives the user a chance to fix it.

The project was funded under **TÜBİTAK 2209-A**. We presented our work as a paper at the **IDAP'26** symposium.

## Dataset and model

Since there was no ready-made dataset, we built our own:

- **3,222** unique Turkish corporate communication texts in two balanced classes: ethical and unethical.
- In the unethical examples, we tried to represent hierarchical pressure, belittling, passive-aggressive phrasing, threatening language and expressions that amount to workplace bullying.
- We drafted texts with large language models but didn't put any of them into the dataset directly. We reviewed every text one by one, checked that it was realistic and coherent, and assigned the labels ourselves.

For the model, we fine-tuned **BERTurk** (`dbmdz/bert-base-turkish-cased`), pretrained for Turkish, as a binary classifier. We chose BERTurk because it looks at a text in context rather than word by word.

## Architecture

```
Write → Send
      │
      ▼
React client
      │  POST /predict
      ▼
FastAPI + BERTurk model
      │
      ▼
toxic score ≥ 0.60 ?
   │              │
  yes             no
   ▼              ▼
Blocked          Sent
(back to edit)
```

- **Client (React + Vite):** A Gmail-like client: sign-in screen, inbox, compose, attachments and a dark theme. Pressing "Send" opens a 6-step analysis screen: subject and body are combined, stripped of HTML, tokenized, sent to the model, and the decision is interpreted.
- **Backend (FastAPI):** The `/predict` endpoint runs the text through the model and returns the toxic and safe probabilities. If the probability of the unethical class passes the **0.60** threshold, sending is blocked and the user is sent back to edit the email.
- **The model and the dataset** are public on Hugging Face.

## Results

On a balanced, held-out evaluation set of **645** samples:

| Metric | Result |
|---|---|
| Accuracy | 99.84% |
| F1 score | 99.845% |
| Correctly classified | 644 of 645 samples |

## Where I struggled

- **A high score doesn't tell the whole story.** Because we built the dataset in a controlled setting, we didn't want to rely on the test score alone. We ran an extra stress test with 30 samples the model had never seen. It got 27 of the 30 right and caught all 10 passive-aggressive ones. But we also saw that it sometimes treats harsh-but-professional language as unethical.
- **The model doesn't fit in Git.** The model is about 422 MB. Instead of putting it in the repository, I uploaded it to Hugging Face. If the backend can't find the model locally, it downloads it from there.
- **Going from a research model to a product.** Running a model in a notebook is one thing; building a system that decides the moment the user presses "Send" is another. Showing the analysis steps on screen, making the wait visible, and adding a rate limit and a 5,000-character input limit to the API were the work that came up at this stage.

## What I learned

- I learned to fine-tune a transformer model for Turkish text classification.
- I saw that the dataset matters at least as much as the model, and that nothing replaces human review.
- I learned to look beyond test metrics and hunt for where the model goes wrong with stress tests and a confusion matrix.
- I gained experience presenting work at a scientific symposium.
