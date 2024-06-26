import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Navbar from "../components/Navbar";
import { NumericFormat } from "react-number-format";
import {
	Container,
	CssBaseline,
	Divider,
	Grid,
	InputAdornment,
} from "@mui/material";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import MyFormSwitch from "../components/InputFields/MyFormSwitch";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import MyFormTextInput from "../components/InputFields/MyFormTextInput";
import MyFormCheckbox from "../components/InputFields/MyFormCheckbox";
import MyFormCategorySelect from "../components/InputFields/MyFormCategorySelect";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import MyFormConditionSelect from "../components/InputFields/MyFormConditionSelect";
import { CurrencyRuble } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setNotificationMessage } from "../store/slices/notificationSlice";
import { useNavigate } from "react-router-dom";

const PriceFormat = React.forwardRef(function NumberFormatCustom(props, ref) {
	const { onChange, ...other } = props;

	return (
		<NumericFormat {...other} {...props} getInputRef={ref} isNumericString />
	);
});

const CreateListing = () => {
	const [categoryTypes, setCategoryTypes] = React.useState([]);
	const [conditions, setConditions] = React.useState([]);
	const formRef = React.useRef(null);
	const mapContainer = React.useRef(null);
	const map = React.useRef(null);
	const [lng, setLng] = React.useState(37.617698);
	const [lat, setLat] = React.useState(55.755864);
	const [zoom, setZoom] = React.useState(9);

	React.useEffect(() => {
		axios
			.get("mart/category-types/")
			.then((res) => setCategoryTypes(res.data));
		axios.get("mart/listing-conditions-options/").then((res) => {
			setConditions(res.data);
		});
		if (map.current) return; // initialize map only once
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [lng, lat],
			zoom: zoom,
		});
		map.current.on("move", () => {
			setLng(map.current.getCenter().lng.toFixed(4));
			setLat(map.current.getCenter().lat.toFixed(4));
			setZoom(map.current.getZoom().toFixed(2));
		});
		let geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			mapboxgl: mapboxgl,
			marker: false,
		});
		map.current.addControl(geocoder);
		map.current.addControl(new mapboxgl.NavigationControl());
		map.current.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
			})
		);
		let marker = new mapboxgl.Marker({});

		function add_marker(event) {
			var coordinates = event.lngLat;
			marker.setLngLat(coordinates).addTo(map.current);
		}
		map.current.on("click", add_marker);
		// eslint-disable-next-line
	}, []);

	const initialValues = {
		title: "",
		description: "",
		category: "",
		offer_delivery: false,
		price: "",
		public_meetup: false,
		door_pickup: false,
		drop_off: false,
		images: null,
		condition: "",
	};

	const validationSchema = Yup.object().shape({
		title: Yup.string()
			.min(3, "Не менее 3 символов")
			.max(255, "Не более 255 символов")
			.required("Обязательное поле"),
		description: Yup.string().required("Обязательное поле"),
		category: Yup.string().required("Обязательное поле"),
		offer_delivery: Yup.boolean().required("Обязательное поле"),
		price: Yup.number().required("Обязательное поле"),
		public_meetup: Yup.boolean().required("Обязательное поле"),
		door_pickup: Yup.boolean().required("Обязательное поле"),
		drop_off: Yup.boolean().required("Обязательное поле"),
		images: Yup.mixed().required("Обязательное поле"),
		condition: Yup.string().required("Обязательное поле"),
	});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const onSubmit = (values, { setSubmitting, setFieldError, resetForm }) => {
		const formData = new FormData();
		values.images.forEach((img, index) => {
			formData.append(`images[${index}]image`, img);
		});
		let formDataObj = {
			title: values.title,
			description: values.description,
			condition: values.condition,
			price: values.price,
			offer_delivery: values.offer_delivery,
			public_meetup: values.public_meetup,
			door_pickup: values.door_pickup,
			drop_off: values.drop_off,
			location_longitude: lng,
			location_latitude: lat,
			category: values.category,
		};
		Object.keys(formDataObj).forEach((key) => {
			formData.append(key, formDataObj[key]);
		});
		axios({
			method: "post",
			url: "mart/create-listing/",
			data: formData,
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((res) => {
				// ! Notfy and redirect to Home Page
				setSubmitting(false);
				dispatch(
					setNotificationMessage("Объявление успешно создано")
				);
				navigate("/");
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
			<Container component="main" maxWidth="md">
				<CssBaseline />
				<Box
					sx={{
						marginTop: 6,
						marginBottom: 6,
					}}
				>
					<Typography
						sx={{ textAlign: "center", mb: 2 }}
						component="h1"
						variant="h5"
					>
						Создать новую покупку
					</Typography>
					<Formik
						enableReinitialize={true}
						initialValues={initialValues}
						validationSchema={validationSchema}
						onSubmit={onSubmit}
					>
						{({ setFieldValue, values, errors, isSubmitting }) => (
							<Form ref={formRef}>
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Детали покупки
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<MyFormTextInput
											label="Название"
											name="title"
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormTextInput
											label="Описание"
											name="description"
											multiline
											rows={4}
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormCategorySelect
											label="Категория"
											name="category"
											items={categoryTypes}
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormConditionSelect
											label="Состояние"
											name="condition"
											items={conditions}
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormSwitch
											label="Необходима доставка"
											name="offer_delivery"
											type="checkbox"
										/>
									</Grid>
								</Grid>
								<Divider sx={{ my: 2 }} />
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Желаемая цена
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<MyFormTextInput
											label="Желаемая цена"
											name="price"
											icon={<CurrencyRuble />}
											InputProps={{
												inputComponent: PriceFormat,
												startAdornment: (
													<InputAdornment position="start">
														<CurrencyRuble />
													</InputAdornment>
												),
											}}
										/>
									</Grid>
								</Grid>
								<Divider sx={{ my: 2 }} />
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Загрузить изображение
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<input
											accept="image/png, image/jpeg, image/jpg, image/x-png"
											style={{ display: "none" }}
											id="raised-button-file"
											multiple
											type="file"
											onChange={(event) => {
												const uplaod_img = Array.from(
													event.currentTarget.files
												);
												if (
													uplaod_img &&
													uplaod_img.length > 0
												) {
													setFieldValue(
														"images",
														Array.from(
															event.currentTarget
																.files
														)
													);
												} else {
													setFieldValue(
														"images",
														null
													);
												}
											}}
										/>
										<label htmlFor="raised-button-file">
											<Button
												color="primary"
												variant="raised"
												component="span"
											>
												Загрузить...
											</Button>
										</label>

										{values.images ? (
											<Typography sx={{ my: 2 }}>
												{`${values.images.length} Изображения выбраны`}
											</Typography>
										) : null}

										{errors.images ? (
											<Typography
												color="error"
												sx={{ mt: 1 }}
											>
												{errors.images}
											</Typography>
										) : null}

										<Box
											sx={{
												display: "flex",
												flexWrap: "wrap",
											}}
										>
											{values.images
												? values.images.map(
														(img, i) => (
															<img
																style={{
																	marginRight: 3,
																	marginBottom: 3,
																}}
																key={i}
																height="50"
																width="70"
																src={URL.createObjectURL(
																	img
																)}
																alt={URL.createObjectURL(
																	img
																)}
															/>
														)
												  )
												: null}
										</Box>
									</Grid>
								</Grid>
								<Divider sx={{ my: 2 }} />
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Необходимость доставки
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<MyFormCheckbox
											label="Приеду сам(а)"
											name="public_meetup"
											type="checkbox"
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormCheckbox
											label="Нужна доставка"
											name="door_pickup"
											type="checkbox"
										/>
									</Grid>
									<Grid item xs={12}>
										<MyFormCheckbox
											label="Drop Off"
											name="drop_off"
											type="checkbox"
										/>
									</Grid>
								</Grid>
								<Divider sx={{ my: 2 }} />
								<Typography
									component="h1"
									variant="h5"
									sx={{ mb: 2 }}
								>
									Моё местоположение
								</Typography>
								<Box
									sx={{
										height: {
											sm: "20rem",
											xs: "25rem",
										},
									}}
									ref={mapContainer}
									fullWidth
								/>
								<Divider sx={{ my: 2 }} />
								<LoadingButton
									type="submit"
									variant="contained"
									loading={isSubmitting}
								>
									Опубликовать
								</LoadingButton>
							</Form>
						)}
					</Formik>
				</Box>
			</Container>
		</>
	);
};

export default CreateListing;
