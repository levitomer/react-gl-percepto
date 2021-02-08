import React, { useState } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import Clock from '../components/Clock/Clock';
import coordinates from '../json/coordinates.json';
import ToolTip from '../components/ToolTip/ToolTip';
import IconCluster from '../Layers/IconCluster';
import Menu from '../components/Menu/Menu';
import markerMapping from '../json/markerMapping.json';
import markerAtlas from '../assets/marker-atlas.png';

// ENVIRONMENT VARIABLES
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const MAP_STYLE = process.env.REACT_APP_MAP_STYLE;

/* eslint-disable react/no-deprecated */
export default function App({
    iconMapping = markerMapping,
    iconAtlas = markerAtlas,
    showCluster = true,
    mapStyle = MAP_STYLE,
}) {
    const [zoom, setZoom] = React.useState(16);
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

    const onHideTooltip = () => {
        setHoverInfo({});
    };

    const onExpandTooltip = (info) => {
        if (info.picked && showCluster) {
            setHoverInfo(info);
        } else {
            setHoverInfo({});
        }
    };

    const onToggleMenu = () => {
        setToggle(!toggle);
    };

    const onGoTo = (marker) => {
        setOrigin(marker.coordinates);
        setZoom(22);
    };

    const onZoomOut = () => {
        setZoom(10);
    };

    const layerProps = {
        data: markers,
        pickable: true,
        getPosition: (d) => {
            const [lat, lng] = d.coordinates;
            return [lng, lat];
        },
        iconAtlas,
        iconMapping,
        onHover: !hoverInfo.objects && setHoverInfo,
    };

    const layer = showCluster
        ? new IconCluster({
              ...layerProps,
              id: 'icon-cluster',
              sizeScale: 60,
          })
        : new IconLayer({
              ...layerProps,
              id: 'icon',
              getIcon: (d) => 'marker',
              sizeUnits: 'meters',
              sizeScale: 2000,
              sizeMinPixels: 6,
          });

    const INITIAL_VIEW_STATE = {
        latitude: origin && origin[0],
        longitude: origin && origin[1],
        maxZoom: 20,
        zoom: zoom,
        pitch: 0,
        bearing: 0,
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
                onViewStateChange={onHideTooltip}
                onClick={onExpandTooltip}
            >
                <MapView
                    id="map"
                    bottom="0"
                    width={toggle ? '70%' : '100%'}
                    repeat={true}
                >
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                    />
                    <Clock handleZoomOut={onZoomOut} />
                </MapView>

                {hoverInfo && <ToolTip info={hoverInfo} />}
            </DeckGL>
        </React.Fragment>
    );
}
