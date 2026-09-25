import { useEffect, useState } from 'react';
import type { DemoMode, LoadState } from '../../types';
import { fetchProducts } from './api';

export function useProducts(mode: DemoMode) {
  const [result, setResult] = useState<{ mode: DemoMode; state: LoadState }>({
    mode,
    state: { status: 'loading' },
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setResult({ mode, state: { status: 'loading' } });
    fetchProducts(mode, controller.signal)
      .then((products) => {
        if (!controller.signal.aborted) {
          setResult({ mode, state: { status: 'success', products } });
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setResult({
          mode,
          state: {
            status: 'error',
            message: error instanceof Error ? error.message : 'Ndodhi një gabim i papritur.',
          },
        });
      });
    return () => controller.abort();
  }, [mode, attempt]);

  // Never expose a previous scenario's data as the newly selected scenario.
  // In particular, leaving the empty demo must not reconcile the real cart to [].
  const state: LoadState = result.mode === mode ? result.state : { status: 'loading' };
  return { state, retry: () => setAttempt((value) => value + 1) };
}
