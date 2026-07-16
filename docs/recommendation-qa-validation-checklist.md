# Recommendation QA Validation Checklist — AI Sales Recommendation & Follow-Up Assistant for UMKM

## Purpose

This document defines the quality assurance checklist for the recommendation layer of the AI Sales Recommendation & Follow-Up Assistant for UMKM.

The checklist validates whether recommendation outputs are:

- structurally valid
- consistent with the service catalog
- mathematically correct
- explainable
- safe for customer-facing follow-up
- compatible with the recommendation output schema
- ready for tracker mapping
- protected by human-in-the-loop review

The recommendation QA process must validate both successful high-confidence recommendations and review-path recommendations with incomplete customer context.

---

## QA Scope

This checklist validates recommendation outputs generated from:

```text
Lead Input
-> Customer Intent and Lead Qualification
-> Service Catalog Matching
-> Rule-Based Recommendation Engine
-> Recommendation Output
-> QA Validation
-> Human Review
```

The current QA scope focuses on:

```text
recommendation_method = rule_based
```

Future versions may extend this checklist for:

```text
interaction_based
collaborative_filtering_simulation
fallback
```

---

## Source-of-Truth Artifacts

Recommendation QA should validate outputs against these files:

```text
data/sample-leads.csv
data/service-catalog.json
docs/lead-scoring-rules.md
docs/recommendation-engine-design.md
docs/recommendation-output-schema.md
outputs/manual-test-L001.json
outputs/manual-test-L006.json
outputs/recommendation-test-L001.json
outputs/recommendation-test-L006.json
tracker/recommendation-tracker-columns.csv
```

---

# 1. JSON Structure Validation

Each recommendation output must be valid JSON.

## Required Top-Level Fields

```text
customer_id
lead_id
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
requires_human_review
```

## Required `matched_signals` Fields

```text
service_interest_match
business_type_fit
budget_fit
timeline_fit
lead_quality_fit
required_context_readiness
```

## Structural Checklist

- [ ] Output is valid JSON.
- [ ] Output contains no Markdown code fence.
- [ ] Output contains no explanation outside the JSON object.
- [ ] All required top-level fields exist.
- [ ] `matched_signals` exists and is an object.
- [ ] All required `matched_signals` fields exist.
- [ ] `missing_recommendation_context` is an array.
- [ ] `recommendation_risk_flags` is an array.
- [ ] `requires_human_review` is a boolean.
- [ ] No unexpected nested structure prevents tracker mapping.

---

# 2. Identifier Integrity Validation

The recommendation output must preserve the correct customer and lead identifiers.

## Rules

- `lead_id` must match the original lead.
- `customer_id` must remain consistent for the same customer.
- The recommendation engine must not replace or modify identifiers.
- A recommendation must be traceable to its source lead.

## Checklist

- [ ] `lead_id` is not empty.
- [ ] `customer_id` is not empty.
- [ ] `lead_id` matches the source lead.
- [ ] `customer_id` matches the expected customer mapping.
- [ ] Identifiers are not duplicated incorrectly.
- [ ] Identifiers can be linked to the recommendation tracker.

---

# 3. Service Catalog Integrity Validation

Every recommended offer must exist in:

```text
data/service-catalog.json
```

## Rules

- `recommended_offer_id` must exist in the catalog.
- `recommended_offer_name` must match the catalog entry.
- `recommended_offer_category` must match the catalog entry.
- The engine must not invent a service.
- An empty offer is only allowed for fallback or manual-review output.

## Checklist

- [ ] `recommended_offer_id` exists in the service catalog.
- [ ] `recommended_offer_name` matches the catalog.
- [ ] `recommended_offer_category` matches the catalog.
- [ ] The offer is active and usable for recommendation.
- [ ] The offer keywords are relevant to the lead inquiry.
- [ ] The offer's `best_for` data supports the business-type match.
- [ ] The offer price range does not clearly conflict with the lead budget.
- [ ] The offer's required context is represented in `missing_recommendation_context`.
- [ ] No non-existent offer was generated.

---

# 4. Allowed Enum Validation

## Recommendation Confidence

Allowed values:

```text
high
medium
low
review
```

## Recommendation Method

Allowed values:

```text
rule_based
interaction_based
collaborative_filtering_simulation
fallback
```

## Offer Action

Allowed values:

```text
recommend_offer
ask_discovery_before_package
clarify_budget_before_offer
clarify_timeline_before_offer
share_portfolio_first
manual_review_required
```

## Recommendation Risk Flags

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

