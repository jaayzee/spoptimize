import React, { useState, useEffect, Children } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'

interface Prop {
    inputData: { [key: string]: JSX.Element[] };
}

//figure out what to replace <any> with
const Analyzer: React.FC <any> = ({inputData}) => {
    
    console.log(inputData)
    
    return (
        <>
        </>
    )
}

export default Analyzer
