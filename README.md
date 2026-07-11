# AI Lead Follow-Up Assistant

AI Lead Follow-Up Assistant is a self-built AI agentic workflow simulation designed to help small service businesses turn scattered lead inquiries into structured, prioritized, and ready-to-review follow-up actions.

This project focuses on **Problem → Solution → Result**, production-like workflow design, deterministic scoring, human-in-the-loop safety, and practical business value instead of AI tool hype.

---

## Problem

Small service businesses often receive leads from multiple channels:

* Instagram DM
* WhatsApp
* website forms
* referrals

However, their follow-up process is often still manual, scattered, and inconsistent.

This creates several problems:

* serious prospects may be missed
* hot and cold leads are mixed together
* owners repeatedly write similar replies from scratch
* there is no clear lead priority
* there is no structured next action
* follow-up status is not tracked properly

The deeper problem is that incoming lead information is not transformed into structured business action.

---

## Solution

This prototype simulates an AI-assisted workflow that processes each lead and produces structured follow-up recommendations.

The workflow:

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

The system produces:

* lead category
* lead score
* priority level
* score breakdown
* qualification reason
* main need
* hidden need
* missing information
* next best action
* follow-up strategy
* follow-up draft
* CRM status
* next follow-up date
* risk flags
* human review flag

---

## Human-in-the-Loop Safety

This system is not a fully autonomous sales bot.

The AI does not send messages automatically.

Every generated follow-up message is treated as a draft and must be reviewed by a human before sending.

Each output includes:

```json
{
  "requires_human_review": true
}
```

---

## Agent Roles

The simulation is divided into seven agent roles:

| Agent                    | Responsibility                                |
| ------------------------ | --------------------------------------------- |
| Lead Intake Agent        | Validates and normalizes incoming lead data   |
| Lead Qualification Agent | Scores and classifies the lead                |
| Need Extraction Agent    | Extracts explicit and hidden customer needs   |
| Follow-Up Strategy Agent | Recommends the next best action               |
| Message Drafting Agent   | Generates a follow-up draft                   |
| CRM Update Agent         | Recommends CRM status and next follow-up date |
| QA Guard Agent           | Checks safety, quality, and review readiness  |

---

## Lead Scoring Logic

Each lead is scored from 0 to 100 using four criteria:

| Criteria         | Maximum Points |
| ---------------- | -------------: |
| Budget clarity   |             25 |
| Timeline urgency |             25 |
| Service clarity  |             25 |
| Buying intent    |             25 |
| **Total**        |        **100** |

Lead category mapping:

| Score Range | Category |
| ----------- | -------- |
| 75-100      | Hot      |
| 45-74       | Warm     |
| 0-44        | Cold     |

A category override rule is used when budget is missing.

If `budget_clarity` is `0`, the final category should not exceed `warm`, even if the total score reaches 75 or above.

---

## Dataset

The prototype uses 10 sample leads stored in:

```text
data/sample-leads.csv
```

The dataset includes different lead conditions:

* hot leads
* warm leads
* cold leads
* clear budget
* missing budget
* urgent timeline
* unclear timeline
* strong buying intent
* low buying intent
* specific service requests
* general service inquiries

---

## Manual Simulation Outputs

The manual simulation generated 10 structured JSON outputs:

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

Each output follows the schema defined in:

```text
docs/output-schema.md
```

---

## Result Summary

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

---

## Before and After

### Before

```text
Lead comes from DM or WhatsApp
-> owner reads manually
-> owner decides manually
-> owner writes reply from scratch
-> no clear priority
-> no structured next action
-> follow-up can be forgotten
```

### After

```text
Lead comes in
-> AI classifies priority
-> AI extracts need
-> AI identifies missing information
-> AI drafts follow-up message
-> AI recommends CRM status
-> owner reviews
-> owner sends manually
```

---

## Project Structure

```text
data/
  sample-leads.csv

docs/
  project-framing.md
  lead-scoring-rules.md
  agent-roles.md
  output-schema.md
  qa-validation-checklist.md
  target-engineering.txt

prompts/
  lead-followup-agent-v1.md

outputs/
  manual-test-L001.json
  manual-test-L002.json
  manual-test-L003.json
  manual-test-L004.json
  manual-test-L005.json
  manual-test-L006.json
  manual-test-L007.json
  manual-test-L008.json
  manual-test-L009.json
  manual-test-L010.json

case-study/
  ai-lead-followup-assistant-case-study-v0.md
```

---

## Engineering Value Demonstrated

This project demonstrates:

* problem framing
* workflow decomposition
* agent role design
* deterministic scoring logic
* JSON output schema design
* QA guard design
* human-in-the-loop safety
* manual simulation before automation
* structured documentation
* business-oriented system thinking

---

## Current Status

The project has completed the manual simulation foundation.

Completed:

* project framing
* sample lead dataset
* lead scoring rules
* agent role design
* JSON output schema
* prompt v1
* 10 manual simulation outputs
* QA validation checklist
* case study v0

---

## Next Step

The next phase is to move from manual simulation into a semi-automated prototype.

Potential workflow:

```text
Google Form / Manual Trigger
-> n8n
-> AI Processing Node
-> JSON Parsing
-> Google Sheet Tracker
-> Owner Notification
-> Human Review
```

The goal is not to build a full CRM yet.

The next goal is to prove:

```text
lead input -> AI processing -> structured output -> tracker update
```
