import React, { useState } from "react";
import Popup from "reactjs-popup";
import "./PopupComponent.css";
import "./RegisterPopUp"

const PopupComponent = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        console.log("Username:", username);
        console.log("Password:", password);
        // TODO: Implement login functionality
        // Currently the login always goes through
        // as long as there's anything in the username and password fields
        if (username && password) {
            const loggedIn = true;
            if (loggedIn) {
                setIsOpen(false);
                setIsLoggedIn(true);
            }
        } else {
            event.preventDefault();
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <p>{`${username} is logged in.`}</p>
            ) : (
                <Popup
                    trigger={
                        <button onClick={() => setIsOpen(true)}>
                            Open Login Popup
                        </button>
                    }
                    open={isOpen}
                    modal={true}
                >
                    <div className="custom-popup-content">
                        <h2>Login</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Username:
                                <br />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </label>
                            <label>
                                Password:
                                <br />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </label>
                            <br />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </Popup>
            )}
        </div>
    );
};

export default PopupComponent;
