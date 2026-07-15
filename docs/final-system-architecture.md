# Final System Architecture — AI Sales Recommendation & Follow-Up Assistant for UMKM

## Purpose

This document defines the final target system architecture for the AI Sales Recommendation & Follow-Up Assistant for UMKM.

This architecture extends the existing AI Lead Follow-Up Assistant project into a journal-informed sales recommendation system.

The goal is not to discard the previous work.

The goal is to upgrade the previous lead follow-up workflow into a stronger business and engineering architecture that combines:

* lead intake
* customer intent extraction
* lead qualification
* product/service recommendation
* next best offer generation
* follow-up drafting
* QA guard
* human review
* CRM tracking
* customer feedback loop
* future collaborative filtering simulation

---

## Final System Name

```text
AI Sales Recommendation & Follow-Up Assistant for UMKM
```

---

## Final System Positioning

This system is an AI-assisted sales workflow for UMKM.

It helps small business owners process incoming customer inquiries, understand customer interest, recommend relevant products or services, draft follow-up messages, and track the result with human review.

The system does not replace the owner.

The system supports the owner by turning scattered customer interaction into structured sales actions.

---

## Scientific Journal Foundation

The system is inspired by a scientific journal case about implementing e-commerce with a recommendation information system using collaborative filtering for UMKM sales development.

The journal-based idea is:

```text
UMKM need better digital sales channels.
Customers need help finding suitable products.
Recommendation systems can support product selection.
Collaborative filtering can use customer rating data to recommend relevant products.
```

The architecture translates that into a practical AI-agent workflow:

```text
Customer inquiry
-> customer intent extraction
-> lead qualification
-> product/service recommendation
-> next best offer
-> follow-up draft
-> owner review
-> CRM and feedback tracking
```

---

## Existing Project Foundation

The previous AI Lead Follow-Up Assistant remains the foundation.

Existing capabilities:

* lead input dataset
* deterministic lead scoring
* agent role design
* structured JSON output schema
* follow-up draft generation
* QA validation
* human review safety
* Google Sheet tracker design
* n8n workflow design

Existing project role in the new system:

```text
AI Lead Follow-Up Assistant
= CRM + qualification + follow-up foundation
```

New architecture role:

```text
Recommendation layer
= product/service matching + next best offer + feedback loop
```

Combined system:

```text
AI Sales Recommendation & Follow-Up Assistant for UMKM
= lead qualification + recommendation engine + follow-up workflow + human review tracker
```

---

# 1. High-Level Architecture

```text
Customer Channels
-> Lead & Interaction Intake Layer
-> Data Normalization Layer
-> Customer Intent Extraction Agent
-> Lead Qualification Agent
-> Product / Service Catalog Layer
-> Recommendation Engine
-> Next Best Offer Agent
-> Follow-Up Drafting Agent
-> QA Guard Agent
-> Human Review Layer
-> CRM / Google Sheet Tracker
-> Customer Response & Rating Feedback
-> Recommendation Data Store
```

---

# 2. Architecture Diagram

```text
[Instagram DM / WhatsApp / Form / E-Commerce Interaction]
                    |
                    v
        [Lead & Interaction Intake Layer]
                    |
                    v
          [Data Normalization Layer]
                    |
                    v
        [Customer Intent Extraction Agent]
                    |
                    v
          [Lead Qualification Agent]
                    |
                    v
        [Product / Service Catalog Layer]
                    |
                    v
          [Recommendation Engine]
          - rule-based matching
          - interaction-based scoring
          - collaborative filtering simulation
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
        [Recommendation Learning Data Store]
```

---

# 3. System Input Sources

The system can receive input from several channels.

## MVP Input Sources

For the current phase:

```text
Manual Trigger
Google Form
Google Sheet row
```

## Future Input Sources

For future phases:

```text
Instagram DM
WhatsApp
Website form
E-commerce product interaction
Customer rating form
Manual owner input
```

---

# 4. Input Data Model

The system should support both lead data and recommendation-related customer data.

## Lead Input

