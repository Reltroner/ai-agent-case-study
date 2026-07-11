# Agent Roles — AI Lead Follow-Up Assistant

## Purpose

This document defines the agent roles used in the AI Lead Follow-Up Assistant simulation.

The goal is to split the workflow into clear, modular responsibilities so the system does not behave like a single generic chatbot.

Each agent has a focused role in the lead follow-up process.

The full workflow is:

```text
Lead Input
-> Lead Intake Agent
-> Lead Qualification Agent
-> Need Extraction Agent
-> Follow-Up Strategy Agent
-> Message Drafting Agent
-> CRM Update Agent
-> QA Guard Agent
-> Human Review
```

---

## Core Principle

This system is not a fully autonomous sales bot.

It is an AI-assisted workflow with human review.

The AI may:

* clean lead data
* classify lead priority
* extract customer needs
* suggest next action
* draft follow-up messages
* recommend CRM status
* check quality and risk

The AI must not:

* send messages automatically
* promise pricing without confirmation
* invent missing information
* override human judgment
* mark a deal as won without owner decision

---

# 1. Lead Intake Agent

## Responsibility

The Lead Intake Agent receives raw lead information and converts it into a clean standard format.

This agent is responsible for preparing the lead data before any scoring or drafting happens.

## Input

Example raw lead:

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

## Tasks

* Validate required fields
* Normalize lead data
* Preserve the original message
* Detect missing fields
* Prepare structured input for the next agent

## Output

```json
{
  "lead_id": "L001",
  "lead_name": "Dinda",
  "business_type": "Skincare Brand",
  "source": "Instagram DM",
  "service_interest": "Social Media Management",
  "budget_range": "2-3 juta/bulan",
  "timeline": "Bulan ini",
  "raw_message": "Kak bisa bantu kelola IG brand skincare aku?",
  "missing_fields": []
}
```

## Failure Case

If critical fields are missing, the agent should flag the lead for review.

```json
{
  "lead_id": "L001",
  "missing_fields": ["message"],
  "requires_manual_review": true
}
```

---

# 2. Lead Qualification Agent

## Responsibility

The Lead Qualification Agent scores and classifies the lead using the deterministic scoring rules.

This agent must follow the rules defined in:

```text
docs/lead-scoring-rules.md
```

## Tasks

* Score budget clarity
* Score timeline urgency
* Score service clarity
* Score buying intent
* Calculate total lead score
* Classify the lead as hot, warm, or cold
* Provide a short reason for the classification

## Scoring Criteria

```text
Budget clarity: 0-25
Timeline urgency: 0-25
Service clarity: 0-25
Buying intent: 0-25
Total: 0-100
```

## Category Mapping

```text
75-100 = Hot Lead
45-74 = Warm Lead
0-44 = Cold Lead
```

