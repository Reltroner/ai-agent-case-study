# Google Sheet Update Mapping — AI Sales Recommendation & Follow-Up Assistant for UMKM

## Purpose

This document defines the Google Sheet mapping strategy for the AI Sales Recommendation & Follow-Up Assistant for UMKM.

The mapping layer converts validated lead-processing output and recommendation output into flat, tracker-ready rows.

The mapping layer must preserve:

- original lead data
- lead qualification output
- recommendation output
- QA and validation status
- human-review defaults
- customer feedback fields
- audit metadata
- mandatory human review

The mapping layer must not change the recommendation decision, lead score, or catalog identity.

---

## Architecture Position

```text
Manual Trigger / Google Form
-> Normalize Lead Input
-> Lead Qualification
-> Deterministic Recommendation Code Node
-> Follow-Up Drafting
-> JSON Parse & Validation
-> Google Sheet Update Mapping
-> Append or Update Tracker Row
-> Owner Notification
-> Human Review
```

The mapping layer receives only validated output.

---

# 1. Tracker Strategy

The system currently uses two tracker schemas.

## Lead Tracker

Schema:

```text
tracker/lead-tracker-columns.csv
```

Purpose:

```text
Store original lead data, lead qualification, need extraction, follow-up draft, QA result, and human-review state.
```

Recommended Google Sheet tab:

```text
Lead Tracker
```

---

## Recommendation Tracker

Schema:

```text
tracker/recommendation-tracker-columns.csv
```

Purpose:

```text
Store recommendation result, matched signals, recommendation QA, owner review, customer response, and feedback.
```

Recommended Google Sheet tab:

```text
Recommendation Tracker
```

---

# 2. Mapping Principles

The mapping layer must follow these principles:

1. Preserve source identifiers.
2. Do not recalculate scores.
3. Do not change catalog offer identity.
4. Flatten nested objects.
5. Convert arrays into readable text.
6. Preserve empty values consistently.
7. Add controlled default values.
8. Add audit timestamps.
9. Preserve validation status.
10. Preserve `requires_human_review = true`.
11. Never mark a message as sent automatically.
12. Never overwrite human-entered fields without an explicit update action.

---

# 3. Expected Mapping Input

The mapping node should receive one combined object.

```json
{
  "lead_input": {
    "lead_id": "L001",
    "customer_id": "C001",
    "lead_name": "Dinda",
    "business_type": "Skincare Brand",
    "source": "Instagram DM",
    "service_interest": "Social Media Management",
    "budget_range": "2-3 juta/bulan",
    "timeline": "Bulan ini",
    "message": "Kak bisa bantu kelola IG brand skincare aku?",
    "created_at": "2026-07-10"
  },
  "lead_output": {
    "lead_id": "L001",
    "lead_category": "hot",
    "lead_score": 90,
    "priority": "high",
    "score_breakdown": {
      "budget_clarity": 25,
      "timeline_urgency": 20,
      "service_clarity": 25,
      "buying_intent": 20
    },
    "qualification_reason": "",
    "main_need": "",
    "hidden_need": "",
    "missing_information": [],
    "next_best_action": "",
    "follow_up_strategy": "consultative",
    "recommended_response_type": "discovery_question",
    "follow_up_message": "",
    "crm_status": "qualified_hot",
    "next_follow_up_date": "",
    "owner_action_required": "",
    "crm_note": "",
    "quality_check": "passed",
    "risk_flags": [],
    "requires_human_review": true
  },
  "recommendation_output": {
    "customer_id": "C001",
    "lead_id": "L001",
    "recommended_offer_id": "SVC002",
    "recommended_offer_name": "Monthly Social Media Management",
    "recommended_offer_category": "social_media_management",
    "recommendation_score": 95,
    "recommendation_confidence": "high",
    "recommendation_method": "rule_based",
    "recommendation_reason": "",
    "offer_action": "ask_discovery_before_package",
    "matched_signals": {
      "service_interest_match": 30,
      "business_type_fit": 20,
      "budget_fit": 20,
      "timeline_fit": 10,
      "lead_quality_fit": 10,
      "required_context_readiness": 5
    },
    "missing_recommendation_context": [],
    "recommendation_risk_flags": [],
    "requires_human_review": true
  },
  "validation": {
    "validation_status": "passed",
    "validation_route": "continue",
    "blocking_errors": [],
    "warnings": [],
    "informational_notes": [],
    "is_tracker_ready": true,
    "requires_human_review": true
  }
}
```

