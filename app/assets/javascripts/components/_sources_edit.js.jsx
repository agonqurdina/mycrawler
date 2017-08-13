class SourcesEdit extends React.Component{
    constructor(props){
        super(props);
        this.state = Object.assign({}, props);
        this.unpermitted_fields = ['id', 'worker_id', 'created_at', 'updated_at'];
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e){
        const source = this.state.source;
        let url = '/sources';
        let method = 'POST';
        if(source.id !== undefined && source.id !== null && source.id !== 0){
            url += ('/' + source.id);
            method = 'PUT';
        }
        $.ajax({
            url: url,
            method: method,
            data: {source: source},
            content_type: 'application/json',
            success: function (data) {
                console.log('data: ', data);
                alert('success');
            },
            error: function (err1, err2) {
                console.log('Error: ', err1);
                console.log(err2);
            }
        });
        e.preventDefault();
    }

    handleChange(e){
        const value = e.target.value;
        for(let property in this.state.source){
            if(e.target.name === property){
                this.setState((prevState, props) => {
                    let newSource = Object.assign({}, prevState.source);
                    newSource[property] = value;
                    return {source: newSource};
                });
                break;
            }
        }
    }

    render(){
        let fields = [];
        const unpermitted_fields = this.unpermitted_fields;
        for(let property in this.state.source)
        {
            let element = null;
            if(unpermitted_fields.indexOf(property) === -1){
                element = (
                    <div className="field" key={property}>
                        <label>{property}</label>
                        <input type="text" value={this.state.source[property] || ''} name={property} onChange={this.handleChange} />
                    </div>
                );
                fields.push(element);
            }
        }

        return(
            <form className="edit_source" onSubmit={this.handleSubmit}>
                {fields}
                <div className="actions">
                    <input type="submit" name="commit" value="Update Source" data-disable-with="Update Source"/>
                </div>
            </form>
        );
    }
}