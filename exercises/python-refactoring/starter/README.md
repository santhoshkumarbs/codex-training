# Legacy Processor - Refactoring Exercise

This is the starting point for Lab 2: Python Code Refactoring.

## The Challenge

`legacy_processor.py` is working code with many issues:

- No type hints
- Poor variable names (`d`, `t`, `r`, `i`, `f`)
- No error handling (bare `except:`)
- No context managers for file handling
- Magic strings and hardcoded paths
- No documentation
- Deeply nested conditionals
- No tests

## What You'll Do

Use Codex to:
1. Add type hints throughout
2. Rename variables to be descriptive
3. Add proper error handling
4. Use context managers (`with` statements)
5. Extract configuration
6. Add docstrings
7. Write pytest tests
8. Set up code quality tools

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the legacy code
python legacy_processor.py

# After refactoring, run tests
pytest --cov=. --cov-report=html
```

## First Codex Prompt

```
Analyze legacy_processor.py and list all the code smells and
issues that need to be fixed. Then start by adding type hints.
```
