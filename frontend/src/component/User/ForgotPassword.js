import React, { Fragment, useState, useEffect } from 'react'
import "./ForgotPassword.css";
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, forgotPassword } from '../../actions/userAction'
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';
import MetaData from "../layout/metaData.js"

const ForgotPassword = () => {


    const dispatch = useDispatch();
    const alert = useAlert();
    const { error, message, loading } = useSelector((state) => state.forgotPassword);

    const [email, setEmail] = useState("");

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();
    
        const myForm = new FormData();
    
        myForm.set("email", email);
        dispatch(forgotPassword(myForm));
    };
    
    useEffect(() => {
        if (error) {
          if(error!=="Please login to view resource")
            alert.error(error);
          dispatch(clearErrors());
        }
    
        if (message) {
            alert.success(message);
        }
    }, [dispatch, error, message, alert]);


    return (
    <Fragment>
        {
            loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Forgot Password"/>
                    <div className="forgotPasswordContainer">
                        <div className="forgotPasswordBox">

                        <h2 className="forgotPasswordHeading">Forgot Password</h2>

                        <form
                            className='forgotPasswordForm'
                            onSubmit={forgotPasswordSubmit}
                        >
                            
                            <div className="forgotPasswordEmail">
                            <MailOutlineIcon />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            </div>

                            <input
                            type='submit'
                            value="Send"
                            className='forgotPasswordBtn'
                            />
                        </form>

                        </div>
                    </div>
                </Fragment>
            )
        }
    </Fragment>
  )
}

export default ForgotPassword