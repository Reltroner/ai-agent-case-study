# Recommendation Engine Design — AI Sales Recommendation & Follow-Up Assistant for UMKM

## Purpose

This document defines the recommendation engine design for the AI Sales Recommendation & Follow-Up Assistant for UMKM.

The recommendation engine extends the existing AI Lead Follow-Up Assistant by adding a product/service recommendation layer.

The goal is to recommend the most relevant offer based on:

- customer intent
- service interest
- business type
- budget range
- timeline
- product/service catalog
- customer interaction data
- rating data in future simulation

This engine is designed to evolve gradually from a deterministic MVP into a journal-inspired collaborative filtering simulation.

---

## Architecture Position

The recommendation engine sits after lead qualification and before follow-up drafting.

System flow:

```text
Lead Input
-> Customer Intent Extraction
-> Lead Qualification
-> Product / Service Catalog
-> Recommendation Engine
-> Next Best Offer Agent
-> Follow-Up Drafting Agent
-> QA Guard
-> Human Review
-> Tracker Update
````

---

## Why Recommendation Engine Is Needed

The existing AI Lead Follow-Up Assistant can already:

* classify leads
* score leads
* extract needs
* draft follow-up messages
* recommend CRM status
* require human review

However, based on the journal-informed business case, UMKM do not only need faster follow-up.

UMKM also need a way to recommend the most relevant product or service based on customer interest and interaction data.

The recommendation engine adds this capability.

---

## Recommendation Engine Evolution

The engine should evolve through three stages.

```text
Stage 1: Rule-Based Recommendation MVP
Stage 2: Interaction-Based Recommendation
Stage 3: Collaborative Filtering Simulation
```

This prevents the project from becoming too complex too early.

---

# Stage 1 — Rule-Based Recommendation MVP

## Purpose

Stage 1 recommends an offer using deterministic matching rules.

This is the first implementation target.

It does not require historical rating data.

It uses the existing lead data and a service catalog.

---

## Input Signals

The rule-based engine uses these fields:

```text
business_type
service_interest
budget_range
timeline
message
customer_intent
interest_type
lead_category
lead_score
missing_information
```

---

## Required Catalog

The engine needs a product/service catalog.

Future file:

```text
data/service-catalog.json
```

Example catalog structure:

```json
[
  {
    "offer_id": "SVC001",
    "offer_name": "Instagram Feed Design Starter",
    "category": "design",
    "keywords": ["feed design", "instagram design", "visual design"],
    "best_for": ["coffee shop", "small brand", "low budget"],
    "price_range": "under 1 juta",
    "minimum_budget_signal": "low",
    "required_context": [
      "number of designs",
      "style reference"
    ]
  },
  {
    "offer_id": "SVC002",
    "offer_name": "Monthly Social Media Management",
    "category": "social_media_management",
    "keywords": ["social media management", "kelola instagram", "content management"],
    "best_for": ["skincare brand", "restaurant", "fashion brand"],
    "price_range": "2-5 juta/bulan",
    "minimum_budget_signal": "medium",
    "required_context": [
      "current Instagram account",
      "monthly content target",
      "brand style preference"
    ]
  },
  {
    "offer_id": "SVC003",
    "offer_name": "Launch Content Package",
    "category": "campaign",
    "keywords": ["launching", "campaign", "rebranding", "content package"],
    "best_for": ["fashion brand", "product launch", "event launch"],
    "price_range": "3-8 juta/project",
    "minimum_budget_signal": "medium",
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
    "keywords": ["landing page", "website", "online course page"],
    "best_for": ["online course", "training provider", "campaign"],
    "price_range": "project-based",
    "minimum_budget_signal": "unknown",
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

## Rule-Based Matching Logic

The engine should calculate a recommendation score from several factors.

| Factor                     | Max Points |
| -------------------------- | ---------: |
| Service interest match     |         30 |
| Business type fit          |         20 |
| Budget fit                 |         20 |
| Timeline fit               |         10 |
| Lead quality fit           |         10 |
| Required context readiness |         10 |
| **Total**                  |    **100** |

---

## 1. Service Interest Match

Measures how closely the lead's `service_interest`, `message`, or `interest_type` matches the offer category and keywords.

| Condition                                   | Points |
| ------------------------------------------- | -----: |
| Direct match with offer category or keyword |     30 |
| Related service category                    |     20 |
| Weak but possible match                     |     10 |
| No match                                    |      0 |

Example:

```text
Lead service_interest = Social Media Management
Offer = Monthly Social Media Management
Score = 30
```

---

## 2. Business Type Fit

Measures whether the offer is relevant for the lead's business type.

| Condition                                 | Points |
| ----------------------------------------- | -----: |
| Business type is listed in offer best_for |     20 |
| Business type is similar to best_for      |     15 |
| Generic business fit                      |     10 |
| Poor fit                                  |      0 |

Example:

```text
Business type = Skincare Brand
Offer best_for includes small brand or skincare brand
Score = 20
```

---

## 3. Budget Fit

Measures whether the lead's budget appears compatible with the offer.

| Condition                              | Points |
| -------------------------------------- | -----: |
| Budget clearly fits offer price range  |     20 |
| Budget may fit but needs clarification |     10 |
| Budget missing                         |      5 |
| Budget likely too low                  |      0 |

Example:

```text
Budget = 2-3 juta/bulan
Offer price range = 2-5 juta/bulan
Score = 20
```

---

## 4. Timeline Fit

Measures whether the offer can reasonably match the lead's timeline.

| Condition                                                | Points |
| -------------------------------------------------------- | -----: |
| Timeline is urgent or near-term and offer can start soon |     10 |
| Timeline is next month                                   |      7 |
| Timeline unclear                                         |      3 |
| Timeline missing                                         |      0 |

---

## 5. Lead Quality Fit

Uses the existing lead qualification result.

| Lead Category | Points |
| ------------- | -----: |
| hot           |     10 |
| warm          |      7 |
| cold          |      3 |
| needs_review  |      0 |

---

## 6. Required Context Readiness

Measures whether the lead already provided enough context to recommend the offer confidently.

| Condition                            | Points |
| ------------------------------------ | -----: |
| Most required context is available   |     10 |
| Some required context is missing     |      5 |
| Critical required context is missing |      0 |

---

## Rule-Based Recommendation Score

Formula:

```text
recommendation_score =
service_interest_match
+ business_type_fit
+ budget_fit
+ timeline_fit
+ lead_quality_fit
+ required_context_readiness
```

Recommendation confidence:

| Score Range | Confidence |
| ----------- | ---------- |
| 80-100      | high       |
| 50-79       | medium     |
| 0-49        | low        |

---

## Stage 1 Output

Example:

```json
{
  "recommended_offer_id": "SVC002",
  "recommended_offer_name": "Monthly Social Media Management",
  "recommendation_score": 90,
  "recommendation_confidence": "high",
  "recommendation_method": "rule_based",
  "recommendation_reason": "The lead is a skincare brand asking for monthly Instagram management with a clear budget and this-month timeline.",
  "offer_action": "ask_discovery_before_package"
}
```

---

## Offer Action Values

Allowed values:

```text
recommend_offer
ask_discovery_before_package
clarify_budget_before_offer
clarify_timeline_before_offer
share_portfolio_first
manual_review_required
```

Guidance:

| Condition                                 | offer_action                  |
| ----------------------------------------- | ----------------------------- |
| High confidence and enough context        | recommend_offer               |
| High confidence but still missing context | ask_discovery_before_package  |
| Budget unclear or missing                 | clarify_budget_before_offer   |
| Timeline unclear or missing               | clarify_timeline_before_offer |
| Lead needs proof of work                  | share_portfolio_first         |
| Low confidence or risky recommendation    | manual_review_required        |

---

# Stage 2 — Interaction-Based Recommendation

## Purpose

Stage 2 adds customer behavior signals.

This is used after the system starts collecting customer interactions.

---

## Customer Interaction Types

Allowed interaction types:

```text
viewed_offer
asked_price
asked_service_detail
requested_portfolio
booked_call
accepted_proposal
rejected_offer
sent_rating
repeat_inquiry
no_response
```

---

## Interaction Score

| Interaction Type     |             Score |
| -------------------- | ----------------: |
| accepted_proposal    |               100 |
| booked_call          |                90 |
| requested_portfolio  |                80 |
| asked_price          |                70 |
| asked_service_detail |                60 |
| viewed_offer         |                40 |
| repeat_inquiry       |                50 |
| sent_rating          | depends on rating |
| no_response          |                10 |
| rejected_offer       |               -30 |

---

## Interaction-Based Output

```json
{
  "customer_id": "C001",
  "offer_id": "SVC002",
  "interaction_score": 80,
  "interaction_reason": "Customer requested portfolio and asked for service details.",
  "recommendation_signal": "positive_interest"
}
```

---

## Recommendation Signal Values

Allowed values:

```text
strong_positive_interest
positive_interest
neutral_interest
weak_interest
negative_signal
```

---

# Stage 3 — Collaborative Filtering Simulation

## Purpose

Stage 3 simulates the journal-inspired collaborative filtering process.

This stage should only be implemented after there is enough sample rating data.

It should not replace Stage 1.

It should complement Stage 1.

---

## Required Rating Dataset

Future file:

```text
data/sample-ratings.csv
```

Columns:

```csv
rating_id,customer_id,offer_id,rating,interaction_type,created_at
```

Example:

```csv
R001,C001,SVC002,5,accepted_proposal,2026-07-15
R002,C002,SVC001,4,asked_price,2026-07-15
R003,C003,SVC003,5,requested_portfolio,2026-07-16
R004,C004,SVC004,3,asked_service_detail,2026-07-16
R005,C005,SVC002,5,accepted_proposal,2026-07-17
```

---

## Collaborative Filtering Flow

```text
rating data
-> build customer-offer rating matrix
-> calculate average customer rating
-> calculate offer similarity
-> calculate predicted score
-> recommend highest positive predicted offer
```

---

## Step 1 — Build Customer-Offer Matrix

Example:

| Customer | SVC001 | SVC002 | SVC003 | SVC004 |
| -------- | -----: | -----: | -----: | -----: |
| C001     |      0 |      5 |      0 |      0 |
| C002     |      4 |      0 |      0 |      0 |
| C003     |      0 |      0 |      5 |      0 |
| C004     |      0 |      0 |      0 |      3 |
| C005     |      0 |      5 |      0 |      0 |

---

## Step 2 — Calculate Average Customer Rating

Formula:

```text
average_customer_rating =
sum(customer ratings) / count(rated offers)
```

Example:

```text
C001 rated SVC002 = 5
average rating C001 = 5
```

---

## Step 3 — Calculate Offer Similarity

Use adjusted cosine similarity for offer-to-offer similarity.

Conceptual formula:

```text
similarity(i, j) =
sum((rating_user_i - avg_user_rating) * (rating_user_j - avg_user_rating))
/
sqrt(sum((rating_user_i - avg_user_rating)^2))
*
sqrt(sum((rating_user_j - avg_user_rating)^2))
```

Interpretation:

| Similarity Value | Meaning     |
| ---------------- | ----------- |
| close to 1       | similar     |
| 0                | independent |
| close to -1      | conflicting |

---

## Step 4 — Calculate Prediction Score

Use weighted sum to predict the score of an unrated offer.

Conceptual formula:

```text
prediction(customer, target_offer) =
sum(customer_rating_on_similar_offer * similarity_score)
/
sum(abs(similarity_score))
```

---

## Step 5 — Choose Recommendation

Recommendation rule:

```text
Recommend the unrated offer with the highest positive prediction score.
```

If all prediction scores are negative or no similarity data exists:

```text
Fallback to rule-based recommendation.
```

---

## Collaborative Filtering Output

```json
{
  "customer_id": "C001",
  "recommended_offer_id": "SVC002",
  "recommended_offer_name": "Monthly Social Media Management",
  "prediction_score": 0.88,
  "recommendation_confidence": "medium",
  "recommendation_method": "collaborative_filtering_simulation",
  "recommendation_reason": "The offer has the highest positive predicted score based on similar customer-offer rating patterns."
}
```

---

# Cold Start Handling

Collaborative filtering has a cold start problem when there is not enough rating data.

## Cold Start Cases

```text
new_customer
new_offer
no_rating_history
insufficient_similarity_data
```

## Cold Start Fallback

Use this fallback order:

```text
1. rule-based recommendation
2. interaction-based recommendation
3. manual review
```

Risk flags:

```text
cold_start_customer
cold_start_offer
insufficient_interaction_data
recommendation_needs_review
```

---

# Recommendation Decision Policy

The system must decide whether the recommendation is ready for follow-up.

## High Confidence

Condition:

```text
recommendation_score >= 80
```

Action:

```text
Mention offer direction carefully and ask missing discovery questions if needed.
```

## Medium Confidence

Condition:

```text
recommendation_score >= 50 and recommendation_score < 80
```

Action:

```text
Use discovery-first follow-up before recommending a specific offer.
```

## Low Confidence

Condition:

```text
recommendation_score < 50
```

Action:

```text
Do not recommend a specific offer yet. Ask clarification questions or route to manual review.
```

---

# Recommendation QA Rules

The QA Guard must check:

1. Recommendation method is defined.
2. Recommended offer exists in catalog.
3. Recommendation score is valid.
4. Recommendation confidence matches score.
5. Offer does not conflict with budget signal.
6. Offer does not invent customer need.
7. Offer is not presented as guaranteed fit.
8. Low-confidence recommendation is not pushed aggressively.
9. Human review is required.
10. Fallback path is safe.

---

# Risk Flags

Recommendation-specific risk flags:

```text
low_recommendation_confidence
insufficient_interaction_data
cold_start_customer
cold_start_offer
offer_budget_mismatch
recommendation_needs_review
catalog_match_unclear
manual_review_required
```

---

# Output Schema

The recommendation engine output should use this structure:

```json
{
  "customer_id": "",
  "lead_id": "",
  "recommended_offer_id": "",
  "recommended_offer_name": "",
  "recommendation_score": 0,
  "recommendation_confidence": "high | medium | low | review",
  "recommendation_method": "rule_based | interaction_based | collaborative_filtering_simulation | fallback",
  "recommendation_reason": "",
  "offer_action": "",
  "recommendation_risk_flags": [],
  "requires_human_review": true
}
```

---

# Integration With Existing Output Schema

The recommendation output should be merged into the existing lead follow-up output.

Existing output:

```text
lead classification
need extraction
follow-up strategy
follow-up message
CRM status
QA guard
human review
```

New added fields:

```text
customer_id
recommended_offer_id
recommended_offer_name
recommendation_score
recommendation_confidence
recommendation_method
recommendation_reason
offer_action
recommendation_risk_flags
```

---

# Integration With n8n

In n8n, the recommendation engine can be implemented as either:

```text
Option A: AI Recommendation Node
Option B: Function / Code Node with deterministic rules
Option C: Hybrid rule-based code + AI explanation
```

Recommended MVP approach:

```text
Use deterministic rule-based matching in a Function / Code Node.
Use AI only to explain the recommendation and draft the follow-up message.
```

Reason:

```text
Recommendation logic should be deterministic.
AI should not freely invent the offer.
```

---

# MVP Implementation Order

Recommended order:

```text
1. Create service catalog
2. Create recommendation output schema
3. Create rule-based matching rules
4. Test recommendation for L001
5. Test recommendation for L006
6. Map recommendation output into tracker
7. Add follow-up draft using recommended offer
8. Add QA guard validation
```

---

# Example End-to-End Recommendation

## Input Lead

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

## Recommendation Output

```json
{
  "customer_id": "C001",
  "lead_id": "L001",
  "recommended_offer_id": "SVC002",
  "recommended_offer_name": "Monthly Social Media Management",
  "recommendation_score": 90,
  "recommendation_confidence": "high",
  "recommendation_method": "rule_based",
  "recommendation_reason": "The lead is a skincare brand asking for social media management with a clear monthly budget and this-month timeline.",
  "offer_action": "ask_discovery_before_package",
  "recommendation_risk_flags": [],
  "requires_human_review": true
}
```

## Follow-Up Direction

```text
Mention the offer direction carefully, but do not give final pricing yet.
Ask for missing context before recommending the final package.
```

Example draft:

```text
Halo Kak Dinda, bisa banget Kak. Dari kebutuhan Kakak untuk kelola IG skincare brand dengan timeline bulan ini, kemungkinan paling cocok arahnya ke monthly social media management. Sebelum aku kasih rekomendasi paket, boleh aku lihat akun Instagram-nya dan target konten bulan ini seperti apa?
```

---

# Safety Rules

The recommendation engine must follow these rules:

1. Never auto-send a recommendation.
2. Never claim that an offer is guaranteed to work.
3. Never promise sales results.
4. Never give final pricing without owner approval.
5. Never recommend an offer that does not exist in the catalog.
6. If confidence is low, ask discovery questions instead.
7. If data is insufficient, route to manual review.
8. Always return `requires_human_review: true`.

---

# Definition of Done

This recommendation engine design is complete when it defines:

1. Engine purpose
2. Architecture position
3. Engine evolution stages
4. Rule-based MVP logic
5. Recommendation scoring factors
6. Recommendation confidence rules
7. Interaction-based scoring plan
8. Collaborative filtering simulation plan
9. Cold start handling
10. Recommendation QA rules
11. Recommendation output schema
12. n8n integration approach
13. MVP implementation order
14. End-to-end example
15. Safety rules