---

# 4. Mapping Output Contract

The mapping node should return:

```json
{
  "lead_tracker_row": {},
  "recommendation_tracker_row": {},
  "mapping_status": "ready",
  "mapping_route": "append_both",
  "mapping_errors": [],
  "mapping_warnings": [],
  "requires_human_review": true
}
```

Allowed `mapping_status` values:

```text
ready
needs_review
failed
```

Allowed `mapping_route` values:

```text
append_both
append_lead_only
append_recommendation_only
update_existing_rows
fallback_rows
stop_workflow
```

---

# 5. Array-to-Text Conversion

Google Sheets stores arrays as text.

Use this transformation:

```javascript
Array.isArray(value) ? value.join(", ") : ""
```

Examples:

```json
[
  "missing_budget",
  "missing_timeline"
]
```

Becomes:

```text
missing_budget, missing_timeline
```

An empty array becomes:

```text
empty string
```

Fields requiring conversion:

```text
missing_information
risk_flags
missing_recommendation_context
recommendation_risk_flags
blocking_errors
warnings
informational_notes
```

---

# 6. Date and Timestamp Policy

Use ISO-compatible date values.

Recommended formats:

```text
Lead-created date:
YYYY-MM-DD
```

```text
System timestamp:
YYYY-MM-DDTHH:mm:ss.sssZ
```

Example:

```text
2026-07-16T10:30:00.000Z
```

System-generated timestamps:

```text
recommendation_created_at
recommendation_updated_at
validation_timestamp
mapping_timestamp
feedback_recorded_at
reviewed_at
```

The mapping node may generate:

```javascript
new Date().toISOString()
```

The mapping node must not replace the original lead `created_at`.

---

# 7. Lead Tracker Mapping

Target sheet:

```text
Lead Tracker
```

Target schema:

```text
tracker/lead-tracker-columns.csv
```

---

## Lead Identity Mapping

| Tracker Column | Source |
|---|---|
| lead_id | `lead_input.lead_id` |
| lead_name | `lead_input.lead_name` |
| business_type | `lead_input.business_type` |
| source | `lead_input.source` |
| service_interest | `lead_input.service_interest` |
| budget_range | `lead_input.budget_range` |
| timeline | `lead_input.timeline` |
| message | `lead_input.message` |
| created_at | `lead_input.created_at` |

Rules:

- `lead_id` must match `lead_output.lead_id`.
- Original lead message must be preserved exactly.
- Do not replace source input values with generated interpretations.

---

## Lead Qualification Mapping

| Tracker Column | Source |
|---|---|
| lead_category | `lead_output.lead_category` |
| lead_score | `lead_output.lead_score` |
| priority | `lead_output.priority` |
| budget_clarity_score | `lead_output.score_breakdown.budget_clarity` |
| timeline_urgency_score | `lead_output.score_breakdown.timeline_urgency` |
| service_clarity_score | `lead_output.score_breakdown.service_clarity` |
| buying_intent_score | `lead_output.score_breakdown.buying_intent` |
| qualification_reason | `lead_output.qualification_reason` |

The mapping node must not recalculate the lead score.

---

## Need and Strategy Mapping

| Tracker Column | Source |
|---|---|
| main_need | `lead_output.main_need` |
| hidden_need | `lead_output.hidden_need` |
| missing_information | `lead_output.missing_information.join(", ")` |
| next_best_action | `lead_output.next_best_action` |
| follow_up_strategy | `lead_output.follow_up_strategy` |
| recommended_response_type | `lead_output.recommended_response_type` |

---

## Follow-Up Draft Mapping

| Tracker Column | Source |
|---|---|
| follow_up_message | `lead_output.follow_up_message` |
| crm_status | `lead_output.crm_status` |
| next_follow_up_date | `lead_output.next_follow_up_date` |
| owner_action_required | `lead_output.owner_action_required` |
| crm_note | `lead_output.crm_note` |

