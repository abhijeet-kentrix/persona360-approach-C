import datetime
from typing import Dict, List, Set, Any
complete_custom_audience_files = {
    "income_lifestyle_group": [
        '1.1',
        '1.2',
        '1.3',
        '1.4',
        '1.5',
        '1.6',
        '1.7',
        '2.1',
        '2.2',
        '2.3',
        '2.4',
        '2.5',
        '2.6',
        '2.7',
        '3.1',
        '3.2',
        '3.3',
        '3.4',
        '3.5',
        '3.6',
        '3.7',
        '4.1',
        '4.2',
        '4.3',
        '4.4',
        '4.5',
        '4.6',
        '4.7'

    ],
    "income": [
        "1",
        "2",
        "3",
        "4"
    ],
    "lifestyle": [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7"
    ],
    "health_care": [
        "1",
        "2",
        "No"
    ],
    "insurance": [
        "insurance_saving_plan_yes",
        "insurance_saving_plan_no",
        "insurance_retirement_plan_yes",
        "insurance_retirement_plan_no"
    ],
    "banking_product": [
        "banking_product_mutual_fund_yes",
        "banking_product_mutual_fund_no",
        "banking_product_fixed_deposit_yes",
        "banking_product_fixed_deposit_no"
    ],
    "credit_card": [
        "2",
        "1",
        "3",
        "No"
    ],
    "automobile": [
        "automobile_1_yes",
        "automobile_1_no",
        "automobile_2_yes",
        "automobile_2_no",
        "automobile_3_yes",
        "automobile_3_no",
        "automobile_4_yes",
        "automobile_4_no",
        "automobile_5_yes",
        "automobile_5_no",
        "automobile_6_yes",
        "automobile_6_no",
        "automobile_7_yes",
        "automobile_7_no",
        "automobile_8_yes",
        "automobile_8_no",
        "automobile_9_yes",
        "automobile_9_no"
    ],
    "real_estate": [
        "1",
        "2",
        "3",
        "4",
        "No"
    ],
    "laundry": [
        "1",
        "2",
        "No"
    ],
    "personal_wash": [
        "2",
        "1",
        "No"
    ],
    "packaged_food": [
        "1",
        "2",
        "No"
    ],
    "cosmetics": [
        "1",
        "2",
        "No"
    ],
    "fashion": [
        "1",
        "2",
        "3",
        "4",
        "No"
    ],
    "jewellery_gold": [
        "moderately_priced",
        "high_priced",
        "No"
    ],
    "jewellery_diamond": [
        "moderately_priced",
        "high_priced",
        "No"
    ],
    "travel_spend": [
        "basic",
        "luxury",
        "No"
    ],
    "travel_destination": [
        "national",
        "No"
    ],
    "online_retail": [
        "rare",
        "moderate",
        "No"
    ],
    "two_wheeler": [
        "two_wheeler_9_yes",
        "two_wheeler_10_yes",
        "two_wheeler_8_yes",
        "two_wheeler_7_yes",
        "two_wheeler_6_yes",
        "two_wheeler_5_yes",
        "two_wheeler_4_yes",
        "two_wheeler_3_yes",
        "two_wheeler_2_yes",
        "two_wheeler_1_yes",
        "two_wheeler_9_no",
        "two_wheeler_10_no",
        "two_wheeler_8_no",
        "two_wheeler_7_no",
        "two_wheeler_6_no",
        "two_wheeler_5_no",
        "two_wheeler_4_no",
        "two_wheeler_3_no",
        "two_wheeler_2_no",
        "two_wheeler_1_no",
    ],
    "TV": [
        "popular",
        "premium",
        "No"
    ],
    "Smartphone": [
        "popular",
        "premium",
        "No"
    ],
    "Refrigerator": [
        "premium",
        "popular",
        "No"
    ],
    "WashingMachine": [
        "premium",
        "popular",
        "No"
    ],
    "AirConditioner": [
        "premium",
        "popular",
        "No"
    ]
}

