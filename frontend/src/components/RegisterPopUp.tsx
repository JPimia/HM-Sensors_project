import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './PopupComponent.css';
import bcrypt from 'bcryptjs-react';

const RegisterComponent = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isOpen, setIsOpen] = useState(false);

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

	const handleSubmit = (event: { preventDefault: () => void }) => {
		// TODO: Send username and pass to the backend
		if (username && password) {
			const saltRounds = 10;
			const hashedPassword = bcrypt.hashSync(password, saltRounds);
			console.log('Username:', username);
			console.log('Encrypted Password:', hashedPassword);
			setIsOpen(false); //please fucking close
		} else {
			// This is here until I figure out how to close this popup
			event.preventDefault();
		}
	};

	return (
		<div>
			<Popup
				trigger={
					<button onClick={ () => setIsOpen(!isOpen) }>
                        Register as a new user
					</button>
				}
				open={ isOpen }
				modal={ true }
			>
				<div className="custom-popup-content">
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
			</Popup>
		</div>
	);
};

export default RegisterComponent;
