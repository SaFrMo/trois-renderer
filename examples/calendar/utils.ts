import { Vector2 } from "three"
import { DateTime } from 'luxon'

export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const monthDayCounts = [31, 28, 31, 30, 31, 30, 31, 31, 31, 31, 30, 31]

export const getDayOfWeek = (date: string) => {
    return DateTime.fromISO(date).weekdayLong
}

export const getDayPositions = ({ month, spacer, topXY, year }:
    { month?: number, spacer?: THREE.Vector2, topXY?: THREE.Vector2, year?: number } = {}
) => {
    month = month ?? (new Date()).getMonth()
    year = year ?? (new Date()).getFullYear()
    const date = DateTime.fromISO(`${year}-${(month + 1).toString().padStart(2, '0')}-01`)

    spacer = spacer ?? new Vector2(1.1, -1.1)
    topXY = topXY ?? new Vector2()

    // prep output
    const output = [] as Array<Vector2>
    let currentRow = 0

    // figure out which day of the week we start on
    const startDayIndex = days.indexOf(date.weekdayLong)

    // build output
    const scratch = new Vector2()
    for (let i = 0; i < date.daysInMonth; i++) {
        const day = date.plus({ days: i })

        // increment current row if we're on a sunday and not the first date
        if (i !== 0 && day.weekdayLong === 'Sunday') {
            currentRow++
        }

        // get day index
        const dayIdx = days.indexOf(day.weekdayLong)

        // add day marker
        output.push(scratch.copy(spacer).multiply(new Vector2(dayIdx, currentRow)).clone())
    }

    return output
}