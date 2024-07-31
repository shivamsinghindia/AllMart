import React, { Fragment, useState, useEffect } from 'react'
import "./UpdatePassword.css";
import { useNavigate } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen.js'
import LockIcon from '@mui/icons-material/Lock.js'
import VpnKeyIcon from '@mui/icons-material/VpnKey.js'
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, updatePassword } from '../../actions/userAction'
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader';
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import MetaData from "../layout/metaData.js"

const UpdatePaswword = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();
    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

        const updatePasswordSubmit = (e) => {
            e.preventDefault();
        
            const myForm = new FormData();
            myForm.set("oldPassword", oldPassword);
            myForm.set("newPassword", newPassword);
            myForm.set("confirmPassword", confirmPassword);
            dispatch(updatePassword(myForm));
        }
    
      useEffect(() => {        
        if(error){
        //   if(error!=="Please login to view resource")
            alert.error(error);
          dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Password Updated Successfully");      
            navigate("/account");
            dispatch({
              type: UPDATE_PASSWORD_RESET,
            });
          }
      }, [dispatch, error, isUpdated, navigate, alert]);
      
    
    



    return (
        <Fragment>
        {
            loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Change Password"/>
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">

                        <h2 className="updatePasswordHeading">Update Password</h2>

                        <form
                            className='updatePasswordForm'
                            onSubmit={updatePasswordSubmit}
                        >
                            
                            <div className="loginPassword">
                                <VpnKeyIcon />
                                <input
                                    type="password"
                                    placeholder="Old Password"
                                    required
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>

                            <div className="loginPassword">
                                <LockOpenIcon />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                            />
                            </div>
                                <div className="loginPassword">
                                <LockIcon />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <input
                            type='submit'
                            value="Change"
                            className='updatePasswordBtn'
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

export default UpdatePaswword