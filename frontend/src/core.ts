export declare interface userProfile  {
    YOUR_NAME: string,
    DEPARTMENT: string
}
export function GetRestoreVar () {
    // @ts-ignore
    return new Promise(function (resolve) {
        if (chrome.storage && chrome.storage.sync && chrome.storage.sync.get) {
            chrome.storage.sync.get(["YOUR_NAME", "DEPARTMENT"], function (value: userProfile) {
                resolve(value);
            });
        } else {
            resolve({
                YOUR_NAME: 'icepro',
                DEPARTMENT: 'test dep'
            })
        }
    });
}
