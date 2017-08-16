/**
 * Created by admin on 2017/7/26.
 */
$(() => {
    "use strict";
    /*init startTime select input*/
    let districtData = [];
    let $submitBtn = $('#submit_btn'),
        $inputDateTime = $('#input_date_time'),
        $imsiInput = $('#imsi_input'),
        $imeiInput = $('#imei_input'),
        $msisdnInput = $('#msisdn_input'),
        $ispInput = $('#isp_input'),
        $countryInput = $('#country_input'),
        $cellInput = $('#cell_input'),
        $lacInput = $('#lac_input'),
        $dataTable = $('#data_table'),
        header = null;
    let prepareHeader = function() {
        header = {};
        let $inputDateTimeVal = $inputDateTime.jqxDateTimeInput('getText'),
            $imsiInputVal = $imsiInput.jqxInput('value'),
            $imeiInputVal = $imeiInput.jqxInput('value'),
            $cityInputVal = $cityInput.jqxComboBox('getSelectedItem') ? $cityInput.jqxComboBox('getSelectedItem').value : '',
            $districtInputVal = $districtInput.jqxComboBox('getSelectedItem') ? $districtInput.jqxComboBox('getSelectedItem').value : '',
            $townshipInputVal = $townshipInput.jqxComboBox('getSelectedItem') ? $townshipInput.jqxComboBox('getSelectedItem').value : '';
        $inputDateTimeVal && (header.time = $inputDateTimeVal);
        $imsiInputVal && (header.imsi = $imsiInputVal);
        $imeiInputVal && (header.imei = $imeiInputVal);
        $cityInputVal && (header.city = $cityInputVal);
        $districtInputVal && (header.district = $districtInputVal);
        $townshipInputVal && (header.township = $townshipInputVal);
        return header;
    };
    let inputVerify = function() {
        if (!$('#input_date_time').jqxDateTimeInput('getText')) {
            console.log('请输入时间段');
            return false;
        }
        if (!$imsiInput.jqxInput('value') && !$imeiInput.jqxInput('value') && !$msisdnInput.jqxInput('value') && !$('#country_input option:selected').val()) {
            console.log('请输入查询参数');
            return false;
        }
        if (!(($('#country_input option:selected').val() && $('#isp_input option:selected').val() && $cellInput.jqxInput('value') && $lacInput.jqxInput('value')) || (!$('#country_input option:selected').val() && !$('#isp_input option:selected').val() && !$cellInput.jqxInput('value') && !$lacInput.jqxInput('value')))) {
            console.log($('#country_input option:selected').val(), $('#isp_input option:selected').val(), $cellInput.jqxInput('value'));
            console.log('需要输入关于基站的全部信息');
            return false;
        }
        return true;
    };
    const source = {
        url: '/cellinfo',
        dataType: 'json',
        root: 'value',
        dataFields: [
            { name: 'timestamp', type: 'string' },
            { name: 'IMSI', type: 'string' },
            { name: 'IMEI', type: 'string' },
            { name: 'MSISDN', type: 'string'},
            { name: 'SRC', type: 'string' },
            { name: 'mcc', type: 'string'},
            { name: 'mnc', type: 'string'},
            { name: 'ci', type: 'string'},
            { name: 'addr', type: 'string'},
        ]
    };
    $inputDateTime.jqxDateTimeInput({
        width: '280px',
        height: '25px',
        theme: 'metroDark',
        showFooter: true,
        showTimeButton: true,
        selectionMode: 'range',
        formatString: 'yyyy-MM-dd HH:mm:ss'
    });
    /*init IMSI input*/
    $imsiInput.jqxInput({
        width: '194px',
        height: '25px',
        theme: 'metroDark'
    });
    /*init IMEI input*/
    $imeiInput.jqxInput({
        width: '194px',
        height: '25px',
        theme: 'metroDark'
    });
    /*init MSISDN input*/
    $msisdnInput.jqxInput({
        width: '194px',
        height: '25px',
        theme: 'metroDark'
    });
    $lacInput.jqxInput({
        width: '194px',
        height: '25px',
        theme: 'metroDark'
    });
    /*init country input*/
/*   $countryInput.jqxComboBox({
        width: '194px',
        height: '25px',
        disabled: true,
        theme: 'metroDark',
        source: ['460'],
        selectedIndex: 0
    });*/
    /*init district input*/
/*    $ispInput.jqxSelect({
        width: '194px',
        height: '25px',
        //disabled: true,
        theme: 'metroDark'
    });*/
    /*init cellinfo input*/
    $cellInput.jqxInput({
        width: '194px',
        height: '25px',
        theme: 'metroDark'
    });
    /*init submit btn*/
    $submitBtn.jqxButton({
        width: '80px',
        height: '26px',
        theme: 'metroDark'
    });
    /*init datatable*/
    $dataTable.jqxDataTable({
        width: '100%',
        height: '100%',
        pageSize: 30,
        theme: 'metroDark',
        serverProcessing: true,
        autoRowHeight: true,
        columnsResize: true,
/*        filterable: true,*/
        pageable: true,
        columns: [
            { text: '时间', dataField: 'timestamp', width: '10%' , cellsrenderer: (rowIndex, colfield, val) => {
                const date = new Date(val);
                return date.toLocaleString();
            }},
            { text: 'IMSI', dataField: 'IMSI',  width: '10%' },
            { text: 'IMEI', width: '10%', dataField: 'IMEI', cellsAlign: 'left'},
            { text: 'MSISDN', dataField: 'MSISDN', cellsAlign: 'left', width: '10%' },
            { text: '事件', dataField: 'SRC', cellsAlign: 'left', width: '9%', cellsrenderer: (rowIndex, colfield, val) => {
                switch (val) {
                    case 0:
                        return "上线激活";
                        break;
                    case 1:
                        return "位置更新";
                        break;
                    case 2:
                        return "离线去活";
                        break;
                }
            }},
            { text: '国家编码', cellsAlign: 'left', dataField: 'mcc', width: '5%'},
            { text: '运营商', cellsAlign: 'left', dataField: 'mnc', width: '6%', cellsrenderer: (rowIndex, colfield, val) => {
                switch (val) {
                    case 0:
                        return "移动";
                        break;
                    case 1:
                        return "联通";
                        break;
                    case 2:
                        return "电信";
                        break;
                }
            }},
            { text: '基站编码', cellsAlign: 'left', datafield: 'ci', width: '10%'},
            { text: '行政区划', cellsAlign: 'left', datafield: 'addr', width: '30%'}
        ]
    });

    /*ajax get cities info to render city&district&township input*/
/*    $.get('/cities', (data) => {
        if (data.ri.rc === 1) {
            const cities = [];
            districtData = data.d;
            for (var item of data.d) {
                if (cities.indexOf(item.city) === -1) {
                    cities.push(item.city);
                }
            }
            $cityInput.jqxComboBox({
                disabled: false,
                source: cities
            });
            $cityInput.on('change', function(evt) {
                const args = evt.args;
                if (args) {
                    let cityName = args.item.value;
                    const districts = [];
                    for (let item of districtData) {
                        if (districts.indexOf(item.district) === -1 && item.city === cityName) {
                            districts.push(item.district);
                        }
                    }
                    $districtInput.jqxComboBox('clearSelection');
                    $townshipInput.jqxComboBox('clearSelection');
                    $townshipInput.jqxComboBox('disabled', true);
                    $districtInput.jqxComboBox({
                        source: districts,
                        disabled: false
                    });
                } else {
                    $(this).jqxComboBox('clearSelection');
                }
            });
        } else if (data.ri.rc === 0) {
            console.log('获取消息失败', data.ri.msg);
        }
    });*/
    /*add changeEvent handle for district_input*/
/*    $districtInput.on('change', function(evt){
        const args = evt.args;
        if (args) {
            let districtName = args.item.value;
            const townshipes = [];
            for (let item of districtData) {
                if (townshipes.indexOf(item.township) === -1 && item.district === districtName) {
                    if (item.township === '[]') {
                        townshipes.push(item.district);
                    } else {
                        townshipes.push(item.township);
                    }
                }
            }
            $townshipInput.jqxComboBox('clearSelection');
            $townshipInput.jqxComboBox({
                source: townshipes,
                disabled: false
            });
        } else {
            $(this).jqxComboBox('clearSelection');
        }
    });*/

    /*bind click handler to submit_btn*/
/*    $submitBtn.on('click', function(){
        $.ajax({
            method: 'get',
            url: '/cellinfo',
            headers: prepareHeader(),
            success: function (data) {
                if (data.ri.rc === 0) {
                    return console.log('获取数据失败');
                } else if (data.ri.rc === 1) {
                    //console.log(data.d, (typeof data.d));
                    const source =
                    {
                        localdata: data.d,
                        dataFields:
                            [
                                { name: 'timestamp', type: 'string' },
                                { name: 'IMSI', type: 'string' },
                                { name: 'IMEI', type: 'string' },
                                { name: 'MSISDN', type: 'string'},
                                { name: 'SRC', type: 'string' }
                            ],
                        datatype: "array"
                    };
                    const dataAdapter = new $.jqx.dataAdapter(source);
                    return $dataTable.jqxDataTable('source', dataAdapter);
                }
            }
        });
    });*/
    $submitBtn.on('click', function(){
        if (!inputVerify()) return;
        const dataAdapter = new $.jqx.dataAdapter(source,
            {
                formatData: function (data) {
                    let $inputDateTimeVal = $inputDateTime.jqxDateTimeInput('getText'),
                        $imsiInputVal = $imsiInput.jqxInput('value'),
                        $imeiInputVal = $imeiInput.jqxInput('value'),
                        $msisdnInputVal = $msisdnInput.jqxInput('value'),
                        $countryInputVal = $('#country_input option:selected').val(),
                        $ispInputVal = $('#isp_input option:selected').val(),
                        $cellInputVal = $cellInput.jqxInput('value'),
                        $lacInputVal = $lacInput.jqxInput('value');
/*                        $cityInputVal = $cityInput.jqxComboBox('getSelectedItem') ? $cityInput.jqxComboBox('getSelectedItem').value : '',
                        $districtInputVal = $districtInput.jqxComboBox('getSelectedItem') ? $districtInput.jqxComboBox('getSelectedItem').value : '',
                        $townshipInputVal = $townshipInput.jqxComboBox('getSelectedItem') ? $townshipInput.jqxComboBox('getSelectedItem').value : '';*/
                        $inputDateTimeVal && (data.time = $inputDateTimeVal);
                        $imsiInputVal && (data.imsi = $imsiInputVal);
                        $imeiInputVal && (data.imei = $imeiInputVal);
                        $msisdnInputVal && (data.msisdn  = $msisdnInputVal);
                        $countryInputVal && (data.mcc = $countryInputVal);
                        $ispInputVal && (data.mnc = $ispInputVal);
                        $cellInputVal && (data.ci = $cellInputVal);
                        $lacInputVal && (data.lac = $lacInputVal);
/*                      $cityInputVal && (data.city = $cityInputVal);
                        $districtInputVal && (data.district = $districtInputVal);
                        $townshipInputVal && (data.township = $townshipInputVal);*/
/*                      data.time = data.pagenum * data.pagesize;
                        data.$top = data.pagesize;
                        data.$inlinecount = "allpages";*/
                        return data;
                },
                downloadComplete: function (data, status, xhr) {
                    console.log('after complete', data);
                    source.totalRecords = data.d.count;
                    //$dataTable.jqxDataTable('updateBoundData');
                },
                loadError: function (xhr, status, error) {
                    throw new Error("fail to get data from server" + error.toString());
                }
            }
        );
       $dataTable.jqxDataTable('source', dataAdapter);
    });

    /*init notification*/
/*    $('#jqxNotification').jqxNotification({
        width: "100%",
        appendContainer: ".side_bar_main",
        opacity: 0.9,
        autoClose: true,
        template: 'danger'
    });*/
    /*bind pageChange handler to datatable*/
    $dataTable.on('pageChanged', function (evt){
        const args = evt.args,
            pageNum = args.pagenum;
        if (!header) {
            return false;
        } else {
            console.log('selelct page', pageNum);
        }
    });
});