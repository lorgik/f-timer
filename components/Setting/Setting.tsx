'use client'

import { useOutsideClick } from '@/hooks/useOutsideClick'
import styles from './Setting.module.css'
import { useState } from 'react'

const colors = ['595fe7', 'FFB81A', 'E32A40']

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
  theme: string
  changeTheme: (c: string) => void
}) => {
  const [fTime, setFTime] = useState(focusTime)
  const [bTime, setBTime] = useState(breakTime)
  const [rTime, setRTime] = useState(relaxTime)

  const ref = useOutsideClick(handleClickOutside)

  function handleClick() {
    timeSetting(fTime, bTime, rTime)
    handleClickOutside()
  }

  function isActive(color: string) {
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
              <label className={styles.label}>фокус</label>
              <input
                className={styles.input}
                type="number"
                value={fTime}
                onChange={(e) => setFTime(Number(e.target.value))}
              />
            </div>
            <div className={styles.fieldset}>
              <label className={styles.label}>перерыв</label>
              <input
                className={styles.input}
                type="number"
                value={bTime}
                onChange={(e) => setBTime(Number(e.target.value))}
              />
            </div>
            <div className={styles.fieldset}>
              <label className={styles.label}>отдых</label>
              <input
                className={styles.input}
                type="number"
                value={rTime}
                onChange={(e) => setRTime(Number(e.target.value))}
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
                className={`${styles.color}  ${isActive(c) && styles.active}`}
                style={{ backgroundColor: `#${c}` }}
                onClick={() => changeTheme(c)}
                key={c}
              ></div>
            ))}
          </div>
        </div>
        <button className={styles.btn} onClick={handleClick}>
          принять
        </button>
      </div>
    </div>
  )
}

export default Setting
