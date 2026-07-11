# Output Schema — AI Lead Follow-Up Assistant

## Purpose

This document defines the standard JSON output schema for the AI Lead Follow-Up Assistant simulation.

The schema exists to make the agent output:

* structured
* predictable
* parseable
* auditable
* ready for Google Sheet, n8n, backend API, or dashboard integration

The AI must return output using this structure after processing each lead.

---

## Core Principle

The agent must not return free-form text as the final output.

The final output must be valid JSON.

The output must always include:

```json
{
  "requires_human_review": true
}
```

The system is designed as an AI-assisted workflow, not an autonomous sales bot.

---

# Final Output Schema

```json
{
  "lead_id": "string",
  "lead_category": "hot | warm | cold | needs_review",
  "lead_score": 0,
  "priority": "high | medium | low | review",
  "score_breakdown": {
    "budget_clarity": 0,
    "timeline_urgency": 0,
    "service_clarity": 0,
    "buying_intent": 0
  },
  "qualification_reason": "string",
  "main_need": "string",
  "hidden_need": "string",
  "missing_information": [],
  "next_best_action": "string",
  "follow_up_strategy": "string",
  "recommended_response_type": "string",
  "follow_up_message": "string",
  "crm_status": "string",
  "next_follow_up_date": "YYYY-MM-DD",
  "owner_action_required": "string",
  "crm_note": "string",
  "quality_check": "passed | needs_review",
  "risk_flags": [],
  "requires_human_review": true
}
```

---

# Field Definitions

## lead_id

Unique identifier for the lead.

Example:

```json
{
  "lead_id": "L001"
}
```

Rules:

* Must match the lead ID from the input dataset.
* Must not be changed by the AI.
* Must not be empty.

---

## lead_category

The classification result of the lead.

Allowed values:

```text
hot
warm
cold
needs_review
```

Rules:

* Use `hot` when lead score is 75-100.
* Use `warm` when lead score is 45-74.
* Use `cold` when lead score is 0-44.
* Use `needs_review` when the agent cannot safely classify the lead.

---

## lead_score

The total score from 0 to 100.

Example:

```json
{
  "lead_score": 90
}
```

Rules:

* Must be a number.
* Must be calculated from the four scoring criteria.
* Must be null only when `lead_category` is `needs_review`.

---

## priority

The business priority of the lead.

Allowed values:

```text
high
medium
low
review
```

Mapping:

| Lead Category | Priority |
| ------------- | -------- |
| hot           | high     |
| warm          | medium   |
| cold          | low      |
| needs_review  | review   |

---

## score_breakdown

Detailed scoring result based on the deterministic scoring rules.

```json
{
  "score_breakdown": {
    "budget_clarity": 25,
    "timeline_urgency": 20,
    "service_clarity": 25,
    "buying_intent": 20
  }
}
```

Rules:

* Each field must be a number.
* Each field must be between 0 and 25.
* The total must match `lead_score`.

---

## qualification_reason

Short explanation of why the lead received the category and score.

Example:

```json
{
  "qualification_reason": "The lead has clear service interest, clear budget, near-term timeline, and active buying intent."
}
```

Rules:

* Must be concise.
* Must be based only on available lead information.
* Must not invent context.

---

## main_need

The main explicit need from the lead.

Example:

```json
{
  "main_need": "Monthly Instagram social media management"
}
```

Rules:

* Must be based on `service_interest` and `message`.
* Must not invent a service that was not implied.

---

## hidden_need

The likely underlying business need.

Example:

```json
{
  "hidden_need": "Consistent content planning and stronger brand presence"
}
```

Rules:

* May infer reasonable business need from the message.
* Must not over-assume.
* If unclear, use an empty string.

---

## missing_information

List of important information still needed before giving a precise recommendation.

Example:

```json
{
  "missing_information": [
    "current Instagram account",
    "monthly content target",
    "brand style preference"
  ]
}
```

Rules:

* Must be an array.
* Use an empty array if no missing information is detected.
* Should include practical follow-up questions.

---

## next_best_action

The recommended next action for the owner.

Example:

```json
{
  "next_best_action": "Ask for the Instagram profile and monthly content goals before recommending a package."
}
```

Rules:

* Must be actionable.
* Must not auto-send anything.
* Must guide the owner toward the next human decision.

---

## follow_up_strategy

The recommended strategy for replying to the lead.

Allowed values:

```text
consultative
discovery_question
pricing_clarification
timeline_clarification
portfolio_offer
proposal_next_step
manual_review
```

Rules:

* Use `consultative` when the lead is serious and needs guided discovery.
* Use `discovery_question` when more context is needed.
* Use `pricing_clarification` when the budget is unclear or low.
* Use `timeline_clarification` when timing is unclear.
* Use `portfolio_offer` when the lead may need proof of work.
* Use `proposal_next_step` when the lead is highly qualified.
* Use `manual_review` when the agent cannot safely decide.

---

## recommended_response_type

The type of response the owner should send.

Allowed values:

```text
discovery_question
pricing_question
timeline_question
service_explanation
portfolio_share
proposal_invitation
manual_review
```

---

## follow_up_message

Draft message for the owner to review.

Example:

```json
{
  "follow_up_message": "Halo Kak Dinda, terima kasih sudah menghubungi. Bisa banget Kak. Sebelum aku kasih gambaran paket yang paling cocok, boleh aku lihat dulu akun Instagram brand-nya dan target konten bulan ini seperti apa?"
}
```

Rules:

* Must be written as a draft.
* Must sound natural and human.
* Must not be too aggressive.
* Must not claim that anything has already been sent.
* Must not promise pricing, results, or delivery without confirmation.

---

## crm_status

Recommended CRM status.

Allowed values:

