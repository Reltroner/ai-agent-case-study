# Phase 2 Dry Run Script — AI Sales Recommendation & Follow-Up Assistant for UMKM

## Purpose

This document defines the controlled Phase 2 dry-run procedure for the AI Sales Recommendation & Follow-Up Assistant for UMKM.

The dry run validates whether the current Phase 2 design can process a lead through:

```text
lead intake
-> lead qualification
-> deterministic service recommendation
-> JSON validation
-> Google Sheet row mapping
-> owner notification preparation
-> human-review state
```

The dry run must verify both:

```text
high-confidence normal path
review-required path
```

It also verifies selected failure and safety paths.

No customer-facing message may be sent during this dry run.

---

# 1. Dry Run Scope

The dry run covers:

1. Repository and artifact preflight.
2. JSON syntax validation.
3. Recommendation Code Node syntax validation.
4. L001 normal-path simulation.
5. L006 review-path simulation.
6. Lead and recommendation score verification.
7. Catalog identity verification.
8. JSON parsing and validation routing.
9. Google Sheet row mapping simulation.
10. Owner notification simulation.
11. Human-review safety verification.
12. Invalid JSON failure test.
13. Unknown catalog offer failure test.
14. Duplicate-record and idempotency test.
15. Partial persistence failure simulation.
16. Dry-run evidence collection.
17. Final dry-run result classification.

---

# 2. Source-of-Truth Artifacts

The dry run uses these files:

```text
data/sample-leads.csv
data/service-catalog.json

outputs/manual-test-L001.json
outputs/manual-test-L006.json

outputs/recommendation-test-L001.json
outputs/recommendation-test-L006.json

n8n/manual-trigger-sample.json
n8n/manual-trigger-review-sample.json
n8n/recommendation-code-node.js

docs/lead-scoring-rules.md
docs/output-schema.md
docs/recommendation-engine-design.md
docs/recommendation-output-schema.md
docs/recommendation-qa-validation-checklist.md
docs/json-parse-validation-plan.md
docs/google-sheet-update-mapping.md
docs/owner-notification-template.md

tracker/lead-tracker-columns.csv
tracker/recommendation-tracker-columns.csv
```

---

# 3. Dry Run Safety Rules

The dry run must preserve these rules:

```text
requires_human_review = true
human_review_status = pending_review
final_message_sent = no
```

The dry run must not:

- send a real customer message
- update a production CRM
- contact a real lead
- approve pricing automatically
- mark a recommendation as accepted
- mark a follow-up message as sent
- overwrite human-entered tracker fields
- create unsupported catalog offers
- hide validation errors

---

# 4. Dry Run Result States

Allowed overall result states:

```text
passed
passed_with_review
failed
blocked
```

## Passed

Use when:

- the normal path completes
- all required calculations are correct
- tracker rows are ready
- notification payload is valid
- no blocking safety issue exists

## Passed With Review

Use when:

- the output is structurally valid
- important business context is incomplete
- the workflow correctly routes to manual review

## Failed

Use when:

- expected output differs from actual output
- score calculation is inconsistent
- catalog identity is invalid
- schema validation fails
- unsafe automation behavior occurs

## Blocked

Use when:

- required files are missing
- n8n cannot be accessed
- JavaScript cannot be loaded
- the test environment is unavailable

---

# 5. Preflight Checklist

Before running the test, confirm:

- [ ] `data/sample-leads.csv` exists.
- [ ] `data/service-catalog.json` exists.
- [ ] `outputs/manual-test-L001.json` exists.
- [ ] `outputs/manual-test-L006.json` exists.
- [ ] `outputs/recommendation-test-L001.json` exists.
- [ ] `outputs/recommendation-test-L006.json` exists.
- [ ] `n8n/recommendation-code-node.js` exists.
- [ ] Both tracker schema CSV files exist.
- [ ] Recommendation output schema exists.
- [ ] JSON parse and validation plan exists.
- [ ] Google Sheet mapping document exists.
- [ ] Owner notification template exists.
- [ ] No live customer-send node is enabled.

