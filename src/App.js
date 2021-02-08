/// app.js
import React from 'react';
import { MapView } from '@deck.gl/core';
import coordinates from './json/coordinates.json';
import DeckGL, { IconLayer } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import Clock from './components/Clock/Clock';

const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoibGV2aXRvbWVyIiwiYSI6ImNqbjFxcTJheTF1czYza28xcWRjbDVkNGIifQ.11bnEt7mIrAiMKijbeuRcg';

const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

export default function App() {
    const [markers, setMarkers] = React.useState([]);
    const [origin, setOrigin] = React.useState(null);

    // Deck.Gl IconLayer setup
    const layer = new IconLayer({
        id: 'IconLayer',
        data: markers,
        iconAtlas:
            'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
        iconMapping: ICON_MAPPING,
        sizeScale: 15,
        getIcon: (d) => 'marker',
        getPosition: (d) => {
            const [lat, lng] = d.coordinates;
            return [lng, lat];
        },
        getSize: (d) => 5,
        getColor: (d) => [Math.sqrt(d.exits), 140, 0],
    });

    React.useEffect(() => {
        // Transforming data to markers
        const markers = coordinates.reduce((acc, curr, idx) => {
            const marker = {
                name: idx,
                coordinates: curr,
            };
            acc.push(marker);
            return acc;
        }, []);
        setMarkers(markers);

        // Calculating average coordinates of aggregated markers
        const originAvg = coordinates.reduce(
            (acc, curr) => {
                acc[0] += curr[0];
                acc[1] += curr[1];

                return acc;
            },
            [0, 0]
        );
        const origin = [
            originAvg[0] / markers.length,
            originAvg[1] / markers.length,
        ];
        setOrigin(origin);
    }, []);

    // Deck.Gl Viewport settings
    const INITIAL_VIEW_STATE = {
        latitude: origin && origin[0],
        longitude: origin && origin[1],
        zoom: 13,
        pitch: 0,
        bearing: 0,
    };

    return (
        <React.Fragment>
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                layers={layer}
                controller={true}
                getTooltip={(marker) =>
                    marker.name && (
                        <span
                            key={marker.name}
                        >{`Name: ${marker.name}\nCoordinates:${marker.coordinates}`}</span>
                    )
                }
            >
                <MapView id="map" width="70%">
                    <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
                    <Clock />
                </MapView>
            </DeckGL>
        </React.Fragment>
    );
}
