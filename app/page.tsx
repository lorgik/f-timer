'use client'

import { useEffect, useRef, useState } from 'react'
import Setting from '@/components/Setting/Setting'
import Timer from '@/components/Timer/Timer'
import styles from './page.module.scss'
import Image from 'next/image'

export default function Home() {
  const [status, setStatus] = useState('фокусировка')
  const [iteration, setIteration] = useState(1)
  const [focusTime, setFocusTime] = useState(30)
  const [breakTime, setBreakTime] = useState(5)
  const [relaxTime, setRelaxTime] = useState(15)
  const [isSetting, setIsSetting] = useState(false)
  const [theme, setTheme] = useState('595fe7')

  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    let fTime = Number(localStorage.getItem('focusTime'))
    let bTime = Number(localStorage.getItem('breakTime'))
    let rTime = Number(localStorage.getItem('relaxTime'))

    if (fTime && bTime && rTime) {
      setFocusTime(fTime)
      setBreakTime(bTime)
      setRelaxTime(rTime)
    }

    if (localStorage.getItem('theme')) {
      setTheme(localStorage.getItem('theme') || '{}')
    }
  }, [])

  const timeSetting = (fTime: number, bTime: number, rTime: number) => {
    setFocusTime(fTime)
    setBreakTime(bTime)
    setRelaxTime(rTime)
    localStorage.setItem('focusTime', String(fTime))
    localStorage.setItem('breakTime', String(bTime))
    localStorage.setItem('relaxTime', String(relaxTime))
  }

  function isActive(currentStatus: string) {
    return status === currentStatus
  }

  function changeStatus(status: string) {
    setStatus(status)
    setIteration((prev) => prev + 1)

    if (audioRef.current) {
      audioRef.current.play()
    }

    if (iteration === 8) {
      setIteration(1)
    }
  }

  function handleClickOutside() {
    setIsSetting(false)
  }

  function changeTheme(color: string) {
    localStorage.setItem('theme', color)
    setTheme(color)

    // root.setAttribute('style', `--color-primary: #${theme}`)
    // if (theme === 'FFB81A') {
    //   root.style.setProperty('--color-white', '#684800')
    // } else {
    //   root.style.setProperty('--color-white', '#ffffff')
    // }
  }

  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty('--color-primary', `#${theme}`)

    if (theme === 'FFB81A') {
      root.style.setProperty('--color-white', '#684800')
      root.style.setProperty('--color-black', '#ffffff')
    } else {
      root.style.setProperty('--color-white', '#ffffff')
      root.style.setProperty('--color-black', '#172a35')
    }
  }, [theme])

  return (
    <main className={styles.main}>
      {isSetting && (
        <Setting
          handleClickOutside={handleClickOutside}
          timeSetting={timeSetting}
          focusTime={focusTime}
          breakTime={breakTime}
          relaxTime={relaxTime}
          theme={theme}
          changeTheme={changeTheme}
        />
      )}
      <audio ref={audioRef} src="/audio/ring.mp3"></audio>
      <header className={styles.header}>
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <div>
          <button className={styles.btn} onClick={() => setIsSetting((prev) => !prev)}>
            настройки
          </button>
        </div>
      </header>

      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${isActive('фокусировка') && styles.active}`}
            onClick={() => changeStatus('фокусировка')}
          >
            фокусировка
          </button>
          <button
            className={`${styles.tab} ${isActive('перерыв') && styles.active}`}
            onClick={() => changeStatus('перерыв')}
          >
            перерыв
          </button>
          <button
            className={`${styles.tab} ${isActive('отдых') && styles.active}`}
            onClick={() => changeStatus('отдых')}
          >
            отдых
          </button>
        </div>
        {isActive('фокусировка') && (
          <Timer
            minutes={focusTime}
            status={status}
            changeStatus={changeStatus}
            iteration={iteration}
          />
        )}
        {isActive('перерыв') && (
          <Timer
            minutes={breakTime}
            status={status}
            changeStatus={changeStatus}
            iteration={iteration}
          />
        )}
        {isActive('отдых') && (
          <Timer
            minutes={relaxTime}
            status={status}
            changeStatus={changeStatus}
            iteration={iteration}
          />
        )}
      </div>
    </main>
  )
}