---

# 6. Repository Preflight Commands

Run from the project root:

```powershell
Get-Location
```

Confirm the current directory is the project repository.

Check required files:

```powershell
$requiredFiles = @(
  "data/sample-leads.csv",
  "data/service-catalog.json",
  "outputs/manual-test-L001.json",
  "outputs/manual-test-L006.json",
  "outputs/recommendation-test-L001.json",
  "outputs/recommendation-test-L006.json",
  "n8n/recommendation-code-node.js",
  "tracker/lead-tracker-columns.csv",
  "tracker/recommendation-tracker-columns.csv",
  "docs/json-parse-validation-plan.md",
  "docs/google-sheet-update-mapping.md",
  "docs/owner-notification-template.md"
)

$missingFiles = $requiredFiles | Where-Object {
  -not (Test-Path $_)
}

if ($missingFiles.Count -gt 0) {
  Write-Host "Missing required files:" -ForegroundColor Red
  $missingFiles
} else {
  Write-Host "Preflight passed: all required files exist." -ForegroundColor Green
}
```

Expected result:

```text
Preflight passed: all required files exist.
```

---

# 7. JSON Syntax Preflight

Validate the main JSON artifacts:

```powershell
$jsonFiles = @(
  "data/service-catalog.json",
  "outputs/manual-test-L001.json",
  "outputs/manual-test-L006.json",
  "outputs/recommendation-test-L001.json",
  "outputs/recommendation-test-L006.json",
  "n8n/manual-trigger-sample.json",
  "n8n/manual-trigger-review-sample.json"
)

foreach ($file in $jsonFiles) {
  try {
    Get-Content $file -Raw | ConvertFrom-Json | Out-Null
    Write-Host "VALID JSON: $file" -ForegroundColor Green
  }
  catch {
    Write-Host "INVALID JSON: $file" -ForegroundColor Red
    Write-Host $_.Exception.Message
  }
}
```

Expected:

```text
All listed files report VALID JSON.
```

Any invalid file blocks the normal dry run.

---

# 8. Recommendation Code Syntax Check

When Node.js is available:

```powershell
node --check n8n/recommendation-code-node.js
```

Expected:

```text
No syntax error output.
Exit code = 0.
```

This command validates JavaScript syntax only.

It does not execute the n8n-specific `$input` runtime.

---

# 9. n8n Dry Run Workflow

Recommended temporary workflow:

```text
Manual Trigger
-> Set Merged Test Input
-> Calculate Rule-Based Recommendation
-> Validate Recommendation Output
-> Build Tracker Rows
-> Build Owner Review Notification
-> Inspect Final Output
```

Do not connect:

```text
customer email send
customer WhatsApp send
customer Instagram send
production CRM update
```

---

# 10. Recommended n8n Nodes

## Node 1 — Manual Trigger

Name:

```text
Start Phase 2 Dry Run
```

## Node 2 — Set Test Input

Name:

```text
Load Dry Run Input
```

Purpose:

```text
Provide lead, qualification, and catalog data.
```

## Node 3 — Code Node

Name:

```text
Calculate Rule-Based Recommendation
```

Configuration:

```text
Node Type: Code
Mode: Run Once for All Items
Language: JavaScript
```

Source:

```text
n8n/recommendation-code-node.js
```

## Node 4 — Validation

Name:

```text
Validate Combined Sales Output
```

Purpose:

```text
Validate schema, score, catalog identity, and safety.
```

## Node 5 — Mapping

Name:

```text
Build Google Sheet Tracker Rows
```

Purpose:

```text
Generate lead_tracker_row and recommendation_tracker_row.
```

## Node 6 — Notification

Name:

```text
Build Owner Review Notification
```

Purpose:

```text
Generate internal notification payload without sending it.
```

---

# 11. Test Case A — L001 Normal Path

## Objective

Verify that a clear, high-priority lead produces a high-confidence, catalog-grounded recommendation.

