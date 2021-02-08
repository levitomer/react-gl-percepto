import style from './Card.module.scss';

export default function Card({ marker, onGoTo }) {
    const [latitude, longitude] = marker.coordinates;

    const zoomToLocation = () => {
        onGoTo(marker);
    };

    return (
        <div className={style.card} onClick={zoomToLocation}>
            <div>Name: {marker.name}</div>
            <div> Latitude: {latitude}</div>
            <div> Longitude: {longitude}</div>
        </div>
    );
}
