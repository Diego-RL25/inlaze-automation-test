# Inlaze Automation Test

## Overview

This project simulates a system that monitors campaign performance, evaluates metrics based on thresholds, and prepares data for further automation and AI processing.

---

## Part 1 — API Integration & Business Logic

### API Selection

For this project, I used the JSONPlaceholder API (https://jsonplaceholder.typicode.com/posts) as a mock data source.

### Reasoning

Since the real Google Ads API was not available, I selected a public REST API that:

* Provides consistent and predictable JSON responses
* Requires no authentication (simplifies setup and testing)
* Is stable and widely used for prototyping

### Design Decision

Even though the API does not contain real campaign metrics, I abstracted the data into a custom `CampaignReport` model.

This allows:

* Decoupling the data source from business logic
* Simulating campaign performance metrics (CTR/ROAS)
* Making the system extensible (a real API can replace this layer easily)

---

## Threshold Logic

The system evaluates campaign performance using the following thresholds:

* metric < 1.0 → critical
* metric < 2.5 → warning
* metric ≥ 2.5 → ok

---

## Error Handling

The implementation includes:

* Retry mechanism with exponential backoff
* Validation of API response structure
* Graceful error handling to prevent crashes

---

## Output

The processed data is stored locally in:

```bash
data/reports.json
```

---

## How to Run

```bash
npm install
npx ts-node src/index.ts
```

