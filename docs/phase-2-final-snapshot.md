# Phase 2 Final Snapshot — AI Sales Recommendation & Follow-Up Assistant for UMKM

## Snapshot Identity

```text
Project:
AI Sales Recommendation & Follow-Up Assistant for UMKM

Original Foundation:
AI Lead Follow-Up Assistant

Current Phase:
Phase 2 — Semi-Automated Prototype and Journal-Informed Recommendation Extension

Phase 1 Foundation:
100% complete

Journal-Based Recommendation Extension:
100% complete

Phase 2 Design and Prototype Foundation:
100% complete

Current Engineering Position:
Deterministic lead qualification, catalog-grounded recommendation, validation, tracker mapping, owner notification, and dry-run architecture are complete and ready for live n8n implementation.
```

---

## 1. Executive Summary

Phase 2 extends the original AI Lead Follow-Up Assistant into a broader sales decision-support system for UMKM.

The original system focused on:

```text
lead intake
-> lead qualification
-> lead prioritization
-> next best action
-> follow-up draft
-> CRM status
-> human review
```

The expanded system adds:

```text
customer intent analysis
-> service catalog matching
-> deterministic recommendation scoring
-> next best offer
-> recommendation confidence
-> recommendation risk flags
-> Google Sheet recommendation tracking
-> customer-response and rating preparation
```

The resulting project is now positioned as:

```text
AI Sales Recommendation & Follow-Up Assistant for UMKM
```

The system does not automatically contact customers.

Its purpose is to support business owners by producing:

- structured lead qualification
- explainable service recommendations
- safe follow-up drafts
- review-ready CRM records
- internal owner notifications
- auditable recommendation decisions

Every output preserves:

```json
{
  "requires_human_review": true
}
```

---

# 2. Problem

Small service businesses and UMKM often receive leads from multiple channels:

```text
Instagram
WhatsApp
website forms
referrals
direct messages
```

The lead-handling process is frequently manual and fragmented.

Common problems include:

- leads are not categorized consistently
- high-intent prospects are not prioritized
- follow-up messages are delayed
- service recommendations depend on memory
- customer needs are incompletely documented
- pricing or package recommendations are made too early
- customer responses are not converted into structured feedback
- there is no audit trail for why an offer was recommended
- business owners must manually review scattered information

The journal-informed extension also addresses a wider UMKM problem:

```text
Customers may have difficulty identifying the most relevant product or service from the available catalog.
```

---

# 3. Solution

The project introduces a semi-automated decision-support workflow:

```text
Lead Intake
-> Input Normalization
-> Lead Qualification
-> Customer Intent Extraction
-> Service Catalog Evaluation
-> Deterministic Recommendation Engine
-> Recommendation Validation
-> Follow-Up Drafting
-> Google Sheet Mapping
-> Owner Notification
-> Human Review
-> Manual Customer Follow-Up
-> Response and Rating Feedback
```

The system combines two connected layers.

## Lead Follow-Up Layer

Responsible for:

- lead scoring
- hot, warm, cold, or review classification
- lead priority
- needs extraction
- missing-information detection
- next best action
- follow-up strategy
- CRM status
- follow-up draft
- quality check

## Recommendation Layer

Responsible for:

- catalog-grounded offer selection
- service-interest matching
- business-type matching
- budget matching
- timeline matching
- lead-quality fit
- required-context readiness
- recommendation score
- recommendation confidence
- offer-action selection
- recommendation risk flags

---

# 4. Phase 2 Result

Phase 2 produces a complete engineering foundation for the semi-automated prototype.

The completed foundation includes:

```text
Google Sheet tracker schemas
n8n manual-trigger payloads
workflow architecture
journal-business mapping
final system architecture
recommendation-engine design
service catalog
recommendation-output schema
recommendation test outputs
recommendation QA
n8n recommendation prompt
deterministic recommendation Code Node design
executable recommendation Code Node
JSON parsing and validation plan
Google Sheet update mapping
owner-notification templates
end-to-end dry-run procedure
```

