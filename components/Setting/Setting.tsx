'use client'

import { useOutsideClick } from '@/hooks/useOutsideClick'
import styles from './Setting.module.scss'
import { useCallback, useState } from 'react'
import { ThemeValue } from '@/types'

const colors: ThemeValue[] = ['595fe7', 'FFB81A', 'E32A40']

const MIN_TIME = 1
const MAX_TIME = 120

const Setting = ({
    handleClickOutside,
    timeSetting,
    focusTime,
    breakTime,
    relaxTime,
    theme,
    changeTheme,
}: {
    handleClickOutside: () => void
    timeSetting: (fTime: number, bTime: number, rTime: number) => void
    focusTime: number
    breakTime: number
    relaxTime: number
    theme: ThemeValue
    changeTheme: (c: ThemeValue) => void
}) => {
    const [fTime, setFTime] = useState(focusTime)
    const [bTime, setBTime] = useState(breakTime)
    const [rTime, setRTime] = useState(relaxTime)

    const handleOutsideClick = useCallback(() => {
        handleClickOutside()
    }, [handleClickOutside])

    const ref = useOutsideClick<HTMLDivElement>(handleOutsideClick)

    const clampTime = (value: number): number => {
        if (Number.isNaN(value)) return MIN_TIME
        return Math.min(Math.max(value, MIN_TIME), MAX_TIME)
    }

    const handleClick = () => {
        const validF = clampTime(fTime)
        const validB = clampTime(bTime)
        const validR = clampTime(rTime)

        timeSetting(validF, validB, validR)
        handleClickOutside()
    }

    const isActive = (color: ThemeValue): boolean => {
        return theme === color
    }

    return (
        <div className={styles.popup}>
            <div className={styles.setting} ref={ref}>
                <h3 className={styles.title}>настройки</h3>

                <div className={styles.timer}>
                    <h4 className={styles.subtitle}>#таймер</h4>
                    <p className={styles.description}>время (минуты)</p>
                    <div className={styles.inputs}>
                        <div className={styles.fieldset}>
                            <label className={styles.label} htmlFor="focus-input">
                                фокус
                            </label>
                            <input
                                id="focus-input"
                                className={styles.input}
                                type="number"
                                min={MIN_TIME}
                                max={MAX_TIME}
                                value={fTime}
                                onChange={(e) => setFTime(clampTime(Number(e.target.value)))}
                            />
                        </div>
                        <div className={styles.fieldset}>
                            <label className={styles.label} htmlFor="break-input">
                                перерыв
                            </label>
                            <input
                                id="break-input"
                                className={styles.input}
                                type="number"
                                min={MIN_TIME}
                                max={MAX_TIME}
                                value={bTime}
                                onChange={(e) => setBTime(clampTime(Number(e.target.value)))}
                            />
                        </div>
                        <div className={styles.fieldset}>
                            <label className={styles.label} htmlFor="relax-input">
                                отдых
                            </label>
                            <input
                                id="relax-input"
                                className={styles.input}
                                type="number"
                                min={MIN_TIME}
                                max={MAX_TIME}
                                value={rTime}
                                onChange={(e) => setRTime(clampTime(Number(e.target.value)))}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.theme}>
                    <h4 className={styles.subtitle}>#тема</h4>
                    <p className={styles.description}>цвет</p>
                    <div className={styles.colors}>
                        {colors.map((c) => (
                            <div
                                key={c}
                                role="button"
                                tabIndex={0}
                                className={`${styles.color} ${isActive(c) && styles.active}`}
                                style={{ backgroundColor: `#${c}` }}
                                onClick={() => changeTheme(c)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        changeTheme(c)
                                    }
                                }}
                                aria-pressed={isActive(c)}
                                aria-label={`Тема: ${c}`}
                            />
                        ))}
                    </div>
                </div>

                <button className={styles.btn} onClick={handleClick} type="button">
                    принять
                </button>
            </div>
        </div>
    )
}

export default Setting
