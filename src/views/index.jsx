class Input extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			list: [],
		}
	}
	handleBlur() {
		if (this.state.value.trim() === '') {
			this.setState({ list: [] });
		} else {
			function createXHR() {
				if (typeof XMLHttpRequest != "undefined") {
					return new XMLHttpRequest();
				} else if (typeof ActiveXObject != "undefined") {
					if (typeof arguments.callee.activeXString != "string") {
						var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], i, len;
						for (i = 0, len = versions.length; i < len; i++) {
							try {
								new ActiveXObject(versions[i]);
								arguments.callee.activeXString = versions[i];
								break;
							} catch (ex) {
								//跳过
							}
						}
					}
					return new ActiveXObject(arguments.callee.activeXString);
				} else {
					throw new Error("No XHR object available.");
				}
			}
			var xhr = createXHR();
			xhr.onreadystatechange = () => {
				if (xhr.readyState == 4) {
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
						const value = JSON.parse(xhr.responseText);
						this.setState({ list: value });
					} else {
						alert("Request was unsuccessful: " + xhr.status);
					}
				}
			};
			xhr.open('get', `http://localhost:8080/getStock?word=${this.state.value}`, true);
			xhr.send(null);
		}
	}
	handleChange(e) {
		this.setState({ value: e.target.value })
	}
	handleClick(index) {
		const symbol = this.state.list[index].symbol;
		console.log(symbol);
		function createXHR() {
			if (typeof XMLHttpRequest != "undefined") {
				return new XMLHttpRequest();
			} else if (typeof ActiveXObject != "undefined") {
				if (typeof arguments.callee.activeXString != "string") {
					var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], i, len;
					for (i = 0, len = versions.length; i < len; i++) {
						try {
							new ActiveXObject(versions[i]);
							arguments.callee.activeXString = versions[i];
							break;
						} catch (ex) {
							//跳过
						}
					}
				}
				return new ActiveXObject(arguments.callee.activeXString);
			} else {
				throw new Error("No XHR object available.");
			}
		}
		var xhr = createXHR();
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4) {

				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					const resDatas = JSON.parse(xhr.responseText);
					const myChart = echarts.init(document.getElementById('chart'));
					console.log(typeof resDatas.datas);
					// 指定图表的配置项和数据
					const option = {
						xAxis: {
							// type: 'datas',
							data: resDatas.datas
						},
						yAxis: {
							// type: 'value'
						},
						series: [{
							data: resDatas.fragment,
							type: 'line'
						}]
					};
					// 使用刚指定的配置项和数据显示图表。
					myChart.setOption(option);
				} else {
					alert("Request was unsuccessful: " + xhr.status);
				}
			}
		};
		xhr.open('get', `http://localhost:8080/getCompany?word=${symbol}`, true);
		xhr.send(null);

	}
	render() {
		return (
			<div>
				<input
					value={this.state.value}
					onBlur={() => this.handleBlur()}
					onChange={(e) => this.handleChange(e)}
				/>
				<p>
					{this.state.list.map((item, index) => {
						return (
							<button
								key={index}
								onClick={() => this.handleClick(index)}
							>
								{item.name}
							</button>
						)
					})}
				</p>
				<div id="chart" style={{width: 1000,height:400}}></div>
			</div>
		);
	}
}


ReactDOM.render(< Input />,
	document.getElementById('app')
);


// 每年净利润变化
