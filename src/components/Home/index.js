import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Header from '../Header'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import PopularRestaurants from '../PopularRestaurants'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    carouselData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCourosel()
  }

  getFormattedData = data => ({
    imageUrl: data.image_url,
    id: data.id,
  })

  getCourosel = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/restaurants-list/offers'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.offers.map(each => this.getFormattedData(each))
      this.setState({
        carouselData: updatedData,
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
    <div className="products-details-loader-container" data-testid="loader">
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

  renderCarousel = () => {
    const {carouselData} = this.state
    const settings = {
      dots: true,
    }
    return (
      <div className="container">
        <Slider {...settings}>
          {carouselData.map(item => (
            <div key={item.id}>
              <img
                src={item.imageUrl}
                alt={`offer-${item.id}`}
                className="home-bg"
              />
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  renderCr = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCarousel()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {sortByOpt} = this.props
    return (
      <div>
        <Header />
        <div>{this.renderCarousel()}</div>
        <PopularRestaurants sort={this.sortByOpt} />
        <Footer />
      </div>
    )
  }
}
export default Home