The system now has:

```text
documented architecture
structured data contracts
deterministic scoring logic
working JavaScript reference
manual test fixtures
QA contracts
safe fallback paths
human-review controls
implementation-ready workflow mappings
```

---

# 5. Completion Status

| Workstream | Status |
|---|---|
| Phase 1 manual agent simulation | Complete |
| Ten manual lead outputs | Complete |
| Lead scoring rules | Complete |
| Lead QA validation | Complete |
| Google Sheet lead tracker schema | Complete |
| n8n workflow design | Complete |
| Manual trigger payloads | Complete |
| Journal-based business-case mapping | Complete |
| Final system architecture | Complete |
| Recommendation-engine design | Complete |
| Service catalog dataset | Complete |
| Recommendation-output schema | Complete |
| Recommendation tracker schema | Complete |
| L001 recommendation test | Complete |
| L006 recommendation review test | Complete |
| Recommendation QA checklist | Complete |
| Recommendation Node prompt | Complete |
| Deterministic Code Node design | Complete |
| Executable recommendation Code Node | Complete |
| JSON parse and validation plan | Complete |
| Google Sheet update mapping | Complete |
| Owner-notification templates | Complete |
| Phase 2 dry-run procedure | Complete |
| Live Google Sheets integration | Not yet implemented |
| Live owner-notification integration | Not yet implemented |
| Production customer-channel integration | Not implemented |
| Collaborative-filtering execution | Reserved for later phase |

---

# 6. Final Architecture

```text
Customer Channels
    |
    v
Lead and Interaction Intake
    |
    v
Data Normalization
    |
    v
Lead Qualification Agent
    |
    v
Customer Intent Extraction
    |
    v
Service Catalog Layer
    |
    v
Deterministic Recommendation Code Node
    |
    v
Recommendation Validation
    |
    v
AI Recommendation Explanation
    |
    v
Follow-Up Drafting Agent
    |
    v
Combined JSON Validation
    |
    v
Google Sheet Tracker Mapping
    |
    +-----------------------------+
    |                             |
    v                             v
Lead Tracker              Recommendation Tracker
    |                             |
    +--------------+--------------+
                   |
                   v
            Owner Notification
                   |
                   v
              Human Review
                   |
                   v
          Manual Customer Follow-Up
                   |
                   v
        Response and Rating Feedback
```

---

# 7. Separation of Responsibilities

The architecture deliberately separates deterministic logic from generative AI.

## Deterministic Code

Responsible for:

```text
score calculation
catalog evaluation
offer ranking
confidence mapping
tie resolution
risk flags
offer-action policy
fallback selection
```

## Generative AI

May assist with:

```text
recommendation explanation
discovery-question wording
follow-up message drafting
communication clarity
```

Generative AI must not change:

```text
selected offer
recommendation score
recommendation confidence
lead score
lead category
catalog identity
human-review requirement
```

---

# 8. Phase 1 Foundation Reused

Phase 2 does not replace Phase 1.

The following Phase 1 components remain active:

```text
data/sample-leads.csv
docs/project-framing.md
docs/lead-scoring-rules.md
docs/agent-roles.md
docs/output-schema.md
prompts/lead-followup-agent-v1.md
outputs/manual-test-L001.json through L010
docs/qa-validation-checklist.md
tracker/lead-tracker-columns.csv
demo/demo-script.md
case-study/ai-lead-followup-assistant-case-study-v0.md
docs/phase-1-final-snapshot.md
```

Phase 1 remains the source of truth for:

- lead qualification
- lead-score calculation
- lead category
- priority
- follow-up strategy
- CRM status
- human review
- manual test coverage

---

# 9. Phase 2 Artifacts

## Architecture and Planning

```text
docs/google-sheet-tracker-design.md
docs/n8n-workflow-design.md
docs/journal-business-case-mapping.md
docs/final-system-architecture.md
```