```json
{
  "lead_id": "L001",
  "customer_id": "C001",
  "customer_name": "Dinda",
  "business_type": "Skincare Brand",
  "source": "Instagram DM",
  "service_interest": "Social Media Management",
  "budget_range": "2-3 juta/bulan",
  "timeline": "Bulan ini",
  "message": "Kak bisa bantu kelola IG brand skincare aku?",
  "created_at": "2026-07-10"
}
```

## Customer Interaction Input

```json
{
  "interaction_id": "INT001",
  "customer_id": "C001",
  "offer_id": "SVC002",
  "interaction_type": "asked_service_detail",
  "rating": null,
  "message": "Aku tertarik kelola Instagram bulanan.",
  "created_at": "2026-07-10"
}
```

## Rating Input

```json
{
  "rating_id": "R001",
  "customer_id": "C001",
  "offer_id": "SVC002",
  "rating": 5,
  "rating_context": "accepted_proposal",
  "created_at": "2026-07-15"
}
```

---

# 5. Product / Service Catalog Layer

The catalog stores the products or services that can be recommended.

For the MVP, the system can use a service catalog instead of a full e-commerce product catalog.

Future file:

```text
data/service-catalog.json
```

Example service catalog:

```json
[
  {
    "offer_id": "SVC001",
    "offer_name": "Instagram Feed Design Starter",
    "category": "design",
    "best_for": ["coffee shop", "small brand", "low budget"],
    "price_range": "under 1 juta",
    "required_context": [
      "number of designs",
      "style reference"
    ]
  },
  {
    "offer_id": "SVC002",
    "offer_name": "Monthly Social Media Management",
    "category": "social_media_management",
    "best_for": ["skincare brand", "restaurant", "fashion brand"],
    "price_range": "2-5 juta/bulan",
    "required_context": [
      "current account",
      "monthly content target",
      "brand style preference"
    ]
  },
  {
    "offer_id": "SVC003",
    "offer_name": "Launch Content Package",
    "category": "campaign",
    "best_for": ["fashion brand", "product launch", "event launch"],
    "price_range": "3-8 juta/project",
    "required_context": [
      "launch date",
      "target audience",
      "asset needs"
    ]
  },
  {
    "offer_id": "SVC004",
    "offer_name": "Landing Page Starter",
    "category": "website",
    "best_for": ["online course", "training provider", "campaign"],
    "price_range": "project-based",
    "required_context": [
      "offer details",
      "target audience",
      "conversion goal",
      "content readiness"
    ]
  }
]
```

---

# 6. Core Agent Modules

## 6.1 Lead & Interaction Intake Layer

Purpose:

```text
Capture incoming lead or customer interaction.
```

Responsibilities:

* receive input from trigger/form/sheet
* preserve raw message
* preserve source
* check missing fields
* pass clean data to normalization layer

Output:

```json
{
  "lead_id": "L001",
  "customer_id": "C001",
  "source": "Instagram DM",
  "raw_message": "Kak bisa bantu kelola IG brand skincare aku?"
}
```

---

## 6.2 Data Normalization Layer

Purpose:

```text
Standardize field names and clean input values.
```

Responsibilities:

* normalize field names
* convert empty values to empty string
* preserve original message
* format date consistently
* prepare data for agents

Output:

```json
{
  "lead_id": "L001",
  "customer_id": "C001",
  "customer_name": "Dinda",
  "business_type": "Skincare Brand",
  "service_interest": "Social Media Management",
  "budget_range": "2-3 juta/bulan",
  "timeline": "Bulan ini",
  "message": "Kak bisa bantu kelola IG brand skincare aku?",
  "created_at": "2026-07-10"
}
```

---

## 6.3 Customer Intent Extraction Agent

Purpose:

```text
Extract structured intent from customer inquiry.
```

Responsibilities:

* identify customer intent
* identify interest type
* detect problem signal
* detect preference signal
* detect urgency signal
* detect missing context

Output:

```json
{
  "customer_intent": "looking_for_service",
  "interest_type": "social_media_management",
  "problem_signal": "needs help managing Instagram",
  "preference_signal": "monthly support",
  "urgency_signal": "this month",
  "intent_confidence": "high"
}
```

