class SourcesIndex extends React.Component{

    render(){
        return (
            <div id="content">
                <SourcesHeader />
                <SourcesTable sources={this.props.sources} paths={this.props.paths} />
            </div>

        );
    }
}

class SourcesHeader extends React.Component{
    render(){
        return (
            <div id="header">
                <div id="user_nav" style={{float: 'right'}}>
                    Signed in as agoni_26@hotmail.com.
                    <a rel="nofollow" data-method="delete" href="/users/sign_out">Sign out</a>
                </div>
                <p id="notice">Signed in successfully.</p>
                <h1>Sources</h1>
            </div>
        );
    }
}

class SourcesTable extends React.Component{
    render(){
        const paths = this.props.paths;
        const rows = this.props.sources.map((source) => {
            const sourceId = source.id.toString();
            return (
                <tr key={source.id}>
                    <td>{source.name}</td>
                    <td>{source.title_path}</td>
                    <td>{source.image_path}</td>
                    <td>{source.content_path}</td>
                    <td><a href={paths[sourceId]['show_path']}>Show</a></td>
                    <td><a href={paths[sourceId]['edit_path']}>Edit</a></td>
                    <td><a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href={paths[sourceId]['destroy_path']}>Destroy</a></td>
                </tr>
            );
        });
        return (
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Title path</th>
                        <th>Image path</th>
                        <th>Content path</th>
                        <th>Show</th>
                        <th>Edit</th>
                        <th>Destroy</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        );
    }
}