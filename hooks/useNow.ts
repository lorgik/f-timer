import { useLayoutEffect, useRef, useState } from 'react'

function useNow(updateInterval: number, enabled: any, cb?: any) {
  const cbRef = useRef(cb)
  cbRef.current = cb
  const [now, setNow] = useState(Date.now())

  useLayoutEffect(() => {
    if (!enabled) {
      return
    }

    setNow(Date.now())
    cbRef.current?.(Date.now())

    const interval = setInterval(() => {
      setNow(Date.now())
      cbRef.current?.(Date.now())
    }, updateInterval)

    return () => {
      clearInterval(interval)
    }
  }, [updateInterval, enabled])

  return now
}

export { useNow }
