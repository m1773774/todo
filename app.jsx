
var Actions = Reflux.createActions(['addItem','delItem']);
var k = 0;
var Store = Reflux.createStore({
  listenables: Actions,
  getInitialState: function(){
    console.log('store init');
    var myList = localStorage.listItems;
    if(!myList){
      this.list = [{
        key: k++,
        cdate: new Date(),
        isDone: false,
        txt: 'Default Item'
      }];
    }else{
      this.list = JSON.parse(myList);
    }
    return this.list;
  },
  onAddItem: function(){
    console.log('store additem');
  }
});

var TodoList = React.createClass({
  mixins: [
    Reflux.listenTo(Store, 'onUpdate'),
    Reflux.connect(Store,"slist")
  ],
  getInitialState: function(){
    return {
      //slist: []
    };
  },
  componentDidMount: function(){
    //Actions.addItem();
  },
  onUpdate: function(data){
    console.log('onUpdate');
    this.setState({
      slist: data
    });
  },
  render: function(){
    var vlist = this.state.slist;
    return (
      <div>
        <div>title</div>

        {vlist.map(function(item){
          return <div key={item.key}>
            {item.txt}
          </div>
        })}
      </div>
    )
  }
})

ReactDOM.render(
  <TodoList/>,
  document.getElementById('container')
);
