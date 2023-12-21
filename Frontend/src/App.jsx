import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket"; 

import PrivateRoute from "./components/Routes/PrivateRoute";
import PublicRoute from "./components/Routes/PublicRoute";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EmailConfirmation from "./pages/EmailConfirmation";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
	removeTokens,
	setTokens,
	tokensState,
} from "./store/slices/tokensSlice";
import { setUser } from "./store/slices/userSlice";
import NotFound from "./pages/NotFound";
import ManageAccount from "./pages/ManageAccount";
import {
	notificationState,
	removeNotificationMessage,
} from "./store/slices/notificationSlice";
import { Alert, Snackbar } from "@mui/material";


import CreateListing from "./pages/CreateListing";
import ListingDetail from "./pages/ListingDetail";
import CategoryListing from "./pages/CategoryListing";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import ListingMessages from "./pages/ListingMessages"

function App() {
	const getNewToken = (refresh) => {
		const newToken = axios
			.post("token/refresh/", {
				refresh,
			})
			.then((res) => {
				if (res.status === 200) {
					return res.data.access;
				}
			})
			.catch((_) => {
				return null;
			});
		return newToken;
	};
	const tokens = useSelector(tokensState);
	const dispatch = useDispatch();
	const notification = useSelector(notificationState);

	React.useEffect(() => {
		if (tokens.access) {
			axios
				.post("token/verify/", {
					token: tokens.access,
				})
				.then((res) => {
					if (res.status === 200) {
						axios.defaults.headers.common[
							"Authorization"
						] = `Bearer ${tokens.access}`;
					}
				})
				.catch(async (err) => {
					const newToken = await getNewToken(tokens.refresh);
					if (newToken) {
						dispatch(setTokens({ ...tokens, access: newToken }));
						axios.defaults.headers.common[
							"Authorization"
						] = `Bearer ${tokens.access}`;
					} else dispatch(removeTokens());
				});
			axios
				.get("authentication/users/me/", {
					headers: {
						Authorization: `Bearer ${tokens.access}`,
					},
				})
				.then((res) => {
					dispatch(setUser(res.data));
				});
		} else dispatch(removeTokens());
		// eslint-disable-next-line
	}, [tokens]);

	const [messageHistory, setMessageHistory] = useState([]);
	const [welcomeMessage, setWelcomeMessage] = useState("");
	const { readyState } = useWebSocket("ws://127.0.0.1:8000/", {
    onOpen: () => {
      console.log("Connected!");
    },
    onClose: () => {
      console.log("Disconnected!");
    },
	onMessage: (e) => {
		const data = JSON.parse(e.data);
		switch (data.type) {
			case "welcome_message":
				setWelcomeMessage(data.message);
				break;
			case 'chat_message_echo':
				setMessageHistory((prev) => prev.concat(data));
				break;
			default:
				console.error("Unknown message type: " + data.type);
				break;
		}
	}
  });
 
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];

	return (
		<>
			<Snackbar
				open={Boolean(notification.message)}
				autoHideDuration={6000}
				onClose={() => dispatch(removeNotificationMessage())}
			>
				<Alert
					elevation={6}
					variant="filled"
					severity="success"
					sx={{ width: "100%" }}
					onClose={() => dispatch(removeNotificationMessage())}
				>
					{notification.message}
				</Alert>
			</Snackbar>
			<BrowserRouter>
				<Routes>
					<Route path="*" element={<NotFound />} />
					<Route path="/404" element={<NotFound />} />
					<Route exact path="/" element={<Home />} />
					<Route path="/signup" element={<PublicRoute />}>
						<Route path="/signup" element={<Signup />} />
					</Route>
					<Route path="/login" element={<PublicRoute />}>
						<Route path="/login" element={<Login />} />
					</Route>
					<Route path="/reset-password" element={<PublicRoute />}>
						<Route
							path="/reset-password"
							element={<ResetPassword />}
						/>
					</Route>
					<Route
						path="/reset-password-confirm/:uid/:token"
						element={<ResetPasswordConfirm />}
					/>
					<Route
						path="/email-confirmation/:uid/:token"
						element={<EmailConfirmation />}
					/>
					<Route path="/account" element={<PrivateRoute />}>
						<Route path="/account" element={<ManageAccount />} />
					</Route>
					<Route path="/my-listings" element={<PrivateRoute />}>
						<Route path="/my-listings" element={<MyListings />} />
					</Route>
					<Route path="/messages" element={<PrivateRoute />}>
						<Route path="/messages" element={<ListingMessages 
							messageHistory={messageHistory} welcomeMessage={welcomeMessage} connectionStatus={connectionStatus}
						/>} />
					</Route>
					<Route path="/create-listing" element={<PrivateRoute />}>
						<Route
							path="/create-listing"
							element={<CreateListing />}
						/>
					</Route>
					<Route path="/listings/:slug" element={<ListingDetail />} />
					<Route
						path="/listings/:slug/edit"
						element={<EditListing />}
					/>
					<Route
						path="/categories/:slug"
						element={<CategoryListing />}
					/>
				</Routes>
			</BrowserRouter>

		</>
		
	);
}

export default App;
