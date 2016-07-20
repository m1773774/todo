


var TodoHead = React.createClass({
  handleClick: function(e){
    var txt = e.target.value;
    if (e.which === 13 && txt) {
      this.props.addItem(txt);
      e.target.value = '';
    } else if (e.which === 27) {
      e.target.value = '';
    }
  },
  render: function(){
    return (
      <div>
        <input
          id='txtTodo'
          placeholder="Something To Do?"
          autoFocus
          onKeyUp={this.handleClick} >
        </input>
      </div>
    )
  }
});

var TodoFoot = React.createClass({
  render: function(){
    return (
      <div>
        Todo Count:{this.props.counter}
      </div>
    )
  }
});

var TodoItem = React.createClass({
  handleDel: function(e){
    this.props.delItem(this.props.it.key);
  },
  handleChk: function(e){
    this.props.chkItem(this.props.it.key);
  },
  render: function(){
    return (
      <div>
        <input type="checkbox" checked={this.props.it.isDone} onChange={this.handleChk}></input>
        <span>
          id:{this.props.it.key}, {this.props.it.txt}
        </span>
        <button onClick={this.handleDel}>X</button>
      </div>
    )
  }
});

var TodoList = React.createClass({
  getInitialState: function(){
    return {slist: this.getState()};
  },
  onAddItem: function(data){
    var k = 0;
    this.state.slist.map(function(item){
      k = Math.max(k, item.key);
    });

    var myList = [{
      key: ++k,
      cdate: new Date(),
      isDone: false,
      txt: data
    }].concat(this.state.slist);
    this.updateState(myList);
  },
 onDelItem: function(id){
    var myList = this.state.slist.filter(function(item){
      return item.key != id;
    });
    this.updateState(myList);
  },
  onCheckItem: function(id){
    var myList = this.state.slist;
    myList.map(function(item){
      if(item.key == id) item.isDone = !item.isDone;
    });
    this.updateState(myList);
  },
  getState: function(){
    var myList = localStorage.listItems;

    if(!myList){
      myList = [];
    }else{
      try {
        myList = JSON.parse(myList);
      } catch (e) {
        myList = [];
      }
    }
    return myList;
  },
  updateState: function(myList){
    localStorage.setItem('listItems', JSON.stringify(myList));
    this.setState({slist: myList});
  },
  render: function(){
    var fnDel = this.onDelItem;
    var fnChk = this.onCheckItem;
    return (
      <div>
        <TodoHead addItem={this.onAddItem} />
        {this.state.slist.map(function(item){
          return <TodoItem key={item.key} it={item} delItem={fnDel} chkItem={fnChk}/>
        })}
        <TodoFoot counter={this.state.slist.length} />
      </div>
    )
  }
})

ReactDOM.render(
  <TodoList/>,
  document.getElementById('container')
);
