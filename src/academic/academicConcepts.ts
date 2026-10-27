/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Academic Curriculum Integration Guide for ConnectSphere
 * B.Tech Third-Year Engineering Core Subjects
 */

export interface AcademicSubjectDetail {
  id: string;
  subjectName: string;
  semester: string;
  coreConcepts: string[];
  systemApplication: string;
  theoreticalFoundation: string;
  codeReference: string;
  mathematicalFormula?: string;
  diagramSvg?: string;
}

export const ACADEMIC_SUBJECTS: AcademicSubjectDetail[] = [
  {
    id: 'algorithms',
    subjectName: 'Analysis of Algorithms',
    semester: 'Semester 5 / 6 Core',
    coreConcepts: [
      'Jaccard Set Similarity Metric',
      'Normalized Convex Combination Weights',
      'Time & Space Complexity Bounds',
      'Top-K Selection and Sorting',
    ],
    systemApplication:
      'ConnectSphere evaluates companion compatibility by representing user profiles as discrete multi-dimensional sets and executing a transparent rule-based matching pipeline.',
    theoreticalFoundation: `1. Jaccard Index Formulation:
Given two discrete user interest sets A and B:
J(A, B) = |A ∩ B| / |A ∪ B|

2. Edge-case handling:
If A = ∅ and B = ∅, J(A, B) is undefined (null) to prevent fabricated false positives.

3. Convex Weight Normalization:
Overall score S = (w_int * S_int + w_city * S_city + w_cat * S_cat) / Σ(w_active)
Where standard base weights are w_int = 0.60, w_city = 0.25, w_cat = 0.15. When a component is missing, its weight is eliminated and the remaining weights renormalize to maintain an exact 0-100 scale.

4. Asymptotic Complexity:
- Set Intersection via Hash Set: O(|A| + |B|) time, O(|A| + |B|) auxiliary space.
- Candidate Matching across N registered users: O(N * M) time where M = max interests per user.
- Ranking Top Candidates: O(N log N) using TimSort.`,
    codeReference: 'src/matching/matching.ts',
    mathematicalFormula: 'J(A, B) = \\frac{|A \\cap B|}{|A \\cup B|}, \\quad S = \\frac{\\sum w_i \\cdot s_i}{\\sum w_i}',
  },
  {
    id: 'os',
    subjectName: 'Operating Systems',
    semester: 'Semester 4 / 5 Core',
    coreConcepts: [
      'Concurrency Control & Critical Sections',
      'Race Conditions on Shared Resources',
      'Pessimistic Row-Level Locking (SELECT ... FOR UPDATE)',
      'ACID Transaction Atomicity & Isolation',
    ],
    systemApplication:
      'Activity capacity enforcement where multiple users attempt to claim the final remaining spot concurrently.',
    theoreticalFoundation: `1. The Concurrency Hazard:
Consider an activity with participantLimit = 5 and current approved count = 4 (1 spot remaining).
If Host approves User 1 and User 2 in separate simultaneous thread requests:
  - Thread T1 reads: count = 4, remaining = 1 (valid!)
  - Thread T2 reads: count = 4, remaining = 1 (valid!)
  - Thread T1 executes: inserts approval, count becomes 5
  - Thread T2 executes: inserts approval, count becomes 6 (OVERCAPACITY BUG!)

2. Database Concurrency Remedy (PostgreSQL / Supabase):
In a production relational engine, this is prevented via a database transaction with pessimistic row-locking:
  BEGIN;
  SELECT participant_limit, ARRAY_LENGTH(approved_participant_ids, 1)
  FROM activities
  WHERE id = $activity_id
  FOR UPDATE; -- Acquires exclusive row lock

  -- Conditional check executed atomically:
  IF current_count < participant_limit THEN
    UPDATE activities SET approved_participant_ids = array_append(...) WHERE id = $activity_id;
    COMMIT;
  ELSE
    ROLLBACK;
    RAISE EXCEPTION 'Activity capacity reached';
  END IF;`,
    codeReference: 'src/services/repositories/supabaseGuide.ts (Section: Concurrency and RLS)',
    mathematicalFormula: 'Race Condition: \\Delta t_{read} < t_{write} \\implies \\text{Inconsistent State}',
  },
  {
    id: 'data-mining',
    subjectName: 'Data Mining Concepts & Techniques',
    semester: 'Semester 6 Core Elective',
    coreConcepts: [
      'Content-Based Filtering Heuristics',
      'Binary Feature Representation',
      'Cold-Start Problem Handling',
      'Similarity Metrics (Jaccard vs Cosine vs Dice)',
    ],
    systemApplication:
      'Personalized recommendation engine for activities and companions based on multidimensional feature overlap rather than black-box opaque models.',
    theoreticalFoundation: `1. High-Dimensional Categorical Representation:
Each user profile U is modeled as a binary feature vector v over the domain of interests I = {i_1, i_2, ..., i_K}.
v_k = 1 if user possesses interest i_k, else 0.

2. Metric Comparison:
- Cosine Similarity: measures angular cosine between vectors: (u · v) / (||u|| ||v||).
- Jaccard Similarity: specifically handles asymmetric binary attributes (two users lacking an interest does NOT increase similarity).
- Dice Coefficient: (2 * |A ∩ B|) / (|A| + |B|), which assigns double weight to common elements.

3. Cold-Start Mitigation:
New users with zero selected interests are explicitly flagged with isAvailable: false. ConnectSphere presents popular and geographically proximate activities until onboarding profile vectors are populated.`,
    codeReference: 'src/matching/matching.ts & src/pages/DiscoverPage.tsx',
    mathematicalFormula: '\\text{Cosine}(u, v) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}, \\quad \\text{Jaccard}(u, v) = \\frac{u \\cdot v}{\\|u\\|^2 + \\|v\\|^2 - u \\cdot v}',
  },
  {
    id: 'graphics',
    subjectName: 'Computer Graphics & Multimedia',
    semester: 'Semester 5 Core Elective',
    coreConcepts: [
      'Visual Hierarchy & Typographic Rhythm',
      '60-30-10 Color Spatial Allocation',
      'Vector Graphics (SVG) Rasterization',
      'WCAG AA Luminance Contrast Math',
    ],
    systemApplication:
      'Responsive, accessible web UI with custom SVG iconography, dynamic cost-split distribution graphs, and contrast-verified color hierarchy.',
    theoreticalFoundation: `1. Relative Luminance & Contrast Ratio:
WCAG AA requires a 4.5:1 minimum contrast ratio for normal text:
L = 0.2126 * R_srgb + 0.7152 * G_srgb + 0.0722 * B_srgb
Ratio = (L_lighter + 0.05) / (L_darker + 0.05)
ConnectSphere pairs deep indigo (#1e1b4b) with warm off-white (#fafaf9) for a 14.8:1 ratio, vastly exceeding accessibility baselines.

2. Procedural Dynamic Graphics:
Interactive cost-split progress bars and compatibility gauges use vector math to calculate fill percentages and stroke offsets on the GPU via CSS compositor transforms.`,
    codeReference: 'src/components/CostBreakdown.tsx & src/index.css',
    mathematicalFormula: 'Ratio = \\frac{L_1 + 0.05}{L_2 + 0.05} \\ge 4.5:1',
  },
  {
    id: 'compiler-design',
    subjectName: 'Compiler Design',
    semester: 'Semester 6 Core',
    coreConcepts: [
      'Lexical Analysis (Regular Expressions & Tokenization)',
      'Context-Free Grammar (CFG) Specification',
      'Recursive-Descent LL(1) Parsing',
      'Abstract Syntax Tree (AST) Construction & Evaluation',
    ],
    systemApplication:
      'Interactive query expression compiler that allows users and evaluators to write filter expressions (e.g. `category == "Trekking & Outdoors" && costAmount <= 1000`) and evaluates them against activity records.',
    theoreticalFoundation: `1. Grammar Definition (EBNF):
Expr        ::= OrExpr
OrExpr      ::= AndExpr ('||' AndExpr)*
AndExpr     ::= EqualityExpr ('&&' EqualityExpr)*
Equality    ::= CompExpr (('==' | '!=') CompExpr)*
CompExpr    ::= Primary (('<' | '<=' | '>' | '>=') Primary)*
Primary     ::= IDENTIFIER | STRING | NUMBER | '(' Expr ')'

2. Pipeline Stages:
Raw Query String ---> [Lexer] ---> Token Stream ---> [Parser] ---> AST ---> [Evaluator] ---> Boolean`,
    codeReference: 'src/academic/compilerParser.ts',
    mathematicalFormula: 'G = (V, \\Sigma, R, S), \\quad \\text{AST} = \\text{Node}(op, left, right)',
  },
];
