import React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingButton from "@mui/lab/LoadingButton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import MyFormTextInput from "../components/InputFields/MyFormTextInput";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { LockOpenOutlined } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setNotificationMessage } from "../store/slices/notificationSlice";

const ResetPasswordConfirm = () => {
	const params = useParams();
	const navigate = useNavigate();
	const initialValues = {
		new_password: "",
		confirm_new_password: "",
	};
	const validationSchema = Yup.object({
		new_password: Yup.string()
			.min(8, "Не менее 8 символов")
			.max(255, "Не более 255 символов")
			.required("Обязательное поле"),
		confirm_new_password: Yup.string()
			.min(8, "Не менее 8 символов")
			.max(255, "Не более 255 символов")
			.required("Обязательное поле")
			.when("password", {
				is: (val) => (val && val.length > 0 ? true : false),
				then: Yup.string().oneOf(
					[Yup.ref("password")],
					"Пароли не совпадает"
				),
			}),
	});
	const dispatch = useDispatch();
	const onSubmit = (
		{ new_password },
		{ setSubmitting, resetForm, setFieldError }
	) => {
		axios
			.post("authentication/users/reset_password_confirm/", {
				uid: params.uid,
				token: params.token,
				new_password,
			})
			.then((res) => {
				resetForm();
				setSubmitting(false);
				navigate("/login");
				dispatch(
					setNotificationMessage("Пароль удачно сброшен!")
				);
			})
			.catch(({ response }) => {
				let errors = response.data;
				let errorKeys = Object.keys(errors);
				errorKeys.forEach((val) => {
					if (Array.isArray(errors[val]))
						setFieldError("new_password", errors[val][0]);
					else setFieldError("new_password", errors[val]);
				});
				setSubmitting(false);
			});
	};

	return (
		<>
			<Navbar />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 6,
						marginBottom: 6,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOpenOutlined />
					</Avatar>
					<Typography component="h1" variant="h5">
						Смена пароля
					</Typography>
					<Box component="div" sx={{ mt: 3 }}>
						<Formik
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
						>
							{(props) => (
								<Form>
									<Grid container spacing={2}>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Новый пароль"
												name="new_password"
												type="password"
											/>
										</Grid>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Подтвердите новый пароль"
												name="confirm_new_password"
												type="password"
											/>
										</Grid>
										<Grid item xs={12}>
											<LoadingButton
												type="submit"
												fullWidth
												variant="contained"
												loading={props.isSubmitting}
											>
												Сменить пароль
											</LoadingButton>
										</Grid>
									</Grid>
								</Form>
							)}
						</Formik>
					</Box>
				</Box>
			</Container>
		</>
	);
};

export default ResetPasswordConfirm;
