import style from './Menu.module.scss';
import Card from '../Card/Card';

export default function Menu({ markers }) {
    return (
        <div className={style.menu}>
            {markers.map((marker) => {
                return (
                    <Card key={marker.name} coordinates={marker.coordinates} />
                );
            })}
        </div>
    );
}
