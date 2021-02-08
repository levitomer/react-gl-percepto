export default function renderTooltip({ info }) {
    const { object, x, y } = info;

    if (info.objects) {
        return (
            <div className="tooltip interactive" style={{ left: x, top: y }}>
                {info.objects.map(
                    ({ name, year, mass, class: meteorClass }) => {
                        return (
                            <div key={name}>
                                <h5>{name}</h5>
                                <div>Year: {year || 'unknown'}</div>
                                <div>Class: {meteorClass}</div>
                                <div>Mass: {mass}g</div>
                            </div>
                        );
                    }
                )}
            </div>
        );
    }

    if (!object) {
        return null;
    }

    return object.cluster ? (
        <div className="tooltip" style={{ left: x, top: y }}>
            {object.point_count} records
        </div>
    ) : (
        <div className="tooltip" style={{ left: x, top: y }}>
            {object.name} {object.year ? `(${object.year})` : ''}
        </div>
    );
}
