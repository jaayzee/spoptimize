import React, { useState, useEffect, Children } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

interface Prop {
    inputData: { [key: string]: JSX.Element[] };
}

const averaging = ((arrays: any) => {
    // 3 is number of arrays to be averaged
    if (arrays.length === 3 ) {
    const result = arrays[0].map((value: number, index: number) => {
        // given an array of size 3, this is the averaging
        return (value + arrays[1][index] + arrays[2][index]) / 3
    })
    return result
    } else { return }
})

//figure out what to replace <any> with
const Optimizer: React.FC <any> = ({inputData}) => {
    // DO NOT MUTILATE inputData
    const [avgData, setAvgData] = useState<any>([])
    useEffect(() => {
        const mutilatedData = inputData
        mutilatedData.forEach((id: any) => {
            const key = Object.keys(id)[0] 
            id[key].start = averaging(id[key].start)
            id[key].end = averaging(id[key].end)
        })
        setAvgData(mutilatedData)
    },[inputData])

    // NEXT, use avg data, find max of array, and corresponding key and then group songs by keys:
    // [C, C#, D, D#, E, F, F#, G, G#, A, A# and B] respectively
    return (
        <>
        </>
    )
}

export default Optimizer