The mapping layer must not claim that the follow-up message was sent.

---

## Lead QA and Human Review Mapping

| Tracker Column | Source or Default |
|---|---|
| quality_check | `lead_output.quality_check` |
| risk_flags | `lead_output.risk_flags.join(", ")` |
| requires_human_review | `true` |
| human_review_status | `pending_review` |
| human_decision | empty string |
| reviewed_at | empty string |
| final_message_sent | `no` |
| notes | validation warnings or empty string |

Mandatory defaults:

```text
requires_human_review = true
human_review_status = pending_review
final_message_sent = no
```

---

# 8. Lead Tracker Row Example — L001

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
  "created_at": "2026-07-10",
  "lead_category": "hot",
  "lead_score": 90,
  "priority": "high",
  "budget_clarity_score": 25,
  "timeline_urgency_score": 20,
  "service_clarity_score": 25,
  "buying_intent_score": 20,
  "qualification_reason": "",
  "main_need": "",
  "hidden_need": "",
  "missing_information": "",
  "next_best_action": "",
  "follow_up_strategy": "consultative",
  "recommended_response_type": "discovery_question",
  "follow_up_message": "",
  "crm_status": "qualified_hot",
  "next_follow_up_date": "",
  "owner_action_required": "",
  "crm_note": "",
  "quality_check": "passed",
  "risk_flags": "",
  "requires_human_review": true,
  "human_review_status": "pending_review",
  "human_decision": "",
  "reviewed_at": "",
  "final_message_sent": "no",
  "notes": ""
}
```

---

# 9. Recommendation Tracker Mapping

Target sheet:

```text
Recommendation Tracker
```

Target schema:

```text
tracker/recommendation-tracker-columns.csv
```

---

## Recommendation Identity Mapping

| Tracker Column | Source or Generated Value |
|---|---|
| recommendation_id | generated deterministic ID |
| lead_id | `recommendation_output.lead_id` |
| customer_id | `recommendation_output.customer_id` |

Recommended ID pattern:

```text
REC-{lead_id}-{timestamp}
```

Example:

```text
REC-L001-20260716T103000000Z
```

The ID must be unique and auditable.

---

## Lead Context Mapping

| Tracker Column | Source |
|---|---|
| customer_name | `lead_input.lead_name` |
| business_type | `lead_input.business_type` |
| source | `lead_input.source` |
| service_interest | `lead_input.service_interest` |
| budget_range | `lead_input.budget_range` |
| timeline | `lead_input.timeline` |
| message | `lead_input.message` |

---

## Lead Qualification Mapping

| Tracker Column | Source |
|---|---|
| lead_category | `lead_output.lead_category` |
| lead_score | `lead_output.lead_score` |
| priority | `lead_output.priority` |

---

## Recommendation Output Mapping

| Tracker Column | Source |
|---|---|
| recommended_offer_id | `recommendation_output.recommended_offer_id` |
| recommended_offer_name | `recommendation_output.recommended_offer_name` |
| recommended_offer_category | `recommendation_output.recommended_offer_category` |
| recommendation_score | `recommendation_output.recommendation_score` |
| recommendation_confidence | `recommendation_output.recommendation_confidence` |
| recommendation_method | `recommendation_output.recommendation_method` |
| recommendation_reason | `recommendation_output.recommendation_reason` |
| offer_action | `recommendation_output.offer_action` |

---

## Matched Signals Mapping

| Tracker Column | Source |
|---|---|
| matched_service_interest_score | `recommendation_output.matched_signals.service_interest_match` |
| matched_business_type_score | `recommendation_output.matched_signals.business_type_fit` |
| matched_budget_score | `recommendation_output.matched_signals.budget_fit` |
| matched_timeline_score | `recommendation_output.matched_signals.timeline_fit` |
| matched_lead_quality_score | `recommendation_output.matched_signals.lead_quality_fit` |
| matched_required_context_score | `recommendation_output.matched_signals.required_context_readiness` |

The mapping node must not recalculate these values.

---

## Recommendation QA Mapping

| Tracker Column | Source or Default |
|---|---|
| missing_recommendation_context | `recommendation_output.missing_recommendation_context.join(", ")` |
| recommendation_risk_flags | `recommendation_output.recommendation_risk_flags.join(", ")` |
| requires_human_review | `true` |

---

## Recommendation Human Review Mapping

| Tracker Column | Default |
|---|---|
| human_review_status | `pending_review` |
| human_decision | empty string |
| reviewed_at | empty string |
| final_message_sent | `no` |
| owner_notes | empty string |

The automated workflow must not overwrite these values after a human edits them.

---

## Customer Feedback Mapping

Initial defaults:

| Tracker Column | Default |
|---|---|
| customer_response | empty string |
| interaction_type | empty string |
| customer_rating | empty string |
| feedback_recorded_at | empty string |

These fields are populated only after manual follow-up or customer interaction.

---

## Audit Mapping

| Tracker Column | Source or Generated Value |
|---|---|
| source_catalog_version | `v1` |
| output_schema_version | `v1` |
| recommendation_created_at | current ISO timestamp |
| recommendation_updated_at | empty string |

---

# 10. Recommendation Tracker Row Example — L001

```json
{
  "recommendation_id": "REC-L001-20260716T103000000Z",
  "lead_id": "L001",
  "customer_id": "C001",
  "customer_name": "Dinda",
  "business_type": "Skincare Brand",
  "source": "Instagram DM",
  "service_interest": "Social Media Management",
  "budget_range": "2-3 juta/bulan",
  "timeline": "Bulan ini",
  "message": "Kak bisa bantu kelola IG brand skincare aku?",
  "lead_category": "hot",
  "lead_score": 90,
  "priority": "high",
  "recommended_offer_id": "SVC002",
  "recommended_offer_name": "Monthly Social Media Management",
  "recommended_offer_category": "social_media_management",
  "recommendation_score": 95,
  "recommendation_confidence": "high",
  "recommendation_method": "rule_based",
  "recommendation_reason": "The lead is a skincare brand asking for social media management with a clear budget and timeline, making Monthly Social Media Management the strongest catalog match.",
  "offer_action": "ask_discovery_before_package",
  "matched_service_interest_score": 30,
  "matched_business_type_score": 20,
  "matched_budget_score": 20,
  "matched_timeline_score": 10,
  "matched_lead_quality_score": 10,
  "matched_required_context_score": 5,
  "missing_recommendation_context": "current Instagram account, monthly content target, brand style preference, approval process, posting frequency, content goals",
  "recommendation_risk_flags": "",
  "requires_human_review": true,
  "human_review_status": "pending_review",
  "human_decision": "",
  "reviewed_at": "",
  "final_message_sent": "no",
  "owner_notes": "",
  "customer_response": "",
  "interaction_type": "",
  "customer_rating": "",
  "feedback_recorded_at": "",
  "source_catalog_version": "v1",
  "output_schema_version": "v1",
  "recommendation_created_at": "2026-07-16T10:30:00.000Z",
  "recommendation_updated_at": ""
}
```

---

# 11. Mapping for L006 Review Path

Expected validation:

```text
validation_status = needs_review
validation_route = tracker_and_manual_review
```

The mapping layer should still create both tracker rows.

Recommendation tracker defaults:

```text
human_review_status = pending_review
final_message_sent = no
```

Recommended owner notes:

```text
Recommendation requires discovery because budget, timeline, and business context are incomplete.
```

Recommendation risk flags:

```text
recommendation_needs_review
```

The row must not be rejected because L006 is structurally valid.

---

# 12. Validation-to-Mapping Route

## Passed Route

Condition:

```text
validation_status = passed
validation_route = continue
```

Mapping action:

```text
Create lead tracker row.
Create recommendation tracker row.
Append both rows.
Notify owner.
```

Mapping result:

```text
mapping_status = ready
mapping_route = append_both
```

---

## Needs-Review Route

Condition:

```text
validation_status = needs_review
validation_route = tracker_and_manual_review
```

Mapping action:

```text
Create both tracker rows.
Preserve warnings.
Set human_review_status = pending_review.
Set final_message_sent = no.
Notify owner that discovery or review is required.
```

Mapping result:

```text
mapping_status = needs_review
mapping_route = append_both
```

---

## Failed Route

Condition:

```text
validation_status = failed
validation_route = fallback_and_manual_review
```

Mapping action:

```text
Use safe fallback outputs.
Create fallback tracker rows when identifiers are available.
Preserve blocking errors.
Set quality status to needs_review.
Set human_review_status = pending_review.
Do not send a customer message.
```

Mapping result:

```text
mapping_status = needs_review
mapping_route = fallback_rows
```

---

## Stop Route

Condition:

```text
validation_route = stop_workflow
```

Mapping action:

```text
Do not attempt normal tracker mapping.
Log the persistence failure.
Stop the workflow.
```

Mapping result:

```text
mapping_status = failed
mapping_route = stop_workflow
```

---

# 13. Append Versus Update Policy

## Append a New Row

Use append when:

- `lead_id` does not exist in the Lead Tracker.
- no active recommendation row exists for the same `recommendation_id`.
- a new recommendation version should be recorded separately.

---

## Update Existing Lead Row

Use update when:

- the same `lead_id` already exists.
- new lead-processing output belongs to the same lead lifecycle.
- the update does not overwrite protected human fields.

Potential update fields:

```text
lead_category
lead_score
priority
qualification_reason
missing_information
next_best_action
follow_up_message
crm_status
quality_check
risk_flags
```

Protected human fields:

```text
human_review_status
human_decision
reviewed_at
final_message_sent
notes
```

Protected fields must remain unchanged unless the update originates from a human-review workflow.

---

## Append a New Recommendation Version

Recommended policy:

```text
Do not overwrite previous recommendation history.
Append a new recommendation row when the selected offer, score, method, or catalog version changes.
```

This preserves an audit trail.

A recommendation update may use:

```text
recommendation_updated_at
```

only for non-decision metadata changes.

---

# 14. Duplicate Prevention

Before appending a lead row, search by:

```text
lead_id
```

Before appending a recommendation row, search by:

```text
recommendation_id
```

Optional duplicate fingerprint:

```text
lead_id
+ recommended_offer_id
+ recommendation_method
+ recommendation_score
+ source_catalog_version
```

If an identical fingerprint already exists:

```text
Do not append another identical row.
Return a duplicate warning.
```

Suggested warning code:

```text
duplicate_tracker_record
```

---

# 15. Human-Field Protection

The automation must never overwrite human-entered fields unless the workflow explicitly performs a human-review update.

Protected lead tracker fields:

```text
human_review_status
human_decision
reviewed_at
final_message_sent
notes
```

Protected recommendation tracker fields:

```text
human_review_status
human_decision
reviewed_at
final_message_sent
owner_notes
customer_response
interaction_type
customer_rating
feedback_recorded_at
```

---

# 16. Validation Metadata Preservation

The current tracker schemas do not include every validation field.

Recommended initial strategy:

```text
Store blocking errors and warnings inside notes or owner_notes.
```

Lead tracker:

```text
notes =
validation warnings + blocking errors
```

Recommendation tracker:

```text
owner_notes =
validation warnings + blocking errors
```

Future schema extension may add:

```text
validation_status
validation_route
validation_warnings
validation_errors
validation_timestamp
```

---

# 17. Missing Values Policy

Use empty string for unavailable optional tracker fields.

```text
null
undefined
missing optional value
-> empty string
```

Exceptions:

```text
lead_score may remain null for fallback
recommendation_score may remain null for fallback
requires_human_review must be true
final_message_sent must be no
human_review_status must be pending_review
```

Do not write literal strings:

```text
undefined
null
NaN
```

into Google Sheets.

---

# 18. Boolean Mapping

Recommended Google Sheet representation:

```text
true
false
```

Required mapping:

```text
requires_human_review = true
```

Do not map the field to:

```text
yes
1
TRUE as arbitrary text
```

unless the Google Sheet integration explicitly normalizes booleans.

---

# 19. Numerical Mapping

These fields must remain numeric:

```text
lead_score
budget_clarity_score
timeline_urgency_score
service_clarity_score
buying_intent_score
recommendation_score
matched_service_interest_score
matched_business_type_score
matched_budget_score
matched_timeline_score
matched_lead_quality_score
matched_required_context_score
customer_rating
```

Do not convert scores into formatted strings such as:

```text
"95 points"
"90/100"
```

---

# 20. Recommended n8n Mapping Nodes

```text
Node 1:
Build Lead Tracker Row

