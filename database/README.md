# SKV138 TEST – SQL privilege stage

**Prepared, not executed.** `runtime-role.sql` creates a NOLOGIN role and narrowly scoped grants. It does not create a database login or store credentials. It presumes the three tables and identity sequence created by the prior SQL migration exist in `public`.

Important: A NOLOGIN role does not protect anything by itself until a dedicated, non-owner LOGIN role is configured to inherit it. Verify the runtime LOGIN role does **not** inherit owner/superuser privileges and that it can only read `skv138_access`, read/update `skv138_data`, and read/insert `skv138_data_history`. The existing DB owner remains privileged. Do not use owner connection strings for Netlify runtime.

Before activation: confirm Neon's role administration behavior and SQL role inheritance; run permission checks with the actual dedicated login; review table-level access and consider row-level security if exposing any direct DB access. The Netlify function must always authenticate and authorize users before querying.

For now, no need to run this SQL; we can batch database steps once the authentication and deployment configuration are settled.
