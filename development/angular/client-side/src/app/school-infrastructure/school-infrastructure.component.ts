import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppServiceComponent } from '../app.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ExportToCsv } from 'export-to-csv';
declare const $;

@Component({
  selector: 'app-school-infrastructure',
  templateUrl: './school-infrastructure.component.html',
  styleUrls: ['./school-infrastructure.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchoolInfrastructureComponent implements OnInit {
  public scatterChart: Chart;
  public result: any = [];
  public xAxis: any = "total_schools";
  public yAxis: any = "total_schools_data_received";
  public xAxisFilter: any = [];
  public yAxisFilter: any = [];
  public downloadLevel = '';

  public districtsNames: any = [];
  public blockNames: any = [];
  public clusterNames: any = [];

  public SchoolInfrastructureDistrictsNames: any = [];
  public SchoolInfrastructureBlocksNames;
  public SchoolInfrastructureClusterNames;

  public myDistrict: any;
  public myBlock: any;
  public myCluster: any;

  public blockHidden;
  public clusterHidden;

  public dist: boolean = false;
  public blok: boolean = false;
  public clust: boolean = false;
  public skul: boolean = false;

  public title: string = '';
  public titleName: string = '';

  public hierName: any;
  public distName: any;
  public blockName: any;
  public clustName: any;

  public fileName: any;
  public reportData: any;
  public myData;

  constructor(public http: HttpClient, public service: AppServiceComponent, public router: Router, private changeDetection: ChangeDetectorRef) {
    localStorage.removeItem('resData');
  }

  ngOnInit() {
    this.districtWise();
  }

  loaderAndErr() {
    if (this.result.length !== 0) {
      document.getElementById('spinner').style.display = 'none';
    } else {
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('errMsg').style.color = 'red';
      document.getElementById('errMsg').style.display = 'block';
      document.getElementById('errMsg').innerHTML = 'No data found';
    }
  }

  errMsg() {
    document.getElementById('errMsg').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    document.getElementById('spinner').style.marginTop = '3%';
  }

  public tableHead: any;
  public chartData: any = [];
  public modes: any

  districtWise() {
    if (this.chartData.length !== 0) {
      this.scatterChart.destroy();
    }
    this.xAxisFilter = [];
    this.yAxisFilter = [];
    this.downloadLevel = 'dist';
    this.tableHead = "District Name";
    this.fileName = "Dist_level_report";
    this.fileName = "Dist_level_Report";

    this.myDistrict = '';

    this.dist = false;
    this.blok = false;
    this.clust = false;
    this.skul = true;

    this.blockHidden = true;
    this.clusterHidden = true;

    document.getElementById('home').style.display = 'none';

    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.infraDistWise().subscribe(res => {
      this.reportData = this.SchoolInfrastructureDistrictsNames = this.result = res;

      // for download========
      this.funToDownload(this.reportData);
      //for chart =============================================
      for (i = 1; i < Object.keys(this.result[0]).length; i++) {
        this.xAxisFilter.push({ key: Object.keys(this.result[0])[i], value: Object.keys(this.result[0])[i].toLocaleUpperCase() });
        this.yAxisFilter.push({ key: Object.keys(this.result[0])[i], value: Object.keys(this.result[0])[i].toLocaleUpperCase() });
      };

      var labels = [];
      this.chartData = []
      for (var i = 0; i < this.result.length; i++) {
        var x = undefined, y = undefined;

        if (Object.keys(this.result[i][this.xAxis]).length === 1 && Object.keys(this.result[i][this.yAxis]).length === 1) {
          x = Number(this.result[i][this.xAxis].value);
          y = Number(this.result[i][this.yAxis].value);
        }
        if (Object.keys(this.result[i][this.xAxis]).length === 1 && Object.keys(this.result[i][this.yAxis]).length === 2) {
          x = Number(this.result[i][this.xAxis].value);
          y = Number(this.result[i][this.yAxis].percent);
        }
        if (Object.keys(this.result[i][this.xAxis]).length === 2 && Object.keys(this.result[i][this.yAxis]).length === 1) {
          x = Number(this.result[i][this.xAxis].percent);
          y = Number(this.result[i][this.yAxis].value);
        }
        if (Object.keys(this.result[i][this.xAxis]).length === 2 && Object.keys(this.result[i][this.yAxis]).length === 2) {
          x = Number(this.result[i][this.xAxis].percent);
          y = Number(this.result[i][this.yAxis].percent);
        }
        this.chartData.push({ x: x, y: y });
        labels.push(this.result[i].district.value);
        this.districtsNames.push({ id: this.result[i].district.id, name: this.result[i].district.value });

      }

      let x_axis = this.xAxisFilter.find(o => o.key == this.xAxis);
      let y_axis = this.yAxisFilter.find(o => o.key == this.yAxis);

      let obj = {
        xAxis: x_axis.value,
        yAxis: y_axis.value
      }

      this.createChart(labels, this.chartData, this.tableHead, obj);
      //====================================

      // for table data
      var dataSet = this.result;
      this.createTable(dataSet);
      //========================

      this.loaderAndErr();
      this.changeDetection.markForCheck();
    }, err => {
      this.result = [];
      this.loaderAndErr();
    });
  }

  myDistData(data) {
    if (this.chartData.length !== 0) {
      this.scatterChart.destroy();
    }
    this.xAxisFilter = [];
    this.yAxisFilter = [];
    this.downloadLevel = 'block';
    this.tableHead = "Block Name";
    this.fileName = "Blcok_level_report";

    this.dist = true;
    this.blok = false;
    this.clust = false;
    this.skul = false;

    this.myBlock = '';

    this.distName = data;
    let obj = this.districtsNames.find(o => o.id == data);
    this.hierName = obj.name;
    localStorage.setItem('dist', obj.name);
    localStorage.setItem('distId', data);

    this.blockHidden = false;
    this.clusterHidden = true;

    document.getElementById('home').style.display = 'block';
    if (this.myData) {
      this.myData.unsubscribe();
    }
    this.myData = this.service.infraBlockWise(data).subscribe(res => {
      this.reportData = this.SchoolInfrastructureBlocksNames = this.result = res;
      console.log(res);
      // for download========
      this.funToDownload(this.reportData);
      //for chart =============================================
      for (i = 2; i < Object.keys(this.result[0]).length; i++) {
        this.xAxisFilter.push({ key: Object.keys(this.result[0])[i], value: Object.keys(this.result[0])[i].toLocaleUpperCase() });
        this.yAxisFilter.push({ key: Object.keys(this.result[0])[i], value: Object.keys(this.result[0])[i].toLocaleUpperCase() });
      };

      var labels = [];
      this.chartData = []
      for (var i = 0; i < this.result.length; i++) {
        var x = undefined, y = undefined;

        if (Object.keys(this.result[i][this.xAxis]).length === 1 && Object.keys(this.result[i][this.yAxis]).length === 1) {
          x = Number(this.result[i][this.xAxis].value);
          y = Number(this.result[i][this.yAxis].value);
        }
        if (Object.keys(this.result[i][this.xAxis]).length === 1 && Object.keys(this.result[i][this.yAxis]).length === 2) {
          x = Number(this.result[i][this.xAxis].value);
          y = Number(this.result[i][this.yAxis].percent);
        }
        if (Object.keys(this.result[i][this.xAxis]).length === 2 && Object.keys(this.result[i][this.yAxis]).length === 1) {
          x = Number(this.result[i][this.xAxis].percent);
          y = Number(this.result[i][this.yAxis].value);
        }
        if (Object.keys(this.result[i][this.xAxis]).length === 2 && Object.keys(this.result[i][this.yAxis]).length === 2) {
          x = Number(this.result[i][this.xAxis].percent);
          y = Number(this.result[i][this.yAxis].percent);
        }
        this.chartData.push({ x: x, y: y });
        labels.push(this.result[i].block.name);
        this.blockNames.push({ id: this.result[i].block.id, name: this.result[i].block.name });
      }

      let x_axis = this.xAxisFilter.find(o => o.key == this.xAxis);
      let y_axis = this.yAxisFilter.find(o => o.key == this.yAxis);

      let obj = {
        xAxis: x_axis.value,
        yAxis: y_axis.value
      }

      this.createChart(labels, this.chartData, this.tableHead, obj);
      //====================================

      // for table data
      var dataSet = this.result;
      this.createTable(dataSet);
      //========================

      this.loaderAndErr();
      this.changeDetection.markForCheck();
    }, err => {
      this.result = [];
      this.loaderAndErr();
    });
  }

  myBlockData(data) {
    console.log(data);
    this.dist = false;
    this.blok = true;
    this.clust = false;
    this.skul = false;

    this.SchoolInfrastructureClusterNames = [{ name: 'abc' }, { name: 'pqr' }, { name: 'xyz' }];
    this.myCluster = '';

    localStorage.setItem('blockId', data);
    this.titleName = localStorage.getItem('dist');
    this.distName = JSON.parse(localStorage.getItem('distId'));
    this.blockName = data;
    let obj = this.blockNames.find(o => o.id == data);
    console.log(":::::;", obj);
    localStorage.setItem('block', JSON.stringify(obj.name));
    this.hierName = obj.name;

    this.blockHidden = false;
    this.clusterHidden = false;

    document.getElementById('home').style.display = 'none';
    console.log(data);
  }

  myClusterData(data) {
    this.dist = false;
    this.blok = false;
    this.clust = true;
    this.skul = false;

    this.title = localStorage.getItem('block');
    this.titleName = localStorage.getItem('dist');
    this.distName = this.titleName;
    this.blockName = this.title;
    this.clustName = data;
    this.hierName = this.clustName;
    localStorage.setItem('cluster', data);

    document.getElementById('home').style.display = 'none';
    console.log(data);
  }

  selectAxis() {
    if (this.skul) {
      this.districtWise();
    }
    if (this.dist) {
      this.myDistData(JSON.parse(localStorage.getItem('distId')));
    }
    if (this.blok) {
      this.myBlockData(JSON.parse(localStorage.getItem('blockId')));
    }
    if (this.clust) {
      this.myClusterData(JSON.parse(localStorage.getItem('cluster')));
    }
  }

  createTable(dataSet) {
    var my_columns = [];
    $.each(dataSet[0], function (key, value) {
      var my_item = {};
      my_item['data'] = key;
      my_item['value'] = value;
      my_columns.push(my_item);
    });

    $(document).ready(function () {
      var headers = '<thead><tr>'
      var subheader = '<tr>';
      var body = '<tbody>';

      my_columns.forEach((column, i) => {
        headers += `<th ${(column.data == 'district'
          || column.data == 'block'
          || column.data == 'cluster'
          || column.data == 'school'
          || column.data == 'total_schools'
          || column.data == 'infra_score'
          || column.data == 'total_schools_data_received') ? 'rowspan="2" style = "text-transform:capitalize;"' : 'colspan="2" style = "text-transform:capitalize;"'}>${column.data}</th>`
        if (column.data != 'district'
          && column.data != 'block'
          && column.data != 'cluster'
          && column.data != 'school'
          && column.data != 'total_schools'
          && column.data != 'infra_score'
          && column.data != 'total_schools_data_received') {
          subheader += '<th>Yes</th><th>%.</th>'
        }
      });

      let newArr = [];
      $.each(dataSet, function (a, b) {
        let temp = [];
        $.each(b, function (key, value) {
          var new_item = {};
          new_item['data'] = key;
          new_item['value'] = value;
          temp.push(new_item);
        })
        newArr.push(temp)
      });

      newArr.forEach((columns) => {
        body += '<tr>';
        columns.forEach((column) => {
          if (column.data != 'district'
            && column.data != 'block'
            && column.data != 'cluster'
            && column.data != 'school'
            && column.data != 'total_schools'
            && column.data != 'infra_score'
            && column.data != 'total_schools_data_received'
          ) {
            body += `<td>${column.value.value}</td><td>${column.value.percent}</td>`
          } else {
            body += `<td>${column.value.value}</td>`
          }
        })
        body += '</tr>';
      });

      subheader += '</tr>'
      headers += `</tr>${subheader}</thead>`
      body += '</tr></tbody>';
      $("#table").empty();
      $("#table").append(headers);
      $("#table").append(body);
      $('#table').DataTable({
        destroy: true, bLengthChange: false, bInfo: false,
        bPaginate: false, scrollY: "58vh", scrollX: true,
        scrollCollapse: true, paging: false, searching: false,
        fixedColumns: {
          leftColumns: 1
        }
      });
    });

  }

  createChart(labels, chartData, name, obj) {
    this.scatterChart = new Chart('myChart', {
      type: 'scatter',
      data: {
        labels: labels,
        datasets: [{
          data: chartData,
          pointBackgroundColor: "#4890b5",
          pointRadius: 6
        }]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          custom: function (tooltip) {
            if (!tooltip) return;
            // disable displaying the color box;
            tooltip.displayColors = false;
          },
          callbacks: {
            label: function (tooltipItem, data) {
              var label = data.labels[tooltipItem.index];
              var multistringText = [name + ": " + label];
              multistringText.push(obj.xAxis + ": " + tooltipItem.xLabel);
              multistringText.push(obj.yAxis + ": " + tooltipItem.yLabel);
              return multistringText;
            }
          }
        },

        scales: {
          xAxes: [{
            gridLines: {
              color: "rgba(252, 239, 252)",
            },
            ticks: {
              min: 0
            },
            scaleLabel: {
              display: true,
              labelString: obj.xAxis,
              fontSize: 12,
              // fontColor: "dark gray"
            }
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(252, 239, 252)",
            },
            ticks: {
              min: 0
            },
            scaleLabel: {
              display: true,
              labelString: obj.yAxis,
              fontSize: 12,
              // fontColor: "dark gray",
            }
          }]
        }
      }
    });
  };

  funToDownload(reportData) {
    let newData = [];
    $.each(reportData, function (key, value) {
      let headers = Object.keys(value);
      let newObj = {}
      for (var i = 0; i < Object.keys(value).length; i++) {
        if (headers[i] != 'district' && headers[i] != 'block' && headers[i] != 'total_schools' && headers[i] != 'total_schools_data_received') {
          if (value[headers[i]].value) {
            newObj[`${headers[i]}_value`] = value[headers[i]].value;
          }
          if (value[headers[i]].percent) {
            newObj[`${headers[i]}_percent`] = value[headers[i]].percent;
          }
        } else {
          newObj[headers[i]] = value[headers[i]].value;
        }
      }
      newData.push(newObj);
    })
    this.reportData = newData
  }

  downloadRoport() {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      filename: this.fileName
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.reportData);
  }

}