## Checklist

- [ ] `recommendation_confidence` uses an allowed value.
- [ ] `recommendation_method` uses an allowed value.
- [ ] `offer_action` uses an allowed value.
- [ ] Every recommendation risk flag uses an allowed value.
- [ ] No unsupported enum value is present.

---

# 5. Matched Signal Range Validation

Each matched signal must remain inside its allowed range.

| Signal | Minimum | Maximum |
|---|---:|---:|
| service_interest_match | 0 | 30 |
| business_type_fit | 0 | 20 |
| budget_fit | 0 | 20 |
| timeline_fit | 0 | 10 |
| lead_quality_fit | 0 | 10 |
| required_context_readiness | 0 | 10 |

## Checklist

- [ ] `service_interest_match` is between 0 and 30.
- [ ] `business_type_fit` is between 0 and 20.
- [ ] `budget_fit` is between 0 and 20.
- [ ] `timeline_fit` is between 0 and 10.
- [ ] `lead_quality_fit` is between 0 and 10.
- [ ] `required_context_readiness` is between 0 and 10.
- [ ] All matched signal values are numeric.
- [ ] No matched signal uses a negative value.
- [ ] No matched signal exceeds its maximum.

---

# 6. Recommendation Score Validation

The recommendation score must equal the total of all matched signals.

## Formula

```text
recommendation_score =
service_interest_match
+ business_type_fit
+ budget_fit
+ timeline_fit
+ lead_quality_fit
+ required_context_readiness
```

## Checklist

- [ ] `recommendation_score` is numeric for a normal recommendation.
- [ ] `recommendation_score` is between 0 and 100.
- [ ] The score equals the total of all matched signals.
- [ ] No unexplained score component is added.
- [ ] No matched signal is excluded from the total.
- [ ] `recommendation_score` is `null` only when fallback is used.

---

# 7. Recommendation Confidence Validation

Confidence must match the recommendation score.

| Score | Expected Confidence |
|---|---|
| 80–100 | high |
| 50–79 | medium |
| 0–49 | low |
| null or unsafe | review |

## Checklist

- [ ] Score 80–100 maps to `high`.
- [ ] Score 50–79 maps to `medium`.
- [ ] Score 0–49 maps to `low`.
- [ ] A null or unsafe score maps to `review`.
- [ ] Confidence is not artificially increased.
- [ ] A low-confidence output is not presented as a final offer.

---

# 8. Lead Qualification Consistency

The recommendation output should use the previously validated lead qualification result.

Lead qualification source:

```text
outputs/manual-test-L001.json
outputs/manual-test-L006.json
```

## Lead Quality Fit Mapping

| Lead Category | Expected Score |
|---|---:|
| hot | 10 |
| warm | 7 |
| cold | 3 |
| needs_review | 0 |

## Checklist

- [ ] Lead category matches the existing manual lead output.
- [ ] Lead score matches the existing manual lead output.
- [ ] `lead_quality_fit` matches the lead category.
- [ ] Recommendation logic does not silently reclassify the lead.
- [ ] A cold lead does not receive hot-lead quality points.
- [ ] A review-required lead does not receive qualified-lead points.

---

# 9. Recommendation Reason Validation

The recommendation reason must be grounded in available data.

## The Reason May Use

```text
business type
service interest
budget signal
timeline signal
lead category
lead score
catalog category
catalog keywords
catalog best_for
required context
```

## The Reason Must Not

```text
invent customer preferences
invent prior purchases
invent interaction history
invent ratings
invent business goals
promise conversion
promise sales growth
claim guaranteed product fit
```

## Checklist

- [ ] The reason references real lead data.
- [ ] The reason references real catalog data.
- [ ] The reason explains the strongest matching signals.
- [ ] The reason is understandable to a human reviewer.
- [ ] The reason does not overstate confidence.
- [ ] The reason does not contain hallucinated information.
- [ ] The reason does not promise business results.
- [ ] The reason does not claim the offer is guaranteed to work.

---

# 10. Offer Action Validation

The offer action must match confidence, missing context, and commercial readiness.

## Expected Policy

| Condition | Expected Offer Action |
|---|---|
| High confidence with sufficient context | recommend_offer |
| High confidence with missing discovery context | ask_discovery_before_package |
| Budget missing or unclear | clarify_budget_before_offer |
| Timeline missing or unclear | clarify_timeline_before_offer |
| Proof of work is needed | share_portfolio_first |
| Unsafe, low-confidence, or unclear catalog match | manual_review_required |

