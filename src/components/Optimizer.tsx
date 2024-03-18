import React, { useState, useEffect, Children } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

interface Prop {
    inputData: { [key: string]: JSX.Element[] };
}

// const averaging = ((arrays: any) => {
//     // 3 is number of arrays to be averaged
//     if (arrays.length === 3 ) {
//     const result = arrays[0].map((value: number, index: number) => {
//         // given an array of size 3, this is the averaging
//         return (value + arrays[1][index] + arrays[2][index]) / 3
//     })
//     return result
//     } else { return }
// })

const largestOfThePack = ((keys: number[]) => {
    if (keys.length == 0) { return -1 }
    let index = 0;
    let max = keys[0];
    for (let i = 1; i < keys.length; i++) {
        if (keys[i] > max) {
            max = keys[i]
            index = i
        }
    }
    return index
})

//figure out what to replace <any> with
const Optimizer: React.FC <any> = ({inputData}) => {
    // DO NOT MUTILATE inputData
    // const [avgData, setAvgData] = useState<any>([])
    // useEffect(() => {
    //     const mutilatedData = inputData
    //     mutilatedData.forEach((id: any) => {
    //         const key = Object.keys(id)[0] 
    //         id[key].start = averaging(id[key].start)
    //         id[key].end = averaging(id[key].end)
    //     })
    //     setAvgData(mutilatedData)
    // },[inputData])
    // console.log(avgData)

    useEffect(() => {
        const startKeyMap = new Map<number, string[]>([
            [0, []], //corresponds to C
            [1, []], //corresponds to C#
            [2, []], //corresponds to D
            [3, []], //corresponds to D#
            [4, []], //corresponds to E
            [5, []], //corresponds to F
            [6, []], //corresponds to F#
            [7, []], //corresponds to G
            [8, []], //corresponds to G#
            [9, []], //corresponds to A
            [10, []], //corresponds to A#
            [11, []], //corresponds to B
        ])
        const endKeyMap = new Map<number, string[]>([
            [0, []], //corresponds to C
            [1, []], //corresponds to C#
            [2, []], //corresponds to D
            [3, []], //corresponds to D#
            [4, []], //corresponds to E
            [5, []], //corresponds to F
            [6, []], //corresponds to F#
            [7, []], //corresponds to G
            [8, []], //corresponds to G#
            [9, []], //corresponds to A
            [10, []], //corresponds to A#
            [11, []], //corresponds to B
        ])
        for(const i of inputData) {
            //Object.keys(i)[0] grabs the id of the data structure
            endKeyMap.get(largestOfThePack(i[Object.keys(i)[0]].end[0]))?.push(Object.keys(i)[0])
            startKeyMap.get(largestOfThePack(i[Object.keys(i)[0]].start[0]))?.push(i[Object.keys(i)[0]])
            console.log(endKeyMap)
        }
    },[inputData])
    // NEXT, use avg data, find max of array, and corresponding key and then group songs by keys:
    // [C, C#, D, D#, E, F, F#, G, G#, A, A# and B] respectively
    return (
        <>
        </>
    )
}

export default Optimizer
