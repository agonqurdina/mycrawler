class Comment extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        console.log('this.div', this.div);
    }

    render(){
        const comment = this.props.comment;
        const user = this.props.user;
        return (
            <div id="ttest" className="comment" ref={(div) => this.div = div} style={{border: '1px solid blue', padding: '5px'}}>
                <h4 className="user">{user}</h4>
                <p className="text" style={{margin: 0}}>{comment.text}</p>
            </div>
        );
    }
}