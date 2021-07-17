import Header from "../common/header/Header";
import React,{Fragment} from "react";
import Home from "./home/Home";

export default function Controller(){

    return (
        <Fragment>
        <div>
            <Header heading="Final" />
            <div className={"header"}></div>
        </div>
        <div>
            <Home />
        </div>
        </Fragment>
    );
}