import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'
import chroma from 'chroma-js'

const width = 650
const height = 400
const margin = {top: 20, right: 35, bottom: 20, left: 35} // right as 5
const red = '#eb6a5b'
const green = '#b6e86f'
const blue = '#52b6ca'
const colors = chroma.scale([blue, green, red])

export default function Chart(props) {
    const fToC = (f) => {
        return ((f-32)*5) / 9
    }

    const xAxisRef = useRef(null),
        yAxisRef = useRef(null),
        y2AxisRef = useRef(null)

    const [highs, setHighs] = useState(null),
        [lows, setLows] = useState(null)

    let xScale = d3.scaleTime().range([margin.left, width - margin.right]),
        yScale = d3.scaleLinear().range([height-margin.bottom, margin.top]), //.range([0, width / 2]),
        lineGenerator = d3.line(),
        xAxis = d3.axisBottom().scale(xScale)
                    .tickFormat(d3.timeFormat('%b')),
        yAxis =  d3.axisLeft().scale(yScale)
                    .tickFormat(d => `${d}°F`),
        y2Axis =  d3.axisRight().scale(yScale)
                    .tickFormat(d => `${Math.round(fToC(d))}°C`)
        
        console.log('test', fToC(82))

    useEffect(()=> {
        // update scales
        const timeDomain = d3.extent(props.temps, d => d.date)
        const tempMax = d3.max(props.temps, d => d.high)
        xScale.domain(timeDomain)
        yScale.domain([0,tempMax])

        // LineGenerators
        lineGenerator.x(d => xScale(d.date))
        lineGenerator.y(d => yScale(d.high))
        const tempHighs = lineGenerator(props.temps)

        lineGenerator.y(d => yScale(d.low))
        const tempLows = lineGenerator(props.temps)

        setHighs(tempHighs)
        setLows(tempLows)

        d3.select(xAxisRef.current).call(xAxis)
        d3.select(yAxisRef.current).call(yAxis)
        d3.select(y2AxisRef.current).call(y2Axis)
    }, [props])

    return (
        <div>
            <h2>{props.city}</h2>
            <p>high: {props.temps[0].high}</p>
            <svg width={width} height={height}>
                <path d={highs} fill='none' stroke={red}/>
                <path d={lows} fill='none' stroke={blue}/>

                <g>
                    <g ref={xAxisRef} transform={`translate(0, ${height - margin.bottom})`}/>
                    <g ref={yAxisRef} transform={`translate(${margin.left}, 0)`}/>
                    <g ref={y2AxisRef} transform={`translate(${width-margin.right}, 0)`}/>
                </g>
            </svg>
        </div>
    )
}
