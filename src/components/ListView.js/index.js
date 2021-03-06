import React, { Component } from 'react';
import RestaurantCard from './ResturantCard'
import FilterBox from './FilterBox'
import { Redirect } from 'react-router'

const WAIT_INTERVAL = 1000;


class ListView extends Component {
   
  constructor() {
    super()

    this.state = {
      orderByRating : false,
      filterText: ''
    };
  }

    componentDidMount(){
        if(this.props.fetchRestaurants) this.props.fetchRestaurants()

    }

    onChangeFilter = (event) =>{
        clearTimeout(this.timer);
        const filterText = event.target.value
        this.timer = setTimeout(() => {
         this.setState({filterText: filterText})
        }, WAIT_INTERVAL);
      }

      onChangeOrderByRating = (event) =>{
          console.log("onChangeOrderByRating")
        const orderBy = event.target.checked
         this.setState({orderByRating: orderBy})
      }


    fuzzy = (value, s) =>{
        var hay = value.toLowerCase(), i = 0, n = -1, l;
        s = s.toLowerCase();
        for (; l = s[i++] ;) if (!~(n = hay.indexOf(l, n + 1))) return false;
        return true;
    }

    sortByRating = (restaurants) => {
        restaurants.sort(function (a, b) {
            if (a.rating > b.rating) {
              return 1;
            }
            if (a.rating < b.rating) {
              return -1;
            }
            return 0;
          });
    }

    onSelectRestaurant = (restaurant) => {
        console.log("restaurant", restaurant)
        this.props.selectRestaurant(restaurant)
    }

    renderList = () =>{
      let restaurantsFiltered = this.props.listView.restaurants.filter((restaurant) => {
          if(this.fuzzy(restaurant.commercialName, this.state.filterText) || this.fuzzy(restaurant.address, this.state.filterText))
          return restaurant
      })

      if (this.state.orderByRating) this.sortByRating(restaurantsFiltered)
        return (
            <React.Fragment>
                <FilterBox onChangeFilter={this.onChangeFilter} onChangeOrderByRating={this.onChangeOrderByRating} orderByRating={this.state.orderByRating}/>
                <center>
                <ul className="mat_list card scrollable"> 
                    {restaurantsFiltered.map((restaurant, index) =>
                        (<RestaurantCard key={`rcard_${index}`}  index={index} restaurant={restaurant} onSelectRestaurant={this.onSelectRestaurant}/>))}
                </ul>
                </center>         
            </React.Fragment> 
                )
            }

        render() {
            if(this.props.listView.selectedRestaurant){
                console.log("redirect")
                return <Redirect to='/restaurants/order' />
            } 
              else return this.renderList()
              }
            }

export default ListView;
