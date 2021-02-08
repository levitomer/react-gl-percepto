import React, { useState } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import { MapView } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import Clock from '../components/Clock/Clock';
import coordinates from '../json/coordinates.json';
import { ToolTip, IconClusterLayer } from '../components/Map';
import Menu from '../components/Menu/Menu';
import Header from '../components/Header/Header';
import markerMapping from '../json/markerMapping.json';
import markerAtlas from '../assets/marker-atlas.png';

const MAPBOX_ACCESS_TOKEN =
    'pk.eyJ1IjoibGV2aXRvbWVyIiwiYSI6ImNqbjFxcTJheTF1czYza28xcWRjbDVkNGIifQ.11bnEt7mIrAiMKijbeuRcg';

const MAP_STYLE =
    'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

/* eslint-disable react/no-deprecated */
export default function App({
    iconMapping = markerMapping,
    iconAtlas = markerAtlas,
    showCluster = true,
    mapStyle = MAP_STYLE,
}) {
    const [markers, setMarkers] = React.useState([]);
    const [origin, setOrigin] = React.useState([]);
    const [hoverInfo, setHoverInfo] = useState({});

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

    const hideTooltip = () => {
        setHoverInfo({});
    };
    const expandTooltip = (info) => {
        if (info.picked && showCluster) {
            setHoverInfo(info);
        } else {
            setHoverInfo({});
        }
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
        ? new IconClusterLayer({
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
        zoom: 16,
        pitch: 0,
        bearing: 0,
    };

    return (
        <React.Fragment>
            <Header />
            <Menu markers={markers} />
            <DeckGL
                layers={[layer]}
                initialViewState={INITIAL_VIEW_STATE}
                controller={{ dragRotate: false }}
                onViewStateChange={hideTooltip}
                onClick={expandTooltip}
            >
                <MapView id="map" bottom="0" width="70%" repeat={true}>
                    <StaticMap
                        reuseMaps
                        mapStyle={mapStyle}
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                    />
                    <Clock />
                </MapView>

                {hoverInfo && <ToolTip info={hoverInfo} />}
            </DeckGL>
        </React.Fragment>
    );
}
