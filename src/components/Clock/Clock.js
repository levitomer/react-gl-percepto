import * as React from 'react';
import style from './Clock.module.scss';
export default function Clock({ handleZoomOut }) {
    const [clock, setClock] = React.useState({
        hour: '',
        minute: '',
        second: '',
    });
    const interval = React.useRef('');

    const handleDate = React.useCallback(() => {
        const date = new Date();

        const hours = ((date.getHours() + 11) % 12) + 1;
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // angle is  measured in degrees from the mark of number 12 clockwise
        const hour = hours * 30;
        const minute = minutes * 6;
        const second = seconds * 6;

        setClock({ hour, minute, second });
    }, []);

    React.useEffect(() => {
        interval.current = setInterval(handleDate, 1000);

        return () => {
            clearInterval(interval.current);
        };
    }, [handleDate]);

    const secondsStyle = {
        transform: `rotate(${clock.second}deg)`,
    };
    const minutesStyle = {
        transform: `rotate(${clock.minute}deg)`,
    };
    const hoursStyle = {
        transform: `rotate(${clock.hour}deg)`,
    };
    return (
        <div className={style.clock} onClick={handleZoomOut}>
            <div className={style.wrap}>
                <span className={style.hour} style={hoursStyle}></span>
                <span className={style.minute} style={minutesStyle}></span>
                <span className={style.second} style={secondsStyle}></span>
                <span className={style.dot}></span>
            </div>
        </div>
    );
}
