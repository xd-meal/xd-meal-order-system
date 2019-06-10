import {collectQuestionDetail, Question, collectCal, findNameAndChoose} from "./utils";
import {GetRestoreVar, userProfile} from "./core";

let last = "";
let timer = null;

export function startIcalCollection (questions: Question[]) {
    if (timer) {
        clearInterval(timer);
    }

    timer = setInterval(() => {
        let change = collectQuestionDetail(questions);
        if (last !== change) {
            if (chrome.storage && chrome.storage.sync && chrome.storage.sync.set) {
                chrome.storage.sync.set({ICAL: collectCal(questions)}, function () {
                });
            }
            last = change;
        }
    }, 30);
}

let HasSet = false;
let lastName = null;
let lastDepartment = null;
let nameTimer = null;

export function startNameAndDepSelector (questions: Question[]) {
    if (nameTimer) {
        clearInterval(nameTimer);
    }
    nameTimer = setInterval(() => {
        GetRestoreVar().then((userProfile: userProfile) => {
            let shouldRefresh = false;
            if (lastName !== userProfile.YOUR_NAME) {
                lastName = userProfile.YOUR_NAME;
                shouldRefresh = true;
            }
            if (lastDepartment !== userProfile.DEPARTMENT) {
                lastDepartment = userProfile.DEPARTMENT;
                shouldRefresh = true;
            }
            if (shouldRefresh) {
                findNameAndChoose(questions, lastName, lastDepartment);
            }
        });
    }, 30);
}
