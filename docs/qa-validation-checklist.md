# QA Validation Checklist — AI Lead Follow-Up Assistant

## Purpose

This document defines the QA validation checklist for the AI Lead Follow-Up Assistant manual simulation outputs.

The goal is to verify that each generated agent output is:

* valid JSON
* consistent with the scoring rules
* aligned with the output schema
* safe for human review
* free from auto-send behavior
* ready for portfolio documentation

This checklist validates the files:

```text
outputs/manual-test-L001.json
outputs/manual-test-L002.json
outputs/manual-test-L003.json
outputs/manual-test-L004.json
outputs/manual-test-L005.json
outputs/manual-test-L006.json
outputs/manual-test-L007.json
outputs/manual-test-L008.json
outputs/manual-test-L009.json
outputs/manual-test-L010.json
```

---

## Core QA Rules

Each output must pass these validation rules:

1. Output must be valid JSON.
2. `lead_id` must not be empty.
3. `lead_category` must use an allowed value.
4. `lead_score` must match the total score breakdown.
5. `priority` must match the lead category.
6. `crm_status` must match the lead category.
7. `follow_up_message` must be a draft only.
8. `follow_up_message` must not claim the message was sent.
9. `risk_flags` must be an array.
10. `missing_information` must be an array.
11. `requires_human_review` must always be `true`.
12. The AI must not invent unsupported client information.
13. The AI must not promise pricing, results, or delivery without confirmation.
14. The AI must not auto-send any message.

---

## Allowed Lead Categories

```text
hot
warm
cold
needs_review
```

---

## Allowed Priority Values

```text
high
medium
low
review
```

---

## Lead Category to Priority Mapping

| Lead Category | Priority |
| ------------- | -------- |
| hot           | high     |
| warm          | medium   |
| cold          | low      |
| needs_review  | review   |

---

## Lead Category to CRM Status Mapping

| Lead Category | CRM Status     |
| ------------- | -------------- |
| hot           | qualified_hot  |
| warm          | qualified_warm |
| cold          | qualified_cold |
| needs_review  | needs_review   |

---

## Score Range Rule

| Score Range | Default Category |
| ----------- | ---------------- |
| 75-100      | hot              |
| 45-74       | warm             |
| 0-44        | cold             |

---

## Category Override Rule

A lead with missing budget should not automatically be treated as hot, even if the total score reaches 75 or above.

If `budget_clarity` is `0`, the category may be capped at `warm`.

This rule exists because a lead with no budget information still requires commercial qualification before being treated as high-confidence hot.

Example:

```text
L004 score = 75
budget_clarity = 0
default score category = hot
final category = warm
reason = budget missing, commercial qualification required
```

---

# Manual Output Validation Summary

| Lead ID | Score | Category | Priority | CRM Status     | QA Status    | Notes                                              |
| ------- | ----: | -------- | -------- | -------------- | ------------ | -------------------------------------------------- |
| L001    |    90 | hot      | high     | qualified_hot  | passed       | Clear budget, service, timeline, and buying intent |
| L002    |    55 | warm     | medium   | qualified_warm | needs_review | Timeline unclear                                   |
| L003    |    95 | hot      | high     | qualified_hot  | passed       | Strong referral lead with active event need        |
| L004    |    75 | warm     | medium   | qualified_warm | needs_review | Budget missing; category capped at warm            |
| L005    |    95 | hot      | high     | qualified_hot  | passed       | Clear branding and launch content need             |
| L006    |    15 | cold     | low      | qualified_cold | needs_review | General inquiry, no budget, no timeline            |
| L007    |    90 | hot      | high     | qualified_hot  | passed       | Clear restaurant SMM need and budget               |
| L008    |   100 | hot      | high     | qualified_hot  | passed       | Strong urgent lead generation campaign need        |
| L009    |    60 | warm     | medium   | qualified_warm | needs_review | Budget and timeline uncertain                      |
| L010    |    95 | hot      | high     | qualified_hot  | passed       | Clear website and content strategy need            |

---

# Expected Risk Flags

## L001

Expected risk flags:

```json
[]
```

Reason:

```text
Lead is clear and safe for review.
```

---

## L002

Expected risk flags:

```json
["missing_timeline"]
```

Reason:

```text
Timeline is not decided yet.
```

---

## L003

Expected risk flags:

```json
[]
```

Reason:

```text
Lead has clear budget, clear service need, near timeline, and strong buying intent.
```

---

## L004

Expected risk flags:

```json
["missing_budget"]
```

Reason:

```text
Budget is not mentioned, so pricing or package recommendation should not be made yet.
```

---

## L005

Expected risk flags:

```json
[]
```

Reason:

```text
Lead has clear budget, clear launch-related need, near timeline, and strong buying intent.
```

---

## L006

Expected risk flags:

```json
["missing_budget", "missing_timeline", "low_buying_intent"]
```

Reason:

```text
Lead is asking for general service information and has not shared a specific project, budget, or timeline.
```

---

## L007

Expected risk flags:

```json
[]
```

Reason:

```text
Lead has clear budget, business need, and service interest.
```

---

## L008

Expected risk flags:

```json
[]
```

Reason:

```text
Lead has clear budget, immediate timeline, specific campaign need, and strong buying intent.
```

---

## L009

Expected risk flags:

```json
["missing_timeline"]
```

Reason:

```text
Timeline is uncertain. Budget is not finalized, but the lead still shows some buying intent.
```

---

## L010

Expected risk flags:

```json
[]
```

Reason:

```text
Lead has clear budget, clear service need, this-month timeline, and strong business intent.
```

---

# Human Review Validation

Every output must include:

```json
{
  "requires_human_review": true
}
```

This is mandatory for all leads:

| Lead ID | Human Review Required |
| ------- | --------------------- |
| L001    | true                  |
| L002    | true                  |
| L003    | true                  |
| L004    | true                  |
| L005    | true                  |
| L006    | true                  |
| L007    | true                  |
| L008    | true                  |
| L009    | true                  |
| L010    | true                  |

---

# Auto-Send Safety Check

The system must never auto-send messages.

The follow-up message must be treated as:

```text
draft only
```

Invalid phrases:

```text
I have sent the message.
The message has been sent.
The system will send this automatically.
The AI will contact the lead directly.
```

Valid framing:

```text
Review and send manually.
Draft message for owner review.
Owner action required.
Requires human review.
```

---

# QA Result Interpretation

## passed

Use `passed` when:

* lead information is clear enough
* scoring is explainable
* draft message is safe
* no critical information is missing
* human review is enabled

## needs_review

Use `needs_review` when:

* budget is missing
* timeline is missing or unclear
* service need is vague
* buying intent is weak
* message needs stronger human judgment
* commercial qualification is still required

---

# Final QA Status

The manual simulation is considered valid when:

1. All 10 JSON files exist.
2. All 10 JSON files are valid JSON.
3. All scores match their score breakdown.
4. All categories are explainable.
5. All CRM statuses match their categories.
6. All follow-up messages are drafts only.
7. All outputs include `requires_human_review: true`.
8. Risk flags are reasonable.
9. No output auto-sends a message.
10. No output promises pricing, results, or delivery without confirmation.

---

# QA Conclusion

The manual simulation passes the initial QA requirement when all 10 lead outputs are validated against this checklist.

This means the project has demonstrated:

```text
Lead input
-> deterministic scoring
-> structured classification
-> need extraction
-> follow-up draft
-> CRM recommendation
-> QA guard
-> human review
```

The system is now ready to move from manual output generation into documented case study preparation.