## Recommendation Layer

```text
docs/recommendation-engine-design.md
docs/recommendation-output-schema.md
docs/recommendation-qa-validation-checklist.md
docs/recommendation-code-node-design.md
data/service-catalog.json
```

## n8n Layer

```text
n8n/manual-trigger-sample.json
n8n/manual-trigger-review-sample.json
n8n/recommendation-node-prompt.md
n8n/recommendation-code-node.js
```

## Recommendation Test Outputs

```text
outputs/recommendation-test-L001.json
outputs/recommendation-test-L006.json
```

## Tracker Layer

```text
tracker/lead-tracker-columns.csv
tracker/recommendation-tracker-columns.csv
docs/google-sheet-update-mapping.md
```

## Validation and Workflow Control

```text
docs/json-parse-validation-plan.md
docs/owner-notification-template.md
demo/phase-2-dry-run-script.md
```

## Research Reference

```text
scientific-journal-references.pdf
docs/target-engineering-based-scientific-journal-references.txt
```

---

# 10. Lead Qualification Model

The lead score remains deterministic.

## Components

| Component | Maximum Score |
|---|---:|
| Budget clarity | 25 |
| Timeline urgency | 25 |
| Service clarity | 25 |
| Buying intent | 25 |
| **Total** | **100** |

Formula:

```text
lead_score =
budget_clarity
+ timeline_urgency
+ service_clarity
+ buying_intent
```

Category mapping:

| Score | Category |
|---|---|
| 75–100 | hot |
| 45–74 | warm |
| 0–44 | cold |

Critical override:

```text
If budget_clarity = 0:
the final category cannot exceed warm.
```

Priority mapping:

| Category | Priority |
|---|---|
| hot | high |
| warm | medium |
| cold | low |
| needs_review | review |

CRM mapping:

| Category | CRM Status |
|---|---|
| hot | qualified_hot |
| warm | qualified_warm |
| cold | qualified_cold |
| needs_review | needs_review |

---

# 11. Recommendation Scoring Model

Every catalog offer is evaluated against six signals.

| Signal | Maximum |
|---|---:|
| Service-interest match | 30 |
| Business-type fit | 20 |
| Budget fit | 20 |
| Timeline fit | 10 |
| Lead-quality fit | 10 |
| Required-context readiness | 10 |
| **Total** | **100** |

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

Confidence mapping:

| Score | Confidence |
|---|---|
| 80–100 | high |
| 50–79 | medium |
| 0–49 | low |
| null or unsafe | review |

---

# 12. Offer Ranking Policy

Catalog candidates are ranked using:

```text
1. Higher recommendation score
2. Higher service-interest match
3. Higher budget fit
4. Higher business-type fit
5. Higher required-context readiness
6. Fewer missing-context items
7. Offer ID in ascending lexical order
```

When two offers have an unresolved identical decision profile:

```text
recommendation_method = fallback
recommendation_confidence = review
offer_action = manual_review_required
```

Risk flags:

```text
catalog_match_unclear
recommendation_needs_review
manual_review_required
```

---

# 13. Service Catalog

The current catalog contains ten offer records.

```text
SVC001 — Instagram Feed Design Starter
SVC002 — Monthly Social Media Management
SVC003 — Launch Content Package
SVC004 — Landing Page Starter
SVC005 — Event Content Package
SVC006 — Marketing Discovery Consultation
SVC007 — Restaurant Social Media Promo Package
SVC008 — Lead Generation Campaign Setup
SVC009 — Product Photography Starter
SVC010 — Website and Content Strategy Package
```

Each catalog record provides:

```text
offer ID
offer name
category
keywords
best-for business types
price range
minimum budget signal
ideal lead category
required context
offer description
recommended conditions
non-recommended conditions
default offer action
```

The recommendation system is not allowed to create an offer outside this catalog.

---

# 14. Offer-Action Policy

Supported offer actions:

