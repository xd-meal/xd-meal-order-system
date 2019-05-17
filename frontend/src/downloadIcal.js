import ical from 'ical-generator'
import moment from 'moment'
let cal = ical({ domain: 'github.com', name: 'my first iCal' })

cal.createEvent({
    start: moment(),
    end: moment().add(3, 'minute'),
    timestamp: moment(),
    summary: 'XXX红烧排骨饭',
    description: 'XXX红烧排骨饭2',
})
let string = cal.toString();
console.log(string)
let blob = new Blob([string], {
    type: 'text/calendar',
})
let a = document.createElement('a')
let url = window.URL.createObjectURL(blob)
let filename = 'date.ics'
a.href = url
a.download = filename
a.click()
window.URL.revokeObjectURL(url)
