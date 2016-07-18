
var Actions = Reflux.createActions(['addItem','delItem']);

var k = 0;

var Store = Reflux.createStore({
  listenables: Actions,
  getInitialState: function(){
    console.log('store get init state');
    var myList = localStorage.listItems;
    if(!myList){
      this.list = [{
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

        this.list = items;
      } catch (e) {
        this.list = [];
        localStorage.setItem('listItems', JSON.stringify(this.list));
      } finally {
      }
    }
    return this.list;
  },
  onAddItem: function(data){
    console.log('store additem');
    var tlist = [{
      key: k++,
      cdate: new Date(),
      isDone: false,
      txt: data
    }];

    if(this.list){
      this.list = tlist.concat(this.list);
    }else{
      this.list = tlist;
    }

    localStorage.setItem('listItems', JSON.stringify(this.list));

    this.trigger(this.list);
  },
  onDelItem: function(id){
    this.list = this.list.filter(function(it){
      return it.key != id;
    });

    localStorage.setItem('listItems', JSON.stringify(this.list));

    this.trigger(this.list);
  }
});

var TodoHead = React.createClass({
  handleClick: function(e){
    var txt = e.target.value;
    if (e.which === 13 && txt) {
      Actions.addItem(txt);
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
    Actions.delItem(this.props.it.key);
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
  mixins: [
    Reflux.connect(Store,"slist")
  ],
  render: function(){
    var vlist = this.state.slist;
    var del = this.handleDel;
    return (
      <div>
        <TodoHead />
        {vlist.map(function(item){
          return <TodoItem key={item.key} it={item}/>
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
