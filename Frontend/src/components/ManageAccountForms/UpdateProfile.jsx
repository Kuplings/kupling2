import LoadingButton from "@mui/lab/LoadingButton";
import {
	Grid,
	Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React from "react";
import MyFormTextInput from "../InputFields/MyFormTextInput";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, userState } from "../../store/slices/userSlice";
import axios from "axios";
import { Box } from "@mui/system";
import { setNotificationMessage } from "../../store/slices/notificationSlice";

const UpdateProfile = () => {
	const user = useSelector(userState);
	const dispatch = useDispatch();

	const initialValues = {
		first_name: user.profile ? user.profile.first_name : "",
		last_name: user.profile ? user.profile.last_name : "",
		phone_no: user.profile ? user.profile.phone_no : "",
	};
	const validationSchema = Yup.object().shape({
		first_name: Yup.string()
			.min(3, "Не менее 3 символов")
			.max(100, "Не более 100 символов")
			.required("Обязательное поле"),
		last_name: Yup.string()
			.min(3, "Не менее 3 символов")
			.max(100, "Не более 100 символов")
			.required("Обязательное поле"),
		phone_no: Yup.string().required("Обязательное поле"),
	});
	const onSubmit = (
		{ first_name, last_name, phone_no },
		{ setSubmitting, resetForm, setFieldError }
	) => {
		axios
			.post("users/update-profile/", {
				first_name,
				last_name,
				phone_no,
			})
			.then((res) => {
				dispatch(
					setNotificationMessage("Профиль успешно обновлён!")
				);
				resetForm();
				dispatch(updateProfile(res.data));
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
			<Box
				sx={{
					marginTop: 6,
					marginBottom: 6,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography component="h1" variant="h5">
					Update Profile
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
											placeholder="Анна"
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
											label="Номер телефона"
											name="phone_no"
											placeholder="+79123456789"
										/>
									</Grid>
								</Grid>
								<LoadingButton
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 2, mb: 2 }}
									loading={props.isSubmitting}
								>
									Update Profile
								</LoadingButton>
							</Form>
						)}
					</Formik>
				</Box>
			</Box>
		</>
	);
};

export default UpdateProfile;