def build_audience_segments(
        complete_audience_filter: Dict[str, List[str]],
        current_username: str = "system"
) -> Dict[str, Any]:
    """
    Build inclusion and exclusion segments based on dashboard selections.

    The function achieves intersection of all selected segments by:
    1. Always ensuring at least one inclusion segment exists (base universe)
    2. Using exclusion to narrow down from the inclusion base
    3. Optimizing between inclusion and exclusion based on selection size

    Args:
        complete_audience_filter: User selections from dashboard
        complete_custom_audience_files: Available audience files
        current_username: User building the segments

    Returns:
        Dictionary with inclusion/exclusion segments and metadata
    """

    inclusion_segments = []
    exclusion_segments = []

    # Track if we have a base universe inclusion
    has_base_inclusion = False

    # Check if both income and lifestyle are present
    income_selected = set(complete_audience_filter.get('income', []))
    lifestyle_selected = set(complete_audience_filter.get('lifestyle', []))
    has_income = bool(income_selected)
    has_lifestyle = bool(lifestyle_selected)

    # Get all available income and lifestyle values
    all_income = set(complete_custom_audience_files.get('income', []))
    all_lifestyle = set(complete_custom_audience_files.get('lifestyle', []))

    # Check if ALL income and lifestyle are selected (whole universe)
    is_full_universe = (income_selected == all_income) and (lifestyle_selected == all_lifestyle)

    # Handle income_lifestyle_group when both are present
    if has_income and has_lifestyle:
        if is_full_universe:
            # Special case: All income and lifestyle selected = whole universe
            # Include all income_lifestyle_group combinations
            for combination in complete_custom_audience_files.get('income_lifestyle_group', []):
                inclusion_segments.append(f"income_lifestyle_group_{combination}")
        else:
            # Include only selected income.lifestyle combinations
            for inc in income_selected:
                for lif in lifestyle_selected:
                    combination = f"{inc}.{lif}"
                    if combination in complete_custom_audience_files.get('income_lifestyle_group', []):
                        inclusion_segments.append(f"income_lifestyle_group_{combination}")
        has_base_inclusion = True
    elif has_income:
        # Only income is selected - include all income segments directly
        for inc in income_selected:
            inclusion_segments.append(f"income_{inc}")
        has_base_inclusion = True
    elif has_lifestyle:
        # Only lifestyle is selected - include all lifestyle segments directly
        for lif in lifestyle_selected:
            inclusion_segments.append(f"lifestyle_{lif}")
        has_base_inclusion = True

    # Process other categories
    for category, selected_values in complete_audience_filter.items():
        if not selected_values:
            continue

        # Skip income and lifestyle as they're already handled
        if category in ['income', 'lifestyle']:
            continue

        # If whole universe is selected, skip all product filtering
        # User wants everyone regardless of product selections
        if is_full_universe:
            continue

        available_files = complete_custom_audience_files.get(category, [])
        if not available_files:
            continue

        selected_set = set(selected_values)
        available_set = set(available_files)

        # Remove "No" from available set for comparison
        available_without_no = available_set - {"No"}

        # Special handling for independent boolean categories
        # These categories treat each segment independently
        independent_boolean_categories = ['insurance', 'banking_product', 'automobile', 'two_wheeler']

        # Handle categories with yes/no suffixes
        if any('_yes' in f or '_no' in f for f in available_files):
            # For boolean-type categories (e.g., insurance, banking_product, automobile, two_wheeler)

            # Get all base values (without _yes/_no suffix)
            all_base_values = set()
            for f in available_files:
                if '_yes' in f:
                    all_base_values.add(f.replace('_yes', ''))
                elif '_no' in f:
                    all_base_values.add(f.replace('_no', ''))

            # If this is the first category and we don't have base inclusion yet
            if not has_base_inclusion:
                # Must use inclusion strategy to create base universe
                for value in selected_values:
                    yes_file = f"{value}_yes"
                    if yes_file in available_files:
                        inclusion_segments.append(f"{category}_{yes_file}")
                has_base_inclusion = True
            elif category in independent_boolean_categories:
                # For independent boolean categories, each segment is treated alone
                # Include the _yes variant and exclude the _no variant for each selected
                for value in selected_values:
                    no_file = f"{value}_no"
                    if no_file in available_files:
                        exclusion_segments.append(f"{category}_{no_file}")
            else:
                # For other boolean categories, use standard exclusion logic
                # Exclude non-selected options
                for base_value in all_base_values:
                    if base_value not in selected_set:
                        no_file = f"{base_value}_no"
                        if no_file in available_files:
                            exclusion_segments.append(f"{category}_{no_file}")
        else:
            # For simple categories (e.g., credit_card, TV, Smartphone)

            # If this is the first category and we don't have base inclusion yet
            if not has_base_inclusion:
                # Must use inclusion strategy to create base universe
                for value in selected_values:
                    if value in available_files:
                        inclusion_segments.append(f"{category}_{value}")
                has_base_inclusion = True
            else:
                # We have a base inclusion, so use exclusion to narrow it down
                # Exclude all non-selected values
                for available_file in available_files:
                    if available_file not in selected_set:
                        exclusion_segments.append(f"{category}_{available_file}")

    # Remove duplicates while preserving order
    inclusion_segments = list(dict.fromkeys(inclusion_segments))
    exclusion_segments = list(dict.fromkeys(exclusion_segments))

    # Build response
    response_data = {
        'inclusionSegments': inclusion_segments,
        'exclusionSegments': exclusion_segments,
        'metadata': {
            'total_inclusion': len(inclusion_segments),
            'total_exclusion': len(exclusion_segments),
            'built_at': datetime.datetime.utcnow().isoformat(),
            'built_by': current_username
        }
    }

    return response_data