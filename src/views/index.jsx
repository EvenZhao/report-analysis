// const debounce = (fn, time) => {
// 	let debounceTimer = null;
// 	let enableQuery = true;
// 	return function () {
// 		if (!enableQuery) return;
// 		enableQuery = false;
// 		if (!debounceTimer) {
// 			debounceTimer = setTimeout(() => {
// 				enableQuery = true;
// 				clearTimeout(debounceTimer);
// 				debounceTimer = null;
// 			}, time);
// 			fn.apply(null, arguments);
// 		}
// 	};
// };


class Input extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			list: [],
			index: null
		};
		this.myChart = null;
		this.myChart2= null;
		this.myChart3 = null;
	}

	componentWillUnmount() {
		clearTimeout(this.debounceTimer);
		this.debounceTimer = null;
	}

	handleChange(e) {
		this.myChart && this.myChart.dispose();
		this.myChart2 && this.myChart2.dispose();
		this.myChart3 && this.myChart3.dispose();
		this.setState({ index: null });
		const { value } = e.target;
		this.setState({ value }, () => {
			axios.get(`http://localhost:8080/api/getStock?word=${value}`)
				.then((response) => {
					this.setState({ list: response.data });
				});
		});
		this.setState({})
	}

	handleClick(index) {
		this.setState({ index: index });
		const symbol = this.state.list[index].symbol;
		axios.get(`http://localhost:8080/api/getCompany?word=${symbol}`)
			.then((response) => {
				const resDatas = response.data;
				this.myChart = echarts.init(document.getElementById('chart'));
				this.myChart2 = echarts.init(document.getElementById('chart2'));
				this.myChart3 = echarts.init(document.getElementById('chart3'));

				// 现金等价物，有息负债
				const option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							crossStyle: {
								color: '#999'
							}
						}
					},
					toolbox: {
						feature: {
							dataView: { show: true, readOnly: false },
							magicType: { show: true, type: ['line', 'bar'] },
							restore: { show: true },
							saveAsImage: { show: true }
						}
					},
					legend: {
						data: ['现金等价物', '有息负债', '单位（万元）']
					},
					xAxis: {
						// type: 'datas',
						data: resDatas.time
					},
					yAxis: [{
						name : '单位（万元）'
					}],
					series: [{
						name: '现金等价物',
						data: resDatas.xjdjw,
						type: 'line'
					}, {
						name: '有息负债',
						data: resDatas.yxfz,
						type: 'bar'
					}]
				};
				// 存货营业收入
				const option2 = {
					color: ['#003366', '#4cabce'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						data: ['存货', '营业收入']
					},
					yAxis: [{
						name : '单位（万元）'
					}],
					xAxis: [
						{
							data: resDatas.time
						}
					],
					series: [
						{
							name: '存货',
							type: 'bar',
							data: resDatas.ch
						},
						{
							name: '营业收入',
							type: 'bar',
							data: resDatas.yysr
						},
					]
				}
				const option3 = {

					tooltip : {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
							label: {
								backgroundColor: '#6a7985'
							}
						}
					},
					legend: {
						data:['净利润','应收款','预收款','预付款']
					},
					toolbox: {
						feature: {
							saveAsImage: {}
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis : [
						{
							type : 'category',
							boundaryGap : false,
							data : resDatas.time
						}
					],
					yAxis : [
						{
							name : '单位（万元）'
						}
					],
					series : [
						{
							name:'净利润',
							type:'line',
							stack: '总量',
							areaStyle: {},
							data: resDatas.jlr
						},
						{
							name:'应收款',
							type:'line',
							stack: '总量',
							areaStyle: {},
							data: resDatas.yingsk
						},
						{
							name:'预收款',
							type:'line',
							stack: '总量',
							areaStyle: {},
							data: resDatas.ysk
						},
						{
							name:'预付款',
							type:'line',
							stack: '总量',
							areaStyle: {},
							data: resDatas.yfk
						},
					]
				};

				this.myChart.setOption(option);
				this.myChart2.setOption(option2);
				this.myChart3.setOption(option3);
			})
			.catch((error) => {
				// handle error
				console.log(error);
			})
			.finally(() => {
				// always executed
			});
	}

	render() {
		return (
			<div className="wrap">
				<input
					className="searchInput"
					value={this.state.value}
					placeholder="请输入关键字"
					style={{
						display: "block",
						width: "60%",
						height: 50,
						margin: "100px auto 50px auto",
						textAlign: "center",
						fontSize: 24,
						color: "#777",
						border: 0,
						outline: "none",
						borderBottom: "2px #eee solid"
					}}
					onChange={ (e) => this.handleChange(e) }
				/>
				<div className="btn-wrap">
					{this.state.list.map((item, index) => {
						return (
							<div key={index} className={this.state.index==index?"on":""}>
								<span
									onClick={() => this.handleClick(index)}
								>
									{item.name}
								</span>
							</div>
						)
					})}
				</div>
				<div id="chart" style={{ width: 1000, height: 400 }}></div>
				<div id="chart2" style={{ width: 1000, height: 400 }}></div>
				<div id="chart3" style={{ width: 1000, height: 400 }}></div>
			</div>
		);
	}
}


ReactDOM.render(< Input />,
	document.getElementById('app')
);


// 每年净利润变化
