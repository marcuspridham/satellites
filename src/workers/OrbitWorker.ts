import {Satellite, TleLine1, TleLine2} from 'ootk'
import {Elset} from '../hooks/UseElsets.ts'

const ORBIT_SEGMENTS = 255;

onmessage = function (event: MessageEvent<Elset>) {
    const satellite = new Satellite({
        tle1: event.data.TLE_LINE1 as TleLine1,
        tle2: event.data.TLE_LINE2 as TleLine2
    })
    const points = new Float32Array(ORBIT_SEGMENTS * 3);
    const time = new Date();

    const timeslice =  satellite.period / ORBIT_SEGMENTS;

    for (let index = 0; index < ORBIT_SEGMENTS; index++) {
        const lla = satellite.lla(new Date(time.getTime() + (index * timeslice * 60000)))
        const offset = index * 3
        points[offset] = lla.lon;
        points[offset + 1] = lla.lat;
        points[offset + 2] = lla.alt * 1000;
    }

    postMessage(points)
};