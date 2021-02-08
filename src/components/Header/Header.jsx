import style from './Header.module.scss';

export default function Header() {
    return (
        <div className={style.header}>
            <img
                src={`${process.env.PUBLIC_URL}/percepto-logo.png`}
                alt="logo"
                className={style.logo}
            />
        </div>
    );
}