---

## 6.4 Lead Qualification Agent

Purpose:

```text
Score and classify the lead using deterministic scoring rules.
```

This reuses:

```text
docs/lead-scoring-rules.md
```

Scoring criteria:

```text
Budget clarity: 0-25
Timeline urgency: 0-25
Service clarity: 0-25
Buying intent: 0-25
```

Output:

```json
{
  "lead_category": "hot",
  "lead_score": 90,
  "priority": "high",
  "score_breakdown": {
    "budget_clarity": 25,
    "timeline_urgency": 20,
    "service_clarity": 25,
    "buying_intent": 20
  }
}
```

---

## 6.5 Recommendation Engine

Purpose:

```text
Recommend the most relevant product or service based on customer intent, catalog fit, and interaction data.
```

The recommendation engine evolves in three levels.

---

### Level 1 — Rule-Based Recommendation MVP

This is the first implementation target.

Input signals:

```text
business_type
service_interest
budget_range
timeline
customer_intent
interest_type
```

Processing logic:

```text
match customer need to catalog category
filter offers by category
check budget fit
check required context
rank by relevance
return best offer
```

Example:

```text
Skincare Brand
+ Social Media Management
+ 2-3 juta/bulan
+ Bulan ini
= Monthly Social Media Management
```

Output:

```json
{
  "recommended_offer_id": "SVC002",
  "recommended_offer_name": "Monthly Social Media Management",
  "recommendation_score": 90,
  "recommendation_confidence": "high",
  "recommendation_reason": "The lead is a skincare brand asking for monthly Instagram management with a clear budget and this-month timeline."
}
```

---

### Level 2 — Interaction-Based Recommendation

This level uses customer behavior signals.

Interaction types:

```text
viewed_offer
asked_price
requested_portfolio
accepted_proposal
rejected_offer
sent_rating
repeat_inquiry
```

Example logic:

```text
asked_price = medium intent
requested_portfolio = high intent
accepted_proposal = very high intent
rejected_offer = negative signal
sent_rating = feedback signal
```

Output:

```json
{
  "interaction_score": 80,
  "interaction_reason": "Customer asked for service details and requested portfolio."
}
```

---

### Level 3 — Collaborative Filtering Simulation

This level follows the journal-inspired recommendation logic.

Input data:

```text
customer_id
offer_id
rating
interaction_type
created_at
```

Future file:

```text
data/sample-ratings.csv
```

Processing flow:

```text
rating data
-> average customer rating
-> offer similarity calculation
-> weighted prediction
-> highest positive recommendation
```

Expected output:

```json
{
  "customer_id": "C001",
  "recommended_offer_id": "SVC002",
  "prediction_score": 0.88,
  "recommendation_method": "collaborative_filtering_simulation"
}
```

Important limitation:

```text
Collaborative filtering requires enough customer-rating interaction data.
If the customer or offer has no rating history, fallback to rule-based recommendation.
```

---

## 6.6 Next Best Offer Agent

Purpose:

```text
Convert recommendation result into a safe and actionable sales recommendation.
```

Responsibilities:

* read recommendation result
* decide whether offer is ready to mention
* decide whether more discovery is needed
* explain why the offer is relevant
* preserve human review

Output:

```json
{
  "recommended_offer_id": "SVC002",
  "recommended_offer_name": "Monthly Social Media Management",
  "offer_action": "ask_discovery_before_package",
  "recommendation_reason": "The lead is a skincare brand asking for monthly Instagram management with clear budget and this-month timeline.",
  "recommendation_confidence": "high"
}
```

---

## 6.7 Follow-Up Drafting Agent

Purpose:

```text
Draft a follow-up message using lead context, recommendation context, and missing information.
```

Responsibilities:

* generate message in Indonesian
* mention offer direction carefully
* ask missing context
* avoid hard selling
* avoid promising final price
* keep message reviewable

Example:

```text
Halo Kak Dinda, bisa banget Kak. Dari kebutuhan Kakak untuk kelola IG skincare brand dengan timeline bulan ini, kemungkinan paling cocok arahnya ke monthly social media management. Sebelum aku kasih rekomendasi paket, boleh aku lihat akun Instagram-nya dan target konten bulan ini seperti apa?
```

