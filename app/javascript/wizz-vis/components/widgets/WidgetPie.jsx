import React from 'react';
import { ResponsiveContainer, PieChart, Pie } from 'recharts';

export default class WidgetArea extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  render () {
    const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
                  {name: 'Group C', value: 300}, {name: 'Group D', value: 200}];

    return (
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" fill="#8884d8" innerRadius="50" label/>
        </PieChart>
      </ResponsiveContainer>
    )
  }
}
