import {useEffect, useState} from 'react'
import {Elset} from './UseElsets.ts'

export function usePropagations(elsets: Elset[]) {
    const [worker, setWorker] = useState<Worker | null>(null);
    const [propagations, setPropagations] = useState<Float32Array>(new Float32Array())


    useEffect(() => {
        // Create a new web worker
        const worker = new Worker(new URL('../workers/PropagateWorker.ts', import.meta.url), { type: 'module'});

        setWorker(worker);
        // Set up event listener for messages from the worker
        worker.onmessage = function (event: MessageEvent<Float32Array>) {
            setPropagations(event.data)
        };

        return () => {
            worker.terminate();
        };
    }, []);

    useEffect(() => {
        if (elsets && worker) {
            worker.postMessage(elsets)
        }
    }, [elsets, worker]);

    return propagations;
}