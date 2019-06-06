// @ts-ignore
import ical from "ical-generator";
// @ts-ignore
import moment from "moment";
import {string} from "prop-types";

const QUESTION_SELECTORS = ".question-list .question";

export function getQuestionDom (): HTMLElement[] {
    return Array.prototype.map.call(<NodeListOf<HTMLElement>>document.querySelectorAll(QUESTION_SELECTORS), _ => _);
}

export function checkIfLoaded (): HTMLElement {
    return document.querySelector(QUESTION_SELECTORS);
}

export const SUPPLIER_REG = new RegExp("（供应商(.*?)）");

export const TIME_REG = /.*?([早中午晚][饭]).*?(\d+)[月](\d+)[日]/;

export function findInfo (title) {
    let matches = title.match(TIME_REG);
    if (matches.length >= 4) {
        return {
            time: {
                午饭: {
                    start: {
                        hour: 12,
                        minute: 0
                    },
                    end: {
                        hour: 13,
                        minute: 30
                    }
                },
                晚饭: {
                    start: {
                        hour: 18,
                        minute: 0
                    },
                    end: {
                        hour: 19,
                        minute: 30
                    }
                }
            }[matches[1]],
            month: parseInt(matches[2]),
            day: parseInt(matches[3])
        };
    }
    return null;
}

export function collectCal (questions: Question[]): string {
    let name = '一周选饭';
    let nameDom = document.querySelector(".survey-header-title");
    if (nameDom) {
        name = nameDom.textContent;
    }
    let cal = ical({
        domain: 'iceprosurface.com',
        name: name
    });
    questions.forEach(function (question) {
        if (question.type !== "select") {
            for (let q of question.list) {
                if (q.querySelector("input").checked) {
                    let info = findInfo(question.title);
                    if (info)
                        cal.createEvent({
                            start: moment()
                                .set("month", info.month - 1)
                                .set("date", info.day)
                                .set("hour", info.time.start.hour)
                                .set("minute", info.time.start.minute),
                            end: moment()
                                .set("month", info.month - 1)
                                .set("date", info.day)
                                .set("hour", info.time.end.hour)
                                .set("minute", info.time.end.minute),
                            timestamp: moment(),
                            summary: cleanSummary(q.textContent)
                        });
                }
            }
        }
    });
    return cal.toString();
}

function cleanSummary (text) {
    let t = String(text).trim();
    t.replace(/[ \n\r\t]/g, '');
    return t
}
/**
 * @desc 用于下载
 * @param questions
 */
export function downloadIcal (questions: Question[]) {
    let str: string = collectCal(questions);
    let blob = new Blob([str], {
        type: "text/calendar"
    });
    let a = document.createElement("a");
    let url = window.URL.createObjectURL(blob);
    let filename = "date.ics";
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

/**
 * @desc 将 question 转化为一个可以用来作为标识的字符串用于判断是否被改变了
 * @param {Question[]} questions
 * @return {string}
 */
export function collectQuestionDetail (questions: Question[]): string {
    return questions
        .map(function (question) {
            if (question.type !== "select") {
                for (let q of question.list) {
                    if (q.querySelector("input").checked) {
                        let info = findInfo(question.title);
                        if (info) {
                            return question.title + q.textContent;
                        }
                    }
                }
            }
        })
        .join(",");
}

/**
 * @desc 查找名字并选中目标名字
 * @param {Question[]} questions
 * @param {string} YOUR_NAME
 * @param {string} DEPARTMENT
 */
export function findNameAndChoose (questions: Question[], YOUR_NAME: string, DEPARTMENT: string) {
    // find 名字
    questions.forEach((question: Question) => {
        let regex = new RegExp(YOUR_NAME || "unset");
        let dep = new RegExp(DEPARTMENT || "unset");
        return question.list.forEach((item: HTMLElement) => {
            let name = item.textContent;
            if (regex.test(name) && dep.test(name)) {
                item.click();
            }
        });
    });
}

export declare interface Question {
    title: string,
    type: 'select' | 'checkbox',
    list: HTMLElement[]
}

/**
 * @param {HTMLElement} dom
 * @return {Question}
 */
export function collectQuestion (dom: HTMLElement): Question {
    let title: string = dom.querySelector(".question-title").textContent;
    let answer: HTMLElement = dom.querySelector(".question-body");
    // 判断是否是 select
    let selectBox: NodeListOf<HTMLElement> = answer.querySelectorAll(".selectbox ul li");
    if (selectBox.length > 0) {
        // 说明是 select 输出 type
        let list: HTMLElement[] = [];
        selectBox.forEach(function (item: HTMLElement) {
            list.push(item);
        });
        return {
            title,
            type: "select",
            list
        };
    }
    let checkOptions: NodeListOf<HTMLElement> = answer.querySelectorAll(".checkbox-option");
    if (checkOptions.length > 0) {
        let checkOpts: HTMLElement[] = [];
        checkOptions.forEach((item: HTMLElement) => {
            checkOpts.push(item);
        });
        return {
            title,
            type: "checkbox",
            list: checkOpts
        };
    }
}

export declare interface Supplier {
    origin: Question,
    option: HTMLElement
}

export declare interface SupplierMap {
    [key: string]: Supplier[]
}

/**
 * @desc 找出所有的供应商
 * @param {Question[]} questions
 * @return SupplierMap
 */
export function findAllSupplier (questions: Question[]): SupplierMap {
    let data: SupplierMap = {};
    questions.forEach((question: Question) => {
        question.list.forEach((option: HTMLElement) => {
            let text: string = option.textContent;
            if (SUPPLIER_REG.test(text)) {
                let datas = text.match(SUPPLIER_REG);
                let name: string = datas[1];
                let output: Supplier = {
                    origin: question,
                    option
                };
                if (data[name]) {
                    data[name].push(output);
                } else {
                    data[name] = [output];
                }
            }
        });
    });
    return data;
}
