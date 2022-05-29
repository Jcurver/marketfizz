import { useState } from 'react';
import { useEffect } from 'react';

interface UseCoordState {
	longitude: number | null;
	latitude: number | null;
}

export default function useCoords() {
	const [coords, setCoords] = useState<UseCoordState>({
		latitude: null,
		longitude: null,
	});
	const onSuccess = ({
		coords: { latitude, longitude },
	}: GeolocationPosition) => {
		console.log(coords);
		setCoords({
			latitude,
			longitude,
		});
	};
	useEffect(() => {
		navigator.geolocation.getCurrentPosition(onSuccess);
	}, []);
	return coords;
}
