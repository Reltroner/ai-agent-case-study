## Journal Reference

Paper:

```text
Implementasi E-Commerce dengan Sistem Informasi Rekomendasi menggunakan Metode Collaborative Filtering untuk Pengembangan Penjualan pada UMKM
```

Journal:

```text
Jurnal Sistem Informasi Bisnis, Vol. 15 No. 1, 2025
```

Core topic:

```text
E-commerce, MSME, recommendation information system, collaborative filtering, sales development
```

---

## Journal-Based Problem

The journal describes several important MSME problems:

1. Many MSME still run traditional business processes.
2. MSME need better digital sales channels through e-commerce.
3. Many MSME lack proper promotional platforms.
4. Customers need help choosing MSME products quickly and accurately.
5. A recommendation system can help customers find relevant products.
6. Collaborative filtering can use MSME data, consumer data, and rating data to generate recommendations.

The journal uses collaborative filtering to recommend products based on user ratings and product similarity.

The recommendation process includes:

```text
rating data
-> average user rating
-> product similarity calculation
-> weighted prediction
-> highest predicted product recommendation
```

---

## Business Case Interpretation

The business case is not only:

```text
MSME need e-commerce.
```

The deeper business case is:

```text
MSME need a system that can understand customer interest, recommend the most relevant product or service, and help the owner follow up with the right offer.
```

This is where the existing AI Lead Follow-Up Assistant becomes valuable.

The old system already solves:

```text
lead inquiry
-> lead classification
-> follow-up draft
-> CRM status
-> human review
```

The journal adds a new layer:

```text
customer/product interaction
-> recommendation engine
-> next best offer
-> sales follow-up
```

The combined system becomes:

```text
customer inquiry
-> intent extraction
-> lead qualification
-> product/service recommendation
-> next best offer
-> follow-up draft
-> owner review
-> CRM and feedback tracker
```

---

## Existing Project Reuse Mapping

The current project is not wasted.

It becomes the foundation layer of the new architecture.

| Existing Artifact                       | New Role in Journal-Based Architecture |
| --------------------------------------- | -------------------------------------- |
| `data/sample-leads.csv`                 | Customer inquiry dataset               |
| `docs/project-framing.md`               | Original business problem framing      |
| `docs/lead-scoring-rules.md`            | Lead qualification logic               |
| `docs/agent-roles.md`                   | Base agent decomposition               |
| `docs/output-schema.md`                 | Structured output contract             |
| `prompts/lead-followup-agent-v1.md`     | Follow-up drafting agent prompt        |
| `outputs/manual-test-L001-L010.json`    | Lead-processing test cases             |
| `docs/qa-validation-checklist.md`       | QA and safety validation layer         |
| `docs/google-sheet-tracker-design.md`   | CRM tracker foundation                 |
| `tracker/lead-tracker-columns.csv`      | Lead tracker schema                    |
| `docs/n8n-workflow-design.md`           | Automation orchestration baseline      |
| `n8n/manual-trigger-sample.json`        | Hot lead workflow test payload         |
| `n8n/manual-trigger-review-sample.json` | Low-intent / review-path test payload  |

---

## New Project Direction

## Previous Direction

```text
AI Lead Follow-Up Assistant
```

Main purpose:

```text
Help small service businesses classify leads, draft follow-up messages, and track CRM status with human review.
```

## New Direction

```text
AI Sales Recommendation & Follow-Up Assistant for MSME
```

Main purpose:

```text
Help MSME understand customer interest, recommend relevant products or services, generate next-best-offer follow-up drafts, and track owner-reviewed sales actions.
```

---

## Updated Problem Statement

MSME often struggle not only because they reply slowly, but because customer interest is not converted into a relevant sales recommendation.

Incoming messages, product interest, customer preferences, budget signals, and prior interactions are often scattered.

As a result:

* owners respond manually
* customer intent is not structured
* product or service recommendations are not data-informed
* follow-up messages are not tied to the best offer
* customer response history is not reused
* sales opportunities can be lost

---

## Updated Solution Statement

AI Sales Recommendation & Follow-Up Assistant for MSME is a journal-informed AI agent architecture that combines:

* customer inquiry intake
* intent extraction
* lead qualification
* product/service catalog matching
* recommendation engine
* next best offer generation
* follow-up draft generation
* QA guard
* human review
* CRM and feedback tracking

The system is designed to help MSME turn customer inquiries and interaction data into structured, relevant, and owner-reviewed sales actions.

---

## Updated Result Goal

The final engineering snapshot should demonstrate:

```text
customer inquiry
-> customer intent extraction
-> lead qualification
-> product/service recommendation
-> next best offer
-> follow-up draft
-> human review
-> tracker update
-> customer feedback loop
```

The result is not just faster reply generation.

The result is a more structured sales decision workflow.

---

## Journal-to-System Mapping

