import {DeckGL, GeoJsonLayer, GlobeViewState, PathLayer, PickingInfo, ScatterplotLayer, SimpleMeshLayer} from 'deck.gl'
import {
    _GlobeView as GlobeView,
    _SunLight as SunLight,
    AmbientLight,
    COORDINATE_SYSTEM,
    LightingEffect
} from '@deck.gl/core'
import {useCallback, useMemo, useState} from 'react'
import {SphereGeometry} from '@luma.gl/engine'
import {useElsets} from '../hooks/UseElsets.ts'
import {usePropagations} from '../hooks/usePropagations.ts'
import {useOrbit} from '../hooks/useOrbit.ts'

export function SatelliteMap() {
    const [hover, setHover] = useState(-1);
    const elsets = useElsets();
    const orbit = useOrbit(hover >= 0 && elsets.data ? elsets.data[hover] : undefined);

    const propagations = usePropagations(elsets.data ?? []);

    const INITIAL_VIEW_STATE: GlobeViewState = {
        longitude: 0,
        latitude: 20,
        zoom: 0,
        minZoom: -3
    };

    const EARTH_RADIUS_METERS = 6.3e6;

    const ambientLight = new AmbientLight({
        color: [255, 255, 255],
        intensity: 0.5
    });
    const sunLight = new SunLight({
        color: [255, 255, 255],
        intensity: 2.0,
        timestamp: 0
    });
    const lightingEffect = new LightingEffect({ambientLight, sunLight});


    const backgroundLayers = useMemo(
        () => [
            new SimpleMeshLayer({
                id: 'earth-sphere',
                data: [0],
                mesh: new SphereGeometry({radius: EARTH_RADIUS_METERS, nlat: 18, nlong: 36}),
                coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
                getPosition: [0, 0, 0],
                getColor: [255, 255, 255]
            }),
            new GeoJsonLayer({
                id: 'earth-land',
                data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson',
                // Styles
                stroked: false,
                filled: true,
                opacity: 0.1,
                getFillColor: [30, 80, 120]
            }),
        ],
        []
    );

    const getTooltip = useCallback((pickingInfo: PickingInfo) => {
        return elsets.data?.[pickingInfo.index]?.OBJECT_NAME ?? null;
    }, [elsets.data]);

    const onHover = useCallback((pickingInfo: PickingInfo) => {
        setHover(pickingInfo.index);
    }, []);

    const dataLayers = useMemo(
        () => [
            new PathLayer({
                id: "orbit",
                visible: orbit.length > 0,
                data: {
                    length: orbit.length > 0 ? 1 : 0,
                    startIndices: [0],
                    attributes: {
                        getPath: {value: orbit, size: 3},
                    }
                },
                opacity: 0.8,
                getColor: [34, 139, 34],
                widthMinPixels: 1,
                wrapLongitude: true,
                _pathType: 'open'

            }),
            new ScatterplotLayer({
                id: 'satellites',
                data: {
                    length: propagations.length / 3,
                    attributes: {
                        getPosition: {value: propagations, size: 3},
                    }
                },
                getFillColor: [255, 140, 0],
                getLineColor: [240, 202, 0, 255],
                lineWidthMinPixels: 2,
                wrapLongitude: true,
                billboard: true,
                radiusMinPixels: 1,
                pickable: true
            }),
        ],
        [orbit, propagations]
    )

    return (
        <>
            <DeckGL
                views={new GlobeView()}
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                // effects={[lightingEffect]}
                layers={[backgroundLayers, dataLayers]}
                getTooltip={getTooltip}
                onHover={onHover}
            />
        </>
    );
}