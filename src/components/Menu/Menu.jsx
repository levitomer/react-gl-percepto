import React from 'react';
import style from './Menu.module.scss';
import Card from '../Card/Card';

export default function Menu({ markers, toggle, handleMenuToggle }) {
    // seperating logo from menu on toggle
    if (!toggle) {
        return (
            <img
                onClick={handleMenuToggle}
                src={`${process.env.PUBLIC_URL}/percepto-logo-alt.png`}
                alt="logo"
                className={style.logoAlt}
            />
        );
    }

    return (
        <div className={style.menuContainer}>
            <img
                onClick={handleMenuToggle}
                src={`${process.env.PUBLIC_URL}/percepto-logo.png`}
                alt="logo"
                className={style.logo}
            />
            <div className={style.menu}>
                {toggle &&
                    markers.map((marker) => {
                        return (
                            <Card
                                key={marker.name}
                                coordinates={marker.coordinates}
                            />
                        );
                    })}
            </div>
        </div>
    );
}
