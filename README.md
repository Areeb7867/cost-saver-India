# CostSaver India

A responsive, privacy-first toolkit for smarter everyday money decisions in India.

## Included tools

- Monthly Budget Planner
- Commute Cost Calculator
- EMI & Loan Calculator

## Analytics layer (dbt + BigQuery)

The `analytics/` folder contains a working dbt project for the future City Cost-of-Living dashboard. It starts with sample city-cost data and transforms it into a clean `city_cost_summary` model.

To connect it to Google BigQuery:

1. Install `dbt-bigquery`.
2. Copy `analytics/profiles.yml.example` to your local dbt profiles directory and replace `your-gcp-project-id`.
3. From `analytics/`, run `dbt seed`, then `dbt build`.

This foundation adds dbt models, data-quality tests, seeds, and BigQuery configuration without requiring cloud credentials to be committed to GitHub.

## Run locally

Open `index.html` in a browser. No dependencies or build step are required.

## Publish with GitHub Pages

In the repository, open **Settings > Pages**. Under **Build and deployment**, select **Deploy from a branch**, then choose the `main` branch and the `/ (root)` folder. Save the setting; GitHub will provide the public site URL.

All calculator inputs stay in the browser and are not stored or sent anywhere.

