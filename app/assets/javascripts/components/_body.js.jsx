class Body extends React.Component{
    constructor(props){
        super(props);
        console.log('Parent: constructor');
        this.state = Object.assign({color: 'red'}, this.props);
        console.log('State1: ', this.state);
        this.index = 0;
        this.handleClick = this.handleClick.bind(this);
        this.btnClick = this.btnClick.bind(this);
    }

    handleClick(e){
        alert('click');
        console.log('e', e);
        console.log('this', this);
    }

    btnClick(e){
        if(this.state.color === 'red'){
            this.setState({color: 'green'});
        } else if(this.state.color === 'green'){
            this.setState({color: 'yellow'});
        } else if(this.state.color === 'yellow'){
            this.setState({color: 'red'});
        }
    }

    render(){
        console.log('Parent: render');
        return (
            <div>
                {
                    this.index < 3 ?
                        (<AllItems first_name={this.state.first_name} color="light-blue" clickHandler={this.handleClick} />) :
                        (<div><div id='ngjyra' style={{backgroundColor: this.state.color}}>NGJYRA</div><button onClick={this.btnClick}>Change color</button></div>)
                }
            </div>
        );
    }
    componentDidMount(){
        console.log('Parent: componentDidMount');
        this.timerID = setInterval(() => {
            this.index += 1;
            if(this.index === 3){
                clearInterval(this.timerID);
            }
            this.setState(
                (prevState, props) => {
                    console.log('\ninside timer');
                    var newState = Object.assign({}, prevState);
                    if (prevState.first_name === 'test1') {
                        newState.first_name = 'test2';
                    } else if (prevState.first_name === 'test2') {
                        newState.first_name = 'test3';
                    } else {
                        newState.first_name = 'test1';
                    }
                    return newState;
                },
                () => {
                    console.log('callback called, this.state: ', this.state)
                }
                );
        }, 1000);
    }

    shouldComponentUpdate(props, propsNew) {
        console.log('\nParent: shouldComponentUpdate, props, propsNew: ', props, propsNew);
        return true;
    }

        componentWillUnmount(){
        console.log('Parent: componentWillUnmount');
        clearInterval(this.timerID);
    }
}