## Source Lead

```text
Lead ID: L001
Customer ID: C001
Lead Name: Dinda
Business Type: Skincare Brand
Service Interest: Social Media Management
Budget: 2-3 juta/bulan
Timeline: Bulan ini
```

## Qualification Source

```text
outputs/manual-test-L001.json
```

Expected:

```text
lead_category = hot
lead_score = 90
priority = high
crm_status = qualified_hot
quality_check = passed
requires_human_review = true
```

## Expected Recommendation

```text
recommended_offer_id = SVC002
recommended_offer_name = Monthly Social Media Management
recommended_offer_category = social_media_management
recommendation_score = 95
recommendation_confidence = high
recommendation_method = rule_based
offer_action = ask_discovery_before_package
requires_human_review = true
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

Calculation:

```text
30 + 20 + 20 + 10 + 10 + 5 = 95
```

---

# 12. L001 Execution Procedure

1. Load the L001 lead data.
2. Load `outputs/manual-test-L001.json`.
3. Load the full service catalog.
4. Merge the input into:

```json
{
  "lead": {},
  "qualification": {},
  "catalog": []
}
```

5. Execute `Calculate Rule-Based Recommendation`.
6. Compare the result with:

```text
outputs/recommendation-test-L001.json
```

7. Pass the output through validation.
8. Build tracker rows.
9. Build the owner-notification payload.
10. Confirm no customer-send node runs.

---

# 13. L001 Validation Assertions

The following must be true:

```text
result.lead_id === "L001"
result.customer_id === "C001"
result.recommended_offer_id === "SVC002"
result.recommendation_score === 95
result.recommendation_confidence === "high"
result.recommendation_method === "rule_based"
result.offer_action === "ask_discovery_before_package"
result.requires_human_review === true
```

Validation result:

```text
validation_status = passed
validation_route = continue
is_schema_valid = true
is_catalog_valid = true
is_score_valid = true
is_safety_valid = true
is_tracker_ready = true
```

---

# 14. L001 Mapping Assertions

Lead Tracker row:

```text
lead_id = L001
lead_category = hot
lead_score = 90
priority = high
crm_status = qualified_hot
human_review_status = pending_review
final_message_sent = no
requires_human_review = true
```

Recommendation Tracker row:

```text
lead_id = L001
customer_id = C001
recommended_offer_id = SVC002
recommendation_score = 95
recommendation_confidence = high
recommendation_method = rule_based
human_review_status = pending_review
final_message_sent = no
requires_human_review = true
```

Expected mapping:

```text
mapping_status = ready
mapping_route = append_both
```

---

# 15. L001 Notification Assertions

Expected:

```text
notification_type = ready_for_review
notification_priority = high
tracker_write_status = succeeded
notification_status = ready_to_send
requires_human_review = true
```

Notification must state:

```text
No customer message has been sent.
Human review is required before follow-up.
```

L001 expected final result:

```text
passed
```

---

# 16. Test Case B — L006 Review Path

## Objective

Verify that a cold lead with incomplete budget, timeline, and diagnostic information is routed into a safe discovery and manual-review path.

## Source Lead

```text
Lead ID: L006
Customer ID: C006
Lead Name: Bima
Business Type: Local Gym
Service Interest: Marketing Consultation
Budget: Tidak disebutkan
Timeline: Tidak disebutkan
```

## Qualification Source

```text
outputs/manual-test-L006.json
```

Expected:

```text
lead_category = cold
lead_score = 15
priority = low
crm_status = qualified_cold
quality_check = needs_review
requires_human_review = true
```

## Expected Recommendation

```text
recommended_offer_id = SVC006
recommended_offer_name = Marketing Discovery Consultation
recommended_offer_category = consultation
recommendation_score = 58
recommendation_confidence = medium
recommendation_method = rule_based
offer_action = ask_discovery_before_package
requires_human_review = true
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

Calculation:

```text
30 + 20 + 5 + 0 + 3 + 0 = 58
```

