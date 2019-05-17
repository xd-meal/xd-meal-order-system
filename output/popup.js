function getAll() {
    return new Promise(function(resolve) {
        chrome.storage.sync.get(['YOUR_NAME', 'DEPARTMENT'], function(value) {
            resolve(value)
        })
    })
}
let d = document.querySelector('#d')
let n = document.querySelector('#n')
let save = document.querySelector('#save')
getAll().then(function(result) {
    let { YOUR_NAME, DEPARTMENT } = result || {}
    d.value = DEPARTMENT
    n.value = YOUR_NAME
})
d.addEventListener('input', function(event) {
    chrome.storage.sync.set({ DEPARTMENT: event.currentTarget.value }, function() {})
})
n.addEventListener('input', function(event) {
    chrome.storage.sync.set({ YOUR_NAME: event.currentTarget.value }, function() {})
})

save.addEventListener('click', function(event) {
    chrome.storage.sync.get( ['ICAL'], function(v) {
        let blob = new Blob([v.ICAL], {
            type: 'text/calendar',
        })
        let a = document.createElement('a')
        let url = window.URL.createObjectURL(blob)
        let filename = 'date.ics'
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)
    })
})
