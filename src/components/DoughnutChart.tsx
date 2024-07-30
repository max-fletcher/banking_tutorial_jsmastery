// Chart JS only works for client components so we sre using this here
"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

const DoughnutChart = ({ accounts }: DoughnutChartProps) => {
  const data = {
    datasets: [
      {
        label: 'Banks', // Name of the chart
        data: [1250, 2500, 3750], // Data value of segment/section that will be shown. In this case, will generate the angle/proportion of the segment/section
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'] // Color of each segment/section
      },
    ],
    labels: ['Bank 1', 'Bank 2', 'Bank 3'] // Name of each segment/section
  }

  return (
    <>
      <Doughnut 
        data={data} 
        options={{
          cutout: '60%', // Controls the width of the doughnut rim
          plugins: {
            legend: {
              display: true // Controls if the legend(i.e which colors represents which label/bar) is shown or not
            }
          }
        }}
      />
    </>
  )
}

export default DoughnutChart