---

## 6.8 QA Guard Agent

Purpose:

```text
Validate the recommendation and follow-up draft before human review.
```

Existing risk flags:

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

New recommendation risk flags:

```text
low_recommendation_confidence
insufficient_interaction_data
cold_start_customer
cold_start_offer
offer_budget_mismatch
recommendation_needs_review
```

Output:

```json
{
  "quality_check": "passed",
  "risk_flags": [],
  "requires_human_review": true
}
```

---

## 6.9 Human Review Layer

Purpose:

```text
Keep the owner in control.
```

The system must not auto-send any message.

Human review flow:

```text
AI recommends offer
-> AI drafts follow-up
-> owner reviews
-> owner approves / edits / rejects
-> owner sends manually
-> owner records result
```

Allowed human review status:

```text
pending_review
approved
edited
rejected
sent_manually
no_action
```

Allowed human decision:

```text
send_as_is
edit_before_send
ask_more_context
ignore_lead
mark_as_lost
manual_follow_up_needed
```

---

## 6.10 CRM and Feedback Tracker

Purpose:

```text
Store lead data, AI output, recommendation output, owner decision, customer response, and rating feedback.
```

Existing tracker:

```text
tracker/lead-tracker-columns.csv
```

Future tracker extension:

```text
tracker/recommendation-tracker-columns.csv
```

Additional columns:

```text
customer_id
recommended_offer_id
recommended_offer_name
recommendation_score
recommendation_confidence
recommendation_reason
offer_action
recommendation_method
customer_response
customer_rating
interaction_type
feedback_recorded_at
```

---

# 7. Final Output Schema Extension

The existing output schema should be extended with recommendation fields.

Current existing schema remains valid.

New recommendation fields:

```json
{
  "customer_id": "",
  "customer_intent": "",
  "interest_type": "",
  "problem_signal": "",
  "preference_signal": "",
  "urgency_signal": "",
  "recommended_offer_id": "",
  "recommended_offer_name": "",
  "recommendation_score": 0,
  "recommendation_confidence": "",
  "recommendation_reason": "",
  "recommendation_method": "",
  "offer_action": ""
}
```

Combined final output:

