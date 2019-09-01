class Input extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 6,
			list: [],
		}
	}
	handleBlur() {
		function createXHR(){
			if (typeof XMLHttpRequest != "undefined"){
				return new XMLHttpRequest();
			} else if (typeof ActiveXObject != "undefined"){
				if (typeof arguments.callee.activeXString != "string"){
					var versions = [ "MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"], i, len;
					for (i=0,len=versions.length; i < len; i++){
						try {
							new ActiveXObject(versions[i]);
							arguments.callee.activeXString = versions[i];
							break;
						} catch (ex){
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
					console.log(value);
					this.setState({ list: value });
				} else {
					alert("Request was unsuccessful: " + xhr.status);
				}
			}
		};
		xhr.open('get', `http://localhost:8080/getStock?word=${this.state.value}`, true);
		xhr.send(null);
	}
	handleChange(e) {
		this.setState({ value: e.target.value })
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
					{ this.state.list.map((item) => {
						return item.name;
					}) }
				</p>
			</div>
		);
	}
}


ReactDOM.render(< Input />,
	document.getElementById('app')
);
