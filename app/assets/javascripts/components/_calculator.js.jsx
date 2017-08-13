const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        this.props.onChangeHandler(e.target.name, e.target.value);
    }

    render() {
        return (
            <fieldset>
                <legend style={{color: 'white'}}>Enter temperature in {scaleNames[this.props.scale]}:</legend>
                <input value={this.props.value}
                       onChange={this.handleChange}
                       name={this.props.scale}
                />
            </fieldset>
        );
    }
}

function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}

const measures = {
    c: 'c',
    f: 'f'
};

class Calculator extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
        this.state[measures.c] = '';
        this.state[measures.f] = '';
        this.changeHandler = this.changeHandler.bind(this);
    }

    changeHandler(name, value){
        let otherName = '';
        let otherValue = '';
        if(name === measures.c){
            otherName = measures.f;
            otherValue = toFahrenheit(value);
        } else {
            otherName = measures.c;
            otherValue = toCelsius(value);
        }

        let newState = {};
        newState[name] = value;
        newState[otherName] = otherValue;
        this.setState(newState);
    }

    render() {
        return (
            <div>
                <TemperatureInput scale={measures.c} value={this.state[measures.c]} onChangeHandler={this.changeHandler} />
                <TemperatureInput scale={measures.f} value={this.state[measures.f]} onChangeHandler={this.changeHandler} />
            </div>
        );
    }
}