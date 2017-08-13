class AllItems extends React.Component{
    constructor(props){
        super(props);
        console.log('Child: constructor');
        this.state = { first_name: this.props.first_name, last_name: 'test', color: this.props.color };
    }
    render(){
        console.log('Child: render');
        return null;
        // (
        //     <div id="test" style={{backgroundColor: this.state.color }} onClick={this.props.clickHandler}>
        //         {this.state.first_name} {this.state.last_name}
        //     </div>
        // );
    }
    componentDidMount(){
        console.log('Child: componentDidMount');
        // setTimeout(() => {
        //     alert('after timeout');
        //     console.log(this.state);
        //     this.setState((state, props) => {
        //         return {first_name: 'Ardit'};
        //     });
        // }, 20000);
    }
    componentWillReceiveProps(newProps){
        console.log('Child: componentWillReceiveProps, newProps: ', newProps);
        this.setState({first_name: newProps.first_name, last_name: 'test', color: newProps.color});
    }
}