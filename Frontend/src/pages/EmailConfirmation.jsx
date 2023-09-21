import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";

const EmailConfirmation = () => {
	const [error, setError] = useState(null);
	const [isActivated, setIsActivated] = useState(false);
	const { uid, token } = useParams();
	useEffect(() => {
		axios
			.post("authentication/users/activation/", {
				uid,
				token,
			})
			.then((res) => {
				if (res.status === 204) {
					setIsActivated(true);
				}
			})
			.catch(({ response }) => {
				if (response) {
					let errors = response.data;
					let errorKeys = Object.keys(errors);
					errorKeys.forEach((val) => {
						if (Array.isArray(errors[val]))
							setError(errors[val][0]);
						else setError(errors[val]);
					});
				}
			});
	}, [uid, token]);
	return (
		<>
			<Navbar />
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "90vh",
				}}
			>
				{!isActivated ? (
					<>
						<Typography variant="h4">
							{!error ? "Обработка..." : <>{error}</>}
						</Typography>
					</>
				) : (
					<>
						<Typography variant="h4">
							Почта подтверждёна и аккаунт активирован
						</Typography>
					</>
				)}
				<Link style={{ textDecoration: "none" }} to="/">
					<Button
						variant="contained"
						sx={{ color: "white", marginTop: "1rem" }}
						startIcon={<ArrowBack />}
					>
						Скорее к покупкам!
					</Button>
				</Link>
			</Box>
		</>
	);
};

export default EmailConfirmation;
