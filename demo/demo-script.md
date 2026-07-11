# Demo Script — AI Lead Follow-Up Assistant

## Demo Title

AI Lead Follow-Up Assistant — Turning Scattered Leads into Structured Follow-Up Actions

---

## Demo Goal

This demo shows how an AI-assisted workflow can help small service businesses process incoming leads more clearly.

The goal is not to replace the business owner.

The goal is to reduce repetitive follow-up work, prioritize serious prospects, and keep every AI-generated message under human review.

---

## 1. Opening

Small service businesses often receive leads from Instagram DM, WhatsApp, website forms, or referrals.

The problem is that these leads are usually handled manually.

Some leads are serious.

Some are only asking for general information.

Some have clear budget and timeline.

Some do not.

Without a structured process, the owner may miss serious prospects, forget follow-ups, or spend too much time writing similar replies from scratch.

---

## 2. Problem Framing

The core problem is not just slow response time.

The deeper problem is that raw lead messages are not transformed into structured business actions.

Before this workflow, the process usually looks like this:

```text
Lead comes from DM or WhatsApp
-> owner reads manually
-> owner decides manually
-> owner writes reply from scratch
-> no clear priority
-> no structured next action
-> follow-up can be forgotten
```

---

## 3. Solution Overview

AI Lead Follow-Up Assistant simulates an AI-assisted workflow for lead follow-up.

The workflow is:

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
* customer need
* missing information
* next best action
* follow-up draft
* CRM status
* QA flags
* human review requirement

---

## 4. Show Sample Lead Input

Example lead:

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

This lead has:

* clear service interest
* clear budget
* this-month timeline
* active buying intent

---

## 5. Show Agent Processing

The agent evaluates the lead using four scoring criteria:

| Criteria         |  Score |
| ---------------- | -----: |
| Budget clarity   |     25 |
| Timeline urgency |     20 |
| Service clarity  |     25 |
| Buying intent    |     20 |
| **Total**        | **90** |

Because the total score is 90, the lead is classified as:

```text
hot lead
```

The CRM status becomes:

```text
qualified_hot
```

---

## 6. Show Structured Output

The system generates a structured JSON output.

Example result:

```json
{
  "lead_id": "L001",
  "lead_category": "hot",
  "lead_score": 90,
  "priority": "high",
  "crm_status": "qualified_hot",
  "quality_check": "passed",
  "requires_human_review": true
}
```

The system also identifies missing information:

```json
[
  "current Instagram account",
  "monthly content target",
  "brand style preference",
  "approval process"
]
```

---

## 7. Show Follow-Up Draft

The AI creates a follow-up draft:

```text
Halo Kak Dinda, terima kasih sudah menghubungi. Bisa banget Kak. Sebelum aku kasih gambaran paket yang paling cocok, boleh aku lihat dulu akun Instagram brand-nya dan target konten bulan ini seperti apa? Biar nanti aku bisa bantu arahkan apakah lebih cocok mulai dari content planning, desain feed, atau full social media management.
```

This message is not sent automatically.

It is only prepared for owner review.

---

## 8. Explain Human-in-the-Loop Safety

This system is not a fully autonomous sales bot.

The AI does not send messages.

Every output includes:

```json
{
  "requires_human_review": true
}
```

The owner still reviews the draft, adjusts the tone if needed, and sends the message manually.

This makes the workflow safer and more realistic for small businesses.

---

## 9. Show Simulation Result Summary

The prototype processed 10 sample leads.

Result summary:

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

## 10. Before and After

Before:

```text
Lead comes in
-> owner reads manually
-> owner decides manually
-> owner writes from scratch
-> no clear status
-> follow-up can be forgotten
```

After:

```text
Lead comes in
-> AI classifies priority
-> AI extracts need
-> AI identifies missing information
-> AI drafts follow-up
-> AI recommends CRM status
-> owner reviews
-> owner sends manually
```

---

## 11. Result Statement

This prototype shows how an AI-assisted workflow can turn scattered incoming leads into structured, prioritized, and ready-to-review follow-up actions.

The value is not only that AI can write messages.

The real value is that AI can help structure business decisions around lead follow-up.

---

## 12. Engineering Value

This project demonstrates:

* problem framing
* workflow decomposition
* agent role design
* deterministic scoring logic
* JSON output schema design
* QA guard design
* human-in-the-loop safety
* manual simulation before automation
* business-oriented system thinking

---

## 13. Closing

AI Lead Follow-Up Assistant is currently a manual agentic simulation prototype.

The next phase is to move into a semi-automated workflow:

```text
Google Form / Manual Trigger
-> n8n
-> AI Processing Node
-> JSON Parsing
-> Google Sheet Tracker
-> Owner Notification
-> Human Review
```

The goal is not to build a full CRM immediately.

The next goal is to prove:

```text
lead input -> AI processing -> structured output -> tracker update
```