## Checklist

- [ ] High-confidence output uses a safe action.
- [ ] Medium-confidence output uses discovery-first or clarification action.
- [ ] Missing budget is reflected in the action when commercially important.
- [ ] Missing timeline is reflected in the action when operationally important.
- [ ] Low-confidence output does not use `recommend_offer`.
- [ ] Unsafe output uses `manual_review_required`.
- [ ] The action does not bypass owner review.
- [ ] The action does not imply that a message has already been sent.

---

# 11. Missing Recommendation Context Validation

`missing_recommendation_context` must identify information required before the offer can be confidently finalized.

## Rules

- The field must be an array.
- Items should be grounded in the catalog's `required_context`.
- Critical missing information must reduce readiness.
- An empty array is only appropriate when context is sufficiently complete.

## Checklist

- [ ] Field is an array.
- [ ] Each item is understandable.
- [ ] Each item is relevant to the recommended offer.
- [ ] Items align with the catalog's required context.
- [ ] Missing budget is included when budget is unavailable and relevant.
- [ ] Missing timeline is included when timeline is unavailable and relevant.
- [ ] Required context readiness reflects the amount of missing information.
- [ ] No irrelevant discovery question is included.

---

# 12. Required Context Readiness Validation

## Expected Mapping

| Context Availability | Score |
|---|---:|
| Most required context is available | 10 |
| Some required context is missing | 5 |
| Critical required context is missing | 0 |

## Checklist

- [ ] A score of 10 is only used when most context is available.
- [ ] A score of 5 is used when the offer is relevant but discovery is incomplete.
- [ ] A score of 0 is used when critical context is missing.
- [ ] The score is consistent with `missing_recommendation_context`.
- [ ] The output does not claim readiness while listing extensive missing context.

---

# 13. Recommendation Risk Flag Validation

Risk flags should describe actual recommendation risks.

## Risk Flag Guidance

### `low_recommendation_confidence`

Use when the recommendation score is below 50.

### `insufficient_interaction_data`

Use when an interaction-based or collaborative recommendation lacks enough interaction data.

For a rule-based MVP, this flag is optional unless the output explicitly depends on unavailable interaction signals.

### `cold_start_customer`

Use when collaborative filtering cannot evaluate a new customer.

### `cold_start_offer`

Use when collaborative filtering cannot evaluate a new offer.

### `offer_budget_mismatch`

Use when the offer price range likely conflicts with the lead budget.

### `recommendation_needs_review`

Use when a recommendation is structurally valid but important context remains incomplete.

### `catalog_match_unclear`

Use when more than one offer is similarly relevant or no strong catalog match exists.

### `manual_review_required`

Use when the system cannot safely finalize the recommendation.

## Checklist

- [ ] Risk flags reflect actual risks.
- [ ] No irrelevant risk flag is added.
- [ ] High-confidence clean output may use an empty array.
- [ ] Incomplete commercial context is flagged when necessary.
- [ ] Budget mismatch uses `offer_budget_mismatch`.
- [ ] Weak catalog matching uses `catalog_match_unclear`.
- [ ] Unsafe recommendation uses `manual_review_required`.
- [ ] Collaborative-filtering-only flags are not incorrectly required for rule-based output.

---

# 14. Human Review Safety Validation

The recommendation system must preserve human control.

Required field:

```json
{
  "requires_human_review": true
}
```

## Checklist

- [ ] `requires_human_review` exists.
- [ ] `requires_human_review` is exactly `true`.
- [ ] The recommendation is treated as decision support.
- [ ] The recommendation is not automatically sent.
- [ ] The follow-up draft is not automatically sent.
- [ ] Final pricing remains controlled by the owner.
- [ ] The owner may approve, edit, or reject the recommendation.
- [ ] Human review status can be mapped into the tracker.

## Automatic Failure Conditions

The QA result must fail when:

```text
requires_human_review = false
```

or when the field is missing.

---

# 15. Fallback Output Validation

Fallback should be used when the system cannot safely recommend an offer.

## Expected Fallback Characteristics

```text
recommended_offer_id = empty
recommended_offer_name = empty
recommended_offer_category = empty
recommendation_score = null
recommendation_confidence = review
recommendation_method = fallback
offer_action = manual_review_required
requires_human_review = true
```

Expected risk flags:

```text
recommendation_needs_review
manual_review_required
```

## Checklist