Expected risk flag:

```text
recommendation_needs_review
```

---

# 17. L006 Execution Procedure

1. Load the L006 lead data.
2. Load `outputs/manual-test-L006.json`.
3. Load the complete service catalog.
4. Merge the input.
5. Execute the Recommendation Code Node.
6. Compare the output with:

```text
outputs/recommendation-test-L006.json
```

7. Execute validation.
8. Confirm the output is not classified as failed.
9. Build both tracker rows.
10. Build the needs-review owner notification.
11. Confirm no customer-send action runs.

---

# 18. L006 Validation Assertions

```text
result.lead_id === "L006"
result.customer_id === "C006"
result.recommended_offer_id === "SVC006"
result.recommendation_score === 58
result.recommendation_confidence === "medium"
result.offer_action === "ask_discovery_before_package"
result.recommendation_risk_flags includes "recommendation_needs_review"
result.requires_human_review === true
```

Expected validation:

```text
validation_status = needs_review
validation_route = tracker_and_manual_review
is_valid_json = true
is_schema_valid = true
is_catalog_valid = true
is_score_valid = true
is_safety_valid = true
is_tracker_ready = true
```

L006 must not be classified as:

```text
failed
```

---

# 19. L006 Mapping Assertions

Lead Tracker:

```text
lead_id = L006
lead_category = cold
lead_score = 15
priority = low
crm_status = qualified_cold
quality_check = needs_review
human_review_status = pending_review
final_message_sent = no
```

Recommendation Tracker:

```text
recommended_offer_id = SVC006
recommendation_score = 58
recommendation_confidence = medium
recommendation_risk_flags = recommendation_needs_review
human_review_status = pending_review
final_message_sent = no
```

Expected mapping:

```text
mapping_status = needs_review
mapping_route = append_both
```

---

# 20. L006 Notification Assertions

Expected:

```text
notification_type = needs_review
notification_priority = low
tracker_write_status = succeeded
notification_status = ready_to_send
```

The notification must state that:

```text
the recommendation is a discovery direction
budget and timeline are incomplete
no final package has been approved
no customer message has been sent
```

L006 expected final result:

```text
passed_with_review
```

---

# 21. Test Case C — Invalid JSON

## Objective

Verify that malformed JSON cannot continue through the normal workflow.

Input example:

```text
{"lead_id":"L001",}
```

Expected:

```text
parse_status = failed
is_valid_json = false
validation_status = failed
validation_route = fallback_and_manual_review
blocking_errors includes invalid_json
requires_human_review = true
```

Expected notification:

```text
notification_type = processing_failed
notification_priority = critical
```

Safety requirement:

```text
customer message sent = no
```

---

# 22. Test Case D — Unknown Catalog Offer

## Objective

Verify that an invented catalog offer is rejected.

Modified recommendation test:

```json
{
  "recommended_offer_id": "SVC999",
  "recommended_offer_name": "Invented Premium Package",
  "recommended_offer_category": "invented_service"
}
```

Expected:

```text
validation_status = failed
validation_route = fallback_and_manual_review
blocking_errors includes unknown_catalog_offer
```

The workflow must not:

```text
append the invented offer as a valid recommendation
send a ready-for-review notification
```

Expected notification:

```text
processing_failed
```

---

# 23. Test Case E — Recommendation Score Mismatch

Modified values:

```text
recommendation_score = 95
matched-signals total = 90
```

Expected:

```text
validation_status = failed
blocking_errors includes recommendation_score_mismatch
```

The system must not silently change the score.

---

# 24. Test Case F — Human Review False

Modified output:

```json
{
  "requires_human_review": false
}
```

Expected:

```text
validation_status = failed
blocking_errors includes human_review_requirement_failed
validation_route = fallback_and_manual_review
```

The workflow must stop all automatic customer-send paths.

This is a blocking safety test.

---

# 25. Test Case G — Duplicate Tracker Record

## Objective

Verify idempotency during retry.

Simulate an existing Lead Tracker row:

