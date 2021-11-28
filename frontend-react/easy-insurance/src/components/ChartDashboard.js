import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar , Line , Doughnut} from 'react-chartjs-2';
import faker from 'faker';
import axios from 'axios';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const optionsBar = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Number of Policies sold per Month',
    },
  },
};

export const  doOptions = {
    plugins : {title : {
        display: true,
        text: 'Total Premium per Month',
      }
}}



function ChartDashboard() {
    const [chartData, setChartData] = useState({
        labels : [],
        datasets: [
          {
            label: 'Number of Policies',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
        ]
      })

      const doughnutChartTemplateData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October','November','December'],
        datasets: [
          {
            label: 'Total Premium',
            data: [],
            backgroundColor: [
              '#1e88e5',
              '#ff80ab',
              '#40c4ff',
              '#f9a825',
              '#7c4dff',
              '#ff8a80',
    
              '#fff176',
              '#6a1b9a',
              '#8c9eff',
              '#4a148c',
              '#ff6e40',
              '#fff59d',
            ],
            borderColor: [
                '#1e88e5',
                '#ff80ab',
                '#40c4ff',
                '#f9a825',
                '#7c4dff',
                '#ff8a80',
      
                '#fff176',
                '#6a1b9a',
                '#8c9eff',
                '#4a148c',
                '#ff6e40',
                '#fff59d',
            //   'rgba(255, 99, 132, 1)',
            //   'rgba(54, 162, 235, 1)',
            //   'rgba(255, 206, 86, 1)',
            //   'rgba(75, 192, 192, 1)',
            //   'rgba(153, 102, 255, 1)',
            //   'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      
      
    
  }

      const [doughnutChartData , setDoughnutChartData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September','October','November','December'],
        datasets: [
          {
            label: 'Total Premium',
            data: [],
            backgroundColor: [
              '#1e88e5',
              '#ff80ab',
              '#40c4ff',
              '#f9a825',
              '#7c4dff',
              '#ff8a80',
    
              '#fff176',
              '#6a1b9a',
              '#8c9eff',
              '#4a148c',
              '#ff6e40',
              '#fff59d',
            ],
            borderColor: [
                '#1e88e5',
                '#ff80ab',
                '#40c4ff',
                '#f9a825',
                '#7c4dff',
                '#ff8a80',
      
                '#fff176',
                '#6a1b9a',
                '#8c9eff',
                '#4a148c',
                '#ff6e40',
                '#fff59d',
            //   'rgba(255, 99, 132, 1)',
            //   'rgba(54, 162, 235, 1)',
            //   'rgba(255, 206, 86, 1)',
            //   'rgba(75, 192, 192, 1)',
            //   'rgba(153, 102, 255, 1)',
            //   'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      
      
    
  }
)

    const [allRegions,setAllRegions]  = useState([])
    const [region ,setRegion] = useState(["All"])
    const [chartRawData, setChartRawData] = useState([])
    const [doughNutChartRawData, setDoughNutChartRawData] = useState([])



    //doughnout chart
    


    function handleRegionSelectChange(event){
        // console.log('select list changed', event.target.value)
        setRegion(event.target.value)
        formatChartObject(chartRawData,event.target.value)
        formatdoughnutChartObject(doughNutChartRawData,event.target.value)
        

    }

    function getAllRegionsFromtheData(recordset,region){
        let regionsFromResult = [] 
        
        recordset.forEach(element=> {
            if(!regionsFromResult.includes(element.CUSTOMER_REGION))
            regionsFromResult.push(element.CUSTOMER_REGION)
        })
        
        // console.log('[...regionsFromResult]',[...regionsFromResult])
        setAllRegions(regionsFromResult)
        // console.log('allRegions',allRegions)
    }


    function formatdoughnutChartObject(recordset,region){
        
        let relevantDataset = recordset.filter(element =>{
            return element.CUSTOMER_REGION == region
        })

        console.log('relevantDataset',relevantDataset)

        let dataHolderArray = new Array(12).fill(0);

        relevantDataset.forEach(element=>{
            dataHolderArray[element.MONTH_NUM -1] = element.TOTAL_PREMIUM
        })

        console.log('dataHolderArray',dataHolderArray)
        let localdoughnutChartTemplateData = {...doughnutChartTemplateData}
        localdoughnutChartTemplateData.datasets[0].data = [...dataHolderArray]
        console.log('localdoughnutChartTemplateData',localdoughnutChartTemplateData)
        setDoughnutChartData({...localdoughnutChartTemplateData})
    }

    function formatChartObject(recordset,region){
        let chartDataStruct = {
            labels : [],
            datasets: [
              {
                label: 'Number of Policies',
                data: [],
                backgroundColor: '#2196f3',
              }
            ]
          }


          //Filters out the unique Months
          let relevantDataset = [...recordset.filter(element=>{
              return element.CUSTOMER_REGION == region
          })]

          relevantDataset.sort(function(a, b) {
            return a.MONTH_NUM - b.MONTH_NUM;
          });
          relevantDataset.forEach(element =>{
            chartDataStruct.labels.push(element.MONTH)
            chartDataStruct.datasets[0].data.push(element.NUMBER_OF_POLICIES)
          })

          setChartData({...chartDataStruct})

    }

    useEffect(()=>{
        getMonthWisepolicies().then(response=>{
            // setChartDataRaw([...response.data.recordset])
            setChartRawData([...response.data.recordset])
            getAllRegionsFromtheData(response.data.recordset)
            formatChartObject(response.data.recordset, "All")

        }).catch(error =>{
            console.log(error)
            alert("Something went wrong. Please try refreshing the page")
        })


        getMonthWisepremium().then(response=>{
            // setChartDataRaw([...response.data.recordset])
            setDoughNutChartRawData([...response.data.recordset])
            formatdoughnutChartObject([...response.data.recordset],"All")
            // getAllRegionsFromtheData(response.data.recordset)
            // formatChartObject(response.data.recordset)

        }).catch(error =>{
            console.log(error)
            alert("Something went wrong. Please try refreshing the page")
        })


    },[])
    
    function getMonthWisepolicies(){
        return axios.get('/monthwisepolicies')
    }

    function getMonthWisepremium(){
        return axios.get('/monthwisepremium')
    }

    return ( 
        <div id="chart-container-div" >
            <div id="region-select-container" className="row">
            <label htmlFor="region-select" id="label-region-select" className="col-2"> Select Region </label>    
            <select className="custom-select col-2 " onChange={handleRegionSelectChange}>
            {allRegions.map((item) => (
              <option key = {item} value={item}>{item}</option>
            ))}

            </select>
            </div>
            <div className = "row">
                <div className = "col-sm-6">
                    <Bar options={optionsBar} data={chartData} />
                </div>
                <div className="col-1"></div>
                <div className = "col-sm-4 divider-div">
                    <Doughnut options={doOptions}  data={doughnutChartData} redraw />
                </div>
            </div>
        </div>
         
     );
}

export default ChartDashboard;