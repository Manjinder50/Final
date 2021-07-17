import React, {useEffect, useState} from 'react';
import './Header.css';
import logo from '../../assets/logo.svg'
import Button from "@material-ui/core/Button";
import Modal,{setAppElement} from "react-modal";
import {Box, makeStyles, Tab, Tabs} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import {ValidatorForm,TextValidator} from 'react-material-ui-form-validator';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component={'div'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    tab: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Header (){
    const [login,setLogin] = useState(false);
    const [register,setRegister] = useState(false);
    const [modalIsOpen,setModalIsOpen] = useState(false);
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const [loginForm,setLoginForm] = useState({
        username: '',
        password: ''
    });

    const [registerForm,setRegisterForm] = useState({
        firstname: '',
        lastname: '',
        email: '',
        regPassword: '',
        contactNo: ''
    });

    const {username,password} = loginForm;
    const {firstname,lastname,email,regPassword,contactNo} = registerForm;
    const [loginMessage,setLoginMessage] = useState('');
    const [registrationSuccessMsg,setRegistrationSuccessMsg] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [loginButton, setLoginButton] = useState('Login');
    const [registerButton, setRegisterButton] = useState('Login');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClose = (e) => {
        setModalIsOpen(false)
    };

    const onSubmitLoginForm = async (e) => {

        //called on the event when submitting the form to prevent a browser reload/refresh
        e.preventDefault();
        let stringToEncode = username + ':' + password;
        let basicAuth = window.btoa(stringToEncode);
        const rawResponse = await fetch('http://localhost:8085/api/v1/auth/login', {
            method:'POST',
            headers:{
                'Authorization': `Basic ${basicAuth}`
            },
        });

        const response = await rawResponse.json();
        if(rawResponse.ok) {
            setAccessToken(rawResponse.headers.get('access-token'));
            setLoginButton('Logout');
            setLoginForm({
                username: '',
                password: ''
            });
            setLoginMessage('');
            handleClose();
        } else {
            const errorCode = rawResponse.status;
            const errorMsg = response.message;
            setLoginMessage(`${errorCode} : ${errorMsg}`);
        }

    }

    const handleLogout = async () => {
        const rawResponse = await fetch('http://localhost:8085/api/v1/auth/logout', {
            method:'POST',
            headers:{
                'Authorization': `Bearer ${accessToken}`
            },
        });

        if(rawResponse.ok) {
            setLoginButton('Login');
        }
    };

    const registerInputChangedHandler = (e) => {
        const state = registerForm;
        state[e.target.name] = e.target.value;
        setRegisterForm({...state})
    }

    const onSubmitRegisterForm = async (e) => {
        e.preventDefault();
        const body = {
            "email_address": registerForm.email,
            "first_name": registerForm.firstname,
            "last_name": registerForm.lastname,
            "mobile_number": registerForm.contactNo,
            "password": registerForm.regPassword
        }

        const rawResponse = await fetch('http://localhost:8085/api/v1/signup', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json;charset=UTF-8',
                'Content-Type': 'application/json'
            },
        });
        const response = await rawResponse.json();
        if (rawResponse.ok) {
            console.log(response);
            const registrationSuccessMessage = 'Registration Successful. Please Login!'
            setRegistrationSuccessMsg(registrationSuccessMessage);
        }
        else {
            console.log(response);
            const errorCode = rawResponse.status;
            const errorMsg = response.message;
            setRegistrationSuccessMsg(`${errorCode} : ${errorMsg}`);
        }
    }

    const loginInputChangedHandler = (e) => {
        const state = loginForm;
        state[e.target.name] = e.target.value;

        setLoginForm({...state});
    }

    useEffect(()=>{
        Modal.setAppElement('body');
    })

    document.querySelectorAll(" p * div ")
    return(
        <header>
            <div className={"logoContainer"}>
            <img className={"logo"} src = {logo} alt={"logo"}/>
        </div>
    <div className = "{headerButtonContainer}">
        {
            loginButton === 'Login' ?
                <Button className="header-btn" variant="contained" name={loginButton}
                        onClick={()=>setModalIsOpen(true)}>{loginButton}</Button> :
                <Button className="header-btn" variant="contained" name={loginButton}
                        onClick={handleLogout}>{loginButton}</Button>
        }
        <Modal className={"modal"} isOpen= {modalIsOpen} onRequestClose={handleClose}>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" className={classes.tab}>
                <Tab label="LOGIN" {...a11yProps(0)} />
                <Tab label="REGISTER" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <ValidatorForm className={"loginForm"} onSubmit={onSubmitLoginForm}>
                    <TextValidator
                        id="username"
                        label="Username *"
                        type="text"
                        name="username"
                        color="secondary"
                        onChange={loginInputChangedHandler}
                        value={username}
                        validators={['required']}
                        errorMessages={['required']}
                    ></TextValidator>
                    <br/>
                    <TextValidator
                        id="password"
                        type="password"
                        name="password"
                        color="secondary"
                        onChange={loginInputChangedHandler}
                        label="Password *"
                        value={password}
                        validators={['required']}
                        errorMessages={['required']}
                    ></TextValidator>
                    <br/><br/>
                    <p>{loginMessage}</p>
                    <div className={"MuiButton-label"}>
                        <Button className="loginButton" variant="contained" color={"primary"} type="submit">Login</Button>
                    </div>
                </ValidatorForm>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ValidatorForm className="registerForm" onSubmit={onSubmitRegisterForm} >
                    <TextValidator
                        id="firstname"
                        label="First Name *"
                        type="text"
                        name="firstname"
                        onChange={registerInputChangedHandler}
                        value={firstname}
                        validators={['required']}
                        errorMessages={['required']}
                    >
                    </TextValidator>

                    <TextValidator
                        id="lastname"
                        label="Last Name *"
                        type="text"
                        name="lastname"
                        onChange={registerInputChangedHandler}
                        value={lastname}
                        validators={['required']}
                        errorMessages={['required']}
                    ></TextValidator>

                    <TextValidator
                        id="email"
                        label="Email *"
                        type="text"
                        name="email"
                        onChange={registerInputChangedHandler}
                        value={email}
                        validators={['required']}
                        errorMessages={['required']}
                    ></TextValidator>

                    <TextValidator
                        id="regPassword"
                        label="Password *"
                        type="password"
                        name="regPassword"
                        onChange={registerInputChangedHandler}
                        value={regPassword}
                        validators={['required']}
                        errorMessages={['required']}
                    ></TextValidator>

                    <TextValidator
                        id="contactNo"
                        label="Contact No. *"
                        type="text"
                        name="contactNo"
                        onChange={registerInputChangedHandler}
                        value={contactNo}
                        validators={['required']}
                        errorMessages={['required']}
                    ></TextValidator>
                    <p>{registrationSuccessMsg}</p>
                    <br /><br />
                    <Button className="registerButton" name="Register" variant="contained" color="primary"
                            type="submit">Register</Button>
                </ValidatorForm>
            </TabPanel>
        </Modal>
    </div>
</header>
);
};


// WEBPACK FOOTER //
// src/common/header/Header.js