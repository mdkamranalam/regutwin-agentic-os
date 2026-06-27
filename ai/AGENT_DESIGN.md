# AGENT_DESIGN.md

# Understanding the Agent Architecture of ReguTwin

## Introduction

Before building any AI agent, it is important to understand what an agent actually is.

Many developers entering AI development imagine agents as advanced chatbots. This misunderstanding creates poor architectures because the entire system becomes centered around conversations rather than responsibilities.

ReguTwin is not being built as a chatbot platform.

It is being built as an autonomous regulatory intelligence system.

The AI agents in ReguTwin are not designed to answer random questions. They are designed to perform specialized jobs within a regulatory compliance workflow.

The easiest way to understand the architecture is to stop thinking about software and start thinking about people.

Imagine walking into the compliance department of a large bank.

You would not find one person responsible for everything.

You would find different employees performing different tasks.

One employee monitors regulatory announcements.

Another interprets regulations.

Another coordinates implementation.

Another verifies compliance.

Another prepares audit reports.

The ReguTwin architecture follows exactly the same philosophy.

Instead of creating one massive AI system responsible for every decision, we divide responsibilities into specialized agents.

Each agent becomes easier to build, easier to maintain, easier to test, and easier to improve.

This document explains the philosophy behind those agents and how they collaborate.

---

# What Is An AI Agent?

An AI agent is a software component that has a specific goal, access to tools, and the ability to make decisions within a limited domain.

Notice something important.

The definition does not mention chat.

The definition does not mention conversations.

The definition does not mention prompts.

Those are implementation details.

At its core, an agent is simply a worker with a responsibility.

Consider a compliance officer.

The officer receives information, performs analysis, makes decisions, and produces outputs.

An AI agent follows the same pattern.

It receives inputs.

It performs reasoning.

It produces outputs.

The difference is that software performs these actions instead of a human.

For ReguTwin, every agent exists because there is a corresponding responsibility inside a real compliance department.

If you cannot explain which human role an agent replaces or assists, the agent probably should not exist.

---

# Why Multiple Agents Instead of One Large Model?

This is one of the most important architectural decisions in the entire project.

A beginner might ask:

"Why don't we simply give the regulation to one model and ask it to do everything?"

Technically, we could.

However, this approach creates several problems.

The model becomes responsible for monitoring, analysis, assignment, validation, reporting, and reasoning simultaneously.

As responsibilities increase, prompts become larger.

Outputs become inconsistent.

Debugging becomes difficult.

Failures become difficult to diagnose.

Suppose the final output is incorrect.

Which part failed?

Did the model misunderstand the regulation?

Did it assign the wrong department?

Did it incorrectly identify the deadline?

Did it fail to detect a conflict?

There is no clear answer.

Now consider a multi-agent system.

Each agent performs one responsibility.

If the output is wrong, we know exactly where to investigate.

This modularity is one of the primary reasons modern agentic systems are becoming popular.

---

# Understanding Agent Responsibilities

Every agent should answer a single question.

The Watchman Agent answers:

"Has a new regulation appeared?"

The Analyst Agent answers:

"What does this regulation require?"

The Mapper Agent answers:

"Who should handle this requirement?"

The Conflict Engine answers:

"Does this regulation contradict previous regulations?"

The Validator Agent answers:

"Can we prove this requirement was implemented?"

Each agent focuses on one problem.

Together they solve a larger problem.

This design principle should guide every future enhancement.

---

# The Watchman Agent

## Why the Watchman Exists

Imagine that RBI publishes a new cybersecurity circular.

If nobody discovers the circular, the organization cannot respond.

Everything begins with awareness.

This is why the Watchman Agent exists.

The Watchman Agent is responsible for discovering new regulatory information.

It continuously monitors predefined sources and detects changes.

Unlike other agents, the Watchman is not primarily a reasoning system.

Its role is observation.

Think of it as the eyes and ears of the platform.

---

## How the Watchman Thinks

The Watchman asks a very simple question repeatedly:

"Has anything changed?"

It does not care about regulatory meaning.

It does not analyze compliance obligations.

It only cares about detecting events.

For example:

A new RBI PDF appears.

The Watchman notices it.

A SEBI circular is updated.

The Watchman notices it.

A compliance officer uploads a policy document.

The Watchman notices it.

Once a change is detected, the Watchman creates an event and triggers the rest of the workflow.

---

## Watchman Inputs

The Watchman may consume:

* RBI websites
* SEBI websites
* PDF repositories
* Internal policy repositories
* User uploads
* Regulatory APIs

Anything capable of producing new regulatory information becomes a source.

---

## Watchman Outputs

The Watchman does not generate compliance recommendations.

Instead, it generates discovery events.

Example:

A new regulation was found.

Source: RBI

Document: Cybersecurity Circular

Published Date: 2026-05-01

This output becomes the input for the Analyst Agent.

---

# The Analyst Agent

## Why the Analyst Exists

The Analyst Agent is arguably the most important component in the entire AI layer.

Without the Analyst, the platform has information but no understanding.

A PDF stored in a database is not intelligence.

A regulation becomes useful only after its meaning has been extracted.

The Analyst performs this transformation.

---

## The Core Responsibility of the Analyst

