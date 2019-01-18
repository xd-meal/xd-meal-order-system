function checkIfLoaded () {
    return document.querySelector('.question-list .question');
}
var YOUR_NAME = "倪立冰";
var DEPARTMENT = "平台事业部"
var timer = setInterval(function () {
    if (checkIfLoaded()) {
        clearInterval(timer)
        startInject();
    }
}, 100);

function collectQuestion (dom) {
    var title = dom.querySelector('.question-title').textContent;
    var answer = dom.querySelector('.question-body');
    // 判断是否是 select
    var selectBox = answer.querySelectorAll('.selectbox ul li');
    if (selectBox.length > 0) {
        // 说明是 select 输出 type
        var list = []
        selectBox.forEach(function (item, index) {
            list.push(item);
        })
        return {
            title,
            type: 'select',
            list,
        }

    }
    var checkOptions = answer.querySelectorAll('.checkbox-option');
    if (checkOptions.length > 0) {
        var checkOpts = []
        checkOptions.forEach((item) => {
            checkOpts.push(item);
        })
        return {
            title,
            type: 'checkbox',
            list: checkOpts
        }
    }
}

function startInject () {
    let doms = Array.from(document.querySelectorAll('.question-list .question'));
    let questions = [];
    doms.forEach(function (dom) {
        questions.push(collectQuestion(dom))
    });
    // find 名字
    let name = questions.shift()
    let regex = new RegExp(YOUR_NAME);
    let dep = new RegExp(DEPARTMENT);
    name.list.forEach((item) => {
        let name = item.textContent;
        if (regex.test(name) && dep.test(name)) {
            item.click();
        }
    })
    let suppliers = findAllSupplier(questions);
    let contorl = document.createElement('div');
    let str = ``;
    for(let name in suppliers) {
        str += `<div class="supplier" data-value="${name}">${name}</div>`
    }
    contorl.innerHTML =  str;
    contorl.style = 'position: fixed;top: 10px;left: 10px;background: #fff;';
    contorl.addEventListener('click', function () {
        let target = event.target;
        let value = target.dataset.value;
        if (value && suppliers[value]) {
            suppliers[value].forEach(function (supplier) {
                supplier.option.querySelector('input').click();
            })
        }
    })
    document.body.appendChild(contorl);
}
const supplierReg = new RegExp('（供应商(.*?)）')
function findAllSupplier (questions) {
    let data = {}
    questions.map(question => {
        question.list.forEach((option) => {
            let text = option.textContent;
            if (supplierReg.test(text)) {
                let datas = text.match(supplierReg);
                let name = datas[1];
                let output = {
                    origin: question,
                    option
                };
                if (data[name]) {
                    data[name].push(output);
                } else {
                    data[name] = [output];
                }
            }
        })
    })
    return data;
}