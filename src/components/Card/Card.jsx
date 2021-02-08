import style from './Card.module.scss';

export default function Card({ id, coordinates }) {
    const [latitude, longitude] = coordinates;
    return (
        <div className={style.card}>
            <div> Latitude: {latitude}</div> <div> Longitude: {longitude}</div>
        </div>
    );
}
