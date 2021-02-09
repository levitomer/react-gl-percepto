import React, { useState } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import Clock from '../components/Clock/Clock';
import coordinates from '../json/coordinates.json';
import ToolTip from '../components/ToolTip/ToolTip';
import IconCluster from '../Layers/IconCluster';
import Menu from '../components/Menu/Menu';
import markerMapping from '../json/markerMapping.json';
import markerAtlas from '../assets/marker-atlas.png';
import * as CONSTANTS from '../constants/map.js';

/* eslint-disable react/no-deprecated */
export default function App({
    iconMapping = markerMapping,
    iconAtlas = markerAtlas,
    mapStyle = process.env.REACT_APP_MAP_STYLE,
}) {
    const zoomRef = React.useRef(CONSTANTS.INITIAL_ZOOM);
    const [markers, setMarkers] = React.useState([]);
    const [origin, setOrigin] = React.useState([]);
    const [hoverInfo, setHoverInfo] = useState({});
    const [toggle, setToggle] = React.useState(false);

    React.useEffect(() => {
        // Transforming data to markers
        const markers = coordinates.reduce((acc, curr, idx) => {
            const marker = {
                name: idx, // marker name is the marker index in list, (no name attribute provided)
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

    const handleViewStateChange = React.useCallback(
        (e) => {
            zoomRef.current = e.viewState.zoom;
            setHoverInfo({});
        },
        [setHoverInfo]
    );

    const onExpandTooltip = React.useCallback((info) => {
        if (info.picked) {
            setHoverInfo(info);
            const [lat, lng] = info.coordinate;
            setOrigin([lng, lat]);
            // TODO: filter markers that are not part of the cluster;
            zoomRef.current += 3;
        } else {
            setHoverInfo({});
        }
    }, []);

    const onToggleMenu = React.useCallback(() => {
        setToggle(!toggle);
    }, [toggle, setToggle]);

    const onGoTo = React.useCallback(
        (marker) => {
            setOrigin(marker.coordinates);
            zoomRef.current = CONSTANTS.ZOOM_MARKER;
        },
        [setOrigin]
    );

    const onZoomOut = React.useCallback(() => {
        if (zoomRef.current !== CONSTANTS.ZOOM_RESET) {
            zoomRef.current = CONSTANTS.ZOOM_RESET;
        }
    }, []);

    const layer = new IconCluster({
        data: markers,
        pickable: true,
        getPosition: (d) => {
            // Deck.gl wants it that way
            const [lat, lng] = d.coordinates;
            return [lng, lat];
        },
        iconAtlas,
        iconMapping,
        onHover: !hoverInfo.objects && setHoverInfo,
        id: 'icon-cluster',
        sizeScale: 60,
    });

    const INITIAL_VIEW_STATE = {
        latitude: origin && origin[0],
        longitude: origin && origin[1],
        maxZoom: CONSTANTS.MAX_ZOOM,
        zoom: zoomRef.current,
        pitch: CONSTANTS.PITCH,
        bearing: CONSTANTS.BEARING,
    };

    return (
        <React.Fragment>
            <Menu
                toggle={toggle}
                markers={markers}
                handleGoTo={onGoTo}
                handleMenuToggle={onToggleMenu}
            />
            <DeckGL
                layers={[layer]}
                initialViewState={INITIAL_VIEW_STATE}
                controller={{ dragRotate: false }}
                onViewStateChange={handleViewStateChange}
                onClick={onExpandTooltip}
            >
                <MapView
                    id="map"
                    bottom="0"
                    width={toggle ? '80%' : '100%'}
                    repeat={true}
                >
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={
                            process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
                        }
                    />
                    <Clock handleZoomOut={onZoomOut} />
                </MapView>

                {hoverInfo && <ToolTip info={hoverInfo} />}
            </DeckGL>
        </React.Fragment>
    );
}
