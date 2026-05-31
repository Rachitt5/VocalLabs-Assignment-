<div align="center">
  <h1>🎙️ VocalLabs AI Voice Agent</h1>
  <p><b>Build, deploy, and manage AI-powered voice agents that sound human, remember context, and scale without a call centre — India-first, sub-400ms latency.</b></p>
  <p>
    <code>VocalLabs Enterprise v2.5</code> | 
    <code>Python 3.10+</code> | 
    <code>GPT-4.1-Mini</code> | 
    <code>mem0 Memory Layer</code> | 
    <code>Neo4j Graph DB</code> | 
    <code>Qdrant Vector DB</code> | 
    <code>380ms Latency</code> | 
    <code>94.6% CSAT</code>
  </p>
  <p>
    <a href="#system-architecture">Architecture</a> •
    <a href="#conversation-loop">How It Works</a> •
    <a href="#dashboard">Dashboard</a> •
    <a href="#onboarding">Onboarding</a> •
    <a href="#design-agent">Design Agent</a> •
    <a href="#test-agent">Test Agent</a> •
    <a href="#memory">Memory Hub</a> •
    <a href="#mobile">Mobile App</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
</div>

---

## 📖 Overview

VocalLabs is a full-stack AI voice agent platform built for Indian businesses. It replaces inconsistent human call centre operations with agents that listen, reason, remember, and speak — in Hinglish, regional accents, or neutral English — with sub-400ms latency and cross-call memory that makes every repeat caller feel recognised.

The platform handles the entire loop: voice capture → speech-to-text → semantic memory retrieval → AI response generation → text-to-speech → memory persistence. Every conversation is stored with vector embeddings in Qdrant and relationship context in Neo4j, so the agent builds a cognitive profile of each caller across sessions.

### 📊 Key Metrics

| Metric | Value |
| :--- | :--- |
| **Total connections** | 14,820 (+12.5% this week) |
| **Real-time streaming latency**| ~380ms |
| **Avg call duration** | 2m 22s (industry: 3.5m) |
| **Customer CSAT** | 94.6% (post-call verified) |
| **Est. savings vs human centres** | $38,530 |
| **Active agents deployed live** | 3 |

---

## 🏗️ System Architecture

The platform is built around a central orchestrator (`voice_agent.py`) that coordinates three specialised modules — speech handling, AI inference, and memory management — each backed by dedicated external services.

*(Note: The architecture diagram image provided in the source was truncated and could not be fully rendered).*