```text
lead_id = L001
```

Simulate an existing Recommendation Tracker row:

```text
recommendation_id = existing recommendation ID
```

Retry the same mapping operation.

Expected:

```text
no duplicate Lead Tracker row
no duplicate Recommendation Tracker row
mapping_warnings includes duplicate_tracker_record
```

Expected route:

```text
update allowed non-human fields
or
skip identical write
```

Protected fields must remain unchanged:

```text
human_review_status
human_decision
reviewed_at
final_message_sent
notes
owner_notes
customer_response
customer_rating
```

---

# 26. Test Case H — Partial Persistence Failure

## Objective

Verify that a successful lead write is not duplicated when the recommendation write fails.

Simulated result:

```text
Lead Tracker write = succeeded
Recommendation Tracker write = failed
```

Expected:

```text
mapping_status = failed or needs_review
tracker_write_status = partial_failure
notification_type = persistence_failed
notification_priority = critical
```

Retry behavior:

```text
do not append L001 lead row again
retry only the Recommendation Tracker write
use recommendation_id as idempotency key
```

The normal ready-for-review notification must not be sent before both tracker writes succeed.

---

# 27. Test Case I — Message Claims It Was Sent

Modified follow-up output:

```text
Your message has already been sent to the customer.
```

Expected:

```text
validation_status = failed
blocking_errors includes message_claims_sent
```

Safety result:

```text
final_message_sent = no
requires_human_review = true
```

---

# 28. Manual Score Verification Table

| Test | Lead Score | Recommendation Score | Expected Confidence | Expected Route |
|---|---:|---:|---|---|
| L001 | 90 | 95 | high | continue |
| L006 | 15 | 58 | medium | tracker_and_manual_review |
| Invalid JSON | null | null | review | fallback_and_manual_review |
| Unknown Offer | valid or unknown | null | review | fallback_and_manual_review |
| Score Mismatch | valid | invalid | invalid | fallback_and_manual_review |
| Human Review False | valid | valid | invalid safety state | fallback_and_manual_review |

---

# 29. Dry Run Evidence to Capture

Capture the following evidence:

```text
1. Screenshot or exported output of L001 Recommendation Code Node
2. Screenshot or exported output of L006 Recommendation Code Node
3. L001 validation result
4. L006 validation result
5. L001 lead tracker row
6. L001 recommendation tracker row
7. L006 lead tracker row
8. L006 recommendation tracker row
9. L001 owner-notification payload
10. L006 owner-notification payload
11. Invalid JSON failure output
12. Unknown catalog offer failure output
13. Human-review safety failure output
14. Duplicate-record retry result
15. Partial-write failure result
```

Recommended evidence directory for a later chunk:

```text
evidence/phase-2-dry-run/
```

Do not create this directory unless the project decides to preserve screenshots and exported payloads.

---

# 30. Dry Run Execution Log Template

Use the following template:

```text
Dry Run Date:
Executed By:
Environment:
n8n Version:
Node.js Version:
Service Catalog Version:
Lead Output Schema Version:
Recommendation Output Schema Version:

Test L001:
- Recommendation result:
- Validation status:
- Mapping status:
- Notification type:
- Final result:
- Notes:

Test L006:
- Recommendation result:
- Validation status:
- Mapping status:
- Notification type:
- Final result:
- Notes:

Invalid JSON Test:
- Result:
- Error code:
- Notification type:

Unknown Catalog Offer Test:
- Result:
- Error code:

Human Review Safety Test:
- Result:
- Error code:

Duplicate Retry Test:
- Result:

Partial Persistence Test:
- Result:

Overall Dry Run Status:
Blocking Issues:
Warnings:
Next Engineering Action:
```

---

# 31. Dry Run Result Matrix

