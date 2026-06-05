Deployment notes

1. Ensure `MONGO_URI` points to your online MongoDB (Atlas) in production.
   - Use `backend/.env` or your hosting platform's environment variables.

2. The app will automatically seed initial data on startup only if the database
   appears empty (`seedIfEmpty()`), to avoid overwriting production data.

3. To run the destructive seed (delete & reinsert collections), explicitly set
   `NODE_ENV=production` and `FORCE_SEED=true` then run:

   yarn seed

   WARNING: this deletes and replaces collections. Use with caution.

4. Frontend should set `VITE_API_URL` to the public backend URL so clients
   point to the deployed API. Example in `frontend/.env.example`.

5. Recommended environment variables in production:

   - `PORT` (optional)
   - `NODE_ENV=production`
   - `MONGO_URI` (Atlas connection string)
   - `FORCE_SEED=true` (only when intentionally seeding)

6. Health check endpoint: `GET /health`

7. If you need to edit content directly, do it in the same database that the
   backend is configured to use (`MONGO_URI`).
