const errorHandler = (err, req, res, next) => {
  // ── Always log the full stack server-side for debugging ──
  console.error('━━━━━━━━━━━━━━━━━━━━ ERROR ━━━━━━━━━━━━━━━━━━━━');
  console.error('Route   :', `${req.method} ${req.originalUrl}`);
  console.error('Name    :', err.name);
  console.error('Code    :', err.code);
  console.error('Message :', err.message);
  console.error('Stack   :', err.stack || err);
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Helper to send a consistent, descriptive payload
  const fail = (status, title, trigger, hint, extra = {}) =>
    res.status(status).json({
      success: false,
      error: {
        title,                                        // short label of the error type
        trigger,                                      // what specifically caused it
        hint,                                         // what to check / how to fix
        ...extra,
      },
      // kept for backward-compatibility with any frontend already reading `message`
      message: `${title}: ${trigger}`,
      // include the route so you can see on the client where it happened
      route: `${req.method} ${req.originalUrl}`,
    });

  // ── 1. Mongoose ValidationError ──
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
      value: e.value,
    }));
    return fail(
      400,
      'Validation failed',
      `One or more fields are invalid: ${errors.map((e) => e.field).join(', ')}`,
      'Check the "errors" array — each entry shows the field, the value sent, and why it was rejected.',
      { errors }
    );
  }

  // ── 2. Mongoose CastError (bad ObjectId, wrong type, etc.) ──
  if (err.name === 'CastError') {
    return fail(
      400,
      'Invalid value type',
      `The value "${err.value}" for field "${err.path}" could not be cast to type ${err.kind}.`,
      `Make sure the "${err.path}" you pass is the correct format (e.g., a 24-char MongoDB ObjectId, a number, etc.).`,
      { field: err.path, value: err.value, expectedType: err.kind }
    );
  }

  // ── 3. Mongo duplicate key (unique index violation) ──
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(', ') || 'unknown field';
    return fail(
      409,
      'Duplicate value',
      `A record with this ${field} already exists.`,
      `Use a different ${field}, or fetch the existing record instead of creating a new one.`,
      { field, value: err.keyValue }
    );
  }

  // ── 4. Multer file-too-large ──
  if (err.code === 'LIMIT_FILE_SIZE') {
    return fail(
      400,
      'File too large',
      'The uploaded file exceeds the 5 MB limit set by Multer.',
      'Compress the image or increase the `limits.fileSize` value in your Multer config.'
    );
  }

  // ── 5. Multer unexpected field ──
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return fail(
      400,
      'Unexpected file field',
      `Multer received a file in field "${err.field}" but the route only expects the configured field name.`,
      'Ensure the frontend FormData key matches the field name used in `upload.single(...)` or `upload.array(...)`.',
      { receivedField: err.field }
    );
  }

  // ── 6. Cloudinary / upload misconfiguration ──
  if (
    err.http_code ||
    /cloudinary|cloud_name|api_key|api_secret/i.test(err.message || '')
  ) {
    return fail(
      503,
      'Image upload service unavailable',
      `Cloudinary rejected the request: ${err.message || 'unknown reason'}.`,
      'Verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the backend .env, then restart the server.'
    );
  }

  // ── 7. Custom image-type rejection from your multer filter ──
  if (err.message?.startsWith('Only image files')) {
    return fail(
      400,
      'Invalid file type',
      err.message,
      'Only JPEG, PNG, GIF or WebP files are accepted. Convert the file before uploading.'
    );
  }

  // ── 8. JWT / auth errors ──
  if (err.name === 'JsonWebTokenError') {
    return fail(
      401,
      'Invalid token',
      'The JWT signature could not be verified.',
      'Log in again to obtain a fresh token. If it keeps failing, confirm JWT_SECRET matches between sign and verify.'
    );
  }
  if (err.name === 'TokenExpiredError') {
    return fail(
      401,
      'Token expired',
      `The JWT expired at ${err.expiredAt}.`,
      'Log in again — or implement a refresh-token flow.'
    );
  }

  // ── 9. Body-parser payload too large ──
  if (err.type === 'entity.too.large') {
    return fail(
      413,
      'Payload too large',
      'The JSON body sent exceeds the limit configured in express.json().',
      'Increase the `limit` option (e.g., express.json({ limit: "10mb" })) or send less data.'
    );
  }

  // ── 10. Malformed JSON body ──
  if (err.type === 'entity.parse.failed') {
    return fail(
      400,
      'Malformed JSON',
      'The request body could not be parsed as valid JSON.',
      'Check for trailing commas, unquoted keys, or missing braces in the JSON you sent.'
    );
  }

  // ── 11. CORS rejection ──
  if (err.message?.startsWith('CORS')) {
    return fail(
      403,
      'CORS blocked',
      err.message,
      'Add the requesting origin to your CORS allowlist in the backend (app.use(cors({ origin: [...] }))).'
    );
  }

  // ── 12. Timeout / network to external service ──
  if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
    return fail(
      504,
      'Upstream service unreachable',
      `Could not connect to an external service (${err.code}).`,
      'Check that the third-party API is up and that your server has outbound network access.'
    );
  }

  // ── 13. Fallback — anything we did not explicitly catch ──
  const status = err.statusCode || err.status || 500;
  return fail(
    status,
    status === 500 ? 'Internal server error' : 'Request failed',
    err.message || 'An unexpected error occurred with no message.',
    status === 500
      ? 'Check the server logs (the full stack was printed above) to find the exact line that threw.'
      : 'See the "trigger" field for details.'
  );
};

export default errorHandler;