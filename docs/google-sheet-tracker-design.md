# Google Sheet Tracker Design — AI Lead Follow-Up Assistant

## Purpose

This document defines the Google Sheet tracker design for Phase 2 of the AI Lead Follow-Up Assistant.

The tracker acts as a simple CRM-like table that stores incoming lead information, AI classification output, follow-up draft, QA status, and human review status.

The goal is not to build a full CRM yet.

The goal is to prove:

lead input -> AI processing -> structured output -> tracker update

---

## Tracker Role

The Google Sheet tracker will be used to:

- store raw lead data
- store AI-generated classification
- store score breakdown
- store follow-up draft
- store CRM status
- store QA status
- track human review
- support owner follow-up decisions

---

## Data Flow

```text
Lead Input
-> n8n Manual Trigger / Google Form
-> AI Processing Node
-> JSON Output
-> Google Sheet Tracker
-> Owner Review
````

---

## Sheet Name

```text
Lead Tracker
```

---

## Main Sections

The tracker should be divided into five logical sections:

1. Lead Identity
2. Lead Qualification
3. Need & Strategy
4. Follow-Up Draft
5. QA & Human Review

---

## Section 1 — Lead Identity

Columns:

* lead_id
* lead_name
* business_type
* source
* service_interest
* budget_range
* timeline
* message
* created_at

Purpose:

This section stores the original lead information.

---

## Section 2 — Lead Qualification

Columns:

* lead_category
* lead_score
* priority
* budget_clarity_score
* timeline_urgency_score
* service_clarity_score
* buying_intent_score
* qualification_reason

Purpose:

This section stores the deterministic scoring and classification result.

---

## Section 3 — Need & Strategy

Columns:

* main_need
* hidden_need
* missing_information
* next_best_action
* follow_up_strategy
* recommended_response_type

Purpose:

This section stores the business interpretation and recommended next action.

---

## Section 4 — Follow-Up Draft

Columns:

* follow_up_message
* crm_status
* next_follow_up_date
* owner_action_required
* crm_note

Purpose:

This section stores the practical follow-up output that the owner can review.

---

## Section 5 — QA & Human Review

Columns:

* quality_check
* risk_flags
* requires_human_review
* human_review_status
* human_decision
* reviewed_at
* final_message_sent
* notes

Purpose:

This section keeps the workflow safe and reviewable.

The AI must not auto-send messages.

The owner must review the draft manually.

---

## Human Review Status Values

Allowed values:

```text
pending_review
approved
edited
rejected
sent_manually
no_action
```

---

## Human Decision Values

Allowed values:

```text
send_as_is
edit_before_send
ask_more_context
ignore_lead
mark_as_lost
manual_follow_up_needed
```

---

## Final Message Sent Values

Allowed values:

```text
yes
no
```

Default value:

```text
no
```

---

## Important Safety Rule

The tracker must preserve this rule:

```json
{
  "requires_human_review": true
}
```

No output should be treated as automatically sent.

The tracker exists to support human decision-making, not replace it.

---

## Definition of Done

This tracker design is complete when it defines:

1. Tracker purpose
2. Data flow
3. Sheet name
4. Logical sections
5. Lead identity columns
6. Qualification columns
7. Need and strategy columns
8. Follow-up draft columns
9. QA and human review columns
10. Human review status values
11. Human decision values
12. Auto-send safety rule