Imagine the following sentence:

"All banks must implement Multi-Factor Authentication for internet banking users within thirty days."

Humans instantly understand:

There is a requirement.

There is a deadline.

There is a security implication.

There are affected systems.

Computers do not understand these concepts naturally.

The Analyst Agent bridges this gap.

Its responsibility is converting unstructured regulatory language into structured compliance knowledge.

---

## Analyst Outputs

The output should not be paragraphs.

The output should be structured data.

For example:

Requirement:
Enable MFA

Deadline:
30 Days

Risk:
High

Affected System:
Internet Banking

This structure allows every downstream agent to operate consistently.

---

## Why Structured Output Matters

Suppose the Analyst returned a two-page explanation.

The Mapper Agent would struggle to consume it.

The Validator Agent would struggle to consume it.

Structured outputs create predictability.

Predictability creates reliability.

Reliability creates production-ready systems.

This is why structured extraction is one of the most important engineering decisions in ReguTwin.

---

# The MAP Generation Layer

## Understanding Measurable Action Points

One of the most important concepts in compliance management is converting obligations into actions.

A regulation may say:

"Implement Multi-Factor Authentication."

However, this statement is not immediately actionable.

Developers need tasks.

Managers need deadlines.

Teams need accountability.

This transformation creates a MAP.

A Measurable Action Point is a concrete action derived from a regulatory obligation.

The purpose of a MAP is to make compliance executable.

Without MAPs, regulations remain abstract ideas.

With MAPs, regulations become operational work items.

---

# The Mapper Agent

## Why the Mapper Exists

The Analyst identifies requirements.

The Mapper identifies ownership.

These are different responsibilities.

Understanding a regulation does not automatically determine who should implement it.

That decision requires organizational context.

The Mapper provides that context.

---

## How the Mapper Thinks

The Mapper asks:

Which department owns this obligation?

Which team should implement it?

How urgent is it?

What service level agreement should apply?

The Mapper converts compliance intelligence into organizational accountability.

---

## Example

Analyst Output:

Enable MFA

Mapper Output:

Department:
IT Security

Priority:
High

SLA:
30 Days

Now the organization knows who should act.

---

# The Conflict Detection Engine

## Why Conflict Detection Exists

Regulations rarely exist in isolation.

Organizations accumulate years of regulatory history.

New requirements often overlap with old requirements.

Sometimes they reinforce existing policies.

Sometimes they contradict them.

The purpose of the Conflict Detection Engine is to identify those contradictions before implementation begins.

---

## Example Conflict

Previous Regulation:

Session Timeout = 60 Seconds

New Regulation:

Session Timeout = 30 Seconds

Both cannot be true simultaneously.

The engine identifies this inconsistency and alerts stakeholders.

Without this capability, organizations risk implementing contradictory controls.

---

# The Validator Agent

## Why Validation Matters

Most compliance systems rely heavily on declarations.

A manager claims that implementation is complete.

The system records the claim.

The organization assumes compliance.

This approach is risky.

ReguTwin introduces proof-based validation.

Instead of trusting declarations, the Validator seeks evidence.

---

## Example

Requirement:

Terminate inactive sessions after thirty seconds.

Validation Process:

Login.

Wait thirty-one seconds.

Verify session termination.

If the session remains active, the requirement has not been implemented correctly.

The Validator therefore transforms compliance from trust-based verification into evidence-based verification.

---

# Agent Communication

One of the biggest mistakes in multi-agent systems is allowing agents to communicate directly with one another.

While direct communication seems simple initially, it quickly becomes difficult to manage.

Instead, agents should communicate through shared state.

State represents the current understanding of the workflow.

Each agent reads from the state.

Each agent updates the state.

This approach creates transparency and maintainability.

---

# Understanding Workflow State

Imagine a regulation enters the system.

Initially, state contains only:

Document Information

After the Analyst runs, state contains:

Document Information

Compliance Obligations

After the Mapper runs, state contains:

Document Information

Compliance Obligations

Ownership Information

After the Validator runs, state contains:

Document Information

Compliance Obligations

Ownership Information

Validation Evidence

The state grows as it moves through the workflow.

This concept becomes extremely important when implementing LangGraph.

---

# Failure Handling

A production system must assume that agents will fail.

Models can hallucinate.

Documents can be malformed.

Sources can become unavailable.

Therefore every agent should support:

Retry mechanisms

Validation checks

Error logging

Audit trails

Fallback handling

Failure is not an exception.

Failure is an expected event that the architecture must accommodate.

---

# Designing for the Future

The initial MVP may contain only a few agents.

That is acceptable.

The architecture should nevertheless support future expansion.

Possible future agents include:

Risk Assessment Agent

Policy Recommendation Agent

Audit Evidence Agent

Regulatory Simulation Agent

Compliance Copilot Agent

The goal is not to build everything immediately.

The goal is to create an architecture capable of evolving over time.

---

# Final Principle

When designing any new agent, ask three questions:

What problem does this agent solve?

What information does it require?

What information does it produce?

If you can answer those questions clearly, the agent probably belongs in the system.

If you cannot, the responsibility may already belong to another agent.

A good agent architecture is not defined by the number of agents.

It is defined by the clarity of their responsibilities.
