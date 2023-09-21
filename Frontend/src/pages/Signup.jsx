import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import MyFormTextInput from "../components/InputFields/MyFormTextInput";
import { Form, Formik } from "formik";
import MuiLink from "@mui/material/Link";
import * as Yup from "yup";
import { PersonAddAltOutlined } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { setNotificationMessage } from "../store/slices/notificationSlice";

const Signup = () => {
	const initialValues = {
		first_name: "",
		last_name: "",
		email: "",
		phone_no: "",
		password: "",
		confirm_password: "",
	};
	const validationSchema = Yup.object({
		first_name: Yup.string()
			.min(3, "Не менее 3 символов")
			.max(100, "Не более 100 символов")
			.required("Обязательное поле"),
		last_name: Yup.string()
			.min(3, "Не менее 3 символов")
			.max(100, "Не более 100 символов")
			.required("Обязательное поле"),
		email: Yup.string()
			.email("Некорректная почта")
			.required("Обязательное поле"),
		phone_no: Yup.string().required("Обязательное поле"),
		password: Yup.string()
			.min(8, "Не менее 8 символов")
			.max(255, "Не более 255 символов")
			.required("Обязательное поле"),
		confirm_password: Yup.string()
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
		{ first_name, last_name, email, password, phone_no },
		{ setSubmitting, resetForm, setFieldError }
	) => {
		axios
			.post("authentication/users/", {
				first_name,
				last_name,
				email,
				password,
				phone_no,
			})
			.then((res) => {
				if (res.status === 201) {
					resetForm();
					dispatch(
						setNotificationMessage(
							"Мы отправили Вам на почту ссылку для подтверждения регистрации. Пожалуйста, перейдите по ссылке, чтобы подтвердить почту и завершить регистрацию."
						)
					);
				}
				setSubmitting(false);
			})
			.catch(({ response }) => {
				if (response) {
					let errors = response.data;
					let errorKeys = Object.keys(errors);
					errorKeys.map((val) => {
						if (Array.isArray(errors[val])) {
							setFieldError(val, errors[val][0]);
							return null;
						} else {
							setFieldError(val, errors[val]);
							return null;
						}
					});
				}
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
						<PersonAddAltOutlined />
					</Avatar>
					<Typography component="h1" variant="h5">
						Регистрация
					</Typography>
					<Box component="div" sx={{ mt: 3 }}>
						<Formik
							enableReinitialize={true}
							initialValues={initialValues}
							validationSchema={validationSchema}
							onSubmit={onSubmit}
						>
							{(props) => (
								<Form>
									<Grid container spacing={2}>
										<Grid item xs={12} sm={6}>
											<MyFormTextInput
												label="Имя"
												name="first_name"
												id="first_name"
												placeholder="Анна"
												autoFocus
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<MyFormTextInput
												label="Фамилия"
												name="last_name"
												placeholder="Анисина"
											/>
										</Grid>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Email"
												name="email"
												placeholder="example@gmail.com"
											/>
										</Grid>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Номер телефона"
												name="phone_no"
												placeholder="+79123456789"
											/>
										</Grid>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Пароль"
												name="password"
												type="password"
											/>
										</Grid>
										<Grid item xs={12}>
											<MyFormTextInput
												label="Подтверждение пароля"
												name="confirm_password"
												type="password"
											/>
										</Grid>
									</Grid>
									<LoadingButton
										type="submit"
										fullWidth
										variant="contained"
										sx={{ mt: 3, mb: 2 }}
										loading={props.isSubmitting}
									>
										Регистрация
									</LoadingButton>
									<Grid container justifyContent="flex-end">
										<Grid item>
											<Link
												to="/login"
												style={{
													textDecoration: "none",
												}}
											>
												<MuiLink
													component="p"
													variant="body2"
												>
													Уже есть аккаунт?
													Вход
												</MuiLink>
											</Link>
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
export default Signup;
