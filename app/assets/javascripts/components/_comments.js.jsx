class Comments extends React.Component {
    constructor(props){
        super(props);
        this.state = {comments: [], text: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addAuthToken = this.addAuthToken.bind(this);
        this.generateComment = this.generateComment.bind(this);

        this.last_id = 0;
    }

    componentDidMount(){
        const obj = this;
        $.ajax({
            url: '/sources/' + this.props.source_id + '/comments/',
            success: function (data) {
                obj.users = data.users;
                const comments = data.comments.map((comment) => {
                    return obj.generateComment(comment, obj.users);
                });
                obj.setState({comments: comments});
            },
            error: function (err1, err2) {
                console.log('Error: ', err1, err2);
            }
        });
    }

    generateComment(comment){
        this.last_id += 1;
        return <Comment comment={comment} user={this.users[comment.user_id]} key={this.last_id} />;
    }

    handleChange(e){
        this.setState({text: e.target.value});
    }

    addAuthToken(data){
        data[this.props.auth_token.name] = this.props.auth_token.value.toString();
        return data;
    }

    handleSubmit(e){
        e.preventDefault();
        let comment = {user_id: this.props.user_id, source_id: this.props.source_id, text: this.state.text};
        this.setState((prevState, props) => {
            let comments = prevState.comments;
            comments.push(this.generateComment(comment));
            return {comments: comments, text: ''};
        });
        $.ajax({
            url: '/sources/' + this.props.source_id + '/comment',
            method: 'POST',
            data: this.addAuthToken({text: this.state.text}),
            success: function (data) {
                if(data.success){
                    comment.id = data.id;
                } else {
                    alert('Nuk u insertua');
                }
            },
            error: function (err1, err2) {
                console.log(err1, err2);
            }
        });
    }

    render(){
        return (
            <div className="comments-wrapper" style={{border: '1px solid black'}}>
                {this.state.comments}
                <form onSubmit={this.handleSubmit}>
                    <textarea onChange={this.handleChange} placeholder="Shkruaj koment te ri" value={this.state.text}/>
                    <button type="submit">Shkruaj</button>
                </form>
            </div>
        );
    }
}