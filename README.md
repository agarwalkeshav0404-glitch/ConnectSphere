# ConnectSphere
> **“Find Your People. Share Your Experiences.”**

ConnectSphere is an activity discovery and companion-matching web application designed to help people discover recreational activities, find peers with shared passions, coordinate participation, and transparently split shared expenses.

Built as a **B.Tech Third-Year Computer Science & Engineering Project**, the application bridges foundational CS subjects (Operating Systems, Analysis of Algorithms, Compiler Design, Data Mining, and Computer Graphics) into a production-grade web system.

---

## 1. Academic Curriculum Connections (B.Tech 3rd Year)

### A. Analysis of Algorithms (Semester 5/6 Core)
- **Jaccard Similarity Calculation**: Companion interest similarity is computed via discrete set intersection over union:
  $$J(A, B) = \frac{|A \cap B|}{|A \cup B|}$$
  When both sets are empty ($A = \emptyset, B = \emptyset$), the algorithm returns `null` to avoid fabricated false positives.
- **Convex Combination & Dynamic Weight Renormalization**:
  The total compatibility score combines three components:
  - 60% Interest Similarity
  - 25% City Match (100 for match, 0 for mismatch)
  - 15% Recreation Category Overlap
  When any data component is missing (e.g. unstated city), its weight is eliminated and the remaining weights renormalize to maintain an exact 0–100 scale:
  $$S = \frac{\sum_{i \in \text{available}} w_i \cdot s_i}{\sum_{i \in \text{available}} w_i}$$
- **Time Complexity**:
  - Set Intersection: $\mathcal{O}(|A| + |B|)$ using hash sets.
  - Companion Candidate Scoring: $\mathcal{O}(N \cdot M)$ where $N$ is candidate count and $M$ is max interest list length.
  - Top-$K$ Ranking: $\mathcal{O}(N \log N)$ sorting.

### B. Operating Systems (Semester 4/5 Core)
- **Concurrency & Critical Sections**:
  In multi-user activity booking, a race condition occurs when two users attempt to claim the final remaining capacity simultaneously:
  1. Thread $T_1$ reads: `currentCount = 4`, `limit = 5` (1 remaining, valid)
  2. Thread $T_2$ reads: `currentCount = 4`, `limit = 5` (1 remaining, valid)
  3. Both threads execute approval and insert participants $\implies$ `currentCount = 6` (**Overcapacity Bug!**)
- **Relational Concurrency Solution (PostgreSQL / Supabase)**:
  Handled using pessimistic row-level locking via `SELECT ... FOR UPDATE` inside a database transaction (`BEGIN ... COMMIT`), preventing concurrent writes until transaction lock release (`src/services/repositories/supabaseGuide.ts`).

### C. Data Mining Concepts & Techniques (Semester 6 Core Elective)
- **Content-Based Filtering & Sparse Feature Vectors**:
  Each user is represented as a high-dimensional binary feature vector over the interest domain $I = \{i_1, i_2, \dots, i_{20}\}$.
- **Similarity Metric Comparison**:
  - *Jaccard Index*: Evaluates asymmetric binary features (two users not having an interest does not artificially boost compatibility).
  - *Cosine Similarity*: Computes vector angle $\frac{u \cdot v}{\|u\| \|v\|}$.
  - *Dice Coefficient*: $\frac{2|A \cap B|}{|A| + |B|}$.
- **Cold-Start Handling**:
  Profiles with uninitialized interest vectors are flagged with `isAvailable: false`, preventing misleading matches and defaulting to geographical recommendations.

### D. Computer Graphics & Multimedia (Semester 5 Core Elective)
- **Visual Ergonomics & 60-30-10 Spatial Allocation**:
  - 60% Dominant canvas (warm neutral `#fafaf9` / white `#ffffff`)
  - 30% Structural surfaces (card boundaries, hairline dividers, typography)
  - 10% High-intent indigo & violet accents (`#1e1b4b`, `#4338ca`)
