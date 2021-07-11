import Header from "../common/header/Header";
import React from "react";

export default function Controller(){

    return (
        <div>
            <Header heading="Final" />
            <div className={"header"}></div>
            {/*<div className="component-body-container">
                <Link to="/add">
                    <button className="custom-btn add-btn">Add</button>
                </Link>

                <div className="grid-container heading-container">
                    <span className="grid-item name-heading">Name</span>
                    <span className="grid-item phone-heading">Phone</span>
                </div>

                {
                    subscribersList.map(sub => {
                        return <div key={sub.id} className="grid-container">
                            <span className="grid-item">{sub.name}</span>
                            <span className="grid-item">{sub.phone}</span>
                            <span className="grid-item action-btn-container">
                  <button className="custom-btn delete-btn" onClick={()=>deleteSubscriberHandler(sub.id)}>Delete</button>
                </span>
                        </div>
                    })
                }
            </div>*/}
        </div>
    );
}