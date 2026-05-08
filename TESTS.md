# Tests

All tests cover the audit engine — the most critical logic in the app.

## Test File

**File:** `src/__tests__/auditEngine.test.ts`
**Framework:** Vitest
**Run:** `npm test`

## Test Coverage

| Test | What it covers |
|------|---------------|
| Team plan for ≤2 users | Flags Claude Team as overkill for 2 seats, expects downgrade recommendation |
| Enterprise for small team | Flags Copilot Enterprise for 3 seats, expects Business downgrade |
| High ChatGPT spend | Flags $600/mo ChatGPT as Credex credits opportunity |
| Claude Max for small team | Expects exactly $160 savings (2 seats × $80 difference) |
| Cursor Business for 2 devs | Expects exactly $40 savings (2 seats × $20 difference) |
| Already optimal setup | Expects zero savings for Cursor Pro, 1 seat |
| Multiple tools | Handles 2 tools simultaneously, total savings > 0 |

## How to Run

```bash
npm install
npm test
```

Expected output:
```
✓ src/__tests__/auditEngine.test.ts (7 tests)
Test Files  1 passed
Tests       7 passed
```