| Journal Concept                   | System Architecture Interpretation        |
| --------------------------------- | ----------------------------------------- |
| MSME sales development            | Business goal                             |
| E-commerce platform               | Digital sales channel                     |
| Recommendation information system | Recommendation engine layer               |
| MSME data                         | Product/service catalog                   |
| Consumer data                     | Customer profile and inquiry data         |
| Rating data                       | Customer feedback and interaction data    |
| Collaborative filtering           | Recommendation algorithm simulation       |
| Highest predictive value          | Recommended product/service               |
| Product displayed to consumers    | Next best offer shown to owner/customer   |
| Effective marketing platform      | CRM + recommendation + follow-up workflow |

---

## Final Target Architecture

```text
Customer Channels
-> Lead & Interaction Intake
-> Data Normalization
-> Customer Intent Extraction Agent
-> Lead Qualification Agent
-> Product / Service Catalog
-> Recommendation Engine
-> Next Best Offer Agent
-> Follow-Up Drafting Agent
-> QA Guard Agent
-> Human Review
-> CRM / Google Sheet Tracker
-> Customer Response & Rating Feedback
-> Recommendation Data Store
```

---

## Architecture Diagram

```text
[Instagram DM / WhatsApp / Form / E-Commerce Interaction]
                    |
                    v
        [Lead & Interaction Intake Layer]
                    |
                    v
          [Normalization & Validation]
                    |
                    v
        [Customer Intent Extraction Agent]
                    |
                    v
        [Lead Qualification Agent]
                    |
                    v
        [Product / Service Catalog]
                    |
                    v
        [Recommendation Engine]
        - rule-based matching
        - collaborative filtering simulation
        - rating / interaction scoring
                    |
                    v
        [Next Best Offer Agent]
                    |
                    v
        [Follow-Up Drafting Agent]
                    |
                    v
        [QA Guard Agent]
                    |
                    v
        [Human Review Layer]
                    |
                    v
        [CRM / Google Sheet Tracker]
                    |
                    v
        [Customer Response / Rating / Feedback]
                    |
                    v
        [Recommendation Learning Data]
```

---

## New Core Modules

## 1. Lead & Interaction Intake Layer

Purpose:

```text
Capture customer inquiry and product/service interaction.
```

Input examples:

* Instagram DM
* WhatsApp message
* Google Form
* product inquiry
* service inquiry
* rating
* manual owner entry

---

## 2. Customer Intent Extraction Agent

Purpose:

```text
Extract customer intent from raw inquiry text.
```

Output example:

```json
{
  "customer_intent": "looking_for_service",
  "interest_type": "social_media_management",
  "problem_signal": "needs help managing Instagram",
  "preference_signal": "monthly support",
  "urgency_signal": "this month"
}
```

---

## 3. Lead Qualification Agent

Purpose:

```text
Score and classify the lead using the existing deterministic rules.
```

This reuses:

```text
docs/lead-scoring-rules.md
```

Existing score criteria:

* budget clarity
* timeline urgency
* service clarity
* buying intent

---

## 4. Product / Service Catalog Layer

Purpose:

```text
Store available MSME products or services that can be recommended.
```

Initial MVP can use service catalog instead of full product catalog.

Future file:

```text
data/service-catalog.json
```

Example:

```json
[
  {
    "offer_id": "SVC001",
    "offer_name": "Instagram Feed Design Starter",
    "category": "design",
    "best_for": ["coffee shop", "small brand", "low budget"],
    "price_range": "under 1 juta",
    "required_context": ["number of designs", "style reference"]
  },
  {
    "offer_id": "SVC002",
    "offer_name": "Monthly Social Media Management",
    "category": "social_media_management",
    "best_for": ["skincare brand", "restaurant", "fashion brand"],
    "price_range": "2-5 juta/bulan",
    "required_context": ["current account", "monthly content target"]
  },
  {
    "offer_id": "SVC003",
    "offer_name": "Launch Content Package",
    "category": "campaign",
    "best_for": ["fashion brand", "product launch"],
    "price_range": "3-8 juta/project",
    "required_context": ["launch date", "target audience", "asset needs"]
  }
]
```

---

## 5. Recommendation Engine

Purpose:

```text
Recommend the most relevant product or service based on customer intent, catalog fit, and interaction data.
```

The recommendation engine should evolve in three levels.

### Level 1 — Rule-Based Recommendation MVP

Use:

```text
customer intent
+ service interest
+ business type
+ budget range
+ timeline
```

To recommend:

```text
best matching offer
```

Example:

```text
Skincare Brand
+ Social Media Management
+ 2-3 juta/bulan
+ Bulan ini
= Monthly Social Media Management
```

### Level 2 — Interaction-Based Recommendation

Add customer behavior signals:

```text
viewed_offer
asked_price
requested_portfolio
accepted_proposal
rejected_offer
sent_rating
```

### Level 3 — Collaborative Filtering Simulation

Use rating or interaction data to simulate collaborative filtering.

Input data:

```text
customer_id
offer_id
rating
interaction_type
created_at
```

Process:

