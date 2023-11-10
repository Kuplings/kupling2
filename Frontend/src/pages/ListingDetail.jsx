import {
	Card,
	CardActions,
	CardContent,
	Container,
	Divider,
	Grid,
	ImageList,
	ImageListItem,
	Typography,
	Button,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box } from "@mui/system";
import {
	Close,
	Done,
	MailOutlineOutlined,
	PhoneOutlined,
} from "@mui/icons-material";
import moment from "moment";
import 'moment/locale/ru';
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax


const ListingInfo = ({ label, data }) => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<Typography variant="body2" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{data}
			</Typography>
		</Box>
	);
};

const ListingDetail = () => {
	const [listing, setListing] = React.useState(null);
	const { slug } = useParams();
	const mapContainer = React.useRef(null);
	const map = React.useRef(null);
	moment.locale('ru')
	React.useEffect(() => {
		if (listing) {
			if (map.current) return; // initialize map only once
			map.current = new mapboxgl.Map({
				container: mapContainer.current,
				style: "mapbox://styles/mapbox/streets-v11",
				center: [listing.location_longitude, listing.location_latitude],
				zoom: 8,
				interactive: false,
			});
			new mapboxgl.Marker()
				.setLngLat([
					listing.location_longitude,
					listing.location_latitude,
				])
				.addTo(map.current);
		}
	}, [listing]);
	const navigate = useNavigate();

	const handleCreateChat = () => {
		// Соберите информацию о пользователе, с которым вы хотите начать чат.
		const otherUserId = listing.user.id; // Пример: идентификатор пользователя в объявлении.
	  
		// Выполните POST-запрос к серверу для создания чата.
		axios.post("api/create-chat/", { otherUserId })
		  .then((response) => {
			// Обработайте успешный ответ от сервера, который может содержать информацию о созданном чате.
			const chatId = response.data.chatId; // Пример: получите идентификатор созданного чата.
	  
			// Перенаправьте пользователя на страницу чата, передав информацию о чате.
			navigate(`/chat/${chatId}`); // Пример: перенаправление на страницу чата.
		  })
		  .catch((error) => {
			console.error("Ошибка при создании чата", error);
			// Здесь вы можете обработать ошибку, например, отобразив сообщение об ошибке.
		  });
	  };

	React.useEffect(() => {
		axios
			.get(`mart/listings/${slug}/`)
			.then((res) => {
				setListing(res.data);
				console.log(res.data);
			})
			.catch((err) => {
				if (err.response.status === 404) {
					navigate("/404");
				}
			});
		// eslint-disable-next-line
	}, []);
	return (
		<>
			<Navbar />
			<Container maxWidth="xl" sx={{ mt: 3 }}>
				{listing && (
					<>
						<Grid container spacing={3}>
							<Grid
								item
								sx={{
									overflow: "auto",
								}}
								xs={12}
								md={6}
							>
								<ImageList variant="masonry" cols={2} gap={4}>
									{listing.images.map((item) => (
										<ImageListItem key={item.id}>
											<img
												src={item.image}
												srcSet={item.image}
												alt={item.title}
												loading="lazy"
											/>
										</ImageListItem>
									))}
								</ImageList>
								<Card>
									<CardContent>
										<Typography
											gutterBottom
											variant="h5"
											component="div"
										>
											{listing.price} ₽
										</Typography>
										<Typography
											variant="body1"
											color="text.secondary"
										>
											{listing.title}
										</Typography>
									</CardContent>
									<CardActions>
										<Typography
											sx={{
												fontSize: "1rem",
											}}
										>
											{moment(
												listing.timestamp
											).fromNow()}
										</Typography>
									</CardActions>
								</Card>
								<Card sx={{ mt: 3 }}>
									<CardContent>
										<Typography
											variant="h5"
											component="div"
										>
											Покупатель:
										</Typography>
										<Divider sx={{ my: 1 }} />
										<Typography
											gutterBottom
											variant="h6"
											component="div"
										>
											{`${listing.user.first_name} ${listing.user.last_name}`}
										</Typography>
										<Typography
											variant="body1"
											color="text.secondary"
										>
											Зарегистрирован{" "}
											{moment(
												listing.user.date_joined
											).format("MMM YYYY")}
										</Typography>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												mt: 1,
											}}
										>
											<MailOutlineOutlined
												sx={{ mr: 2 }}
											/>
											<Typography
												variant="body1"
												color="text.secondary"
											>
												{listing.user.email}
											</Typography>
										</Box>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												mt: 1,
											}}
											>
											<Button
												variant="outlined"
												color="primary"
												startIcon={<MailOutlineOutlined />}
												onClick={handleCreateChat} // Обработчик события для создания чата
											>
												Начать чат
											</Button>
											</Box>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												mt: 1,
											}}
										>
											<PhoneOutlined sx={{ mr: 2 }} />
											<Typography
												variant="body1"
												color="text.secondary"
											>
												{listing.user.phone_no}
											</Typography>
										</Box>
									</CardContent>
								</Card>
							</Grid>
							<Grid item xs={12} md={6}>
								<Card>
									<CardContent>
										<ListingInfo
											label="Категория"
											data={listing.category.name}
										/>
										<ListingInfo
											label="Состояние"
											data={listing.get_condition_display}
										/>
										<ListingInfo
											label="Необходима доставка"
											data={
												listing.offer_delivery ? (
													<Done color="primary" />
												) : (
													<Close color="error" />
												)
											}
										/>
										<ListingInfo
											label="Приеду сам(а)"
											data={
												listing.public_meetup ? (
													<Done color="primary" />
												) : (
													<Close color="error" />
												)
											}
										/>
										<ListingInfo
											label="Нужна доставка"
											data={
												listing.door_pickup ? (
													<Done color="primary" />
												) : (
													<Close color="error" />
												)
											}
										/>
										<ListingInfo
											label="Drop Off"
											data={
												listing.drop_off ? (
													<Done color="primary" />
												) : (
													<Close color="error" />
												)
											}
										/>

										<Divider sx={{ my: 1 }} />
										<Typography
											gutterBottom
											variant="h6"
											component="div"
										>
											Описание
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											{listing.description}
										</Typography>
									</CardContent>
								</Card>
								<Card sx={{ mt: 3 }}>
									<CardContent>
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
									</CardContent>
								</Card>
							</Grid>
							{/* // ! Add Maps Location Here  */}
						</Grid>
					</>
				)}
			</Container>
		</>
	);
};

export default ListingDetail;
