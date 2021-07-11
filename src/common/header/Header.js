import React,{Fragment} from 'react';
import './Header.css';
import logo from '../../assets/logo.svg'
import Button from "@material-ui/core/Button";

const Header = props => {
    return(
    <header>
        <div>
            <img className={"logo"} src = {logo} alt={"logo"}/>
            <div className={"login"}>
                <Button variant="contained" color={"default"} >Login</Button>
            </div>
        </div>
    </header>
    );
}

export default Header;