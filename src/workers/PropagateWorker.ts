import {Satellite, TleLine1, TleLine2} from 'ootk'
import {Elset} from '../hooks/UseElsets.ts'

let timeout: NodeJS.Timeout | undefined;

let satellites: Satellite[]

let positions: Float32Array;

onmessage = function (event: MessageEvent<Elset[]>) {
    satellites = event.data.map(elset => {
        return new Satellite({
            tle1: elset.TLE_LINE1 as TleLine1,
            tle2: elset.TLE_LINE2 as TleLine2
        });
    });

    positions = new Float32Array(satellites.length * 3);

    if (timeout === undefined) {
        onPropagate();
    }
};

export const onPropagate = () => {
    const time = new Date();

    satellites.forEach((satellite, index) => {
        const lla = satellite.lla(time)
        const offset = index * 3
        positions[offset] = lla.lon;
        positions[offset + 1] = lla.lat;
        positions[offset + 2] = lla.alt * 1000;
    })

    postMessage(positions)

    timeout = setTimeout(onPropagate, 1000 / 60)
};