# Query Doctor Controlled Public Beta

## Purpose

The controlled public Beta tests which professional segments find Query Doctor useful, trustworthy, and valuable enough to use repeatedly.

The experiment expands validation beyond the initial Oracle Retail and integration cohort without treating the product as a finished public release.

## Current Evidence

The initial private validation included two Oracle integration professionals with OIC, RIB, SOA, SQL, and PL/SQL experience.

Both participants requested:

- Oracle PL/SQL review;
- a revised version of the submitted code;
- a workflow closer to direct code review than educational guidance alone.

This is a meaningful product signal, but the participants belong to a similar professional segment. Broader validation is required before committing to full PL/SQL implementation.

## Experiment Goals

- identify the professional segments that perceive the most value;
- measure usefulness, trust, and repeat-use intent;
- identify incorrect or speculative review claims;
- validate demand for PL/SQL analysis;
- validate demand for revised-code generation;
- understand preferred review workflows;
- measure latency and cost per completed review;
- collect willingness-to-pay evidence;
- determine the most valuable direction for Sprint 006.

## Target Cohort

Recruit at least 15 participants across at least three professional profiles and three database contexts.

Target profiles include:

- Oracle SQL developers;
- Oracle PL/SQL developers;
- Oracle integration developers;
- Oracle DBAs and technical reviewers;
- PostgreSQL developers;
- SQL Server developers;
- MySQL developers;
- data engineers;
- data analysts;
- technical consultants outside Oracle Retail.

Recruitment should favor second-degree contacts and public technical communities to reduce dependence on the founders immediate professional circle.

## Safety and Privacy

Participants must use synthetic, anonymized, non-confidential, or explicitly authorized code.

Participants must not submit:

- credentials or connection details;
- personal or customer data;
- confidential source code;
- proprietary business rules;
- unreleased implementation details;
- identifiers that reveal clients, employers, systems, or schemas;
- production data or execution plans containing sensitive values.

Query Doctor performs static analysis only. It does not connect to a database or execute submitted code.

The Beta telemetry layer must not store submitted SQL or PL/SQL.

## Data Collection

The Beta may record:

- anonymous session identifier;
- review timestamp;
- selected dialect;
- review completion or failure;
- response duration;
- model identifier;
- token usage;
- estimated review cost;
- usefulness response;
- incorrect-review report;
- optional professional profile;
- optional free-text feedback;
- repeat usage for the same anonymous session.

The Beta must not record the submitted code in telemetry or feedback records.

Free-text feedback must warn participants not to paste confidential code or data.

## In-Product Feedback

After a completed review, ask:

Was this review useful?

Available answers:

- Yes;
- Partially;
- No.

Optional follow-up questions:

1. What did you expect the tool to do that it did not do?
2. Did the review contain an incorrect or unsupported claim?
3. Would you use Query Doctor again for real work?
4. Would receiving revised code make the result more useful?

Optional participant attributes:

- professional role;
- primary database;
- SQL or PL/SQL usage;
- preferred workflow;
- contact information for a follow-up interview.

## Usage Protection

Before broader promotion, the application should support:

- per-session or per-origin request limits;
- a global daily review limit;
- a configurable daily cost threshold;
- a Beta pause switch controlled by environment configuration;
- safe rate-limit and unavailable responses;
- monitoring of review failures, latency, tokens, and cost.

Limits must be configurable without changing application source code whenever practical.

## Rollout Stages

### Stage 1 — Instrumented Preview

Invite five to ten indirect participants. Validate feedback capture, limits, costs, errors, and privacy guidance.

### Stage 2 — Controlled Community Beta

Share the recruitment page with selected professional groups and second-degree contacts.

### Stage 3 — Broader Public Recruitment

Publish the invitation more broadly only if operating cost, review quality, and abuse controls remain healthy.

## Success Criteria

The Beta is considered promising when:

- at least 15 participants complete a review;
- at least three professional profiles are represented;
- at least three database contexts are represented;
- at least 70 percent rate usefulness as Yes or equivalent;
- at least 60 percent express repeat-use intent;
- at least five participants provide qualitative feedback;
- at least five participants accept a follow-up conversation;
- materially incorrect reviews remain below 10 percent;
- cost per useful review remains financially sustainable;
- a clear preferred workflow or segment emerges.

These thresholds are directional and must be interpreted with qualitative evidence.

## Pause Conditions

Pause recruitment or review access when:

- the daily usage or cost threshold is reached;
- repeated automated or abusive traffic appears;
- materially incorrect reviews exceed the acceptable threshold;
- confidential code is repeatedly submitted;
- latency or provider failures prevent a usable experience;
- telemetry or feedback persistence is unreliable;
- operating cost cannot be reconciled with potential value.

## Out of Scope

- storing submitted SQL or PL/SQL;
- complete PL/SQL support;
- production-ready automatic rewriting;
- authentication and user accounts;
- billing and subscriptions;
- paid advertising;
- IDE, CLI, and pull-request integrations;
- equal-depth support for every SQL dialect;
- a sophisticated analytics dashboard.

## Decision After the Beta

Sprint 006 should select one primary direction:

1. Oracle PL/SQL review with safe revised-code output;
2. deeper Oracle SQL review;
3. stronger multi-dialect SQL review;
4. workflow integration such as IDE, CLI, or pull request;
5. trust and correctness improvements before expansion;
6. repositioning or stopping if recurring value is not demonstrated.

The decision must be based on observed usage, technical feedback, repeat-use evidence, and credible willingness to pay.
