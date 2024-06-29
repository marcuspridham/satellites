import {useEffect, useState} from 'react'
import {Elset} from './UseElsets.ts'

export function useOrbit(elset?: Elset) {
    const [worker, setWorker] = useState<Worker | null>(null);
    const [positions, setPositions] = useState<Float32Array>(new Float32Array())


    useEffect(() => {
        // Create a new web worker
        const worker = new Worker(new URL('../workers/OrbitWorker.ts', import.meta.url), {type: 'module'});

        setWorker(worker);
        // Set up event listener for messages from the worker
        worker.onmessage = function (event: MessageEvent<Float32Array>) {
            setPositions(event.data)
        };

        return () => {
            worker.terminate();
        };
    }, []);

    useEffect(() => {
        if (elset && worker) {
            worker.postMessage(elset)
        } else {
            setPositions(new Float32Array())
        }
    }, [elset, worker]);

    return positions;
}