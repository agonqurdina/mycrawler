class Main extends React.Component{
    constructor(props){
        super(props);
        console.log('Parent: constructor');
        let arr = [1,2,3,4,5];
        let arr2 = arr.map((i, idx) => {
            return <li key={idx.toString()}>{i*2}</li>;
        });
        this.state = {items: arr2};
        console.log('arr: ', arr);
        console.log('arr2: ', arr2);
    }

    componentWillMount(){
        console.log('Parent: componentWillMount');
    }

    render() {
        console.log('Parent: render');
        return (
            <div>
                <ul>
                    {this.state.items}
                </ul>
                <Header />
            </div>
        )
    }

    componentDidMount(){
        console.log('Parent: componentDidMount');
        this.timerId = setTimeout(() => {
            this.setState({color: 'green'});
        }, 3000);
    }
}