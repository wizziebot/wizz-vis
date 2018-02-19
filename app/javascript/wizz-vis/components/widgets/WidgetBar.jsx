import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
         Tooltip, Legend } from 'recharts';

export default class WidgetSerie extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  render () {
    const data = [
      { name: 'Page A', pv: 2400 },
      { name: 'Page B', pv: 1398 },
      { name: 'Page C', pv: 9800 },
      { name: 'Page D', pv: 3908 },
      { name: 'Page E', pv: 4800 },
      { name: 'Page F', pv: 3800 },
      { name: 'Page G', pv: 4300 },
    ];

    return (
      <ResponsiveContainer>
        <BarChart data={data}
              margin={{top: 5, right: 30, left: 20, bottom: 5}}>
           <CartesianGrid strokeDasharray="3 3"/>
           <XAxis dataKey="name"/>
           <YAxis/>
           <Tooltip/>
           <Legend />
           <Bar dataKey="pv" fill="#8884d8"/>
        </BarChart>
      </ResponsiveContainer>
    )
  }
}
