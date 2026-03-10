export enum Theme {
    Blue = '595fe7',
    Yellow = 'FFB81A',
    Red = 'E32A40',
}

export type ThemeValue = `${Theme}`

export const isValidTheme = (value: string | null): value is ThemeValue => {
    return value === Theme.Blue || value === Theme.Yellow || value === Theme.Red
}

export type Status = 'фокусировка' | 'перерыв' | 'отдых'
