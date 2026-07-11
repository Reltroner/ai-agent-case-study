# AI Lead Follow-Up Assistant — Case Study v0

## Overview

AI Lead Follow-Up Assistant is a self-built agentic workflow simulation designed to help small service businesses handle incoming leads more clearly and consistently.

The prototype simulates how AI can assist the lead follow-up process by classifying lead priority, extracting customer needs, generating follow-up drafts, recommending CRM status, and keeping human review before any message is sent.

This project focuses on practical business value, production-like workflow thinking, and Problem → Solution → Result reasoning instead of tool hype.

---

## Project Type

Self-built AI agentic workflow simulation prototype.

---

## Target User

Small service business owners who receive leads from:

* Instagram DM
* WhatsApp
* website forms
* referrals

Example businesses include:

* social media management services
* content agencies
* design services
* wedding organizers
* online course creators
* restaurants
* local service businesses

---

## Problem

Small service businesses often receive leads from multiple channels, but their follow-up process is still manual, scattered, and inconsistent.

This creates several business problems:

* serious prospects may be missed
* hot and cold leads are mixed together
* owners repeatedly write similar replies from scratch
* there is no clear lead priority
* there is no structured next action
* follow-up status is not tracked properly
* potential revenue can be lost because response handling is inconsistent

The core problem is not only communication speed.

The deeper problem is that incoming lead information is not transformed into structured business action.

---

## Problem Statement

Small service businesses often lose potential clients not because their service is bad, but because incoming leads are scattered, follow-up is manual, and serious prospects are not prioritized.

---

## Solution

The solution is an AI-assisted workflow that turns raw incoming lead information into structured follow-up actions.

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

The system processes each lead and produces:

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

## Agent Roles

The simulation is divided into seven agent roles.

### 1. Lead Intake Agent

Responsible for validating and normalizing incoming lead data.

### 2. Lead Qualification Agent

Responsible for scoring and classifying the lead using deterministic scoring rules.

### 3. Need Extraction Agent

Responsible for identifying the explicit and hidden needs of the lead.

### 4. Follow-Up Strategy Agent

Responsible for recommending the next best action and follow-up strategy.

### 5. Message Drafting Agent

Responsible for generating a natural follow-up draft for human review.

### 6. CRM Update Agent

Responsible for recommending lead status, CRM note, and next follow-up date.

### 7. QA Guard Agent

Responsible for checking whether the output is safe, reviewable, and free from risky assumptions.

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

Lead categories:

| Score Range | Category |
| ----------- | -------- |
| 75-100      | Hot      |
| 45-74       | Warm     |
| 0-44        | Cold     |

A category override rule is used when budget is missing.

If `budget_clarity` is `0`, the final lead category should not exceed `warm`, even if the total score reaches 75 or above.

This makes the simulation more realistic because a lead without budget information still requires commercial qualification.

---

## Human-in-the-Loop Safety

The system does not auto-send messages.

Every generated follow-up message is treated as a draft.

Each output must include:

```json
{
  "requires_human_review": true
}
```

This keeps the workflow realistic, safe, and easier for small business owners to trust.

The AI assists the owner, but the owner remains responsible for the final decision and message sending.

---

## Dataset

The prototype uses 10 sample leads.

The sample dataset includes different lead conditions:

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

Dataset file:

```text
data/sample-leads.csv
```

---

## Manual Simulation Outputs

The project generated 10 manual simulation outputs:

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

Each output follows the standard JSON schema defined in:

```text
docs/output-schema.md
```

---

## Manual Simulation Result Summary

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

## Example Output

For lead `L001`, the system classified the lead as hot because the lead had:

* clear service interest
* clear monthly budget
* this-month timeline
* active buying intent

The system produced:

* lead score: 90
* category: hot
* priority: high
* CRM status: qualified_hot
* follow-up strategy: consultative
* quality check: passed
* human review required: true

The AI-generated message was not sent automatically. It was prepared as a draft for owner review.

---

## QA Validation

The manual simulation was validated using:

```text
docs/qa-validation-checklist.md
```

The QA checklist verifies that:

* all outputs are valid JSON
* scores match score breakdowns
* categories are explainable
* CRM statuses match lead categories
* risk flags are reasonable
* follow-up messages are drafts only
* no message is auto-sent
* no output promises pricing, results, or delivery without confirmation
* every output requires human review

---

## Result

The simulation demonstrates that scattered lead inquiries can be transformed into structured, prioritized, and ready-to-review follow-up actions.

The prototype shows that an AI-assisted workflow can help small service businesses:

* identify which leads should be prioritized
* reduce repetitive follow-up writing
* clarify missing information
* standardize CRM status updates
* make follow-up actions more visible
* keep human control in the loop

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

## Engineering Value Demonstrated

This project demonstrates several engineering and product-thinking skills:

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

## Current Project State

The project has completed the manual simulation foundation.

Completed artifacts:

```text
data/sample-leads.csv
docs/project-framing.md
docs/lead-scoring-rules.md
docs/agent-roles.md
docs/output-schema.md
docs/qa-validation-checklist.md
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
```

---

## Next Step

The next step is to move from manual simulation into a semi-automated prototype.

Potential next phase:

```text
Google Form / Manual Trigger
-> n8n
-> AI Processing Node
-> JSON Parsing
-> Google Sheet Tracker
-> Owner Notification
-> Human Review
```

However, before moving to automation, the case study should be polished into a portfolio-ready version.
