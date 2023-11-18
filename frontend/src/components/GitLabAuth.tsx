import React, { useEffect, useState } from "react";

const GitLabAuth = ( { setUser }: any) => {
	const [user, setUserState] = useState(null);
    const [userName, setUserName] = useState(null);

	useEffect(() => {
		const fetchData = async (code: string) => {
			try {
				const response = await fetch("https://gitlab.lrz.de/oauth/token", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						client_id:
							"dd765912b52b6ab5d8a3c19c77a50a1761a17e940aa8bd34280abc67637b27fe",
						client_secret:
							"gloas-93dc98d366815c98c1484b02fa545f86065c2a26bad07eb49c2d4c5c4924215a",
						code,
						grant_type: "authorization_code",
						redirect_uri: "http://localhost:3000/",
					}),
				});
				const data = await response.json();
                console.log(data);
                if (data.access_token) {
                    console.log("toimii")
                    console.log(data.access_token)
                    setUser(data);
                    const userProfile = await fetch('https://gitlab.lrz.de/api/v4/user', {
                        headers: {
                            'Authorization': `Bearer ${data.access_token}`,
                        }
                    }); 
                    const userProfileData = await userProfile.json();
                    console.log(userProfileData);
                    setUserState(userProfileData)
                    setUserName(userProfileData.name);
                }
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
        

		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");

		if (code) {
			fetchData(code);
		}
	}, []);

	const handleLogin = () => {
		// Redirect the user to GitLab for authentication
		window.location.href =
			"https://gitlab.lrz.de/oauth/authorize?client_id=dd765912b52b6ab5d8a3c19c77a50a1761a17e940aa8bd34280abc67637b27fe&redirect_uri=http://localhost:3000/&response_type=code&scope=api";
	};

	return (
		<div>
			{!user ? (
				<button onClick={handleLogin}>Login with GitLab</button>
			) : (
				<div>
					<h2>Welcome {userName}</h2>
				</div>
			)}
		</div>
	);
};

export default GitLabAuth;
