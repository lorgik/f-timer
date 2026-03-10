'use client'

import styles from './Timer.module.scss'
import { memo, useEffect, useRef, useState } from 'react'
import { useNow } from '@/hooks/useNow'
import { Status } from '@/types'

const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const Timer = memo(
    ({
        minutes,
        status,
        changeStatus,
        iteration,
    }: {
        minutes: number
        status: Status
        changeStatus: (command: Status | 'next') => void
        iteration: number
    }) => {
        const seconds = minutes * 60
        const [startAt, setStartAt] = useState<number | undefined>()
        const [initialTimer, setInitialTimer] = useState(0)
        const audioPunchRef = useRef<HTMLAudioElement>(null)

        const now = useNow(1000, startAt !== undefined)

        const timeFromStart = now - (startAt ?? now)
        const timer = seconds * 1000 - timeFromStart - initialTimer

        const toggleTimer = () => {
            if (startAt) {
                setInitialTimer(timeFromStart + initialTimer)
                setStartAt(undefined)
            } else {
                setStartAt(Date.now())
            }

            if (audioPunchRef.current) {
                audioPunchRef.current.currentTime = 0
                audioPunchRef.current.play().catch(() => {})
            }

            if (typeof window.navigator.vibrate === 'function') {
                window.navigator.vibrate([100, 30, 100, 30, 100])
            }
        }

        const isTimerEnd = Math.floor(timer / 1000) <= 0

        useEffect(() => {
            if (isTimerEnd) {
                const timeoutId = setTimeout(() => {
                    changeStatus('next')
                    setStartAt(undefined)
                }, 100)

                return () => clearTimeout(timeoutId)
            }
        }, [isTimerEnd, changeStatus])

        useEffect(() => {
            setStartAt(undefined)
            setInitialTimer(0)
        }, [minutes])

        useEffect(() => {
            const titles: Record<Status, string> = {
                фокусировка: 'Время фокуса',
                перерыв: 'Время перерыва',
                отдых: 'Время отдыха',
            }
            document.title = `${formatTime(timer)} - ${titles[status]}`
        }, [timer, status])

        return (
            <>
                <audio ref={audioPunchRef} src="/audio/punch.mp3" preload="auto" />
                <p className={styles.timer} role="timer" aria-live="polite">
                    {formatTime(timer)}
                </p>
                <button className={styles.btn} onClick={toggleTimer} aria-pressed={!!startAt}>
                    {!startAt ? 'старт' : 'стоп'}
                </button>
            </>
        )
    }
)

Timer.displayName = 'Timer'

export default Timer