```text
recommend_offer
ask_discovery_before_package
clarify_budget_before_offer
clarify_timeline_before_offer
share_portfolio_first
manual_review_required
```

Safety policy:

```text
Low confidence
-> manual_review_required

High confidence and full context
-> recommend_offer

High or medium confidence with incomplete context
-> ask_discovery_before_package

Budget mismatch
-> clarify_budget_before_offer

Timeline missing when operationally important
-> clarify_timeline_before_offer

Customer explicitly requests portfolio
-> share_portfolio_first
```

Catalog metadata cannot override the safety policy.

Unsupported catalog action:

```text
clarify_scope_before_offer
```

is safely mapped into:

```text
ask_discovery_before_package
```

inside the executable recommendation Code Node.

---

# 15. Recommendation Risk Flags

Supported risk flags:

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

Current rule-based policy:

```text
High-confidence clean result
-> risk flags may be empty

Medium-confidence incomplete result
-> recommendation_needs_review

Low-confidence result
-> low_recommendation_confidence
-> recommendation_needs_review
-> manual_review_required

Budget conflict
-> offer_budget_mismatch

Unclear catalog match
-> catalog_match_unclear
-> recommendation_needs_review
-> manual_review_required
```

---

# 16. Executable Recommendation Code Node

Executable file:

```text
n8n/recommendation-code-node.js
```

Recommended n8n configuration:

```text
Node Type:
Code

Node Name:
Calculate Rule-Based Recommendation

Mode:
Run Once for All Items

Language:
JavaScript
```

Expected input:

```json
{
  "lead": {},
  "qualification": {},
  "catalog": []
}
```

