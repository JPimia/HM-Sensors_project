import React, { useState } from 'react';
import './PopupComponent.css';
import bcrypt from 'bcryptjs-react';

const RegisterComponent = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [created, setCreated] = useState(false);

	const handleUsernameChange = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event: {
        target: { value: React.SetStateAction<string> };
    }) => {
		setPassword(event.target.value);
	};

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		// TODO: Check backend if username is available
		// TODO: Send username and pass to the backend
		event.preventDefault();
		if (username && password) {
			const saltRounds = 10;
			const hashedPassword = bcrypt.hashSync(password, saltRounds);
			
            try {
                const response = await fetch('https://suzbt4f677.execute-api.eu-central-1.amazonaws.com/alpha/userInfoFunction', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userName: username, passWord: password }),
                    mode: 'cors',
                });
        
                if (response.ok) {
                    console.log(response);
                    const jsonResponse = await response.json();
                    console.log(jsonResponse);
                    setCreated(true);
                } else {
                    console.error('Failed to register:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error registering user:', error);
            }
		}
	};

	return (
		<div>
			{created ? (
				<p>{`Username ${username} created.`}</p>
			) : (
				<div>
					<h2>Register</h2>
					<form onSubmit={ handleSubmit }>
						<label>
                        Username:
							<br />
							<input
								type="text"
								value={ username }
								onChange={ handleUsernameChange }
							/>
						</label>
						<label>
							<br />
                            Password:
							<br />
							<input
								type="password"
								value={ password }
								onChange={ handlePasswordChange }
							/>
						</label>
						<br />
						<button type="submit">Register</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default RegisterComponent;
