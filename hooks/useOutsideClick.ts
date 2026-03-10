import { useEffect, useRef } from 'react'

export const useOutsideClick = <T extends HTMLElement = HTMLElement>(callback: () => void) => {
    const ref = useRef<T | null>(null)

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (
                ref.current &&
                event.target instanceof Node &&
                !ref.current.contains(event.target)
            ) {
                callback()
            }
        }

        document.addEventListener('click', handleClick, true)
        return () => document.removeEventListener('click', handleClick, true)
    }, [callback])

    return ref
}
