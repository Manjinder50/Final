import React, {useEffect, useState} from 'react';
import './Header.css';
import logo from '../../assets/logo.svg'
import Button from "@material-ui/core/Button";
import Modal,{setAppElement} from "react-modal";
import {Box, makeStyles, Tab, Tabs} from "@material-ui/core";
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
                    <Typography>{children}</Typography>
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
                Item One
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
                </Modal>
        </div>
    </header>
    );
};
export default Header;