```json
{
  "lead_id": "",
  "customer_id": "",
  "lead_category": "",
  "lead_score": 0,
  "priority": "",
  "score_breakdown": {
    "budget_clarity": 0,
    "timeline_urgency": 0,
    "service_clarity": 0,
    "buying_intent": 0
  },
  "customer_intent": "",
  "interest_type": "",
  "problem_signal": "",
  "preference_signal": "",
  "urgency_signal": "",
  "main_need": "",
  "hidden_need": "",
  "missing_information": [],
  "recommended_offer_id": "",
  "recommended_offer_name": "",
  "recommendation_score": 0,
  "recommendation_confidence": "",
  "recommendation_reason": "",
  "recommendation_method": "",
  "offer_action": "",
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

# 8. Data Storage Architecture

## MVP Storage

For the current stage:

```text
Google Sheet
```

Used for:

* lead tracker
* recommendation tracker
* human review status
* customer response
* rating feedback

## Future Storage

For production-like simulation:

```text
PostgreSQL
```

Suggested tables:

```text
customers
leads
offers
customer_interactions
ratings
recommendations
agent_outputs
human_reviews
audit_logs
```

---

# 9. Suggested Database Model

## customers

```text
customer_id
customer_name
business_type
source
created_at
updated_at
```

## leads

```text
lead_id
customer_id
service_interest
budget_range
timeline
message
lead_category
lead_score
priority
crm_status
created_at
updated_at
```

## offers

```text
offer_id
offer_name
category
price_range
best_for
required_context
is_active
created_at
updated_at
```

## customer_interactions

```text
interaction_id
customer_id
offer_id
interaction_type
message
created_at
```

## ratings

```text
rating_id
customer_id
offer_id
rating
rating_context
created_at
```

## recommendations

```text
recommendation_id
customer_id
lead_id
recommended_offer_id
recommendation_score
recommendation_confidence
recommendation_reason
recommendation_method
created_at
```

## agent_outputs

```text
agent_output_id
lead_id
prompt_version
raw_output
parsed_output
quality_check
risk_flags
created_at
```

## human_reviews

```text
review_id
lead_id
recommendation_id
human_review_status
human_decision
final_message_sent
reviewed_at
notes
```

## audit_logs

```text
audit_log_id
entity_type
entity_id
action
before_data
after_data
created_at
```

---

# 10. n8n Target Workflow

The final n8n workflow should evolve into:

```text
Manual Trigger / Google Form
-> Normalize Lead Input
-> Customer Intent Extraction
-> Lead Qualification
-> Load Service Catalog
-> Recommendation Engine
-> Next Best Offer Agent
-> Follow-Up Drafting
-> QA Guard
-> Parse & Validate JSON
-> Map to Google Sheet Tracker
-> Owner Notification
-> Human Review
```

---

# 11. MVP vs Future Scope

## MVP Scope

The MVP should include:

```text
Manual Trigger
Google Sheet tracker
AI lead qualification
Rule-based recommendation
Next best offer
Follow-up draft
QA guard
Human review
```

## Not MVP

The MVP should not include:

```text
WhatsApp API integration
Instagram DM integration
Full e-commerce platform
Full collaborative filtering engine
Payment system
Multi-user CRM
Production deployment
```

---

# 12. Recommendation Engine Evolution Plan

## Stage 1 — Rule-Based Matching

Use catalog matching rules.

Goal:

```text
Prove that customer intent can map to a relevant offer.
```

## Stage 2 — Interaction-Based Scoring

Use customer behavior.

Goal:

```text
Use customer actions as signals for recommendation quality.
```

## Stage 3 — Collaborative Filtering Simulation

Use sample ratings.

Goal:

```text
Simulate journal-inspired recommendation logic using rating data.
```

## Stage 4 — Production-Like Recommendation Service

Use database-backed recommendation logic.

Goal:

```text
Separate recommendation logic into a backend service or API.
```

---

# 13. Safety Principles

The system must follow these rules:

1. AI must not auto-send messages.
2. AI must not promise exact pricing without owner approval.
3. AI must not promise sales results.
4. AI must not invent missing customer information.
5. AI must not recommend low-confidence offers as final.
6. Owner review must always be required.
7. `requires_human_review` must always be true.
8. Recommendation confidence must be visible.
9. Risk flags must be tracked.
10. Customer feedback must be used carefully and transparently.

---

# 14. Final Engineering Snapshot Target

The final engineering snapshot should prove:

```text
customer inquiry
-> customer intent extraction
-> lead qualification
-> product/service recommendation
-> next best offer
-> follow-up draft
-> QA guard
-> human review
-> tracker update
-> feedback loop
```

Final value:

```text
The system helps UMKM owners turn scattered customer inquiries into structured, relevant, and owner-reviewed sales actions.
```

---

# 15. Final Portfolio Framing

This project can be explained as:

```text
I designed a journal-informed AI agent architecture for UMKM sales recommendation and follow-up.

The system extends a lead follow-up assistant into a recommendation-driven sales workflow by combining customer intent extraction, deterministic lead scoring, product/service catalog matching, next-best-offer generation, QA guard validation, CRM tracking, and human-in-the-loop safety.

The architecture is inspired by an e-commerce recommendation system research case using collaborative filtering for UMKM sales development.
```

---

# 16. Definition of Done

This final system architecture is complete when it defines:

1. Final system name
2. Final system positioning
3. Scientific journal foundation
4. Existing project foundation
5. High-level architecture
6. Architecture diagram
7. Input sources
8. Input data model
9. Product/service catalog layer
10. Core agent modules
11. Recommendation engine levels
12. Output schema extension
13. Data storage architecture
14. Suggested database model
15. n8n target workflow
16. MVP scope
17. Future scope
18. Safety principles
19. Final engineering snapshot target
20. Portfolio framing
