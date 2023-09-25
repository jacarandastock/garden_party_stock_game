<script setup>
import {useDataStore} from "@/stores/data";

const chart = ref(null);
const dataStore = useDataStore();

const chartOptions = {
  chart: {
    type: "line",
    height: 350,
    zoom: {
      type: 'x',
      enabled: false,
      autoScaleYaxis: true
    },
    toolbar: {
      autoSelected: "zoom",
    },
  },
  xaxis: {
    type: "category",
    categories: dataStore.graph_data.x,  // 使用x值作为x轴的类别
  },
  dataLabels: {
    enabled: false,
  },
  title: {
    text: "价格",
    align: "left",
  },
};

const chartSeries = ref(Object.entries(dataStore.graph_data.y).map(([name, yValues]) => {
  return {
    name: name,
    data: yValues.map(y => parseFloat(y)),
  };
}));

const updateOptions = (options) => {
  chart.value?.updateOptions(options)
}
function updateChart() {
  updateOptions({
    xaxis: {
      categories: dataStore.graph_data.x,
    }
  });
  // chartOptions.xaxis.categories = dataStore.graph_data.x;
  const validEntries = Object.entries(dataStore.graph_data.y).filter(([name, yValues]) => {
    return yValues.every(y => y !== undefined && y !== null);
  });

  chartSeries.value = validEntries.map(([name, yValues]) => {
    return {
      name: name,
      data: yValues.map(y => parseFloat(y)),
    };
  });
}


watch(dataStore.graph_data, () => {
  updateChart();
});

</script>


<template>
  <div>
<!--    {{ chartOptions }}-->
<!--    {{ chartSeries }}-->
    <apexchart
        ref="chart"
        height='400'
        type="line"
        :options="chartOptions"
        :series="chartSeries"
    ></apexchart>
  </div>
</template>