Expected output:

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
  "offer_action": "",
  "matched_signals": {},
  "missing_recommendation_context": [],
  "recommendation_risk_flags": [],
  "requires_human_review": true
}
```

The Code Node includes:

- input validation
- identifier preservation
- text normalization
- service matching
- business-type matching
- budget parsing
- timeline scoring
- lead-quality scoring
- context-readiness scoring
- offer ranking
- tie handling
- confidence mapping
- action selection
- risk-flag construction
- fallback output
- final output validation

---

# 17. Validated Test Case — L001

## Input

```text
Lead ID: L001
Customer: Dinda
Business: Skincare Brand
Interest: Social Media Management
Budget: 2-3 juta/bulan
Timeline: Bulan ini
Lead Category: hot
Lead Score: 90
```

## Expected Recommendation

```text
Offer ID: SVC002
Offer: Monthly Social Media Management
Recommendation Score: 95
Confidence: high
Method: rule_based
Action: ask_discovery_before_package
```

## Matched Signals

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

Expected route:

```text
validation_status = passed
validation_route = continue
mapping_status = ready
mapping_route = append_both
notification_type = ready_for_review
notification_priority = high
```

Final test classification:

```text
passed
```

---

# 18. Validated Test Case — L006

## Input

```text
Lead ID: L006
Customer: Bima
Business: Local Gym
Interest: Marketing Consultation
Budget: Tidak disebutkan
Timeline: Tidak disebutkan
Lead Category: cold
Lead Score: 15
```

## Expected Recommendation

```text
Offer ID: SVC006
Offer: Marketing Discovery Consultation
Recommendation Score: 58
Confidence: medium
Method: rule_based
Action: ask_discovery_before_package
```

## Matched Signals

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

Expected route:

```text
validation_status = needs_review
validation_route = tracker_and_manual_review
mapping_status = needs_review
mapping_route = append_both
notification_type = needs_review
notification_priority = low
```

Final test classification:

```text
passed_with_review
```

L006 is not a failed recommendation.

It is a structurally valid discovery direction that requires more customer context.

---

# 19. JSON Parsing Strategy

The validation architecture accepts:

```text
native JSON objects
valid JSON strings
JSON strings wrapped in Markdown fences
```

The parser must:

1. Preserve raw output.
2. Detect the input type.
3. Remove one harmless outer Markdown fence when necessary.
4. Parse valid JSON strings.
5. Reject invalid JSON.
6. Reject arrays when an object is required.
7. Reject null or empty output.
8. Preserve parsing warnings and errors.

Invalid JSON must not be repaired through speculation.

Example:

```text
{"lead_id":"L001",}
```

Expected route:

```text
validation_status = failed
validation_route = fallback_and_manual_review
blocking_errors includes invalid_json
```

---

# 20. Validation Stages

The validation plan includes:

```text
Stage 1 — Parsing validation
Stage 2 — Required-field validation
Stage 3 — Data-type validation
Stage 4 — Enum validation
Stage 5 — Mathematical consistency
Stage 6 — Cross-field consistency
Stage 7 — Service-catalog integrity
Stage 8 — Human-review and message safety
Stage 9 — Tracker-mapping readiness
Stage 10 — Workflow routing
```

Validation states:

```text
passed
needs_review
failed
```

Validation routes:

```text
continue
tracker_and_manual_review
fallback_and_manual_review
stop_workflow
```

---

# 21. Blocking Validation Conditions

The workflow must fail safely when:

```text
JSON is invalid
required fields are missing
lead score does not match score breakdown
recommendation score does not match matched signals
recommended offer does not exist
offer name does not match catalog
offer category does not match catalog
lead IDs conflict across outputs
recommendation confidence does not match score
requires_human_review is false
customer-facing content claims it was already sent
```

The workflow must not:

- silently repair score mismatches
- silently select another offer
- invent a catalog item
- continue to customer messaging
- mark the output as approved

---

# 22. Google Sheet Tracker Architecture

Two tracker tabs are used.

## Lead Tracker

Schema:

```text
tracker/lead-tracker-columns.csv
```

Stores:

```text
lead input
lead qualification
score breakdown
identified needs
missing information
follow-up strategy
follow-up draft
CRM status
QA result
human-review state
```

## Recommendation Tracker

Schema:

```text
tracker/recommendation-tracker-columns.csv
```

Stores:

```text
recommendation identity
lead and customer context
recommended offer
recommendation score
recommendation confidence
matched signals
missing recommendation context
risk flags
human-review state
customer response
customer rating
audit information
```

---

# 23. Tracker Safety Defaults

Every new tracker record must use:

```text
requires_human_review = true
human_review_status = pending_review
final_message_sent = no
```

The automated workflow must not overwrite these human-controlled fields:

```text
human_review_status
human_decision
reviewed_at
final_message_sent
notes
owner_notes
customer_response
interaction_type
customer_rating
feedback_recorded_at
```

---

# 24. Tracker Idempotency

Lead Tracker idempotency key:

```text
lead_id
```

Recommendation Tracker idempotency key:

```text
recommendation_id
```

Recommended recommendation ID:

```text
REC-{lead_id}-{timestamp}
```

The mapping workflow must:

```text
search existing row
-> update allowed fields when appropriate
-> otherwise append a new row
```

A retry must not produce duplicate tracker records.

Previous recommendations should generally remain preserved as historical records.

---

# 25. Google Sheet Mapping Routes

## Normal Route

```text
validation_status = passed
-> build both rows
-> append both
-> notification type = ready_for_review
```

## Review Route

```text
validation_status = needs_review
-> build both rows
-> append both
-> human_review_status = pending_review
-> notification type = needs_review
```

## Fallback Route

```text
validation_status = failed
-> build safe fallback rows when possible
-> preserve errors
-> notification type = processing_failed
```

## Persistence Failure

```text
one or both Google Sheet writes fail
-> preserve prepared rows
-> do not claim success
-> notification type = persistence_failed
```

---

# 26. Partial Write Safety

When the Lead Tracker write succeeds but the Recommendation Tracker write fails:

```text
Lead Tracker:
already stored