Node 2:
Build Recommendation Tracker Row

Node 3:
Check Existing Lead Row

Node 4:
Append or Update Lead Tracker

Node 5:
Check Existing Recommendation Row

Node 6:
Append Recommendation Tracker

Node 7:
Set Mapping Result
```

For the MVP, Node 1 and Node 2 may be combined into one Code Node.

Recommended node name:

```text
Build Google Sheet Tracker Rows
```

---

# 21. Suggested n8n Expressions

## Lead ID

```javascript
{{ $json.lead_tracker_row.lead_id }}
```

## Recommendation ID

```javascript
{{ $json.recommendation_tracker_row.recommendation_id }}
```

## Lead Score

```javascript
{{ $json.lead_tracker_row.lead_score }}
```

## Recommendation Score

```javascript
{{ $json.recommendation_tracker_row.recommendation_score }}
```

## Human Review Status

```javascript
{{ $json.recommendation_tracker_row.human_review_status }}
```

## Final Message Sent

```javascript
{{ $json.recommendation_tracker_row.final_message_sent }}
```

---

# 22. Mapping Result Example — Passed

```json
{
  "mapping_status": "ready",
  "mapping_route": "append_both",
  "lead_tracker_row": {
    "lead_id": "L001"
  },
  "recommendation_tracker_row": {
    "recommendation_id": "REC-L001-20260716T103000000Z",
    "lead_id": "L001",
    "recommended_offer_id": "SVC002"
  },
  "mapping_errors": [],
  "mapping_warnings": [],
  "requires_human_review": true
}
```

---

# 23. Mapping Result Example — Needs Review

```json
{
  "mapping_status": "needs_review",
  "mapping_route": "append_both",
  "lead_tracker_row": {
    "lead_id": "L006",
    "human_review_status": "pending_review",
    "final_message_sent": "no"
  },
  "recommendation_tracker_row": {
    "lead_id": "L006",
    "recommended_offer_id": "SVC006",
    "recommendation_risk_flags": "recommendation_needs_review",
    "human_review_status": "pending_review",
    "final_message_sent": "no"
  },
  "mapping_errors": [],
  "mapping_warnings": [
    "recommendation_needs_review",
    "missing_budget",
    "missing_timeline"
  ],
  "requires_human_review": true
}
```

---

# 24. Mapping Result Example — Fallback

```json
{
  "mapping_status": "needs_review",
  "mapping_route": "fallback_rows",
  "lead_tracker_row": {
    "lead_id": "L001",
    "lead_category": "needs_review",
    "lead_score": null,
    "quality_check": "needs_review",
    "human_review_status": "pending_review",
    "final_message_sent": "no"
  },
  "recommendation_tracker_row": {
    "lead_id": "L001",
    "recommended_offer_id": "",
    "recommendation_score": null,
    "recommendation_confidence": "review",
    "recommendation_method": "fallback",
    "offer_action": "manual_review_required",
    "human_review_status": "pending_review",
    "final_message_sent": "no"
  },
  "mapping_errors": [
    "invalid_json"
  ],
  "mapping_warnings": [],
  "requires_human_review": true
}
```

---

# 25. Mapping Validation Checklist

Before writing to Google Sheets, validate:

## Lead Tracker

- [ ] `lead_id` exists.
- [ ] Original lead fields are preserved.
- [ ] Lead score fields remain numeric or valid fallback null.
- [ ] Score breakdown has been flattened.
- [ ] Arrays have been converted to text.
- [ ] Human-review defaults are present.
- [ ] `requires_human_review` equals true.
- [ ] `final_message_sent` equals no.

## Recommendation Tracker

- [ ] `recommendation_id` exists.
- [ ] `lead_id` and `customer_id` exist.
- [ ] Offer identity matches validated output.
- [ ] Recommendation scores remain numeric or valid fallback null.
- [ ] Matched signals have been flattened.
- [ ] Arrays have been converted to text.
- [ ] Audit versions are populated.
- [ ] Human-review defaults are present.
- [ ] `requires_human_review` equals true.
- [ ] `final_message_sent` equals no.

---

# 26. Mapping Failure Conditions

Blocking mapping errors:

```text
missing lead_id
missing recommendation_id
invalid tracker row object
requires_human_review is false
final_message_sent defaults to yes
unsupported mapping route
Google Sheet column mismatch
```

Suggested error codes:

```text
missing_tracker_lead_id
missing_recommendation_id
invalid_lead_tracker_row
invalid_recommendation_tracker_row
human_review_mapping_failed
unsafe_message_sent_default
tracker_column_mismatch
unsupported_mapping_route
```

---

# 27. Google Sheet Write Failure Handling

If the Lead Tracker write fails:

```text
Do not mark mapping as complete.
Do not send owner notification claiming success.
Preserve the prepared row.
Route to retry or manual persistence review.
```

If the Recommendation Tracker write fails after the Lead Tracker succeeds:

```text
Preserve the successful lead row ID.
Record partial persistence.
Retry only the recommendation tracker write.
Do not append a duplicate lead row.
```

Suggested status:

```text
partial_write_failure
```

---

# 28. Idempotency Strategy

The mapping workflow should be safe to retry.

Lead idempotency key:

```text
lead_id
```

Recommendation idempotency key:

```text
recommendation_id
```

A retry must not produce duplicate rows when the previous write succeeded.

Recommended flow:

```text
search existing row
-> if found: update allowed fields
-> if not found: append new row
```

---

# 29. L001 Expected Mapping

Expected route:

```text
append_both
```

Expected status:

```text
ready
```

Expected lead row:

```text
lead_id = L001
lead_category = hot
lead_score = 90
crm_status = qualified_hot
quality_check = passed
human_review_status = pending_review
final_message_sent = no
```

Expected recommendation row:

```text
recommended_offer_id = SVC002
recommendation_score = 95
recommendation_confidence = high
recommendation_method = rule_based
offer_action = ask_discovery_before_package
human_review_status = pending_review
final_message_sent = no
```

---

# 30. L006 Expected Mapping

Expected route:

```text
append_both
```

Expected status:

```text
needs_review
```

Expected lead row:

```text
lead_id = L006
lead_category = cold
lead_score = 15
crm_status = qualified_cold
quality_check = needs_review
human_review_status = pending_review
final_message_sent = no
```

Expected recommendation row:

```text
recommended_offer_id = SVC006
recommendation_score = 58
recommendation_confidence = medium
recommendation_method = rule_based
recommendation_risk_flags = recommendation_needs_review
human_review_status = pending_review
final_message_sent = no
```

L006 remains tracker-ready and must not be treated as a failed recommendation.

---

# 31. Current MVP Scope

Included:

```text
lead tracker mapping
recommendation tracker mapping
nested object flattening
array-to-text conversion
default human-review fields
audit timestamps
append/update policy
duplicate prevention
idempotency
normal/review/fallback routes
```

Not included:

```text
real Google Sheet credentials
live n8n Google Sheets nodes
multi-user sheet permissions
customer-facing auto-send
production database synchronization
collaborative-filtering feedback ingestion
```

---

# 32. Definition of Done

This Google Sheet update mapping is complete when it defines:

1. Tracker strategy
2. Mapping principles
3. Expected combined input
4. Mapping output contract
5. Array-to-text conversion
6. Timestamp policy
7. Lead tracker mapping
8. Lead tracker example
9. Recommendation tracker mapping
10. Recommendation tracker example
11. L006 review-path mapping
12. Validation-to-mapping routes
13. Append-versus-update policy
14. Duplicate prevention
15. Human-field protection
16. Validation metadata preservation
17. Missing-value policy
18. Boolean mapping
19. Numeric mapping
20. Recommended n8n mapping nodes
21. Suggested n8n expressions
22. Passed mapping result
23. Needs-review mapping result
24. Fallback mapping result
25. Mapping validation checklist
26. Mapping failure conditions
27. Google Sheet write failure handling
28. Idempotency strategy
29. L001 expected mapping
30. L006 expected mapping
31. Current MVP scope