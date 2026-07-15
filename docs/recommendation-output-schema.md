# Recommendation Output Schema — AI Sales Recommendation & Follow-Up Assistant for UMKM

## Purpose

This document defines the standard output schema for the recommendation layer of the AI Sales Recommendation & Follow-Up Assistant for UMKM.

The recommendation output schema exists to make the recommendation result:

- structured
- predictable
- parseable
- auditable
- safe for human review
- ready for n8n integration
- ready for Google Sheet tracker mapping
- ready for future collaborative filtering simulation

This schema extends the existing AI Lead Follow-Up Assistant output schema with recommendation-specific fields.

---

## Architecture Context

The recommendation output is generated after:

```text
Lead Input
-> Customer Intent Extraction
-> Lead Qualification
-> Product / Service Catalog Matching
-> Recommendation Engine
````

And before:

```text
Next Best Offer Agent
-> Follow-Up Drafting Agent
-> QA Guard
-> Human Review
-> Tracker Update
```

---

## Core Principle

The recommendation engine must not freely invent offers.

Every recommended offer must exist in:

```text
data/service-catalog.json
```

The recommendation result must always preserve human review.

The system must not auto-send any recommendation or follow-up message.

Every output must include:

```json
{
  "requires_human_review": true
}
```

---

# Final Recommendation Output Schema

```json
{
  "customer_id": "",
  "lead_id": "",
  "recommended_offer_id": "",
  "recommended_offer_name": "",
  "recommended_offer_category": "",
  "recommendation_score": 0,
  "recommendation_confidence": "high | medium | low | review",
  "recommendation_method": "rule_based | interaction_based | collaborative_filtering_simulation | fallback",
  "recommendation_reason": "",
  "offer_action": "recommend_offer | ask_discovery_before_package | clarify_budget_before_offer | clarify_timeline_before_offer | share_portfolio_first | manual_review_required",
  "matched_signals": {
    "service_interest_match": 0,
    "business_type_fit": 0,
    "budget_fit": 0,
    "timeline_fit": 0,
    "lead_quality_fit": 0,
    "required_context_readiness": 0
  },
  "missing_recommendation_context": [],
  "recommendation_risk_flags": [],
  "requires_human_review": true
}
```

---

# Field Definitions

## customer_id

Unique identifier for the customer.

Example:

```json
{
  "customer_id": "C001"
}
```

Rules:

* Must be preserved from input if available.
* If unavailable, it may be generated from the lead ID in later implementation.
* Must not be invented inconsistently.

---

## lead_id

Unique identifier for the lead.

Example:

```json
{
  "lead_id": "L001"
}
```

Rules:

* Must match the original lead ID.
* Must not be changed by the recommendation engine.
* Required for linking recommendation output to lead tracker output.

---

## recommended_offer_id

The ID of the recommended offer from the service catalog.

Example:

```json
{
  "recommended_offer_id": "SVC002"
}
```

Rules:

* Must exist in `data/service-catalog.json`.
* Must not be empty when recommendation confidence is high or medium.
* Should be empty only when the output is fallback or manual review.

---

## recommended_offer_name

The name of the recommended offer.

Example:

```json
{
  "recommended_offer_name": "Monthly Social Media Management"
}
```

Rules:

* Must match the offer name from `data/service-catalog.json`.
* Must not invent new offer names.
* Must be consistent with `recommended_offer_id`.

---

## recommended_offer_category

The category of the recommended offer.

Example:

```json
{
  "recommended_offer_category": "social_media_management"
}
```

Rules:

* Must match the category from the service catalog.
* Used for tracker filtering and later analytics.

---

## recommendation_score

The total recommendation score from 0 to 100.

Example:

```json
{
  "recommendation_score": 90
}
```

Rules:

* Must be a number.
* Must be calculated from `matched_signals`.
* Must be `null` only when `recommendation_method` is `fallback`.

---

## recommendation_confidence

The confidence level of the recommendation.

Allowed values:

```text
high
medium
low
review
```

Mapping:

| Score Range   | Confidence |
| ------------- | ---------- |
| 80-100        | high       |
| 50-79         | medium     |
| 0-49          | low        |
| null / unsafe | review     |

Rules:

* High confidence can mention offer direction carefully.
* Medium confidence should use discovery-first framing.
* Low confidence should not push a specific offer.
* Review means manual review is required.

---

## recommendation_method

The method used to generate the recommendation.

Allowed values:

```text
rule_based
interaction_based
collaborative_filtering_simulation
fallback
```

Rules:

* Use `rule_based` for the MVP.
* Use `interaction_based` when customer interaction signals are used.
* Use `collaborative_filtering_simulation` when rating-based recommendation is implemented.
* Use `fallback` when the system cannot safely recommend an offer.

---

## recommendation_reason

A short explanation of why the offer was recommended.

Example:

```json
{
  "recommendation_reason": "The lead is a skincare brand asking for social media management with a clear monthly budget and this-month timeline."
}
```

Rules:

* Must be based on available lead data and catalog data.
* Must not invent customer intent.
* Must mention the strongest matching signals.

---

## offer_action

The recommended sales action after the recommendation.

Allowed values:

```text
recommend_offer
ask_discovery_before_package
clarify_budget_before_offer
clarify_timeline_before_offer
share_portfolio_first
manual_review_required
```

Action mapping:

| Condition                                | offer_action                  |
| ---------------------------------------- | ----------------------------- |
| High confidence and enough context       | recommend_offer               |
| High confidence but missing some context | ask_discovery_before_package  |
| Budget missing or unclear                | clarify_budget_before_offer   |
| Timeline missing or unclear              | clarify_timeline_before_offer |
| Lead likely needs proof of work          | share_portfolio_first         |
| Low confidence or unsafe output          | manual_review_required        |

---

# Matched Signals

The `matched_signals` object explains how the recommendation score was calculated.

```json
{
  "matched_signals": {
    "service_interest_match": 30,
    "business_type_fit": 20,
    "budget_fit": 20,
    "timeline_fit": 10,
    "lead_quality_fit": 10,
    "required_context_readiness": 5
  }
}
```

Maximum score:

| Signal                     | Max Points |
| -------------------------- | ---------: |
| service_interest_match     |         30 |
| business_type_fit          |         20 |
| budget_fit                 |         20 |
| timeline_fit               |         10 |
| lead_quality_fit           |         10 |
| required_context_readiness |         10 |
| **Total**                  |    **100** |

Rules:

* Each value must be a number.
* Total must match `recommendation_score`.
* This makes the recommendation explainable and auditable.

---

## service_interest_match

Measures whether the lead's service interest matches the offer.

| Condition                        | Points |
| -------------------------------- | -----: |
| Direct category or keyword match |     30 |
| Related service category         |     20 |
| Weak but possible match          |     10 |
| No match                         |      0 |

---

## business_type_fit

Measures whether the offer fits the business type.

| Condition                                 | Points |
| ----------------------------------------- | -----: |
| Business type directly matches `best_for` |     20 |
| Business type is similar to `best_for`    |     15 |
| Generic business fit                      |     10 |
| Poor fit                                  |      0 |

---

## budget_fit

Measures whether the lead budget fits the offer.

| Condition                              | Points |
| -------------------------------------- | -----: |
| Budget clearly fits offer price range  |     20 |
| Budget may fit but needs clarification |     10 |
| Budget missing                         |      5 |
| Budget likely too low                  |      0 |

---

## timeline_fit

Measures whether the lead timeline fits the offer.

| Condition                                    | Points |
| -------------------------------------------- | -----: |
| Urgent or near-term and offer can start soon |     10 |
| Next month                                   |      7 |
| Timeline unclear                             |      3 |
| Timeline missing                             |      0 |

---

## lead_quality_fit

Uses existing lead qualification result.

| Lead Category | Points |
| ------------- | -----: |
| hot           |     10 |
| warm          |      7 |
| cold          |      3 |
| needs_review  |      0 |

---

## required_context_readiness

Measures whether required context for the offer is available.

| Condition                            | Points |
| ------------------------------------ | -----: |
| Most required context is available   |     10 |
| Some required context is missing     |      5 |
| Critical required context is missing |      0 |

---

## missing_recommendation_context

List of missing information needed before recommending the offer confidently.

Example:

```json
{
  "missing_recommendation_context": [
    "current Instagram account",
    "monthly content target",
    "brand style preference"
  ]
}
```

Rules:

* Must be an array.
* Use an empty array if no missing context is detected.
* Should be aligned with `required_context` from the recommended offer.

---

## recommendation_risk_flags

Risk flags detected by the recommendation layer.

Allowed values:

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

Rules:

* Must be an array.
* Use an empty array if no recommendation risk is detected.
* Add `manual_review_required` if the recommendation cannot be safely trusted.

---

## requires_human_review

Mandatory safety field.

Required value:

```json
{
  "requires_human_review": true
}
```

Rules:

* Must always be true.
* Must never be false.
* Recommendation output must always be reviewed before being used in customer-facing messages.

---

# Example Output — L001

Input:

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

Expected recommendation output:

```json
{
  "customer_id": "C001",
  "lead_id": "L001",
  "recommended_offer_id": "SVC002",
  "recommended_offer_name": "Monthly Social Media Management",
  "recommended_offer_category": "social_media_management",
  "recommendation_score": 95,
  "recommendation_confidence": "high",
  "recommendation_method": "rule_based",
  "recommendation_reason": "The lead is a skincare brand asking for social media management with a clear monthly budget and this-month timeline.",
  "offer_action": "ask_discovery_before_package",
  "matched_signals": {
    "service_interest_match": 30,
    "business_type_fit": 20,
    "budget_fit": 20,
    "timeline_fit": 10,
    "lead_quality_fit": 10,
    "required_context_readiness": 5
  },
  "missing_recommendation_context": [
    "current Instagram account",
    "monthly content target",
    "brand style preference",
    "approval process"
  ],
  "recommendation_risk_flags": [],
  "requires_human_review": true
}
```

---

# Example Output — L006

Input:

```json
{
  "lead_id": "L006",
  "customer_id": "C006",
  "customer_name": "Bima",
  "business_type": "Local Gym",
  "source": "WhatsApp",
  "service_interest": "Marketing Consultation",
  "budget_range": "Tidak disebutkan",
  "timeline": "Tidak disebutkan",
  "message": "Saya ingin tahu jasa marketing apa saja yang tersedia.",
  "created_at": "2026-07-10"
}
```

Expected recommendation output:

```json
{
  "customer_id": "C006",
  "lead_id": "L006",
  "recommended_offer_id": "SVC006",
  "recommended_offer_name": "Marketing Discovery Consultation",
  "recommended_offer_category": "consultation",
  "recommendation_score": 58,
  "recommendation_confidence": "medium",
  "recommendation_method": "rule_based",
  "recommendation_reason": "The lead is asking for general marketing service information with no budget or timeline, so a discovery consultation is safer than recommending a specific package.",
  "offer_action": "ask_discovery_before_package",
  "matched_signals": {
    "service_interest_match": 30,
    "business_type_fit": 10,
    "budget_fit": 5,
    "timeline_fit": 0,
    "lead_quality_fit": 3,
    "required_context_readiness": 10
  },
  "missing_recommendation_context": [
    "specific marketing problem",
    "business goal",
    "available budget",
    "timeline",
    "current marketing channels",
    "decision-making stage"
  ],
  "recommendation_risk_flags": [
    "insufficient_interaction_data",
    "manual_review_required"
  ],
  "requires_human_review": true
}
```

---

# Fallback Output

Use fallback when the system cannot safely recommend an offer.

```json
{
  "customer_id": "",
  "lead_id": "",
  "recommended_offer_id": "",
  "recommended_offer_name": "",
  "recommended_offer_category": "",
  "recommendation_score": null,
  "recommendation_confidence": "review",
  "recommendation_method": "fallback",
  "recommendation_reason": "The system cannot safely recommend an offer because the available information is insufficient or the catalog match is unclear.",
  "offer_action": "manual_review_required",
  "matched_signals": {
    "service_interest_match": 0,
    "business_type_fit": 0,
    "budget_fit": 0,
    "timeline_fit": 0,
    "lead_quality_fit": 0,
    "required_context_readiness": 0
  },
  "missing_recommendation_context": [],
  "recommendation_risk_flags": [
    "recommendation_needs_review",
    "manual_review_required"
  ],
  "requires_human_review": true
}
```

---

# Combined Output Extension

The recommendation output should later be merged with the existing lead follow-up output.

Existing lead follow-up output includes:

```text
lead_category
lead_score
priority
score_breakdown
qualification_reason
main_need
hidden_need
missing_information
next_best_action
follow_up_strategy
recommended_response_type
follow_up_message
crm_status
next_follow_up_date
owner_action_required
crm_note
quality_check
risk_flags
requires_human_review
```

Recommendation extension adds:

```text
customer_id
recommended_offer_id
recommended_offer_name
recommended_offer_category
recommendation_score
recommendation_confidence
recommendation_method
recommendation_reason
offer_action
matched_signals
missing_recommendation_context
recommendation_risk_flags
```

---

# Google Sheet Mapping

Future tracker columns should include:

```text
customer_id
recommended_offer_id
recommended_offer_name
recommended_offer_category
recommendation_score
recommendation_confidence
recommendation_method
recommendation_reason
offer_action
matched_service_interest_score
matched_business_type_score
matched_budget_score
matched_timeline_score
matched_lead_quality_score
matched_required_context_score
missing_recommendation_context
recommendation_risk_flags
```

These fields will be added later in:

```text
tracker/recommendation-tracker-columns.csv
```

---

# Validation Rules

Before accepting a recommendation output, validate that:

1. Output is valid JSON.
2. `lead_id` is not empty.
3. `customer_id` is present or can be derived.
4. `recommended_offer_id` exists in `data/service-catalog.json`, unless fallback is used.
5. `recommended_offer_name` matches the catalog.
6. `recommended_offer_category` matches the catalog.
7. `recommendation_score` equals the total of `matched_signals`.
8. `recommendation_confidence` matches the score range.
9. `recommendation_method` uses an allowed value.
10. `offer_action` uses an allowed value.
11. `missing_recommendation_context` is an array.
12. `recommendation_risk_flags` is an array.
13. `requires_human_review` is always true.
14. Low-confidence recommendations are not pushed as final offers.
15. Fallback output is used when recommendation cannot be safely determined.

---

# Safety Rules

The recommendation layer must follow these rules:

1. Do not auto-send recommendations.
2. Do not invent offers.
3. Do not recommend an offer that does not exist in the catalog.
4. Do not promise final pricing without owner approval.
5. Do not promise sales results.
6. Do not claim that the recommended offer is guaranteed to work.
7. Do not push low-confidence recommendations.
8. Use manual review when context is insufficient.
9. Preserve `requires_human_review: true`.

---

# Definition of Done

This schema is complete when it defines:

1. Final recommendation output structure
2. Field definitions
3. Allowed enum values
4. Matched signal scoring fields
5. Missing recommendation context
6. Recommendation risk flags
7. Example output for high-confidence lead
8. Example output for medium-confidence / review-needed lead
9. Fallback output
10. Combined output extension
11. Google Sheet mapping fields
12. Validation rules
13. Safety rules

