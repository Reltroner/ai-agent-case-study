# Phase 1 Final Snapshot — AI Lead Follow-Up Assistant

## Snapshot Status

Phase 1 is complete.

The project has successfully built a manual agentic simulation foundation for the AI Lead Follow-Up Assistant.

This phase proves that scattered lead inquiries can be transformed into structured, prioritized, and ready-to-review follow-up actions through a deterministic AI-assisted workflow.

---

## Project Objective

AI Lead Follow-Up Assistant is a self-built AI agentic workflow simulation designed for small service businesses.

The goal is to help business owners process incoming leads more clearly by using AI to:

* classify lead priority
* extract customer needs
* identify missing information
* draft follow-up messages
* recommend CRM status
* apply QA checks
* keep human review before sending

This is not a fully autonomous sales bot.

This is an AI-assisted workflow with human-in-the-loop safety.

---

## Phase 1 Scope

Phase 1 focused on manual simulation before automation.

The goal was not to integrate n8n, Google Sheets, WhatsApp API, or a full CRM yet.

The goal was to prove the core logic first.

Phase 1 covered:

* project framing
* sample lead dataset
* deterministic scoring rules
* modular agent roles
* JSON output schema
* prompt v1 design
* 10 manual simulation outputs
* QA validation checklist
* case study v0
* README portfolio framing
* demo script

---

## Completed Artifacts

```text
data/sample-leads.csv

docs/project-framing.md
docs/lead-scoring-rules.md
docs/agent-roles.md
docs/output-schema.md
docs/qa-validation-checklist.md
docs/target-engineering.txt
docs/phase-1-final-snapshot.md

prompts/lead-followup-agent-v1.md

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

case-study/ai-lead-followup-assistant-case-study-v0.md

demo/demo-script.md

README.md
```

---

## Workflow Built

The simulated workflow is:

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

## Agent Roles Completed

Phase 1 defines seven agent roles:

| Agent                    | Role                                          |
| ------------------------ | --------------------------------------------- |
| Lead Intake Agent        | Validates and normalizes lead data            |
| Lead Qualification Agent | Scores and classifies leads                   |
| Need Extraction Agent    | Extracts explicit and hidden needs            |
| Follow-Up Strategy Agent | Recommends next best action                   |
| Message Drafting Agent   | Creates follow-up draft                       |
| CRM Update Agent         | Recommends CRM status and next follow-up date |
| QA Guard Agent           | Checks safety, quality, and review readiness  |

---

## Scoring Logic Completed

Each lead is scored from 0 to 100 using four criteria:

| Criteria         | Maximum Points |
| ---------------- | -------------: |
| Budget clarity   |             25 |
| Timeline urgency |             25 |
| Service clarity  |             25 |
| Buying intent    |             25 |
| **Total**        |        **100** |

Lead categories:

| Score Range | Category |
| ----------- | -------- |
| 75-100      | Hot      |
| 45-74       | Warm     |
| 0-44        | Cold     |

Category override rule:

If `budget_clarity` is `0`, the final lead category should not exceed `warm`, even if the total score reaches 75 or above.

This prevents leads with missing budget information from being treated as fully qualified hot leads before commercial qualification.

---

## Output Schema Completed

Each output follows this structured JSON schema:

```json
{
  "lead_id": "",
  "lead_category": "",
  "lead_score": 0,
  "priority": "",
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
  "quality_check": "",
  "risk_flags": [],
  "requires_human_review": true
}
```

---

## Manual Simulation Coverage

The prototype processed 10 sample leads.

| Lead ID | Score | Category | Priority | CRM Status     | QA Status    |
| ------- | ----: | -------- | -------- | -------------- | ------------ |
| L001    |    90 | hot      | high     | qualified_hot  | passed       |
| L002    |    55 | warm     | medium   | qualified_warm | needs_review |
| L003    |    95 | hot      | high     | qualified_hot  | passed       |
| L004    |    75 | warm     | medium   | qualified_warm | needs_review |
| L005    |    95 | hot      | high     | qualified_hot  | passed       |
| L006    |    15 | cold     | low      | qualified_cold | needs_review |
| L007    |    90 | hot      | high     | qualified_hot  | passed       |
| L008    |   100 | hot      | high     | qualified_hot  | passed       |
| L009    |    60 | warm     | medium   | qualified_warm | needs_review |
| L010    |    95 | hot      | high     | qualified_hot  | passed       |

Manual simulation coverage:

```text
10/10 leads completed
```

---

## QA Result

The manual simulation passed the initial QA requirement.

Validated rules:

* all outputs are valid JSON
* scores match score breakdowns
* categories are explainable
* CRM statuses match lead categories
* risk flags are reasonable
* follow-up messages are drafts only
* no message is auto-sent
* no output promises pricing, results, or delivery without confirmation
* every output includes `requires_human_review: true`

---

## Human-in-the-Loop Safety

The system does not auto-send messages.

Every follow-up message is generated as a draft.

Every output includes:

```json
{
  "requires_human_review": true
}
```

The owner must review and manually send the message.

This makes the workflow safer, more realistic, and more acceptable for small service businesses.

---

## Problem → Solution → Result

## Problem

Small service businesses receive leads from multiple channels, but follow-up is often manual, scattered, and inconsistent.

As a result, serious prospects may be missed, owners repeatedly write similar replies from scratch, and there is no clear system for prioritizing leads.

## Solution

AI Lead Follow-Up Assistant simulates an AI-assisted workflow that captures lead information, classifies priority, extracts needs, generates follow-up drafts, recommends CRM status, and keeps human review before sending.

## Result

The simulation shows that scattered lead inquiries can become structured, prioritized, and ready-to-review follow-up actions.

The system helps reduce repetitive follow-up writing, clarify missing information, standardize CRM status, and make next actions more visible.

---

## Engineering Value Demonstrated

Phase 1 demonstrates:

* business problem framing
* workflow decomposition
* agent role design
* deterministic scoring logic
* JSON schema design
* prompt design
* QA guard design
* human-in-the-loop safety
* manual simulation before automation
* structured documentation
* portfolio-ready case study framing

---

## Final Phase 1 Conclusion

Phase 1 successfully proves the core workflow logic of AI Lead Follow-Up Assistant.

The project is now ready to move from manual simulation into a semi-automated prototype.

The next phase should prove:

```text
lead input -> AI processing -> structured output -> tracker update
```

---

## Recommended Phase 2 Direction

Phase 2 should focus on semi-automation using:

```text
Google Form / Manual Trigger
-> n8n
-> AI Processing Node
-> JSON Parsing
-> Google Sheet Tracker
-> Owner Notification
-> Human Review
```

Phase 2 should not build a full CRM yet.

The next engineering goal is to validate input-to-output automation while preserving the same schema, scoring rules, QA guard, and human review principle.
