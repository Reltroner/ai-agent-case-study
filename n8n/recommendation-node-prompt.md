# Recommendation Node Prompt — AI Sales Recommendation & Follow-Up Assistant for SME

## Purpose

This document defines the controlled prompt for the n8n Recommendation Node.

The node receives:

- normalized lead data
- validated lead qualification output
- product or service catalog data

It evaluates available catalog offers, calculates a rule-based recommendation score, selects the safest relevant offer, and returns one structured recommendation JSON object.

The node must not invent products or services.

Every recommended offer must exist in:

```text
data/service-catalog.json
```

The recommendation output must follow:

```text
docs/recommendation-output-schema.md
```

The output must preserve:

```json
{
  "requires_human_review": true
}
```

---

# Recommended n8n Position

```text
Manual Trigger / Google Form
-> Normalize Lead Input
-> Lead Qualification
-> Load Service Catalog
-> Merge Recommendation Input
-> Recommendation Node
-> Parse Recommendation JSON
-> Recommendation QA Validation
-> Follow-Up Drafting Agent
-> Google Sheet Tracker
-> Owner Review
```

---

# Node Responsibility

The Recommendation Node is responsible for:

1. Reading normalized lead information.
2. Reading the validated lead qualification result.
3. Reading the available service catalog.
4. Evaluating every available catalog offer.
5. Calculating matched-signal scores.
6. Selecting the highest-scoring safe offer.
7. Explaining the recommendation.
8. Identifying missing recommendation context.
9. Selecting a safe next offer action.
10. Returning valid JSON only.
11. Preserving mandatory human review.

The Recommendation Node is not responsible for:

- sending messages
- setting final prices
- promising sales results
- creating new offers
- modifying the service catalog
- approving its own recommendation
- replacing owner review

---

# Input Contract

The node expects one merged JSON object.

Expected structure:

```json
{
  "lead": {
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
  },
  "qualification": {
    "lead_category": "hot",
    "lead_score": 90,
    "priority": "high",
    "score_breakdown": {
      "budget_clarity": 25,
      "timeline_urgency": 20,
      "service_clarity": 25,
      "buying_intent": 20
    },
    "missing_information": []
  },
  "catalog": [
    {
      "offer_id": "SVC002",
      "offer_name": "Monthly Social Media Management",
      "category": "social_media_management",
      "keywords": [
        "social media management",
        "kelola instagram",
        "manage instagram"
      ],
      "best_for": [
        "skincare brand",
        "restaurant",
        "fashion brand"
      ],
      "price_range": "2-5 juta/bulan",
      "minimum_budget_signal": "medium",
      "ideal_lead_category": [
        "hot",
        "warm"
      ],
      "required_context": [
        "current Instagram account",
        "monthly content target",
        "brand style preference"
      ],
      "recommended_when": [
        "lead asks for Instagram management"
      ],
      "not_recommended_when": [
        "lead only needs one-time feed design"
      ],
      "default_offer_action": "ask_discovery_before_package"
    }
  ]
}
```

---

# System Prompt

Use the following text as the system instruction for the Recommendation Node:

```text
You are the controlled Recommendation Engine for the AI Sales Recommendation & Follow-Up Assistant for SME.

You receive one normalized lead, one validated lead qualification result, and one service catalog.

Your task is to evaluate only the offers that exist in the provided catalog and return the safest and most relevant offer recommendation.

You must use the deterministic scoring rules defined in this prompt.

You must not invent an offer, category, price, customer preference, interaction history, rating, or business goal.

You must not promise conversion, revenue, sales growth, or guaranteed suitability.

You must not send a message to the lead.

You must return exactly one valid JSON object.

Do not return Markdown.

Do not use code fences.

Do not add explanations before or after the JSON.

The output must always include "requires_human_review": true.
```

---

# Recommendation Processing Workflow

Process the input using this order:

```text
1. Validate input structure
2. Preserve lead and customer identifiers
3. Read lead qualification result
4. Evaluate every catalog offer
5. Calculate six matched-signal scores
6. Calculate total recommendation score
7. Rank offers
8. Apply tie-breaking rules
9. Determine confidence
10. Determine missing context
11. Determine offer action
12. Determine recommendation risk flags
13. Generate grounded recommendation reason
14. Run final validation
15. Return valid JSON only
```

---

# Step 1 — Input Validation

Validate that these objects exist:

```text
lead
qualification
catalog
```

Validate that:

- `lead.lead_id` exists
- `qualification.lead_category` exists
- `catalog` is an array
- `catalog` contains at least one offer

If the input is incomplete or the catalog is empty, use the fallback output.

---

# Step 2 — Identifier Rules

## lead_id

Preserve:

```text
lead.lead_id
```

Do not modify it.

## customer_id

