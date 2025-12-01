#!/bin/sh

# Create env.js dynamically from runtime variables
cat <<EOF > /usr/share/nginx/html/env.js
window.__env = {
  VITE_API_URL: "${VITE_API_URL}",
  VITE_AI_BASE_URL: "${VITE_AI_BASE_URL}"
};
EOF

# Start nginx
exec "$@"
