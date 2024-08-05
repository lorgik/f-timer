'use client'

import styles from './Timer.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useNow } from '@/hooks/useNow'

const Timer = ({
  minutes,
  status,
  changeStatus,
  iteration,
}: {
  minutes: number
  status: string
  changeStatus: (status: string) => void
  iteration: number
}) => {
  const seconds = minutes * 60

  const [startAt, setStartAt] = useState<number | undefined>()
  const [initialTimer, setInitialTimer] = useState(0)

  const audioPunchRef = useRef<HTMLAudioElement>(null)

  const now = useNow(1000, startAt)

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
      audioPunchRef.current.load()
      audioPunchRef.current.play()
    }
    window.navigator.vibrate([
      100, 30, 100, 30, 100, 200, 200, 30, 200, 30, 200, 200, 100, 30, 100, 30, 100,
    ])
  }

  const isTimerEnd = Math.floor(timer / 1000) <= 0

  useEffect(() => {
    if (isTimerEnd) {
      console.log(iteration)

      setTimeout(() => {
        if (iteration === 7) {
          changeStatus('отдых')
        } else if (iteration % 2 === 1) {
          changeStatus('перерыв')
        } else {
          changeStatus('фокусировка')
        }
        setStartAt(undefined)
      }, 100)
    }
  }, [isTimerEnd])

  useEffect(() => {
    if (status === 'фокусировка') {
      document.title = `${getTime(timer)} - Время фокуса`
    } else if (status === 'перерыв') {
      document.title = `${getTime(timer)} - Время перерыва`
    } else {
      document.title = `${getTime(timer)} - Время отдыха`
    }
  }, [timer])

  function getTime(timer: number): string {
    let seconds: string | number = timer / 1000
    let minutes: string | number = Math.floor(seconds / 60)
    seconds = Math.floor(seconds - minutes * 60)

    if (Math.floor(minutes / 10) === 0) {
      minutes = `0${minutes}`
    }

    if (Math.floor(seconds / 10) === 0) {
      seconds = `0${seconds}`
    }

    return `${minutes}:${seconds}`
  }

  return (
    <>
      <audio ref={audioPunchRef} src="/audio/punch.mp3"></audio>
      <p className={styles.timer}>{getTime(timer)}</p>
      <button className={styles.btn} onClick={toggleTimer}>
        {!startAt ? 'старт' : 'стоп'}
      </button>
    </>
  )
}

export default Timer
