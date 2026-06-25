'use client';

import { useEffect, useState } from 'react';

interface HealthPayload {
  status: string;
  environment: string;
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

    fetch(`${backendUrl}/health`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }
        return (await response.json()) as HealthPayload;
      })
      .then((data) => setHealth(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <h1>Handball Analytics MVP</h1>
      <p>Local project skeleton is running.</p>
      <p>
        Backend URL: <code>{process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000'}</code>
      </p>
      {loading && <p>Checking backend health...</p>}
      {!loading && error && <p>Backend health check failed: {error}</p>}
      {!loading && health && (
        <>
          <p>
            Backend health: <strong>{health.status}</strong>
          </p>
          <p>
            Environment: <strong>{health.environment}</strong>
          </p>
        </>
      )}
    </main>
  );
}
