## Read. For Speed.

A full-stack reading training platform built to measure not just how fast you read — but how well you understand.

---

## Status

Work in progress — and getting more complicated every time I touch it.

---

## Overview

Read. For Speed. is a full-stack web application designed to help users improve their reading speed while maintaining comprehension.

Instead of treating speed as the only metric, the platform combines:

- Words per minute (WPM)  
- Comprehension accuracy  
- Effective WPM (speed × understanding)  

The goal is to create a system where progress is measured meaningfully, not just maximized blindly.

---

## Tech Stack

### Frontend
- React  
- TypeScript  
- Vite  

### Backend
- Node.js  
- Express  

### Database & Auth
- Supabase  

---

## Core Features

### Baseline Assessment

New users begin with a baseline test that determines:

- Reading speed (WPM)  
- Comprehension accuracy  
- Effective WPM  

This establishes a personalized starting point for training.

---

### RSVP Reading Mode

Implements Rapid Serial Visual Presentation (RSVP):

- Words displayed one at a time  
- Reduces eye movement  
- Encourages faster reading pacing  

---

### Results & Metrics

After each session, users receive:

- WPM  
- Accuracy  
- Effective WPM  

The goal is to make feedback feel clear and motivating rather than overwhelming.

---

### Authentication & User Data

- Supabase authentication  
- Secure user profiles  
- Persistent tracking of performance metrics  

---

### Backend Architecture

- REST API built with Express  
- Authenticated routes  
- Structured endpoints for baseline tests, user profiles, and performance data  

---

## How It Works

Effective reading speed is calculated as:

Effective WPM = WPM × Accuracy

This prevents users from optimizing for speed alone and encourages balanced improvement.

---

## What I’m Building Next

- Unlock system (new test after every 5 training sessions)  
- Adaptive WPM recalibration  
- Chunked RSVP mode  
- Speed drills  
- WPM leaderboard  

---

## Challenges & Design Decisions

### Balancing Speed vs Understanding

A fast reader who understands nothing is not improving.  
This is why effective WPM is the core metric.

---

### Data Flow & State Management

Handling timed reading sessions, navigation between test → questions → results, and syncing frontend state with backend required careful structure across React and API boundaries.

---

### Supabase Integration

- Auth sessions  
- Protected routes  
- Database updates tied to user actions  

---

## Why This Project

This project started as a simple idea:

“What if I could train reading speed like a skill?”

It quickly turned into a full system involving real-time interaction, metrics design, backend architecture, and user progression logic.

At this stage, it feels less like a single app and more like a growing ecosystem.

---

## Future Vision

The goal is to evolve this into:

- A structured training platform  
- A performance tracker  
- A system that adapts to each user  

---

## Final Note

Read. For Speed. is not finished — it is actively becoming the thing it was meant to be.

And that is the most interesting part.
