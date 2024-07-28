import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsFilterRight} from 'react-icons/bs'
import {BsArrowLeftSquare} from 'react-icons/bs'
import {BsArrowRightSquare} from 'react-icons/bs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class PopularRestaurants extends Component {
  state = {
    popularData: [],
    apiStatus: apiStatusConstants.initial,
    activePage: 1,
    offset: 0,
    limit: 9,
  }

  componentDidMount() {
    this.getPopularData()
  }

  getOffset = newPage => {
    const {limit} = this.state
    const newOffset = (newPage - 1) * limit
    this.setState({activePage: newPage, offset: newOffset}, this.getPopularData)
  }

  getFormat = data => ({
    rating: data.user_rating.rating,
    totalReviews: data.user_rating.total_reviews,
    name: data.name,
    cuisine: data.cuisine,
    imageUrl: data.image_url,
    id: data.id,
  })

  getPopularData = async () => {
    const {offset, limit} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${limit}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data.restaurants)
      const updatedData = data.restaurants.map(each => this.getFormat(each))
      this.setState({
        popularData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  getSuccess = () => {
    const {popularData, activePage} = this.state
    const {sort} = this.props
    return (
      <>
        <div className="resta">
          <h1 className="popular-head">Popular Restaurants</h1>
          <div className="sub-popular">
            <p className="popular-para">
              Select your favourite restaurant special dish and make your day
              happy...
            </p>
            <div className="srt-cont">
              <BsFilterRight className="sort-by-icon" />
              <p className="sort-by">Sort by</p>
              <select className="sort-by-select">
                <option>Lowest</option>
              </select>
            </div>
          </div>
        </div>
        <hr />
        <ul className="popular-co">
          {popularData.map(each => (
            <li className="popular-list" key={each.id}>
              <img
                src={each.imageUrl}
                alt={each.name}
                className="popular-img"
              />
              <div>
                <h4>{each.name}</h4>
                <p className="popu-para">{each.cuisine}</p>
                <div className="review">
                  <img
                    src="https://res.cloudinary.com/dvmcsww2y/image/upload/v1721992438/7_Rating_bb0vlt.png"
                    className="star"
                  />
                  <p>{each.rating}</p>
                  <p className="car-pa">
                    (<span> {each.totalReviews} reviews</span>)
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="popular-co">
          <BsArrowLeftSquare
            onClick={() => this.getOffset(Math.max(1, activePage - 1))}
          />
          <p>{`${activePage} of ${Math.ceil(20 / 9)}`}</p>
          <BsArrowRightSquare onClick={() => this.getOffset(activePage + 1)} />
        </div>
      </>
    )
  }

  renderAll = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getSuccess()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderAll()}</div>
  }
}
export default PopularRestaurants
