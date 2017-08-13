class Form extends React.Component{
    constructor(props){
        super(props);

        this.state = {};

        this.submitHandler = this.submitHandler.bind(this);
        this.inputChangeHandler = this.inputChangeHandler.bind(this);
    }

    submitHandler(event, event2){
        event.preventDefault();
        console.log('url: ', $.param(this.state));
        console.log('event: ', event);
        console.log('event2: ', event2);
        console.log('form data: ', event.target.value.serialize());
        alert('form submitted');
    }

    inputChangeHandler(event){
        console.log('inputChangeHandler, value: ', event.target.value);
        let newPartialState = {};
        newPartialState[event.target.name] = event.target.value;
        this.setState(newPartialState);
    }

    render(){
        return(
            <form onSubmit={this.submitHandler}>
                <div>
                    <label>Emri</label>
                    <input type="text" name="Emri" value={this.state.first_name} onChange={this.inputChangeHandler} placeholder="Emri"/>
                </div>
                <div>
                    <label>Mbiemri</label>
                    <input type="text" name="Mbiemri" value={this.state.last_name} onChange={this.inputChangeHandler} placeholder="Mbiemri"/>
                </div>
                <div>
                    <label>Mosha</label>
                    <input type="number" name="Mosha" value={this.state.age} onChange={this.inputChangeHandler} placeholder="Mosha"/>
                </div>
                <div>
                    <label>Graduated</label>
                    <input type="checkbox" name="Graduated" value={this.state.graduated} onChange={this.inputChangeHandler} placeholder="Mosha"/>
                </div>
                <div>
                    <input type="submit" value="Submit"/>
                </div>
            </form>
        );
    }
}