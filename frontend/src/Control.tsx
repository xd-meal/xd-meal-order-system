import * as React from "react";
import {downloadIcal, Question, SupplierMap} from "./utils";
import {startIcalCollection, startNameAndDepSelector} from "./timers";

export declare interface ControlProps {
    suppliers: SupplierMap;
    questions: Question[];
}

export class Control extends React.Component<ControlProps> {
    constructor (props: ControlProps) {
        super(props);
        startIcalCollection(this.props.questions);
        startNameAndDepSelector(this.props.questions);
    }

    downloadICal () {
        downloadIcal(this.props.questions);
    }

    selectBuffet () {
        let questions = this.props.questions;
        questions.slice(1).forEach(function (question) {
            // 直接选择第二个就是自助餐
            let index = 1;
            question.list[index].querySelector("input").click();
        });
    }

    selectRandom () {
        let questions = this.props.questions;
        questions.slice(1).forEach(function (question) {
            // 移除不吃饭选项
            let list = question.list.slice(1);
            let index = parseInt(String(list.length * Math.random()));
            list[index].querySelector("input").click();
        });
    }

    selectBySuppliers (value) {
        this.props.suppliers[value].forEach(function (supplier) {
            supplier.option.querySelector("input").click();
        });
    }

    static cal () {
        let progressBar = document.querySelector('.s-main  .progress');
        let bound = progressBar.getBoundingClientRect();
        console.log(bound.left);
        let xdMeal:HTMLElement = document.querySelector('.xd-meal .control-wrap');
        let xdMealBound = xdMeal.getBoundingClientRect();
        if (bound.width < document.body.clientWidth - xdMealBound.width - 40) {
            xdMeal.setAttribute('style', `top: ${bound.bottom}px;left: ${bound.right + 20}px;`);
        } else {
            xdMeal.setAttribute('style', `top: ${bound.bottom}px;left: ${bound.right - xdMealBound.width}px;`);
        }
    }

    componentDidMount () {
        document.onscroll = Control.cal;
        window.onresize = Control.cal;
        window.onload = Control.cal;
    }

    render () {
        const suppliers: SupplierMap = this.props.suppliers;
        return (
            <div className="control-wrap">
                {Object.keys(suppliers).map(key => (
                    <div
                        className="supplier"
                        key={key}
                        onClick={this.selectBySuppliers.bind(this, key)}
                    >
                        {key}
                    </div>
                ))}
                <div className="supplier" onClick={this.selectRandom.bind(this)}>
                    随机大法
                </div>
                <div className="supplier" onClick={this.selectBuffet.bind(this)}>
                    全部自助餐
                </div>
                <button className="btn" onClick={this.downloadICal.bind(this)}>
                    下载日历
                </button>
            </div>
        );
    }
}
