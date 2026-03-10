'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Setting from '@/components/Setting/Setting'
import Timer from '@/components/Timer/Timer'
import styles from './page.module.scss'
import Image from 'next/image'
import { isValidTheme, Status, Theme, ThemeValue } from '@/types'

const safeSetItem = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value)
    } catch (e) {
        console.warn('Failed to save to localStorage:', e)
    }
}

export default function Home() {
    const [status, setStatus] = useState<Status>('фокусировка')
    const [iteration, setIteration] = useState(1)
    const [focusTime, setFocusTime] = useState(30)
    const [breakTime, setBreakTime] = useState(5)
    const [relaxTime, setRelaxTime] = useState(15)
    const [isSetting, setIsSetting] = useState(false)
    const [theme, setTheme] = useState<ThemeValue>(Theme.Blue)

    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const fTime = Number(localStorage.getItem('focusTime'))
        const bTime = Number(localStorage.getItem('breakTime'))
        const rTime = Number(localStorage.getItem('relaxTime'))

        if (fTime && bTime && rTime) {
            setFocusTime(fTime)
            setBreakTime(bTime)
            setRelaxTime(rTime)
        }

        const savedTheme = localStorage.getItem('theme')
        if (isValidTheme(savedTheme)) {
            setTheme(savedTheme)
        }

        if (audioRef.current) {
            audioRef.current.preload = 'auto'
            audioRef.current.load()
        }
    }, [])

    const timeSetting = useCallback((fTime: number, bTime: number, rTime: number) => {
        setFocusTime(fTime)
        setBreakTime(bTime)
        setRelaxTime(rTime)

        safeSetItem('focusTime', String(fTime))
        safeSetItem('breakTime', String(bTime))
        safeSetItem('relaxTime', String(rTime))
    }, [])

    function isActive(currentStatus: Status): boolean {
        return status === currentStatus
    }

    const changeStatus = useCallback(
        (command: Status | 'next') => {
            if (command === 'next') {
                const nextStatus: Status =
                    iteration === 7 ? 'отдых' : iteration % 2 === 1 ? 'перерыв' : 'фокусировка'

                setStatus(nextStatus)

                if (iteration === 7) {
                    setIteration(1)
                } else {
                    setIteration((prev) => prev + 1)
                }
            } else {
                setStatus(command)
            }

            if (audioRef.current) {
                audioRef.current.currentTime = 0
                audioRef.current.play().catch(() => {})
            }
        },
        [iteration]
    )

    const handleClickOutside = useCallback(() => {
        setIsSetting(false)
    }, [])

    const changeTheme = useCallback((color: ThemeValue) => {
        safeSetItem('theme', color)
        setTheme(color)
    }, [])

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

            <audio ref={audioRef} src="/audio/ring.mp3" preload="auto" />

            <header className={styles.header}>
                <Image src="/logo.svg" alt="logo" width={30} height={30} />
                <div>
                    <button
                        className={styles.btn}
                        onClick={() => setIsSetting((prev) => !prev)}
                        aria-label="Открыть настройки"
                        aria-expanded={isSetting}
                    >
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