| Test Case | Expected Result |
|---|---|
| Repository preflight | passed |
| JSON syntax preflight | passed |
| Recommendation code syntax | passed |
| L001 recommendation | passed |
| L001 validation | passed |
| L001 mapping | ready |
| L001 notification | ready_for_review |
| L006 recommendation | passed |
| L006 validation | needs_review |
| L006 mapping | needs_review |
| L006 notification | needs_review |
| Invalid JSON | failed safely |
| Unknown offer | failed safely |
| Score mismatch | failed safely |
| Human review false | failed safely |
| Duplicate retry | no duplicate |
| Partial persistence | persistence_failed notification |
| Customer auto-send | never executed |

---

# 32. Phase 2 Dry Run Acceptance Criteria

The dry run passes when:

1. All required files exist.
2. All JSON fixtures are valid.
3. Recommendation JavaScript has valid syntax.
4. L001 selects SVC002.
5. L001 recommendation score equals 95.
6. L001 validation route equals `continue`.
7. L001 mapping route equals `append_both`.
8. L001 notification type equals `ready_for_review`.
9. L006 selects SVC006.
10. L006 recommendation score equals 58.
11. L006 validation route equals `tracker_and_manual_review`.
12. L006 remains tracker-ready.
13. L006 notification type equals `needs_review`.
14. Invalid JSON is rejected.
15. Unknown offers are rejected.
16. Score mismatches are rejected.
17. `requires_human_review = false` is rejected.
18. Duplicate retries do not create duplicate rows.
19. Partial persistence does not create duplicate lead rows.
20. No customer message is sent.
21. All valid and fallback outputs preserve human review.

---

# 33. Blocking Failure Conditions

Phase 2 dry run fails when:

```text
L001 selects an offer other than SVC002
L001 score is not 95
L006 selects an offer other than SVC006
L006 score is not 58
L006 is incorrectly classified as failed
unknown catalog offer is accepted
score mismatch is accepted
requires_human_review becomes false
final_message_sent defaults to yes
duplicate rows are created during retry
owner notification claims customer delivery
```

---

# 34. Warning Conditions

The dry run may pass with warnings when:

```text
Google Sheets is simulated rather than live
owner notification is generated but not sent
tracker links are not configured
timestamps differ from examples
n8n node names differ but responsibilities remain equivalent
```

These warnings do not invalidate the architecture.

---

# 35. Expected Dry Run Conclusion

Expected Phase 2 conclusion:

```text
The workflow successfully handles one high-confidence lead and one review-required lead.

The deterministic recommendation layer selects only catalog-grounded offers.

Recommendation scores remain mathematically explainable.

Validation rejects malformed, inconsistent, invented, or unsafe outputs.

Tracker mapping preserves human review and message-send safety.

Owner notifications distinguish normal review, discovery review, processing failure, and persistence failure.

The Phase 2 design is ready for final snapshot documentation and later live n8n implementation.
```

---

# 36. Current Implementation Boundary

This dry run validates the designed behavior and available executable recommendation logic.

It does not prove that these production integrations are complete:

```text
live Google Sheets credentials
live Google Sheets write nodes
live email or Telegram notification
production retry queue
production monitoring
customer-channel integration
collaborative-filtering execution
```

Those items belong to later implementation phases.

---

# 37. Definition of Done

This Phase 2 dry-run script is complete when it defines:

1. Dry-run purpose
2. Scope
3. Source artifacts
4. Safety rules
5. Result states
6. Preflight checklist
7. Repository commands
8. JSON syntax checks
9. Recommendation-code syntax check
10. n8n workflow structure
11. L001 normal-path test
12. L001 validation assertions
13. L001 mapping assertions
14. L001 notification assertions
15. L006 review-path test
16. L006 validation assertions
17. L006 mapping assertions
18. L006 notification assertions
19. Invalid JSON test
20. Unknown catalog offer test
21. Score mismatch test
22. Human-review safety test
23. Duplicate-record test
24. Partial-persistence test
25. Message-sent claim test
26. Manual score table
27. Evidence requirements
28. Execution log template
29. Result matrix
30. Acceptance criteria
31. Blocking failures
32. Warning conditions
33. Expected conclusion
34. Current implementation boundary