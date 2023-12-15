import React, { useContext, useEffect, useState } from "react";
import { SensorContext } from "../App";

const GitLabAuth = () => {
	const [user, setUserState] = useState(null);
    const [userName, setUserName] = useState(null);
    const { setUser, setSelectedDatastream, setSelectedSensors } = useContext(SensorContext)!;

	useEffect(() => {
		const fetchData = async (code: string) => {
			try {
                // Send a POST request to obtain an access token from GitLab
				const response = await fetch("https://gitlab.lrz.de/oauth/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						client_id: process.env.REACT_APP_GITLAB_CLIENT_ID,
                        client_secret: process.env.REACT_APP_GITLAB_CLIENT_SECRET,
                        code,
                        grant_type: "authorization_code",
                        redirect_uri: process.env.REACT_APP_REDIRECT_URI,
					}),
				});
				const data = await response.json();
                // If an access token is obtained, fetch user profile
                if (data.access_token) {
                    const userProfile = await fetch('https://gitlab.lrz.de/api/v4/user', {
                        headers: {
                            'Authorization': `Bearer ${data.access_token}`,
                        }
                    }); 
                    const userProfileData = await userProfile.json();
                    setUser(userProfileData);
                    setUserState(userProfileData)
                    setUserName(userProfileData.name);
                    // Store user data in local storage
                    localStorage.setItem('user', JSON.stringify(userProfileData));
                }
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

        // Check if user data is stored in local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
             // If stored data exists, update state and context with stored user data
            const storedUserData = JSON.parse(storedUser);
            setUser(storedUserData);
            setUserState(storedUserData);
            setUserName(storedUserData.name);
        }

        // Parse the authorization code from the URL parameters
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");

        // If an authorization code is present, fetch user data
		if (code) {
			fetchData(code);
		}
	}, []);

	const handleLogin = () => {
		// Redirect the user to GitLab for authentication
        window.location.href = `https://gitlab.lrz.de/oauth/authorize?client_id=${process.env.REACT_APP_GITLAB_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=api`
	};

    const handleLogOut= () => {
        setUser(null);
        setUserName(null);
        setUserState(null);
        // Resets everything to the "default view"
        setSelectedDatastream(null);
        setSelectedSensors([]);
        localStorage.clear();
    }

	return (
		<div>
			{!user ? (
				<button className="buttons" onClick={handleLogin}>Login with GitLab</button>
			) : (
				<div>
                    <button className="buttons" onClick={handleLogOut}>Log out</button>
				</div>
			)}
		</div>
	);
};

export default GitLabAuth;