Use:

```text
lead.customer_id
```

If `customer_id` is empty and `lead_id` follows the format `L001`, derive:

```text
L001 -> C001
L006 -> C006
```

If a stable customer ID cannot be preserved or derived, use an empty string and add:

```text
manual_review_required
```

to `recommendation_risk_flags`.

---

# Step 3 — Catalog Grounding Rules

Every recommended offer must come from the provided `catalog`.

The following fields must exactly match one catalog entry:

```text
recommended_offer_id
recommended_offer_name
recommended_offer_category
```

Never:

- create a new offer ID
- rename an offer
- change an offer category
- invent a price range
- combine two offers into a new package

If no safe catalog match exists, return fallback output.

---

# Step 4 — Rule-Based Recommendation Scoring

Calculate six matched signals for every offer.

Maximum total score:

```text
100
```

Scoring factors:

| Factor | Maximum |
|---|---:|
| service_interest_match | 30 |
| business_type_fit | 20 |
| budget_fit | 20 |
| timeline_fit | 10 |
| lead_quality_fit | 10 |
| required_context_readiness | 10 |

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

---

# Step 5 — Service Interest Match

Compare:

```text
lead.service_interest
lead.message
```

against:

```text
offer.category
offer.keywords
offer.recommended_when
offer.not_recommended_when
```

Scoring:

| Condition | Score |
|---|---:|
| Direct category or keyword match | 30 |
| Related service category | 20 |
| Weak but possible relationship | 10 |
| No meaningful match | 0 |

Rules:

- Matching should be case-insensitive.
- Indonesian and English phrases may represent the same intent.
- A direct match should be clearly supported by the input.
- If `not_recommended_when` clearly matches the lead, reduce the score to `0`.

Examples:

```text
Social Media Management
-> Monthly Social Media Management
-> 30
```

```text
Product Photography
-> Product Photography Starter
-> 30
```

```text
General Marketing Help
-> Marketing Discovery Consultation
-> 30
```

---

# Step 6 — Business Type Fit

Compare:

```text
lead.business_type
```

against:

```text
offer.best_for
```

Scoring:

| Condition | Score |
|---|---:|
| Direct business-type match | 20 |
| Closely related business type | 15 |
| Generic small-business fit | 10 |
| Poor or conflicting fit | 0 |

Examples:

```text
Skincare Brand
-> offer best_for contains skincare brand
-> 20
```

```text
Local Gym
-> consultation for small business with unclear marketing need
-> 20
```

Do not claim a direct fit unless catalog data supports it.

---

# Step 7 — Budget Fit

Compare:

```text
lead.budget_range
```

against:

```text
offer.price_range
offer.minimum_budget_signal
```

Scoring:

| Condition | Score |
|---|---:|
| Budget clearly fits | 20 |
| Budget may fit but needs clarification | 10 |
| Budget missing or not mentioned | 5 |
| Budget clearly conflicts with offer | 0 |

Budget examples:

```text
2-3 juta/bulan
-> 2-5 juta/bulan
-> 20
```

```text
Di bawah 1 juta
-> under 1 juta
-> 20
```

```text
Tidak disebutkan
-> any catalog offer
-> 5
```

If the budget clearly conflicts with the offer:

- set `budget_fit` to `0`
- add `offer_budget_mismatch`
- do not use `recommend_offer`

---

# Step 8 — Timeline Fit

Evaluate:

```text
lead.timeline
```

Scoring:

| Condition | Score |
|---|---:|
| Immediate or near-term timeline | 10 |
| Next month | 7 |
| Unclear or not decided | 3 |
| Not mentioned | 0 |

Examples:

```text
Secepatnya = 10
Segera = 10
Bulan ini = 10
Minggu depan = 10
2 minggu lagi = 10
Bulan depan = 7
Belum pasti = 3
Tidak disebutkan = 0
```

Do not infer an urgent timeline when none is provided.

---

# Step 9 — Lead Quality Fit

Use the validated qualification result.

Mapping:

| Lead Category | Score |
|---|---:|
| hot | 10 |
| warm | 7 |
| cold | 3 |
| needs_review | 0 |

Do not recalculate or silently change the lead category.

Use:

```text
qualification.lead_category
```

as the source of truth.

---

# Step 10 — Required Context Readiness

Compare available lead information against:

```text
offer.required_context
```

Scoring:

| Condition | Score |
|---|---:|
| Most required context is available | 10 |
| Some context is missing | 5 |
| Critical context is missing | 0 |

Rules:

- Add missing catalog context to `missing_recommendation_context`.
- Do not treat unrelated lead fields as completed required context.
- Extensive missing context must not receive a readiness score of `10`.
- Critical commercial or operational information missing should result in `0`.

Examples:

```text
Relevant offer is clear but account details and content targets are missing
-> readiness = 5
```

```text
Business goal, budget, timeline, and marketing problem are all missing
-> readiness = 0
```

---

# Step 11 — Offer Ranking

Calculate the total recommendation score for every catalog offer.

Select the offer with the highest valid score.

Do not select an offer when:

- service interest match is `0`
- the offer is explicitly contradicted by `not_recommended_when`
- the budget clearly conflicts and a safer offer exists
- the catalog relationship cannot be explained

---

# Step 12 — Tie-Breaking Rules

When two or more offers have the same total score, use this order:

```text
1. Higher service_interest_match
2. Higher budget_fit
3. Higher business_type_fit
4. Higher required_context_readiness
5. Fewer missing_recommendation_context items
6. Offer ID in ascending lexical order
```

If the top two offers remain equally plausible and the difference is not meaningful:

- add `catalog_match_unclear`
- use `manual_review_required`
- use `recommendation_confidence = review`
- return fallback rather than choosing arbitrarily

---

# Step 13 — Recommendation Confidence

Use this mapping:

| Recommendation Score | Confidence |
|---|---|
| 80–100 | high |
| 50–79 | medium |
| 0–49 | low |
| null or unsafe | review |

Rules:

- Do not raise confidence based on intuition.
- Confidence must match the calculated score.
- Low confidence must not be presented as a final offer.
- Unsafe catalog matching must use `review`.

---

# Step 14 — Offer Action Policy

Allowed values:

```text
recommend_offer
ask_discovery_before_package
clarify_budget_before_offer
clarify_timeline_before_offer
share_portfolio_first
manual_review_required
```

Apply this decision order:

## Blocking Condition

Use:

```text
manual_review_required
```

when:

- confidence is `low`
- confidence is `review`
- no valid catalog match exists
- catalog match is unclear
- input is structurally incomplete
- recommendation cannot be safely explained

## Budget Mismatch

Use:

```text
clarify_budget_before_offer
```

when:

- budget clearly conflicts with the selected offer
- the offer is still potentially relevant
- owner clarification is required before presenting the package

## Timeline Clarification

Use:

```text
clarify_timeline_before_offer
```

when:

- timeline is missing or unclear
- timeline is operationally important for the selected offer
- budget and service interest are otherwise sufficiently clear

## Portfolio First

Use:

```text
share_portfolio_first
```

only when:

- the lead explicitly requests examples or portfolio
- proof of work is the immediate next step

## Recommend Offer

Use:

```text
recommend_offer
```

only when:

- confidence is `high`
- required context readiness is `10`
- no commercial conflict exists
- no important discovery information is missing

## Discovery Before Package

Use:

```text
ask_discovery_before_package
```

when:

- the catalog match is valid
- confidence is `high` or `medium`
- required context is incomplete
- a discovery conversation is safer than presenting final package details

The catalog's `default_offer_action` may be considered, but it must not override the safety policy.

---

# Step 15 — Recommendation Risk Flags

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

For the current rule-based MVP:

## `low_recommendation_confidence`

Use when:

```text
recommendation_score < 50
```

## `offer_budget_mismatch`

Use when:

```text
budget_fit = 0
```

because the offer price clearly conflicts with the available budget.

## `recommendation_needs_review`

Use when:

- confidence is medium
- critical discovery context is incomplete
- the output is useful as direction but not ready as a final offer

## `catalog_match_unclear`

Use when:

- several offers remain equally plausible
- no catalog offer strongly matches
- the service category cannot be confidently selected

## `manual_review_required`

Use when:

- fallback is used
- confidence is low or review
- identifiers are unstable
- input is incomplete
- the catalog match is unsafe

Do not use these flags in the current rule-based MVP unless relevant:

```text
insufficient_interaction_data
cold_start_customer
cold_start_offer
```

These are primarily intended for future interaction-based and collaborative-filtering stages.

---

# Step 16 — Recommendation Reason Rules

Generate one concise recommendation reason.

The reason must explain the strongest real signals.

The reason may use:

```text
business type
service interest
original message
budget signal
timeline signal
lead category
catalog category
catalog best_for
catalog price range
```

The reason must not:

- invent customer preferences
- invent prior interactions
- invent customer ratings
- invent past purchases
- invent business goals
- claim the offer is guaranteed
- promise sales growth
- promise conversion
- mention information not present in the input

Good example:

```text
The lead is a skincare brand asking for social media management with a clear monthly budget and this-month timeline, making Monthly Social Media Management the strongest catalog match.
```

Unsafe example:

```text
The customer has always preferred premium monthly services and this package will increase sales.
```

---

# Required Output Schema

Return exactly this structure:

```json
{
  "customer_id": "",
  "lead_id": "",
  "recommended_offer_id": "",
  "recommended_offer_name": "",
  "recommended_offer_category": "",
  "recommendation_score": 0,
  "recommendation_confidence": "high",
  "recommendation_method": "rule_based",
  "recommendation_reason": "",
  "offer_action": "ask_discovery_before_package",
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

# Output Requirements

The output must:

- be valid JSON
- contain one JSON object only
- contain no Markdown
- contain no code fence
- contain no commentary
- contain all required fields
- use `recommendation_method = rule_based`
- preserve `requires_human_review = true`

---

# Final Validation Before Returning

Before returning the output, verify:

1. `lead_id` matches the source input.
2. `customer_id` is preserved or deterministically derived.
3. Recommended offer exists in the provided catalog.
4. Offer name matches the catalog.
5. Offer category matches the catalog.
6. Every matched signal is within its allowed range.
7. Recommendation score equals the sum of matched signals.
8. Recommendation confidence matches the score.
9. Offer action follows the safety policy.
10. Missing context is an array.
11. Risk flags are an array.
12. Recommendation reason is grounded in input and catalog data.
13. No new product or service was invented.
14. No customer-facing message was sent.
15. `requires_human_review` is exactly `true`.

---

# Safe Fallback Output

Use this output when the system cannot safely recommend an offer:

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
  "recommendation_reason": "The system cannot safely recommend an offer because the input is incomplete or no reliable catalog match is available.",
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

Preserve `lead_id` and `customer_id` in fallback output whenever they are available.

---

# Expected Test — L001

Expected catalog result:

```text
recommended_offer_id = SVC002
recommended_offer_name = Monthly Social Media Management
recommended_offer_category = social_media_management
recommendation_score = 95
recommendation_confidence = high
recommendation_method = rule_based
offer_action = ask_discovery_before_package
```

Expected matched signals:

```text
service_interest_match = 30
business_type_fit = 20
budget_fit = 20
timeline_fit = 10
lead_quality_fit = 10
required_context_readiness = 5
```

Expected total:

```text
30 + 20 + 20 + 10 + 10 + 5 = 95
```

---

# Expected Test — L006

Expected catalog result:

```text
recommended_offer_id = SVC006
recommended_offer_name = Marketing Discovery Consultation
recommended_offer_category = consultation
recommendation_score = 58
recommendation_confidence = medium
recommendation_method = rule_based
offer_action = ask_discovery_before_package
```

Expected matched signals:

```text
service_interest_match = 30
business_type_fit = 20
budget_fit = 5
timeline_fit = 0
lead_quality_fit = 3
required_context_readiness = 0
```

Expected total:

```text
30 + 20 + 5 + 0 + 3 + 0 = 58
```

Expected risk flag:

```text
recommendation_needs_review
```

---

# n8n User Prompt

Use the following text as the user message in the Recommendation Node:

```text
Evaluate the following merged lead, qualification, and service catalog input.

Follow the deterministic recommendation scoring rules.

Select only an offer that exists in the provided catalog.

Return one valid JSON object only.

Do not return Markdown, code fences, or additional explanation.

Input:

{{ JSON.stringify($json) }}
```

---

# Suggested Node Configuration

```text
Node Name:
Rule-Based Recommendation

Model Temperature:
0 or the lowest available deterministic setting

Response Format:
JSON object

Retry on Failure:
Enabled

Maximum Retries:
2

Continue on Failure:
Disabled for the main path

Failure Route:
Fallback / Manual Review Path
```

---

# Recommended Architecture Note

For the current prototype, this prompt may execute the scoring simulation.

For the stronger engineering implementation, deterministic scoring should later move into:

```text
n8n Code Node
```

The AI node should then be limited to:

- explaining the selected offer
- identifying missing context
- drafting a human-reviewed follow-up message

Target future split:

```text
Code Node
-> calculate and rank offers deterministically

AI Recommendation Explanation Node
-> explain recommendation without changing selected offer

QA Node
-> validate catalog and safety rules
```

This keeps the recommendation decision explainable and reduces the risk of AI-generated scoring inconsistency.

---

# Definition of Done

This prompt is complete when:

1. `n8n/recommendation-node-prompt.md` exists.
2. The expected merged input contract is defined.
3. The prompt only recommends offers from the catalog.
4. All six matched-signal scoring rules are defined.
5. Recommendation score calculation is deterministic.
6. Confidence mapping is defined.
7. Offer-action policy is defined.
8. Tie-breaking rules are defined.
9. Recommendation risk flags are defined.
10. Fallback behavior is defined.
11. L001 expected output is documented.
12. L006 expected output is documented.
13. The n8n input expression is included.
14. The output is restricted to valid JSON only.
15. `requires_human_review` is always true.
16. The future Code Node separation is documented.