Recommendation Tracker:
not stored
```

Retry behavior:

```text
Do not append another lead row.
Retry only the missing recommendation write.
Use recommendation_id as the idempotency key.
```

The workflow must not issue a normal ready-for-review notification until both required writes succeed.

---

# 27. Owner Notification States

Supported notification types:

```text
ready_for_review
needs_review
processing_failed
persistence_failed
```

Priority values:

```text
high
medium
low
critical
```

Examples:

```text
Hot lead and high-confidence recommendation
-> ready_for_review
-> high

Cold lead and medium-confidence discovery direction
-> needs_review
-> low

Validation failure
-> processing_failed
-> critical

Tracker write failure
-> persistence_failed
-> critical
```

---

# 28. Owner Notification Safety

Every notification must state that:

```text
No customer message has been sent.
Human review is required.
```

The notification must not claim:

```text
the owner approved the recommendation
the customer accepted the offer
pricing was finalized
the message was delivered
conversion is guaranteed
sales growth is guaranteed
```

Notification idempotency key:

```text
lead_id
+ recommendation_id
+ notification_type
+ tracker_write_status
```

This prevents duplicate notifications during workflow retries.

---

# 29. Dry-Run Coverage

The Phase 2 dry-run procedure covers:

```text
repository preflight
JSON syntax validation
JavaScript syntax validation
L001 normal path
L006 review path
catalog validation
score validation
tracker mapping
owner-notification preparation
invalid JSON
unknown catalog offer
score mismatch
human-review false
duplicate retry
partial tracker failure
customer-message safety
```

Expected result matrix:

| Test | Expected Result |
|---|---|
| L001 normal path | passed |
| L006 review path | passed_with_review |
| Invalid JSON | failed safely |
| Unknown catalog offer | failed safely |
| Recommendation score mismatch | failed safely |
| Human-review false | failed safely |
| Duplicate tracker retry | no duplicate |
| Partial persistence | persistence-failed route |
| Customer auto-send | never executed |

---

# 30. Human-in-the-Loop Contract

The system is decision support, not autonomous sales execution.

Every stage must preserve:

```json
{
  "requires_human_review": true
}
```

The owner remains responsible for:

- approving or rejecting the recommendation
- reviewing the follow-up draft
- selecting final pricing
- choosing portfolio material
- deciding which discovery questions to ask
- manually sending the message
- recording customer feedback
- marking the message as sent
- approving a proposal
- closing or rejecting the lead

The system must never silently bypass these controls.

---

# 31. Journal-Informed Architecture

The recommendation extension is informed by the scientific-journal case concerning e-commerce and recommendation systems for UMKM.

The architectural concepts adopted into this project include:

```text
structured customer data
structured product or service data
customer-product interaction signals
rating feedback
recommendation calculation
catalog-based recommendation
future collaborative-filtering simulation
```

The current implementation begins with rule-based recommendation because:

- the project has limited historical interaction data
- new customers create a cold-start condition
- new offers create a cold-start condition
- deterministic logic is easier to audit
- the recommendation dataset is currently small
- human review remains mandatory

The planned recommendation maturity path is:

```text
Stage 1:
Rule-Based Recommendation

Stage 2:
Interaction-Based Recommendation