```text
rating data
-> average customer rating
-> offer similarity
-> weighted prediction
-> highest positive recommendation
```

---

## 6. Next Best Offer Agent

Purpose:

```text
Convert recommendation engine output into a sales action.
```

Output example:

```json
{
  "recommended_offer_id": "SVC002",
  "recommended_offer_name": "Monthly Social Media Management",
  "recommendation_reason": "The lead is a skincare brand asking for monthly Instagram management with clear budget and this-month timeline.",
  "recommendation_confidence": "high",
  "offer_action": "ask_discovery_before_package"
}
```

---

## 7. Follow-Up Drafting Agent

Purpose:

```text
Draft a follow-up message using customer intent, lead score, recommended offer, missing information, and human review rule.
```

Example:

```text
Halo Kak Dinda, bisa banget Kak. Dari kebutuhan Kakak untuk kelola IG skincare brand dengan timeline bulan ini, kemungkinan paling cocok arahnya ke monthly social media management. Sebelum aku kasih rekomendasi paket, boleh aku lihat akun Instagram-nya dan target konten bulan ini seperti apa?
```

---

## 8. QA Guard Agent

Purpose:

```text
Validate recommendation and follow-up draft before owner review.
```

Existing QA rules remain active.

Additional recommendation-specific risk flags:

```text
low_recommendation_confidence
insufficient_interaction_data
cold_start_customer
cold_start_offer
offer_budget_mismatch
recommendation_needs_review
```

---

## 9. Human Review Layer

Purpose:

```text
Keep the owner in control.
```

The system must not auto-send messages.

Workflow:

```text
AI recommends
-> AI drafts
-> owner reviews
-> owner approves / edits / rejects
-> owner sends manually
```

---

## 10. CRM and Feedback Tracker

Purpose:

```text
Store lead data, AI output, recommendation output, owner review, customer response, and rating feedback.
```

Future tracker extension:

```text
tracker/recommendation-tracker-columns.csv
```

Potential new columns:

```text
customer_id
recommended_offer_id
recommended_offer_name
recommendation_score
recommendation_confidence
recommendation_reason
offer_action
customer_response
customer_rating
interaction_type
feedback_recorded_at
```

---

## Final Engineering Snapshot Target

The final target is:

```text
Journal-informed AI agent architecture for MSME sales recommendation and follow-up.
```

The final snapshot should prove:

1. Lead inquiry can be captured.
2. Customer intent can be extracted.
3. Lead priority can be scored.
4. Product/service catalog can be matched.
5. A relevant offer can be recommended.
6. A follow-up message can be drafted.
7. QA guard can detect risk.
8. Owner review is preserved.
9. CRM tracker stores the sales action.
10. Customer response or rating can feed future recommendations.

---

## Updated Repository Direction

Add these new artifacts without deleting the previous project foundation:

```text
docs/
  journal-business-case-mapping.md
  final-system-architecture.md
  recommendation-engine-design.md
  customer-interaction-model.md
  recommendation-output-schema.md

data/
  service-catalog.json
  customer-interactions.csv
  sample-ratings.csv

tracker/
  recommendation-tracker-columns.csv

n8n/
  recommendation-node-prompt.md

outputs/
  recommendation-test-C001.json

case-study/
  ai-sales-recommendation-followup-case-study-v1.md
```

---

## Roadmap After This Pivot

## Phase 2A — Stabilize Existing Automation

Continue the current semi-automated workflow:

```text
manual trigger
-> AI processing
-> JSON parsing
-> Google Sheet lead tracker
```

## Phase 2B — Add Recommendation Layer

Add:

```text
service catalog
customer interaction schema
rule-based recommendation logic
next best offer agent
recommendation output schema
```

## Phase 3 — Collaborative Filtering Simulation

Build a simple simulation:

```text
sample-ratings.csv
-> average rating
-> similarity matrix
-> weighted prediction
-> recommended offer
```

## Phase 4 — Portfolio Case Study v1

Upgrade case study from:

```text
AI Lead Follow-Up Assistant
```

Into:

```text
AI Sales Recommendation & Follow-Up Assistant for MSME
```

---

## Strategic Decision

The existing project should not be discarded.

The project should be extended.

Final strategic framing:

```text
AI Lead Follow-Up Assistant is the CRM and follow-up foundation.

The journal-based recommendation layer turns it into an AI Sales Recommendation & Follow-Up Assistant for MSME.
```

This creates a stronger portfolio because it combines:

* AI agent workflow
* MSME business problem
* recommendation system concept
* lead qualification
* sales follow-up
* CRM tracking
* human review safety
* scientific-journal-informed architecture

---

## Definition of Done

This chunk is complete when:

1. `docs/journal-business-case-mapping.md` exists.
2. The journal problem is summarized.
3. The business case is translated into system architecture.
4. Existing project artifacts are mapped to the new architecture.
5. The new project direction is defined.
6. The final architecture direction is documented.
7. Recommendation layer modules are identified.
8. Human review safety remains preserved.
9. The next roadmap is clear.

