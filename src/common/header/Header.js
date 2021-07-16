import React, {useEffect, useState} from 'react';
import './Header.css';
import logo from '../../assets/logo.svg'
import Button from "@material-ui/core/Button";
import Modal,{setAppElement} from "react-modal";
import {Box, makeStyles, Tab, Tabs, FormControl,TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

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

const Header = () => {
    const [login,setLogin] = useState(false);
    const [register,setRegister] = useState(false);
    const [modalIsOpen,setModalIsOpen] = useState(false);

    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClose = (e) => {
        setModalIsOpen(false)
    };

    useEffect(()=>{
        Modal.setAppElement('body');
    })

    document.querySelectorAll(" p * div ")
    return(
    <header>
        <div>
            <img className={"logo"} src = {logo} alt={"logo"}/>
            <div className={"login"}>
                <Button variant="contained" color={"default"} onClick={()=>setModalIsOpen(true)}>Login</Button>
            </div>
                <Modal className={"modal"} isOpen= {modalIsOpen} onRequestClose={handleClose}>
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" className={classes.tab}>
                        <Tab label="LOGIN" {...a11yProps(0)} />
                        <Tab label="REGISTER" {...a11yProps(1)} />
                    </Tabs>
            <TabPanel value={value} index={0}>
                <FormControl>
                    <TextField id="username" label="Username *" color="secondary" />
                    <br/>
                    <TextField
                        id="password"
                        label="Password *"
                        color="secondary"
                    />
                    <br/><br/>
                    <div className={"MuiButton-label"}>
                    <Button variant="contained" color={"primary"}>Login</Button>
                    </div>
                </FormControl>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <FormControl>
                    <TextField id="firstName" label="First Name *" color="secondary" />
                    <br/>
                    <TextField
                        id="lastName" label="Last Name*" color="secondary"
                    />
                    <br/>
                    <TextField id="email" label="Email *" color="secondary" />
                    <br/>
                    <TextField
                        id="password" label="Password *" color="secondary"
                    />
                    <br/>
                    <TextField
                        id="contactNo" label="Contact No. *" color="secondary"
                    />
                    <br/><br/>
                    <div className={"MuiButton-label"}>
                        <Button variant="contained" color={"primary"}>Register</Button>
                    </div>
                </FormControl>
            </TabPanel>
                </Modal>
        </div>
    </header>
    );
};
export default Header;