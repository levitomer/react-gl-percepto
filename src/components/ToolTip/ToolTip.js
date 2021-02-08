import style from './ToolTip.module.scss';
export default function ToolTip({ info }) {
    const { object, x, y } = info;

    if (!object) {
        return null;
    }

    return object.cluster ? (
        <div className={style.tooltip} style={{ left: x, top: y }}>
            {object.point_count} drones in area
        </div>
    ) : (
        <div className={style.tooltip} style={{ left: x, top: y }}>
            <div>Drone #{object.name}</div>
            <div>Latitude: {object.coordinates[0]}</div>
            <div>Longitude: {object.coordinates[1]}</div>
        </div>
    );
}