Stage 3:
Collaborative Filtering Simulation
```

---

# 32. Future Interaction Signals

The architecture is ready to later record:

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

These signals may later influence:

- recommendation ranking
- next best offer
- customer-intent strength
- follow-up strategy
- interaction-based recommendations
- customer-offer rating matrices

---

# 33. Future Collaborative Filtering Flow

Reserved future flow:

```text
customer ratings
-> customer-offer rating matrix
-> average customer rating
-> adjusted cosine similarity
-> weighted-sum prediction
-> highest positive predicted offer
```

Cold-start fallback remains:

```text
1. Rule-based recommendation
2. Interaction-based recommendation
3. Manual review
```

Collaborative filtering is not currently executed by the Phase 2 Code Node.

---

# 34. What Is Complete

The following are complete at the engineering-design and prototype-foundation level:

```text
business framing
lead-scoring rules
manual lead simulation
output contracts
recommendation architecture
catalog design
deterministic scoring model
executable recommendation JavaScript
test outputs
QA contracts
JSON-validation plan
tracker schemas
tracker mapping
notification templates
dry-run procedure
safety constraints
human-review contract
```

---

# 35. What Is Not Yet Complete

The following live integrations are not yet implemented:

```text
production n8n workflow
live Google Sheets credentials
live Google Sheets append and update nodes
live owner-notification channel
production retry handling
production execution logs
production error monitoring
real customer-channel ingestion
real response-feedback ingestion
live rating collection
interaction-based recommendation
collaborative-filtering execution
production database
automatic deployment
```

The Phase 2 completion claim applies to:

```text
architecture
contracts
schemas
logic
fixtures
validation plans
mapping plans
templates
dry-run procedure
executable recommendation reference
```

It does not claim that all external integrations are already running.

---

# 36. Known Engineering Decisions

## Deterministic Decisions Are Kept in Code

Reason:

```text
reduce calculation inconsistency
improve repeatability
make debugging easier
preserve auditability
reduce hallucination risk
```

## AI Is Limited to Language Tasks

Reason:

```text
AI is useful for explanations and drafts,
but it should not be the source of truth for scores or catalog identity.
```

## Google Sheets Is Used as the MVP Tracker

Reason:

```text
easy owner visibility
low initial infrastructure cost
fast prototype iteration
simple manual review
```

## Human Review Is Mandatory

Reason:

```text
recommendations may affect pricing, customer communication, and commercial decisions.
```

## Recommendations Are Versioned

Reason:

```text
previous decisions should remain auditable when the catalog or customer context changes.
```

---

# 37. Known Risks

## Catalog Quality Risk

Poor catalog metadata can reduce recommendation quality.

Mitigation:

```text
validate keywords
validate best_for
validate pricing
validate required_context
review catalog versions
```

## Data Sparsity

The system currently lacks large-scale interaction and rating data.

Mitigation:

```text
use rule-based matching
collect feedback gradually
preserve cold-start fallbacks
```

## AI Draft Hallucination

The AI may add unsupported claims to a follow-up message.

Mitigation:

```text
ground prompts in validated outputs
run message safety validation
preserve human review
do not auto-send
```

## Google Sheets Concurrency

Multiple workflow executions may create conflicting writes.

Mitigation:

```text
idempotency keys
search-before-write
protected human fields
partial-write handling
```

## Notification Duplication

Workflow retries may send duplicate owner alerts.

Mitigation:

```text
notification idempotency key
duplicate-skipped status
notification audit fields
```

---

# 38. Portfolio Positioning

The project demonstrates:

- business-problem translation
- deterministic scoring-system design
- structured AI output contracts
- human-in-the-loop AI architecture
- service recommendation design
- n8n workflow planning
- JavaScript Code Node implementation
- JSON parsing and validation
- catalog integrity checks
- Google Sheet schema design
- CRM mapping
- failure-path design
- idempotency
- auditability
- notification architecture
- research-informed system design
- safety-conscious automation

Recommended portfolio description:

```text
Designed a semi-automated AI Sales Recommendation and Follow-Up Assistant for small service businesses and UMKM.

The system combines deterministic lead scoring, catalog-grounded service recommendations, structured JSON validation, Google Sheet CRM mapping, and owner review notifications.

Recommendation scoring is implemented in JavaScript rather than delegated entirely to generative AI, providing repeatable calculations, explainable decisions, catalog integrity, and human-in-the-loop safety.

The architecture is informed by scientific research on recommendation systems for UMKM and is designed to evolve from rule-based recommendation into interaction-based and collaborative-filtering stages.
```

---

# 39. Problem–Solution–Result Summary

## Problem

```text
UMKM leads are handled manually, follow-up is inconsistent, and service recommendations are often undocumented or made with incomplete information.
```

## Solution

```text
A semi-automated workflow that qualifies leads, evaluates a structured service catalog, calculates deterministic recommendation scores, prepares safe follow-up drafts, validates all outputs, maps results into Google Sheets, and notifies the owner for review.
```

## Result

```text
A complete Phase 2 engineering foundation containing architecture, schemas, test data, executable recommendation logic, validation controls, tracker mapping, owner-notification templates, and dry-run procedures.