## Output

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
  "qualification_reason": "The lead has a clear service interest, clear budget, near-term timeline, and active buying intent."
}
```

---

# 3. Need Extraction Agent

## Responsibility

The Need Extraction Agent identifies what the lead actually needs.

This agent separates explicit needs from hidden or implied needs.

## Tasks

* Identify the main service need
* Detect hidden business need
* List missing information
* Clarify what the owner should ask next
* Avoid assuming details that were not provided

## Output

```json
{
  "lead_id": "L001",
  "main_need": "Monthly Instagram social media management",
  "hidden_need": "Consistent content planning and brand presence",
  "missing_information": [
    "current Instagram account",
    "monthly content target",
    "brand style preference",
    "approval process"
  ]
}
```

## Rule

The agent must not invent client requirements.

If information is not available, it must be placed under:

```json
{
  "missing_information": []
}
```

---

# 4. Follow-Up Strategy Agent

## Responsibility

The Follow-Up Strategy Agent decides the next best action.

This agent determines how the owner should respond without being too aggressive or salesy.

## Tasks

* Recommend next best action
* Choose the follow-up strategy
* Decide whether the response should ask questions, explain service, qualify budget, or suggest a call
* Avoid hard-selling too early
* Keep the response aligned with the lead category

## Strategy Types

```text
consultative
discovery_question
pricing_clarification
timeline_clarification
portfolio_offer
proposal_next_step
manual_review
```

## Output

```json
{
  "lead_id": "L001",
  "next_best_action": "Ask for Instagram profile and monthly content goals before recommending a package.",
  "follow_up_strategy": "consultative",
  "recommended_response_type": "discovery_question"
}
```

---

# 5. Message Drafting Agent

## Responsibility

The Message Drafting Agent creates a follow-up draft for the owner to review.

The message must sound natural, polite, consultative, and not too robotic.

## Tasks

* Draft a follow-up message
* Match the lead context
* Keep the tone friendly and professional
* Ask relevant next-step questions
* Avoid overpromising
* Avoid sounding too AI-generated

## Tone Rules

The message should be:

```text
friendly
professional
consultative
clear
not pushy
not overly formal
not too long
```

## Output

```json
{
  "lead_id": "L001",
  "follow_up_message": "Halo Kak Dinda, terima kasih sudah menghubungi. Bisa banget Kak. Sebelum aku kasih gambaran paket yang paling cocok, boleh aku lihat dulu akun Instagram brand-nya dan target konten bulan ini seperti apa? Biar nanti aku bisa bantu arahkan apakah lebih cocok mulai dari content planning, desain feed, atau full social media management."
}
```

## Restriction

The agent must not claim that the message has been sent.

It only creates a draft.

---

# 6. CRM Update Agent

## Responsibility

The CRM Update Agent recommends the lead status and next follow-up action.

This agent prepares the output so it can be stored in a tracker, Google Sheet, database, or dashboard later.

## Tasks

* Recommend CRM status
* Recommend next follow-up date
* Create CRM note
* Set owner action required
* Keep the lead ready for human review

## CRM Status Options

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

## Output

```json
{
  "lead_id": "L001",
  "crm_status": "qualified_hot",
  "next_follow_up_date": "2026-07-11",
  "owner_action_required": "Review and send follow-up message manually.",
  "crm_note": "Potential monthly social media management client. Ask for Instagram profile and monthly content goals."
}
```

---

# 7. QA Guard Agent

## Responsibility

The QA Guard Agent checks whether the final output is safe, realistic, and ready for human review.

This agent acts as a quality control layer before the owner sees the final recommendation.

## Tasks

* Check whether the output uses valid JSON
* Check whether the message is too aggressive
* Check whether the AI invented information
* Check whether required fields are missing
* Check whether human review is enabled
* Add risk flags when needed

## Risk Flags

Possible risk flags:

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

## Output

```json
{
  "lead_id": "L001",
  "quality_check": "passed",
  "risk_flags": [],
  "requires_human_review": true,
  "qa_note": "The message is safe to review and does not auto-send or overpromise."
}
```

## Failure Output

```json
{
  "lead_id": "L001",
  "quality_check": "needs_review",
  "risk_flags": ["missing_budget", "missing_timeline"],
  "requires_human_review": true,
  "qa_note": "Lead needs manual review because budget and timeline are unclear."
}
```

---

# Final Combined Agent Output

The final output of the workflow should follow this standard structure:

```json
{
  "lead_id": "",
  "lead_category": "hot | warm | cold | needs_review",
  "lead_score": 0,
  "priority": "high | medium | low | review",
  "score_breakdown": {
    "budget_clarity": 0,
    "timeline_urgency": 0,
    "service_clarity": 0,
    "buying_intent": 0
  },
  "qualification_reason": "",
  "main_need": "",
  "hidden_need": "",
  "missing_information": [],
  "next_best_action": "",
  "follow_up_strategy": "",
  "recommended_response_type": "",
  "follow_up_message": "",
  "crm_status": "",
  "next_follow_up_date": "",
  "owner_action_required": "",
  "crm_note": "",
  "quality_check": "passed | needs_review",
  "risk_flags": [],
  "requires_human_review": true
}
```

---

# Agent Boundary Rules

## Lead Intake Agent

Should only clean, validate, and normalize input.

It should not score the lead.

## Lead Qualification Agent

Should only score and classify.

It should not write the follow-up message.

## Need Extraction Agent

Should only extract needs and missing information.

It should not decide CRM status.

## Follow-Up Strategy Agent

Should only decide the next best action and strategy.

It should not write the final full message.

## Message Drafting Agent

Should only draft the message.

It should not claim the message was sent.

## CRM Update Agent

Should only recommend status, notes, and next follow-up date.

It should not override the human decision.

## QA Guard Agent

Should only validate the final output.

It should not change the business meaning unless there is a safety or quality issue.

---

# Human-in-the-Loop Rule

Every final output must include:

```json
{
  "requires_human_review": true
}
```

The owner must review the AI-generated follow-up draft before sending it to the lead.

The system must never auto-send a message in the MVP simulation.

---

# Definition of Done

This document is complete when it defines:

1. Lead Intake Agent
2. Lead Qualification Agent
3. Need Extraction Agent
4. Follow-Up Strategy Agent
5. Message Drafting Agent
6. CRM Update Agent
7. QA Guard Agent
8. Final combined output structure
9. Agent boundary rules
10. Human-in-the-loop rule