```text
new
qualified_hot
qualified_warm
qualified_cold
contacted
waiting_response
follow_up_needed
proposal_sent
deal_won
deal_lost
inactive
needs_review
```

Initial mapping:

| Lead Category | CRM Status     |
| ------------- | -------------- |
| hot           | qualified_hot  |
| warm          | qualified_warm |
| cold          | qualified_cold |
| needs_review  | needs_review   |

---

## next_follow_up_date

Recommended date for the next follow-up.

Format:

```text
YYYY-MM-DD
```

Rules:

* Hot lead: usually next day.
* Warm lead: usually within 2-3 days.
* Cold lead: usually within 5-7 days or manual review.
* If unclear, use an empty string and flag manual review.

Example:

```json
{
  "next_follow_up_date": "2026-07-11"
}
```

---

## owner_action_required

Clear action required from the owner.

Example:

```json
{
  "owner_action_required": "Review and send the follow-up message manually."
}
```

Rules:

* Must always assume human review.
* Must not tell the system to auto-send.
* Must be practical and direct.

---

## crm_note

Short note that can be stored in a CRM, Google Sheet, or dashboard.

Example:

```json
{
  "crm_note": "Potential monthly social media management client. Ask for Instagram profile and monthly content goals."
}
```

Rules:

* Must summarize the lead context.
* Must mention the most important next action.
* Must be concise.

---

## quality_check

QA result from the QA Guard Agent.

Allowed values:

```text
passed
needs_review
```

Rules:

* Use `passed` when output is safe, clear, and reviewable.
* Use `needs_review` when there are missing fields, vague context, possible hallucination, invalid assumptions, or risky messaging.

---

## risk_flags

List of risks detected by the QA Guard Agent.

Allowed values:

```text
missing_budget
missing_timeline
unclear_service_need
low_buying_intent
message_too_pushy
possible_hallucination
invalid_json
duplicate_lead_possible
manual_review_required
```

Example:

```json
{
  "risk_flags": ["missing_budget", "missing_timeline"]
}
```

Rules:

* Must be an array.
* Use an empty array if no risk is detected.
* Must include `manual_review_required` if the output is uncertain.

---

## requires_human_review

Mandatory human review flag.

Required value:

```json
{
  "requires_human_review": true
}
```

Rules:

* Must always be true.
* Must never be false.
* This field protects the system from becoming an unsafe auto-send workflow.

---

# Example Output — Hot Lead

Input lead:

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

Expected output:

```json
{
  "lead_id": "L001",
  "lead_category": "hot",
  "lead_score": 90,
  "priority": "high",
  "score_breakdown": {
    "budget_clarity": 25,
    "timeline_urgency": 20,
    "service_clarity": 25,
    "buying_intent": 20
  },
  "qualification_reason": "The lead has clear service interest, clear budget, near-term timeline, and active buying intent.",
  "main_need": "Monthly Instagram social media management",
  "hidden_need": "Consistent content planning and stronger brand presence",
  "missing_information": [
    "current Instagram account",
    "monthly content target",
    "brand style preference",
    "approval process"
  ],
  "next_best_action": "Ask for the Instagram profile and monthly content goals before recommending a package.",
  "follow_up_strategy": "consultative",
  "recommended_response_type": "discovery_question",
  "follow_up_message": "Halo Kak Dinda, terima kasih sudah menghubungi. Bisa banget Kak. Sebelum aku kasih gambaran paket yang paling cocok, boleh aku lihat dulu akun Instagram brand-nya dan target konten bulan ini seperti apa? Biar nanti aku bisa bantu arahkan apakah lebih cocok mulai dari content planning, desain feed, atau full social media management.",
  "crm_status": "qualified_hot",
  "next_follow_up_date": "2026-07-11",
  "owner_action_required": "Review and send the follow-up message manually.",
  "crm_note": "Potential monthly social media management client. Ask for Instagram profile and monthly content goals.",
  "quality_check": "passed",
  "risk_flags": [],
  "requires_human_review": true
}
```

---

# Fallback Output

Use this output when the lead cannot be safely processed.

```json
{
  "lead_id": "L000",
  "lead_category": "needs_review",
  "lead_score": null,
  "priority": "review",
  "score_breakdown": {
    "budget_clarity": 0,
    "timeline_urgency": 0,
    "service_clarity": 0,
    "buying_intent": 0
  },
  "qualification_reason": "The lead cannot be safely classified because critical information is missing or unclear.",
  "main_need": "",
  "hidden_need": "",
  "missing_information": [
    "budget",
    "timeline",
    "service need"
  ],
  "next_best_action": "Manual review required before drafting a follow-up message.",
  "follow_up_strategy": "manual_review",
  "recommended_response_type": "manual_review",
  "follow_up_message": "",
  "crm_status": "needs_review",
  "next_follow_up_date": "",
  "owner_action_required": "Review the lead manually and request missing information.",
  "crm_note": "Lead requires manual review because the available information is insufficient.",
  "quality_check": "needs_review",
  "risk_flags": [
    "manual_review_required"
  ],
  "requires_human_review": true
}
```

---

# Validation Rules

Before accepting the final output, check that:

1. Output is valid JSON.
2. `lead_id` is not empty.
3. `lead_category` uses an allowed value.
4. `lead_score` matches the score breakdown.
5. `priority` matches the lead category.
6. `crm_status` matches the lead category.
7. `follow_up_message` does not claim the message was sent.
8. `risk_flags` is an array.
9. `missing_information` is an array.
10. `requires_human_review` is always true.

---

# Definition of Done

This schema is complete when it defines:

1. Final JSON output structure
2. Field definitions
3. Allowed enum values
4. Example hot lead output
5. Fallback output
6. Validation rules
7. Mandatory human review rule
