'use client';

import { useCallback, useEffect, useRef, useState } from 'react'

interface FetchOptions extends RequestInit {
    immediate?: boolean;
    initialData?: any;
}

interface UseFetchReturn {
    data: any;
    error: any;
    loading: boolean;
    refetch: (overrideUrl?: string, overrideInit?: RequestInit) => Promise<void>;
    setData: React.Dispatch<React.SetStateAction<any>>;
    result: any;
}

const useFetch = (url: string, options: FetchOptions = {}): UseFetchReturn => {
    const {
        immediate = true,
        initialData = [],
        ...requestInit
    } = options;

    const [data, setData] = useState(initialData)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(Boolean(immediate && url))
    const abortRef = useRef<AbortController | null>(null)
    const requestInitRef = useRef(requestInit)
    const [result, setResult] = useState(null)

    useEffect(() => {
        requestInitRef.current = requestInit
    }, [requestInit])

    const fetchData = useCallback(async (overrideUrl?: string, overrideInit?: RequestInit) => {
        const targetUrl = overrideUrl || url
        if (!targetUrl) return

        if (abortRef.current) {
            abortRef.current.abort()
        }

        const controller = new AbortController()
        abortRef.current = controller

        setLoading(true)
        setError(null)

        try {
            const res = await fetch(targetUrl, {
                ...requestInitRef.current,
                ...(overrideInit || {}),
                signal: controller.signal
            })

            if (!res.ok) {
                const message = await res.text().catch(() => '')
                throw new Error(message || 'Failed to fetch')
            }

            const raw = await res.json()
            setResult(raw)
            const payload = raw?.data ?? raw
            setData(payload)
        } catch (err: any) {
            if (err?.name === 'AbortError') return
            setError(err?.message || 'Failed to fetch')
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false)
            }
        }
    }, [url])

    useEffect(() => {
        if (!immediate) return
        fetchData()
        return () => {
            if (abortRef.current) abortRef.current.abort()
        }
    }, [fetchData, immediate])

    return {
        data,
        error,
        loading,
        refetch: fetchData,
        setData,
        result
    };
};

export default useFetch
