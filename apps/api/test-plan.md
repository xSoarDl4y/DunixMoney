# MONEYFLOW API manual test plan

After configuring PostgreSQL, running `pnpm db:migrate`, and starting the API:

1. `GET /api/v1/health` returns `status: ok`.
2. `GET /api/v1/ready` returns `database: connected`.
3. `POST /api/v1/auth/register` with name, email and password (8+ chars) creates a user and returns a bearer token.
4. Registering the same email returns 409.
5. `POST /api/v1/auth/login` with correct credentials returns a token; incorrect credentials return 401.
6. `GET /api/v1/auth/me` without a token returns 401; with a token returns the current user without password hash.
7. `GET /api/v1/transactions` requires a token and returns only the current user's transactions.
8. `POST /api/v1/transactions` with title, amount > 0, type, category and YYYY-MM-DD date creates a transaction.
9. `PATCH /api/v1/transactions/:id` and `DELETE /api/v1/transactions/:id` only affect records owned by the signed-in user.
10. Register two users and verify neither can read, update, or delete the other's transactions.

These are manual test cases; they have not been executed automatically in this generated environment.