- **WCAG AA Relative Luminance & Contrast**:
  $$Ratio = \frac{L_1 + 0.05}{L_2 + 0.05} \ge 4.5:1$$
  ConnectSphere achieves 14.8:1 text contrast between deep indigo and warm canvas.
- **Dynamic Cost Split Visualization**:
  GPU-accelerated CSS compositor graphs illustrate dynamic per-person shares ($Total \div [Participants + Host]$).

### E. Compiler Design (Semester 6 Core)
- **Interactive Query Filter Expression Engine (`src/academic/compilerParser.ts`)**:
  ConnectSphere includes a built-in Lexer, Context-Free Grammar (CFG) Parser, and Abstract Syntax Tree (AST) Evaluator allowing users to write custom filter expressions:
  - Example Query: `category == "Trekking & Outdoors" && costAmount <= 3000`
  - Pipeline:
    1. **Lexical Analysis (Lexer)**: Tokenizes input into `IDENTIFIER`, `EQUALS`, `STRING`, `NUMBER`, `AND`, `OR`, `LPAREN`, `RPAREN`.
    2. **Recursive-Descent LL(1) Parser**: Builds an AST following operator precedence ($() > \text{Comparison} > \&\& > ||$).
    3. **AST Evaluator**: Traverses the syntax tree against activity records at runtime.

---

## 2. Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (Tailwind v4 with `@import "tailwindcss"` and typography tokens)
- **Icons**: Lucide React
- **Validation**: Zod (strict minimum age 18+ validation, future dates, cost mode consistency)
- **Storage**: Local-First Data Adapter with structured seeds, persistence in browser storage (IndexedDB/localStorage), and real-time cross-tab synchronization.
- **Testing**: Vitest automated unit test runner (`npm test`) + interactive in-app visual test runner.

---

## 3. Seed Personas & Multi-User Testing Guide

ConnectSphere includes 5 pre-seeded personas in Bengaluru and Mysuru with realistic activities and requests.

### Testing Host-Guest Approval Workflow:
1. **Active Host Account**: Currently active user is **Aarav Sharma** (Host of *"Sunrise Trek to Skandagiri Hills"*).
2. **View Incoming Request**: Navigate to **My Activities** $\rightarrow$ **Incoming Requests** (or open the Skandagiri activity details). Notice the pending request from **Rohan Iyer**.
3. **Approve Request**: Click **Approve**. Notice the approved roster updates, participant count becomes 3 of 6, and spots decrease in real time.
4. **Switch Persona (1-Click)**:
   - Click **Switch Account** in the top navigation banner.
   - Select **Rohan Iyer**.
   - Navigate to **My Activities** $\rightarrow$ **Requests Sent** or **Joined Activities** to see that Rohan's status is now **APPROVED**!
5. **Request as Guest**:
   - As Rohan, go to **Discover** $\rightarrow$ select Diya's *"Friday Strategy Board Game Evening"* or Sneha's *"Indie Acoustic Jam"*.
   - Click **Request to Join**, type an intro note, and submit.
   - Switch account to **Diya Patel** or **Sneha Rao** to review and approve!

---

## 4. How to Run Locally

### Start Development Server:
\`\`\`bash
npm run dev
\`\`\`
The application starts at `http://localhost:3000`.

### Run Automated Unit Tests:
\`\`\`bash
npm test
\`\`\`
Executes all 21 Vitest unit tests verifying:
- Jaccard similarity & weight renormalization
- 18+ birthdate validation
- Activity form schemas
- Capacity constraints & cost-sharing division

---

## 5. Future Supabase Integration Guide

ConnectSphere is structured with an interface-driven service layer (`src/services/repositories/types.ts`). To transition from local storage mode to production Supabase:

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. In Supabase SQL Editor, execute the schema migration located in:
   `src/services/repositories/supabaseGuide.ts`
   (Includes UUID tables, RLS policies, indexes, and the `approve_activity_request` row-lock function).
3. Set client environment variables:
   \`\`\`bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   \`\`\`
4. Switch the repository binding in `src/services/repositories/` from `localRepository` to `supabaseRepository`.