- [ ] Fallback uses `recommendation_method = fallback`.
- [ ] Fallback uses `recommendation_confidence = review`.
- [ ] Fallback does not invent an offer.
- [ ] Fallback score is `null`.
- [ ] Fallback uses `manual_review_required`.
- [ ] Fallback includes appropriate risk flags.
- [ ] Fallback preserves the original lead ID when available.
- [ ] Fallback preserves the original customer ID when available.
- [ ] Fallback requires human review.

---

# 16. Tracker Mapping Validation

Recommendation output must be compatible with:

```text
tracker/recommendation-tracker-columns.csv
```

## Mapping Checklist

- [ ] `lead_id` maps correctly.
- [ ] `customer_id` maps correctly.
- [ ] Recommended offer fields map correctly.
- [ ] Recommendation score maps correctly.
- [ ] Recommendation confidence maps correctly.
- [ ] Recommendation method maps correctly.
- [ ] Recommendation reason maps correctly.
- [ ] Offer action maps correctly.
- [ ] All matched signals map into separate tracker columns.
- [ ] Missing context is converted into readable text.
- [ ] Risk flags are converted into readable text.
- [ ] Human review defaults remain intact.
- [ ] `final_message_sent` defaults to `no`.

---

# 17. Test Case QA — L001

## Source Lead

```text
Lead ID: L001
Customer ID: C001
Lead Name: Dinda
Business Type: Skincare Brand
Service Interest: Social Media Management
Budget: 2-3 juta/bulan
Timeline: Bulan ini
Lead Category: hot
Lead Score: 90
```

## Expected Recommendation

```text
Offer ID: SVC002
Offer Name: Monthly Social Media Management
Offer Category: social_media_management
Recommendation Method: rule_based
Recommendation Score: 95
Recommendation Confidence: high
Offer Action: ask_discovery_before_package
QA Result: passed
```

## Expected Matched Signals

```text
service_interest_match = 30
business_type_fit = 20
budget_fit = 20
timeline_fit = 10
lead_quality_fit = 10
required_context_readiness = 5
```

Score validation:

```text
30 + 20 + 20 + 10 + 10 + 5 = 95
```

## L001 Validation Checklist

- [x] JSON structure is valid.
- [x] Lead ID matches L001.
- [x] Customer ID matches C001.
- [x] SVC002 exists in the catalog.
- [x] Offer name matches SVC002.
- [x] Offer category matches SVC002.
- [x] Matched signals are within allowed ranges.
- [x] Recommendation score equals 95.
- [x] Confidence correctly maps to high.
- [x] Lead quality fit correctly maps from hot to 10.
- [x] Offer action is appropriate.
- [x] Missing recommendation context is an array.
- [x] Risk flags are an array.
- [x] No blocking recommendation risk exists.
- [x] Human review remains required.

## L001 QA Result

```text
passed
```

Interpretation:

```text
The recommendation is structurally valid, catalog-grounded, mathematically correct, high-confidence, and safe for human-reviewed discovery follow-up.
```

---

# 18. Test Case QA — L006

## Source Lead

```text
Lead ID: L006
Customer ID: C006
Lead Name: Bima
Business Type: Local Gym
Service Interest: Marketing Consultation
Budget: Tidak disebutkan
Timeline: Tidak disebutkan
Lead Category: cold
Lead Score: 15
```

## Expected Recommendation

```text
Offer ID: SVC006
Offer Name: Marketing Discovery Consultation
Offer Category: consultation
Recommendation Method: rule_based
Recommendation Score: 58
Recommendation Confidence: medium
Offer Action: ask_discovery_before_package
QA Result: needs_review
```

## Expected Matched Signals

```text
service_interest_match = 30
business_type_fit = 20
budget_fit = 5
timeline_fit = 0
lead_quality_fit = 3
required_context_readiness = 0
```

Score validation:

```text
30 + 20 + 5 + 0 + 3 + 0 = 58
```

## Expected Missing Context

```text
specific marketing problem
business goal
available budget
timeline
current marketing channels
decision-making stage
```

## Expected Risk Flag

```text
recommendation_needs_review
```

## L006 Validation Checklist

- [x] JSON structure is valid.
- [x] Lead ID matches L006.
- [x] Customer ID matches C006.
- [x] SVC006 exists in the catalog.
- [x] Offer name matches SVC006.
- [x] Offer category matches SVC006.
- [x] Matched signals are within allowed ranges.
- [x] Recommendation score equals 58.
- [x] Confidence correctly maps to medium.
- [x] Lead quality fit correctly maps from cold to 3.
- [x] Missing budget is reflected in the score.
- [x] Missing timeline is reflected in the score.
- [x] Required context readiness correctly equals 0.
- [x] Offer action uses a discovery-first approach.
- [x] Recommendation does not push a fixed package.
- [x] Recommendation risk flags are present.
- [x] Human review remains required.

