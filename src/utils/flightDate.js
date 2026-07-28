import dayjs from 'dayjs'

// Display/edit format requested by users: traditional DD/MM/YYYY HH:MM (not US-style).
export const FLIGHT_DATE_FORMAT = 'DD/MM/YYYY HH:mm'

// Legacy seed data (src/data/flights.js) stores only a time, e.g. "10:00", with no date part.
const LEGACY_TIME_ONLY = /^([01]?\d|2[0-3]):([0-5]\d)$/

/**
 * Parse a flight departure/arrival value coming from the backend (String field) or the
 * form (dayjs instance) into a valid dayjs object, or null if it can't be parsed.
 * Handles ISO strings, legacy "HH:mm"-only strings, and already-parsed dayjs values.
 */
export function parseFlightDateTime(value) {
  if (!value) return null
  if (dayjs.isDayjs(value)) return value.isValid() ? value : null

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (LEGACY_TIME_ONLY.test(trimmed)) {
      // Anchor legacy time-only values to today's date so they render instead of NaN.
      const anchored = dayjs(`${dayjs().format('YYYY-MM-DD')}T${trimmed}`)
      return anchored.isValid() ? anchored : null
    }
    const parsed = dayjs(trimmed)
    return parsed.isValid() ? parsed : null
  }

  const parsed = dayjs(value)
  return parsed.isValid() ? parsed : null
}

/** Format any stored/legacy value as DD/MM/YYYY HH:mm, falling back gracefully instead of NaN. */
export function formatFlightDateTime(value, fallback = '—') {
  const parsed = parseFlightDateTime(value)
  return parsed ? parsed.format(FLIGHT_DATE_FORMAT) : fallback
}

/** Normalize a form value (dayjs instance or string) into an ISO string for the API payload. */
export function toFlightDateTimePayload(value) {
  const parsed = parseFlightDateTime(value)
  return parsed ? parsed.toISOString() : ''
}
