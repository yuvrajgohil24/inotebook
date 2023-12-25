import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {

    const [credentials, setCredentials] = useState({email:"", password:""})
    let navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'             
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        console.log(json);

        if(json.success){
            //save the auth toke and redirect
            localStorage.setItem('token', json.authToken);
            props.showAlert("Logged In Successfully", "success")
            navigate("/");
        }
        else{
            props.showAlert("Incorrect Details", "danger")
        }
    }

    const OnChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='mt-3'>
            <h2 className='my-2'>Login to continue to iNotebook</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter your Email here" onChange={OnChange} value={credentials.email} name='email' />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type='password' className="form-control" id="password" onChange={OnChange} value={credentials.password} name="password" />
                </div>

                <button type="submit" className='btn btn-primary' >Submit</button>
            </form>
        </div>
    )
}

export default Login
