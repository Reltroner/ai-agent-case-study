# n8n Workflow Design — AI Lead Follow-Up Assistant

## Purpose

This document defines the n8n workflow design for Phase 2 of the AI Lead Follow-Up Assistant.

The goal is to move from manual simulation into a semi-automated prototype.

The workflow should prove:

```text
lead input -> AI processing -> structured output -> tracker update
```

This phase does not build a full CRM.

This phase does not integrate WhatsApp API or Instagram DM yet.

The goal is to validate the automation path while preserving the same scoring rules, output schema, QA guard, and human-in-the-loop principle from Phase 1.

---

## Workflow Name

```text
AI Lead Follow-Up Assistant — Semi-Automated Prototype v1
```

---

## Workflow Goal

The workflow receives one lead, processes it using the AI Lead Follow-Up Agent prompt, validates the structured JSON output, writes the result to the Google Sheet tracker, and prepares the lead for human review.

---

## High-Level Flow

```text
Manual Trigger / Google Form
-> Normalize Lead Input
-> AI Processing Node
-> Parse AI JSON Output
-> Validate Required Fields
-> Map Output to Google Sheet Columns
-> Append Row to Google Sheet
-> Owner Notification
-> Human Review
```

---

## Node 1 — Manual Trigger

## Purpose

The first version should use a Manual Trigger to test the workflow safely.

This avoids premature integration with WhatsApp, Instagram, or production lead sources.

## Input

The manual trigger should provide one lead payload.

Example:

```json
{
  "lead_id": "L001",
  "lead_name": "Dinda",
  "business_type": "Skincare Brand",
  "source": "Instagram DM",
  "service_interest": "Social Media Management",
  "budget_range": "2-3 juta/bulan",
  "timeline": "Bulan ini",
  "message": "Kak bisa bantu kelola IG brand skincare aku?",
  "created_at": "2026-07-10"
}
```

## Output

One lead object passed to the next node.

---

## Node 2 — Normalize Lead Input

## Purpose

This node ensures the incoming lead fields are clean and consistently named.

## Responsibilities

* preserve `lead_id`
* preserve original `message`
* ensure all expected input fields exist
* set empty strings for missing non-critical fields
* prepare clean JSON for the AI Processing Node

## Expected Output

```json
{
  "lead_id": "L001",
  "lead_name": "Dinda",
  "business_type": "Skincare Brand",
  "source": "Instagram DM",
  "service_interest": "Social Media Management",
  "budget_range": "2-3 juta/bulan",
  "timeline": "Bulan ini",
  "message": "Kak bisa bantu kelola IG brand skincare aku?",
  "created_at": "2026-07-10"
}
```

---

## Node 3 — AI Processing Node

## Purpose

This node sends the normalized lead input into the AI Lead Follow-Up Agent prompt.

The prompt source is:

```text
prompts/lead-followup-agent-v1.md
```

## Responsibilities

The AI Processing Node must generate:

* lead category
* lead score
* score breakdown
* qualification reason
* main need
* hidden need
* missing information
* next best action
* follow-up strategy
* recommended response type
* follow-up message
* CRM status
* next follow-up date
* owner action required
* CRM note
* quality check
* risk flags
* human review flag

## Output Requirement

The AI must return valid JSON only.

No markdown.

No code fences.

No explanations outside JSON.

---

## Node 4 — Parse AI JSON Output

## Purpose

This node parses the AI response into structured fields.

## Responsibilities

* parse JSON string into object
* reject invalid JSON
* preserve original AI output if parsing fails
* route parsing errors to fallback handling

## Success Output

Parsed JSON object.

## Failure Output

If parsing fails, route to fallback path:

```json
{
  "lead_category": "needs_review",
  "lead_score": null,
  "priority": "review",
  "crm_status": "needs_review",
  "quality_check": "needs_review",
  "risk_flags": ["invalid_json", "manual_review_required"],
  "requires_human_review": true
}
```

---

## Node 5 — Validate Required Fields

## Purpose

This node checks whether the parsed AI output follows the expected schema.

## Required Fields

```text
lead_id
lead_category
lead_score
priority
score_breakdown
qualification_reason
main_need
missing_information
next_best_action
follow_up_strategy
recommended_response_type
follow_up_message
crm_status
owner_action_required
crm_note
quality_check
risk_flags
requires_human_review
```

## Validation Rules

The workflow should check that:

1. `lead_id` is not empty.
2. `lead_category` is one of `hot`, `warm`, `cold`, or `needs_review`.
3. `priority` matches lead category.
4. `score_breakdown` exists.
5. `lead_score` matches score breakdown unless category is `needs_review`.
6. `missing_information` is an array.
7. `risk_flags` is an array.
8. `requires_human_review` is `true`.
9. `follow_up_message` does not claim that the message was sent.
10. `crm_status` matches the lead category.

---

## Node 6 — Map Output to Google Sheet Columns

## Purpose

This node maps the input lead and AI output into the Google Sheet tracker schema.

Column reference:

```text
tracker/lead-tracker-columns.csv
```

## Mapping Source

Use two sources:

1. Original lead input
2. Parsed AI output

## Important Mapping Notes

`score_breakdown.budget_clarity` maps to:

```text
budget_clarity_score
```

`score_breakdown.timeline_urgency` maps to:

```text
timeline_urgency_score
```

`score_breakdown.service_clarity` maps to:

```text
service_clarity_score
```

`score_breakdown.buying_intent` maps to:

```text
buying_intent_score
```

Arrays should be converted to readable text before writing to Google Sheet.

Example:

```json
["missing_budget", "missing_timeline"]
```

Should become:

```text
missing_budget, missing_timeline
```

---

## Node 7 — Append Row to Google Sheet

## Purpose

This node writes one complete lead processing result into the Google Sheet tracker.

## Sheet Name

```text
Lead Tracker
```

## Row Content

The row should include:

* original lead data
* AI classification
* score breakdown
* need extraction
* follow-up draft
* CRM status
* QA result
* human review fields

## Default Human Review Fields

```text
human_review_status = pending_review
human_decision = empty
reviewed_at = empty
final_message_sent = no
notes = empty
```

---

## Node 8 — Owner Notification

## Purpose

This node prepares a notification for the owner after the lead is added to the tracker.

The notification should not send a message to the lead.

It only informs the owner that a new lead output is ready for review.

## Notification Content

The notification should include:

* lead name
* lead category
* lead score
* priority
* CRM status
* next best action
* risk flags
* reminder that human review is required

## Example Notification

```text
New lead ready for review.

Lead: Dinda
Category: hot
Score: 90
Priority: high
CRM Status: qualified_hot

Next action:
Ask for the Instagram profile and monthly content goals before recommending a package.

Human review required before sending any message.
```

---

## Node 9 — Human Review

## Purpose

Human review happens outside the automated AI step.

The owner reviews the Google Sheet row and decides what to do.

## Possible Human Review Status Values

```text
pending_review
approved
edited
rejected
sent_manually
no_action
```

## Possible Human Decision Values

```text
send_as_is
edit_before_send
ask_more_context
ignore_lead
mark_as_lost
manual_follow_up_needed
```

---

## Error Handling Path

The workflow must handle errors safely.

## Error Cases

Possible errors:

* missing input field
* invalid AI JSON
* missing required AI output field
* score mismatch
* unsupported lead category
* `requires_human_review` is not true
* Google Sheet append failure

## Safe Fallback Output

If the workflow fails, it should produce a safe fallback row:

```json
{
  "lead_category": "needs_review",
  "lead_score": null,
  "priority": "review",
  "crm_status": "needs_review",
  "quality_check": "needs_review",
  "risk_flags": ["manual_review_required"],
  "requires_human_review": true
}
```

The workflow should never auto-send a message in an error path.

---

## Safety Rules

The workflow must preserve these rules:

1. AI output is draft only.
2. AI does not send messages to leads.
3. Owner must review before sending.
4. `requires_human_review` must always be true.
5. Invalid output must route to `needs_review`.
6. The tracker is a decision-support tool, not a replacement for the owner.

---

## Phase 2 Non-Goals

This phase does not include:

* WhatsApp API integration
* Instagram DM integration
* full CRM dashboard
* automatic message sending
* payment system
* multi-user access
* production deployment

---

## Definition of Done

This workflow design is complete when it defines:

1. Workflow name
2. Workflow goal
3. High-level flow
4. Manual Trigger node
5. Normalize Lead Input node
6. AI Processing Node
7. Parse AI JSON Output node
8. Validate Required Fields node
9. Map Output to Google Sheet Columns node
10. Append Row to Google Sheet node
11. Owner Notification node
12. Human Review step
13. Error handling path
14. Safety rules
15. Phase 2 non-goals
