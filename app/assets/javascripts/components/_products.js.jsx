class ProductCategoryRow extends React.Component {
    render() {
        return (<tr><th colSpan="2">{this.props.category}</th></tr>);
    }
}

class ProductRow extends React.Component {
    render() {
        var name = this.props.product.stocked ?
            this.props.product.name :
            <span style={{color: 'red'}}>
        {this.props.product.name}
      </span>;
        return (
            <tr>
                <td>{name}</td>
                <td>{this.props.product.price}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {
    render() {
        var rows = [];
        var lastCategory = null;
        this.props.products.forEach((product) => {
            if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
            }
            rows.push(<ProductRow product={product} key={product.name} />);
            lastCategory = product.category;
        });
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {
    constructor(props){
        super(props);

        this.textChangeHandler = this.textChangeHandler.bind(this);
        this.checkboxChangeHandler = this.checkboxChangeHandler.bind(this);
    }

    textChangeHandler(e){
        this.props.onTextChange(e.target.value);
    }

    checkboxChangeHandler(e){
        this.props.onCheckboxChange(e.target.value);
    }

    render() {
        return (
            <form>
                <input type="text" placeholder="Search..." value={this.props.filterText} onChange={this.textChangeHandler} />
                <p>
                    <input type="checkbox" checked={this.props.inStockOnly} onChange={this.checkboxChangeHandler} />
                    {' '}
                    Only show products in stock
                </p>
            </form>
        );
    }
}

class FilterableProductTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            inStockOnly: false
        };
        this.textChangeHandler = this.textChangeHandler.bind(this);
        this.checkboxChangeHandler = this.checkboxChangeHandler.bind(this);
    }

    textChangeHandler(value){
        this.setState({filterText: value});
    }

    checkboxChangeHandler(value){
        this.setState({inStockOnly: value});
    }

    render() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onTextChange={this.textChangeHandler}
                    onCheckboxChange={this.checkboxChangeHandler}
                />
                <ProductTable
                    products={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                />
            </div>
        );
    }
}