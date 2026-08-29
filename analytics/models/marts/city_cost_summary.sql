select
    city,
    sum(monthly_estimated_cost) as estimated_monthly_cost,
    sum(case when category = 'housing' then monthly_estimated_cost else 0 end) as housing_cost,
    sum(case when category = 'food' then monthly_estimated_cost else 0 end) as food_cost,
    sum(case when category = 'transport' then monthly_estimated_cost else 0 end) as transport_cost,
    max(updated_at) as last_updated_at
from {{ ref('stg_city_costs') }}
group by city

