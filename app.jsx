
var k = 0;

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
        <input id='txtTodo' placeholder="Something To Do?" autoFocus onKeyUp={this.handleClick} ></input>
      </div>
    )
  }
});

var TodoFoot = React.createClass({
  render: function(){
    return (
      <div>
        Todo Count:{this.props.list.length}
      </div>
    )
  }
});

var TodoItem = React.createClass({
  handleDel: function(e){
    this.props.delItem(this.props.it.key);
  },
  render: function(){
    return (
        <div>
          <button onClick={this.handleDel}>X</button>
          <div>{this.props.it.txt}</div>
        </div>
    )
  }
});

var TodoList = React.createClass({
  getInitialState: function(){
    console.log('store get init state');
    var myList = localStorage.listItems;
    if(!myList){
      myList = [{
        key: k++,
        cdate: new Date(),
        isDone: false,
        txt: 'Default Item'
      }];
    }else{
      try {
        var items = JSON.parse(myList);
        items.map(function(item){
          item.key = k++;
        });

        myList = items;
      } catch (e) {
        myList = [];

      } finally {
      }
    }

    localStorage.setItem('listItems', JSON.stringify(myList));
    return {slist: myList}
  },
  onAddItem: function(data){
    console.log('store additem');
    var tlist = [{
      key: k++,
      cdate: new Date(),
      isDone: false,
      txt: data
    }];

    var myList = this.state.slist;

    if(myList){
      myList = tlist.concat(myList);
    }else{
      myList = tlist;
    }

    localStorage.setItem('listItems', JSON.stringify(myList));

    this.setState({slist: myList});

  },
  onDelItem: function(id){
    var myList = this.state.slist.filter(function(it){
      return it.key != id;
    });

    localStorage.setItem('listItems', JSON.stringify(myList));

this.setState({slist: myList});
  },
  render: function(){
    var vlist = this.state.slist;
 var del = this.onDelItem;
    return (
      <div>
        <TodoHead addItem={this.onAddItem} />
        {vlist.map(function(item){
          return <TodoItem key={item.key} it={item} delItem={del}/>
        })}
        <TodoFoot list={vlist} />
      </div>
    )
  }
})

ReactDOM.render(
  <TodoList/>,
  document.getElementById('container')
);
