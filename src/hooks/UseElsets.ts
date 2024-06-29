import {useQuery} from '@tanstack/react-query'
import axios from 'axios';

export type Elset = {
    OBJECT_NAME: string,
    TLE_LINE1: string,
    TLE_LINE2: string
}

async function getElsets(): Promise<Elset[]> {
    const response = await axios.get('gp_data.json')
    return response.data;
}

export function useElsets() {
    return useQuery({queryKey: ['elsets'], queryFn: getElsets})
}