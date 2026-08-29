with source_data as (
    select * from {{ ref('city_costs') }}
),

cleaned as (
    select
        lower(trim(city)) as city,
        lower(trim(category)) as category,
        cast(monthly_estimated_cost as numeric) as monthly_estimated_cost,
        cast(updated_at as date) as updated_at
    from source_data
)

select * from cleaned

