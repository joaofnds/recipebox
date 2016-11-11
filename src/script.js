import './style.sass';
import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Collapse } from 'react-bootstrap';

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
}

var List = React.createClass ({	
	render() {
		var list = this.props.data.map(function(item) {
			return (
				<ListItem recipe={item}  onRecipeUpdate={this.props.onRecipeUpdate} onDeleteItem={this.props.onDeleteItem}/>
			);
		}, this)

		return(
			<ul className="list-group">
				{list}
			</ul>
		);
	}
});

var ListItem = React.createClass({
	getInitialState: function() {
		return { open: false };
	},
	
	toggleCollapse: function() {
		this.setState({ open: !this.state.open })
	},

	render() {
		var recipe = this.props.recipe;
		return(
			<li className="list-group-item" key={recipe.id}><strong>{recipe.name}</strong>
				<Button className="primary" onClick={this.props.onDeleteItem.bind(this,recipe)}>Delete</Button>
				<Button bsStyle="warning" onClick={this.toggleCollapse}>Edit</Button>
				<br/>{recipe.ingredients}
				<Collapse in={this.state.open}>
					<div>
						<UpdateForm itemId={recipe.id} name={recipe.name} ingredients={recipe.ingredients} onRecipeUpdate={this.props.onRecipeUpdate} toggleCollapse={this.toggleCollapse}/>
					</div>
				</Collapse>
			</li>
		);
	}

});

var UpdateForm =  React.createClass({

	getInitialState: function() {
		return {name: this.props.name, ingredients: this.props.ingredients};
	},

	handleNameChange: function(e) {
		this.setState({name: e.target.value});
	},

	handleIngredientsChange: function(e) {
		this.setState({ingredients: e.target.value});
	},

	handleUpdateRecipe: function(e) {
		e.preventDefault();
		var id = this.props.itemId;
		var name = this.state.name.trim();
		var ingredients = this.state.ingredients.trim();
		if(!name || !ingredients) return;
		this.props.toggleCollapse();
		this.props.onRecipeUpdate({id: id, name: name, ingredients: ingredients});
	},

	render() {
		return(
			<form id="form" onSubmit={this.handleUpdateRecipe}>
				<br/>
				<strong>Recipe Name: </strong>
				<input
					type="text"
					className="form-control"
					placeholder="Recipe name"
					value={this.state.name}
					onChange={this.handleNameChange}
				/>
				<br/>
				<strong>Ingredients: </strong>
				<input
					type="text"
					className="form-control"
					placeholder="Recipe ingredients"
					value={this.state.ingredients}
					onChange={this.handleIngredientsChange}
				/>
				<button type="submit" value="post" className="btn btn-primary">Update Recipe</ button>
			</form>
		);
	}
});

var Form = React.createClass ({

	getInitialState: function() {
		return {name: '', ingredients: ''};
	},

	handleNameChange: function(e) {
		this.setState({name: e.target.value});
	},

	handleIngredientsChange: function(e) {
		this.setState({ingredients: e.target.value});
	},

	handleSubmit: function(e) {
		e.preventDefault();
		var name = this.state.name.trim();
		var ingredients = this.state.ingredients.trim();
		if(!name || !ingredients) return;
		this.setState({name: '', ingredients: ''});
		this.props.onFormSubmit({id: guid(), name: name, ingredients: ingredients});
	},

	render() {
		return(
			<form id="form" onSubmit={this.handleSubmit}>
				<input
					type="text"
					className="form-control"
					placeholder="Recipe name"
					value={this.state.name}
					onChange={this.handleNameChange}
				/>
				<input
					type="text"
					className="form-control"
					placeholder="Recipe ingredients"
					value={this.state.ingredients}
					onChange={this.handleIngredientsChange}
				/>
				<button type="submit" value="post" className="btn btn-primary">Add Recipe</ button>&emsp;
				<button className="btn btn-danger" onClick={this.props.onDeleteLocalData}>Delete local data</button>
			</form>
		);
	}
});

var RecipeBox = React.createClass ({
	
	getInitialState() {
		if(Storage) {
			var recipes = (typeof localStorage['recipes'] !== 'undefined') ? JSON.parse(localStorage['recipes']) : [];
			return { data: recipes };
		} else {
			alert("Unable tu store local data!");
			return { data: {} };
		}
	},
	
	handleDelete(message) {
		var newList = this.state.data.filter(function(i) {
			return i !== message;
		});
		this.setState({data: newList});
		localStorage.setItem('recipes', JSON.stringify(newList));
	},
	
	handleFormSubmit(item) {
		var newItems = this.state.data.concat(item);
		this.setState({data: newItems});
		localStorage.setItem('recipes', JSON.stringify(newItems));
	},
	
	deleteLocalData() {
		localStorage.clear();
		this.setState({data: []});
	},

	handleRecipeUpdate(item) {
		var newList = this.state.data;
		var target = newList.find(function(recipe, i) {
			return recipe.id === item.id;
		});
		var index = newList.indexOf(target);
		newList[index] = item;
		this.setState({data: newList});
	},
	
	render() {
		return(
			<div>
				<List data={this.state.data} onDeleteItem={this.handleDelete} onRecipeUpdate={this.handleRecipeUpdate}/>
				<Form onFormSubmit={this.handleFormSubmit} onDeleteLocalData={this.deleteLocalData}/>
			</div>
		);
	}
});

ReactDOM.render(<RecipeBox />, document.getElementById("app"));
