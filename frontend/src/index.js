
function ApiGet (url, data) {
    return new Promise(function (resole, reject) {
      chrome.runtime.sendMessage({
        type: 'http',
        method: 'get',
        url,
        data,
      }, function(response) {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(respone.response)
        }
      });
    })
  }
  
  function GetRestoreVar() {
    return new Promise(function(resolve) {
        chrome.storage.sync.get(["YOUR_NAME", "DEPARTMENT"], function(value) {
          resolve(value);
        });
      })
  }
  let YOUR_NAME, DEPARTMENT;
  GetRestoreVar().then(function(result) {
    YOUR_NAME = result.YOUR_NAME;
    DEPARTMENT = result.DEPARTMENT;
    var timer = setInterval(function() {
      if (checkIfLoaded()) {
        clearInterval(timer);
        startInject();
      }
    }, 100);
  });
  
  function checkIfLoaded() {
    return document.querySelector(".question-list .question");
  }
  function findNameAndChoose(questions) {
    // find 名字
    questions.some(question => {
      let regex = new RegExp(YOUR_NAME);
      let dep = new RegExp(DEPARTMENT);
      return question.list.some(item => {
        let name = item.textContent;
        if (regex.test(name) && dep.test(name)) {
          item.click();
        }
      });
    });
  }
  
  function collectQuestion(dom) {
    var title = dom.querySelector(".question-title").textContent;
    var answer = dom.querySelector(".question-body");
    // 判断是否是 select
    var selectBox = answer.querySelectorAll(".selectbox ul li");
    if (selectBox.length > 0) {
      // 说明是 select 输出 type
      var list = [];
      selectBox.forEach(function(item, index) {
        list.push(item);
      });
      return {
        title,
        type: "select",
        list
      };
    }
    var checkOptions = answer.querySelectorAll(".checkbox-option");
    if (checkOptions.length > 0) {
      var checkOpts = [];
      checkOptions.forEach(item => {
        checkOpts.push(item);
      });
      return {
        title,
        type: "checkbox",
        list: checkOpts
      };
    }
  }
  
  const supplierReg = new RegExp("（供应商(.*?)）");
  function findAllSupplier(questions) {
    let data = {};
    questions.map(question => {
      question.list.forEach(option => {
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
      });
    });
    return data;
  }
  
  function startInject() {
    let doms = Array.from(document.querySelectorAll(".question-list .question"));
    let questions = [];
    doms.forEach(function(dom) {
      questions.push(collectQuestion(dom));
    });
    findNameAndChoose(questions);
    let suppliers = findAllSupplier(questions);
    let contorl = document.createElement("div");
    let str = ``;
    for (let name in suppliers) {
      str += `<div class="supplier" data-value="${name}">${name}</div>`;
    }
    str += `<div class="supplier" data-value="random">随机大法</div>`
    str += `<div class="supplier" data-value="buffet">全部自助餐</div>`
    contorl.innerHTML = str;
    contorl.style = "position: fixed;top: 10px;left: 10px;background: #fff; cursor: pointer;";
    contorl.addEventListener("click", function() {
      let target = event.target;
      let value = target.dataset.value;
      if (value === 'buffet') {
        questions.slice(1).forEach(function (question) {
          // 直接选择第二个就是自助餐
          let index = 1
          question.list[index].querySelector("input").click();
        })
        return 
      }
      if (value === 'random') {
        questions.slice(1).forEach(function (question) {
          // 移除不吃饭选项
          let list = question.list.slice(1);
          let index = parseInt(list.length * Math.random())
          list[index].querySelector("input").click();
        })
        return
      }
      if (value && suppliers[value]) {
        suppliers[value].forEach(function(supplier) {
          supplier.option.querySelector("input").click();
        });
      }
    });
    document.body.appendChild(contorl);
  }
  