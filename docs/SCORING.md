# Career Assessment Scoring Criteria

## Overview
This document outlines the scoring methodology and interpretation logic for the career assessment test. The system evaluates responses across 4 main categories and 20 subcategories to provide personalized career recommendations.

## Scoring Components

### 1. Question Scoring
- **Option Values**: Questions use reverse scoring based on option position:
  - 5 options: `[4, 3, 2, 1, 0]` points
  - 4 options: `[3, 2, 1, 0]` points
  - 3 options: `[2, 1, 0]` points
- **Rationale**: Higher values indicate stronger alignment with the trait being measured

### 2. Category Breakdown
Four main categories are evaluated:

| Category | Subcategories Included | Color | Icon |
|----------|-------------------------|-------|------|
| Skills & Abilities | Cognitive, Technical, Social, Analytical | #4361ee | fas fa-tools |
| Interests & Passions | Realistic, Investigative, Artistic, Social, Enterprising, Conventional | #3a0ca3 | fas fa-star |
| Motivations & Values | Financial Security, Social Impact, Work-Life Balance | #7209b7 | fas fa-award |
| Work Style Preferences | Structure, Autonomy, Collaboration, Leadership | #f72585 | fas fa-sliders-h |

### 3. Score Calculations

#### a. Subcategory Scores
```math
Subcategory Percentage = (Total Subcategory Points / Max Possible Subcategory Points) × 100
```
- Max points per question: `(number of options - 1)`
- Includes all questions in the subcategory

#### b. Category Scores
```math
Category Percentage = (Total Category Points / Max Possible Category Points) × 100
```
- Aggregates all subcategory scores within the category

#### c. Overall Score
```math
Overall Percentage = (Total Points Across All Categories / Max Possible Total Points) × 100
```

### 4. Strengths Identification
Top strengths are determined by:
1. **Category Strengths**: Top 2 categories scoring ≥70%
2. **Subcategory Strengths**: Top 3 subcategories scoring ≥75%
3. **Scoring Priority**:
   - Category strengths weighted 1.5×
   - Primary subcategories weighted 2×
   - Secondary subcategories weighted 1×

### 5. Career Recommendations
Recommendations are generated using weighted matches against 6 career paths:

| Career Path | Key Factors | Weighting |
|-------------|-------------|-----------|
| Technology | Technical, Analytical, Cognitive | 1.5× |
| Business | Enterprising, Analytical, Social | 1.5× |
| Creative | Artistic, Social | 2× |
| Healthcare | Social Impact, Analytical | 1.5× |
| Education | Social Impact, Cognitive | 1.5× |
| Research | Investigative, Analytical | 2× |

**Inclusion Threshold**: Minimum 60% match score

### 6. Interpretation Logic
Personalized insights consider:
- Overall percentage bracket (Above 80%, 65-80%, Below 65%)
- Highest scoring category characteristics
- Indian job market trends
- Balance between strengths and developmental areas

## Validation & Error Handling

### Response Validation
1. Index bounds checking for question arrays
2. Option index validation (0 ≤ index < options.length)
3. Category/subcategory existence verification
4. Minimum 90% attempt check before scoring

### Error Conditions
- **Low Attempts (<90%)**: Triggers feedback
- **Network Errors**: Retry prompts with connectivity checks
- **Scoring Errors**: Fallback to basic percentage calculation
- **Data Mismatches**: Server-side logging of response/question mismatches