## L006 QA Result

```text
needs_review
```

Interpretation:

```text
The recommendation is structurally valid and catalog-grounded, but critical commercial and discovery context is missing. The output is suitable for a human-reviewed discovery conversation, not a final package recommendation.
```

---

# 19. Manual Recommendation Validation Summary

| Lead | Offer | Score | Confidence | Score Valid | Catalog Valid | Safe Action | Human Review | QA Result |
|---|---|---:|---|---|---|---|---|---|
| L001 | SVC002 | 95 | high | yes | yes | yes | true | passed |
| L006 | SVC006 | 58 | medium | yes | yes | yes | true | needs_review |

---

# 20. QA Result Classification

## passed

Use when:

- JSON is valid
- catalog match is valid
- score is correct
- confidence is correct
- recommendation is grounded
- no blocking risk exists
- human review is preserved

## needs_review

Use when:

- JSON is valid
- catalog match is valid
- score is correct
- recommendation is directionally useful
- important business or customer context is incomplete
- owner discovery is still required

## failed

Use when:

- JSON is invalid
- required fields are missing
- offer does not exist
- score calculation is incorrect
- confidence does not match score
- recommendation contains hallucinated information
- unsafe offer action is used
- `requires_human_review` is false or missing

---

# 21. Failure Severity

## Blocking Failure

Examples:

```text
invalid JSON
unknown catalog offer
incorrect score total
requires_human_review is false
unsupported recommendation method
unsupported offer action
invented customer information
```

Required action:

```text
Reject output and route to fallback or manual review.
```

## Review Warning

Examples:

```text
missing budget
missing timeline
medium recommendation confidence
critical required context missing
unclear decision-making stage
```

Required action:

```text
Preserve the recommendation as a discovery direction and require owner review.
```

## Informational Warning

Examples:

```text
customer has no historical rating
interaction data is not yet available
collaborative filtering is not yet active
```

Required action:

```text
Continue using the rule-based MVP without treating the absence of historical data as a structural failure.
```

---

# 22. Recommendation QA Execution Template

Use this template for future recommendation tests:

```text
Lead ID:
Customer ID:
Recommended Offer ID:
Recommended Offer Name:
Recommendation Method:
Recommendation Score:
Calculated Signal Total:
Recommendation Confidence:
Expected Confidence:
Offer Action:
Catalog Match:
Missing Context Count:
Risk Flags:
Requires Human Review:
QA Result:
QA Notes:
```

---

# 23. Final QA Status

Current recommendation test coverage:

```text
High-confidence rule-based recommendation: completed
Review-path rule-based recommendation: completed
Catalog validation: completed
Score validation: completed
Confidence validation: completed
Human-review safety validation: completed
Fallback test: not yet executed
Interaction-based test: not yet executed
Collaborative filtering test: not yet executed
```

Current validated files:

```text
outputs/recommendation-test-L001.json
outputs/recommendation-test-L006.json
```

---

# 24. QA Conclusion

The current rule-based recommendation layer has validated two critical paths:

```text
L001
-> strong service match
-> high-confidence recommendation
-> discovery-before-package action
-> human review

L006
-> general service inquiry
-> medium-confidence consultation recommendation
-> critical context still missing
-> review-path discovery action
-> human review
```

This confirms that the recommendation architecture can:

- recommend a catalog offer for a qualified lead
- avoid forcing a package on an unclear lead
- calculate explainable matched-signal scores
- preserve safe sales actions
- route incomplete cases into human-reviewed discovery
- maintain compatibility with the recommendation tracker

---

# 25. Definition of Done

This QA checklist is complete when it defines:

1. JSON structure validation
2. Identifier integrity validation
3. Service catalog integrity validation
4. Allowed enum validation
5. Matched signal range validation
6. Recommendation score validation
7. Confidence validation
8. Lead qualification consistency
9. Recommendation reason validation
10. Offer action validation
11. Missing context validation
12. Required context readiness validation
13. Risk flag validation
14. Human review safety validation
15. Fallback validation
16. Tracker mapping validation
17. L001 high-confidence test validation
18. L006 review-path test validation
19. Manual validation summary
20. QA result classification
21. Failure severity classification
22. QA execution template
23. Current QA coverage status