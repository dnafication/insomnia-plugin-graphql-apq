# insomnia-plugin-graphql-apq
 Convert a GraphQL POST request to an Apollo APQ GET request.

> To improve network performance for large query strings, Apollo Server supports Automatic Persisted Queries (APQ). A persisted query is a query string that's cached on the server side, along with its unique identifier (always its SHA-256 hash). Clients can send this identifier instead of the corresponding query string, thus reducing request sizes dramatically (response sizes are unaffected).

