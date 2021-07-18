import React, {Fragment} from 'react';
import Header from "../../common/header/Header";
import {makeStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import Typography from "@material-ui/core/Typography";

export default function Details({accessToken,setAccessToken,loginButton,setLoginButton}){
    const styles = makeStyles((theme) => ({

    }));
    const classes = styles();
    
    return(
        <Fragment>
            <Header accessToken={accessToken} loginButton={loginButton}
                    setAccessToken={setAccessToken} setLoginButton={setLoginButton}></Header>
            <Link to="/">
                <Typography id="backToHomeBtn" variant="button" display="block" gutterBottom>
                    {'<'} Back to Home
                </Typography>
            </Link>
        </Fragment>
    )
}