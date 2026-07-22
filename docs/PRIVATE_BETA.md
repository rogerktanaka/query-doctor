# Query Doctor Private Oracle Beta

## Purpose

The private Beta tests whether Oracle professionals find Query Doctor useful, trustworthy, and valuable enough to use repeatedly.

This is a product-validation exercise, not a public launch.

## Target Cohort

Recruit 10 to 20 participants across:

- Oracle SQL developers;
- PL/SQL developers;
- Oracle consultants;
- Oracle DBAs;
- technical leads who review Oracle SQL;
- developers maintaining Oracle-based systems.

Prefer a mixed cohort of trusted second-degree contacts, former colleagues outside the closest personal circle, Oracle community contacts, and developers introduced by known professionals.

Participants do not need detailed business, roadmap, or implementation information.

## Safety and Privacy

Participants must use anonymized, synthetic, or non-confidential SQL.

They must not submit production credentials, personal or customer data, proprietary identifiers, confidential business rules, unreleased source code, or SQL that reveals sensitive schemas.

Query Doctor performs static analysis only and does not connect to or execute against a database.

## Beta Workflow

1. Invite the participant privately.
2. Explain that the feature is experimental and Oracle has the deepest coverage.
3. Ask the participant to test three to five representative, anonymized queries.
4. Ask for at least one clean query and one query with a known concern.
5. Record whether the review found the expected concern and invented unsupported claims.
6. Collect the structured feedback form.
7. Invite selected participants to a 15-minute follow-up interview.
8. Do not store submitted SQL unless the participant explicitly authorizes it.

## Feedback Form

For each participant, record:

- role and Oracle experience range;
- number of reviews performed;
- usefulness rating from 1 to 5;
- trust rating from 1 to 5;
- whether a real issue was found;
- whether an important issue was missed;
- whether an incorrect or speculative claim appeared;
- whether suggestions preserved intended behavior;
- whether the participant would use the tool again;
- preferred workflow: web, IDE, pull request, or another format;
- willingness to pay and preferred pricing model;
- optional free-text feedback.

Do not collect employer, client, or system names unless necessary and explicitly authorized.

## Interview Questions

1. What type of Oracle SQL review consumes the most time today?
2. Which part of the response was most useful?
3. Which claim did you trust least, and why?
4. Did the review identify anything you had missed?
5. Did it recommend a change that could alter semantics?
6. At what point would you use this repeatedly?
7. Where should the tool fit into your workflow?
8. Would you personally pay, expense it, or expect an employer to buy it?
9. What outcome would justify payment?
10. What would prevent you from using it again?

## Success Criteria

The Beta is considered promising when:

- at least 10 Oracle professionals participate;
- at least 30 anonymized reviews are completed;
- at least 70% rate usefulness at 4 or 5;
- at least 60% say they would use the tool again;
- materially incorrect reviews remain below 10%;
- at least three participants agree to a follow-up interview;
- at least three express credible willingness to pay or recommend employer purchase.

These thresholds are directional and must be interpreted with qualitative feedback.

## Warning Signals

Pause feature expansion and reassess if reviewers frequently invent facts, rewrites change semantics, fewer than half want to use the tool again, participants see no advantage over general-purpose AI chat, latency prevents normal use, or expected revenue cannot support operating costs.

## Operating Metrics

Track reviews per participant, repeat usage, latency, estimated cost per review, usefulness and trust ratings, incorrect-review reports, invitation conversion, and willingness-to-pay signals.

Do not add invasive analytics before they are needed. Prefer explicit feedback and privacy-preserving aggregate metrics.

## Initial Invitation Template

> I am privately testing Query Doctor, an experimental AI-assisted Oracle SQL reviewer. It performs static review only and does not connect to a database. Would you be willing to test three to five anonymized or synthetic queries and share brief, candid feedback? Please do not submit confidential SQL, data, credentials, or proprietary identifiers.

## Decision After Beta

After the first cohort, choose one of four outcomes:

1. continue Oracle specialization;
2. improve trust and correctness before further recruitment;
3. change the workflow or target user;
4. stop or reposition the product if repeated use and willingness to pay are not supported.

The decision must be based on observed behavior and interviews rather than positive comments alone.