The system remains human-controlled and does not automatically contact customers.
```

---

# 40. Phase 2 Definition of Done

Phase 2 is complete at the design and prototype-foundation level because:

1. Google Sheet tracker architecture is defined.
2. Lead tracker columns are defined.
3. Recommendation tracker columns are defined.
4. n8n workflow architecture is defined.
5. Manual-trigger payloads are available.
6. Journal-based business-case mapping is complete.
7. Final system architecture is documented.
8. Recommendation-engine stages are documented.
9. Service catalog data is available.
10. Recommendation-output schema is defined.
11. High-confidence recommendation test output exists.
12. Review-path recommendation test output exists.
13. Recommendation QA is documented.
14. Recommendation Node prompt is documented.
15. Deterministic Code Node design is complete.
16. Executable Code Node JavaScript is available.
17. JSON parsing and validation are defined.
18. Score consistency validation is defined.
19. Service-catalog validation is defined.
20. Human-review safety validation is defined.
21. Google Sheet mapping is defined.
22. Append and update policies are defined.
23. Duplicate prevention is defined.
24. Idempotency strategy is defined.
25. Partial-write recovery is defined.
26. Owner-notification states are defined.
27. Notification safety is defined.
28. Notification idempotency is defined.
29. L001 normal-path dry run is defined.
30. L006 review-path dry run is defined.
31. Failure-path dry runs are defined.
32. Production boundaries are documented.
33. Every valid and fallback output preserves human review.

---

# 41. Final Phase 2 Status

```text
Phase 1 Foundation:
COMPLETE — 100%

Journal-Based Recommendation Extension:
COMPLETE — 100%

Phase 2 Architecture:
COMPLETE — 100%

Phase 2 Data Contracts:
COMPLETE — 100%

Phase 2 Deterministic Recommendation Logic:
COMPLETE — 100%

Phase 2 QA and Validation Design:
COMPLETE — 100%

Phase 2 Tracker Mapping:
COMPLETE — 100%

Phase 2 Owner Notification Design:
COMPLETE — 100%

Phase 2 Dry-Run Procedure:
COMPLETE — 100%

Live n8n External Integration:
NOT YET IMPLEMENTED

Production Deployment:
NOT YET IMPLEMENTED
```

---

# 42. Final Engineering Position

```text
The project has progressed from manual lead simulation into an implementation-ready semi-automated sales recommendation architecture.

The current system can deterministically qualify leads, evaluate catalog offers, calculate explainable recommendation scores, route incomplete cases into discovery review, prepare tracker-ready records, and generate owner-review notifications.

The next engineering phase should focus on building and executing the live n8n workflow using the completed contracts, JavaScript logic, mapping rules, safety controls, and dry-run acceptance criteria.
```

---

# 43. Recommended Next Phase

```text
Phase 3 — Live n8n Workflow Implementation
```

Suggested first chunk:

```text
Chunk 3.1 — Build Merged Test Input Node

Target:
Create the exact n8n input object required by n8n/recommendation-code-node.js.

Output:
n8n/merged-test-input-L001.json
n8n/merged-test-input-L006.json
```

Phase 3 should then continue through:

```text
3.1 Merged Test Input
3.2 Live Recommendation Code Node
3.3 Validation Code Node
3.4 Tracker Mapping Code Node
3.5 Google Sheets Test Tabs
3.6 Lead Tracker Write
3.7 Recommendation Tracker Write
3.8 Owner Notification Payload Node
3.9 L001 End-to-End Test
3.10 L006 End-to-End Test
3.11 Failure-Path Tests
3.12 Phase 3 Final Snapshot
```