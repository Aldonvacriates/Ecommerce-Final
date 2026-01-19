import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";
import styles from './auth-styles';
import { useNavigate } from "react-router-dom";

const Register = () => {
  return <div>Register page</div>;
};

export default Register;
