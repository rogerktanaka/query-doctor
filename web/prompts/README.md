# Query Doctor Prompts

This directory contains all prompts used by Query Doctor.

Prompts are treated as first-class engineering artifacts.

They are versioned, reviewed and improved in the same way as application code.

Changing a prompt changes the behavior of the product.

Therefore every prompt modification should have a clear technical justification and its own Git history.

---

# Philosophy

Query Doctor is not a chatbot.

Query Doctor is an AI-powered SQL code review engine.

Its objective is not simply to find mistakes.

Its objective is to help developers write better SQL.

Every prompt should reinforce this philosophy.

---

# Prompt Design Principles

Every prompt should:

- be deterministic whenever possible
- avoid ambiguous instructions
- define clear responsibilities
- explicitly describe limitations
- avoid unsupported assumptions
- produce structured JSON output
- be educational instead of merely corrective

---

# Prompt Structure

Each prompt should define:

1. Identity
2. Mission
3. Scope
4. Review Principles
5. Analysis Rules
6. Confidence Rules
7. Forbidden Behaviors
8. Output Format
9. Examples

---

# Current Prompts

sql-review-system.md

System prompt used by the SQL Review Engine.

Responsible for defining how Query Doctor analyzes SQL statements.

---

# Long-term Vision

Future prompt specializations may include:

- Oracle SQL
- PostgreSQL
- SQL Server
- MySQL
- Snowflake
- BigQuery

The application should select the appropriate prompt based on the selected database engine.

---

# Important

Prompts are part of the product.

They should be reviewed with the same level of attention as production code.