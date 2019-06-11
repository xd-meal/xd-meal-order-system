import {
    checkIfLoaded,
    collectQuestion,
    findAllSupplier,
    getQuestionDom,
    Question
} from "./utils";
import * as React from "react";
import ReactDOM from "react-dom";
import {Control} from "./Control";

class App extends React.Component<{},
    { questions: Question[]; loaded: boolean }> {
    constructor (props) {
        super(props);

        this.state = {
            questions: [],
            loaded: false
        };
        let timer = setInterval(() => {
            if (checkIfLoaded()) {
                let doms = getQuestionDom();
                let questions: Question[] = [];
                doms.forEach(function (dom) {
                    questions.push(collectQuestion(dom));
                });
                this.setState({
                    loaded: true,
                    questions
                });
                clearInterval(timer);
            }
        }, 30);
    }
    render () {
        const suppliers = findAllSupplier(this.state.questions);
        const questions = this.state.questions;
        let control = null;
        if (this.state.loaded) {
            control = <Control suppliers={suppliers} questions={questions}/>;
        }

        return <div className="xd-meal">{control}</div>;
    }
}

var mountNode = document.createElement("div");
mountNode.setAttribute("meerkat", "");
document.body.appendChild(mountNode);


ReactDOM.render(<App/>, mountNode);
